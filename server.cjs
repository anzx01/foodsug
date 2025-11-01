const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 手动读取.env.local文件
function loadEnvLocal() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=');
          process.env[key.trim()] = value.trim();
        }
      }
    });

    console.log('✅ .env.local 文件已加载');
  } catch (error) {
    console.log('⚠️  未找到.env.local文件，将使用默认环境变量');
  }
}

// 加载环境变量
loadEnvLocal();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// 静态资源服务，用于提供resource目录下的图片
app.use('/resource', express.static(path.join(__dirname, 'resource')));

// 初始化OpenAI客户端，使用通义千问API
const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: process.env.DASHSCOPE_BASEURL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  dangerouslyAllowBrowser: false
});

// 食物识别分析接口
app.post('/api/analyze-food', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: '请提供图片数据'
      });
    }

    // 验证base64图片格式
    if (!image.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        error: '图片格式不正确，请提供有效的base64图片数据'
      });
    }

    const completion = await openai.chat.completions.create({
      model: "qwen-vl-plus",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: image
              }
            },
            {
              type: "text",
              text: `请分析这张图片中的食物，并以JSON格式返回详细的分析结果。请严格按照以下格式返回：

{
  "food_name": "食物名称",
  "gi_value": 数值,
  "suitable_for_diabetics": true/false,
  "recommendation": "针对糖尿病患者的建议",
  "estimated_nutrition": {
    "calories": 数值,
    "carbs": 数值,
    "protein": 数值,
    "fat": 数值,
    "fiber": 数值
  }
}

请注意：
1. GI值范围：0-100
2. suitable_for_diabetics：GI值≤55为true，否则为false
3. 营养成分估算为每100g的含量
4. 如果图片中没有食物，请返回 {"error": "未识别到食物"}
5. 务必返回有效的JSON格式`
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        success: false,
        error: 'AI服务返回空响应'
      });
    }

    try {
      // 尝试解析JSON响应
      const analysisResult = JSON.parse(content);

      // 验证返回的数据结构
      if (analysisResult.error) {
        return res.status(400).json({
          success: false,
          error: analysisResult.error
        });
      }

      // 验证必要字段
      const requiredFields = ['food_name', 'gi_value', 'suitable_for_diabetics', 'recommendation', 'estimated_nutrition'];
      const missingFields = requiredFields.filter(field => !(field in analysisResult));

      if (missingFields.length > 0) {
        return res.status(500).json({
          success: false,
          error: `返回数据缺少必要字段: ${missingFields.join(', ')}`
        });
      }

      // 验证营养信息字段
      const nutritionFields = ['calories', 'carbs', 'protein', 'fat', 'fiber'];
      const missingNutritionFields = nutritionFields.filter(field => !(field in analysisResult.estimated_nutrition));

      if (missingNutritionFields.length > 0) {
        return res.status(500).json({
          success: false,
          error: `营养成分信息缺少字段: ${missingNutritionFields.join(', ')}`
        });
      }

      res.json({
        success: true,
        data: analysisResult
      });

    } catch (parseError) {
      console.error('JSON解析错误:', parseError);
      console.error('原始响应:', content);
      res.status(500).json({
        success: false,
        error: 'AI返回的数据格式不正确，无法解析JSON'
      });
    }

  } catch (error) {
    console.error('API调用错误:', error);

    if (error.status === 401) {
      res.status(500).json({
        success: false,
        error: 'API密钥无效或未设置'
      });
    } else if (error.status === 429) {
      res.status(429).json({
        success: false,
        error: 'API调用频率过高，请稍后重试'
      });
    } else {
      res.status(500).json({
        success: false,
        error: `服务器错误: ${error.message || '未知错误'}`
      });
    }
  }
});

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '食物识别API服务正常运行',
    timestamp: new Date().toISOString()
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    error: '服务器内部错误'
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 食物识别API服务器已启动`);
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`📝 图片分析接口: POST http://localhost:${PORT}/api/analyze-food`);

  // 检查环境变量
  if (!process.env.DASHSCOPE_API_KEY) {
    console.warn('⚠️  警告: 未设置DASHSCOPE_API_KEY环境变量，API调用将失败');
    console.log('💡 请设置环境变量: export DASHSCOPE_API_KEY=your-api-key');
  } else {
    console.log('✅ DASHSCOPE_API_KEY已设置');
  }
});

module.exports = app;