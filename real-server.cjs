// Copyright (c) 2025. All rights reserved.
// Licensed under the MIT License. See LICENSE file for details.

const http = require('http');
const https = require('https');
const fs = require('fs');
const { URL } = require('url');

const PORT = 3001;

// 从.env读取API配置
function loadConfig() {
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const config = {};

    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          config[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    console.log('✅ API配置已加载');
    return config;
  } catch (error) {
    console.error('❌ 无法读取.env文件:', error.message);
    process.exit(1);
  }
}

const config = loadConfig();

// 设置CORS headers
const setCORSHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// 调用通义千问API
async function callQwenAPI(imageBase64) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: "qwen-vl-plus",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageBase64
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

    const options = {
      hostname: 'dashscope.aliyuncs.com',
      port: 443,
      path: '/compatible-mode/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('🔍 API原始响应:', data);
        try {
          const response = JSON.parse(data);
          console.log('📝 解析后的响应:', JSON.stringify(response, null, 2));

          if (response.choices && response.choices[0] && response.choices[0].message) {
            resolve(response.choices[0].message.content);
          } else if (response.error) {
            reject(new Error(`API错误: ${response.error.message || response.error}`));
          } else {
            reject(new Error('API返回格式不正确'));
          }
        } catch (error) {
          reject(new Error(`解析API响应失败: ${error.message}\n原始数据: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`API请求失败: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);

  // 设置CORS headers
  setCORSHeaders(res);

  // 处理OPTIONS请求 (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 路由处理
  if (req.method === 'GET' && parsedUrl.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      message: '食物识别API服务正常运行 (真实AI模式)',
      timestamp: new Date().toISOString(),
      api_configured: !!config.DASHSCOPE_API_KEY
    }));
    return;
  }

  if (req.method === 'POST' && parsedUrl.pathname === '/api/analyze-food') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(body);

        if (!data.image) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: '请提供图片数据'
          }));
          return;
        }

        // 验证base64图片格式
        if (!data.image.startsWith('data:image/')) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: '图片格式不正确，请提供有效的base64图片数据'
          }));
          return;
        }

        console.log('🔍 开始分析食物图片...');

        try {
          // 调用真实的API
          const apiResponse = await callQwenAPI(data.image);

          try {
          // 清理API响应，移除可能的代码块标记
          let cleanedResponse = apiResponse.trim();

          // 如果响应被包装在 ```json 代码块中，提取JSON部分
          if (cleanedResponse.startsWith('```json')) {
            cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (cleanedResponse.startsWith('```')) {
            cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }

          // 尝试解析JSON响应
          const analysisResult = JSON.parse(cleanedResponse);

          // 验证返回的数据结构
          if (analysisResult.error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              error: analysisResult.error
            }));
            return;
          }

          // 验证必要字段
          const requiredFields = ['food_name', 'gi_value', 'suitable_for_diabetics', 'recommendation', 'estimated_nutrition'];
          const missingFields = requiredFields.filter(field => !(field in analysisResult));

          if (missingFields.length > 0) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              error: `返回数据缺少必要字段: ${missingFields.join(', ')}`
            }));
            return;
          }

          // 验证营养信息字段
          const nutritionFields = ['calories', 'carbs', 'protein', 'fat', 'fiber'];
          const missingNutritionFields = nutritionFields.filter(field => !(field in analysisResult.estimated_nutrition));

          if (missingNutritionFields.length > 0) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              error: `营养成分信息缺少字段: ${missingNutritionFields.join(', ')}`
            }));
            return;
          }

          console.log('✅ 食物识别完成:', analysisResult.food_name);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            data: analysisResult
          }));

        } catch (parseError) {
          console.error('JSON解析错误:', parseError);
          console.error('原始响应:', apiResponse);
          console.error('清理后响应:', cleanedResponse || 'N/A');
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'AI返回的数据格式不正确，无法解析JSON'
          }));
        }

        } catch (apiError) {
          console.error('API调用错误:', apiError);

          let errorMessage = 'AI服务调用失败';
          if (apiError.message.includes('401')) {
            errorMessage = 'API密钥无效或已过期';
          } else if (apiError.message.includes('429')) {
            errorMessage = 'API调用频率过高，请稍后重试';
          } else if (apiError.message.includes('timeout')) {
            errorMessage = 'API请求超时，请重试';
          }

          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: errorMessage
          }));
        }

      } catch (error) {
        console.error('请求数据解析错误:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: '请求数据格式不正确'
        }));
      }
    });
    return;
  }

  // 404处理
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: false,
    error: '接口不存在'
  }));
});

server.listen(PORT, () => {
  console.log(`🚀 食物识别API服务器已启动 (真实AI模式)`);
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`📝 图片分析接口: POST http://localhost:${PORT}/api/analyze-food`);
  console.log(`🤖 AI模型: 通义千问 VL-Plus`);
  console.log(`✅ API密钥已配置: ${config.DASHSCOPE_API_KEY ? '是' : '否'}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，请使用其他端口或关闭占用该端口的程序`);
  } else {
    console.error('服务器错误:', err);
  }
});

module.exports = server;