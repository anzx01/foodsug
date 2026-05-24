const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 3001;
const MAX_REQUEST_BYTES = 15 * 1024 * 1024;

// 模拟的食物识别结果
const mockFoodResults = [
  {
    food_name: "红烧肉",
    gi_value: 75,
    suitable_for_diabetics: false,
    recommendation: "建议适量搭配蔬菜食用，控制份量",
    estimated_nutrition: {
      calories: 320,
      carbs: 12,
      protein: 18,
      fat: 24,
      fiber: 0.5
    }
  },
  {
    food_name: "白米饭",
    gi_value: 83,
    suitable_for_diabetics: false,
    recommendation: "建议替换为糙米饭或杂粮饭",
    estimated_nutrition: {
      calories: 130,
      carbs: 28,
      protein: 2.7,
      fat: 0.3,
      fiber: 0.4
    }
  },
  {
    food_name: "西兰花",
    gi_value: 15,
    suitable_for_diabetics: true,
    recommendation: "低GI蔬菜，适合糖尿病患者大量食用",
    estimated_nutrition: {
      calories: 34,
      carbs: 7,
      protein: 2.8,
      fat: 0.4,
      fiber: 2.6
    }
  }
];

// 设置CORS headers
const setCORSHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

const server = http.createServer((req, res) => {
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
      message: '食物识别API服务正常运行 (模拟模式)',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  if (req.method === 'POST' && parsedUrl.pathname === '/api/analyze-food') {
    let body = '';
    let requestTooLarge = false;

    req.on('data', chunk => {
      if (requestTooLarge) return;
      body += chunk.toString();
      if (Buffer.byteLength(body) > MAX_REQUEST_BYTES) {
        requestTooLarge = true;
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: '图片过大，请上传10MB以内的图片'
        }));
        req.destroy();
      }
    });

    req.on('end', () => {
      if (requestTooLarge) return;

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

        // 模拟处理延迟
        setTimeout(() => {
          // 随机选择一个模拟结果
          const randomResult = mockFoodResults[Math.floor(Math.random() * mockFoodResults.length)];

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            data: randomResult
          }));
        }, 1500); // 模拟AI处理时间

      } catch (error) {
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
  console.log(`🚀 食物识别API服务器已启动 (模拟模式)`);
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`📝 图片分析接口: POST http://localhost:${PORT}/api/analyze-food`);
  console.log(`\n⚠️  注意: 这是模拟服务器，返回随机数据`);
  console.log(`💡 要使用真实的AI识别，请安装依赖并运行: npm install express cors openai`);
  console.log(`🔧 然后启动真实服务器: npm run server`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，请使用其他端口或关闭占用该端口的程序`);
  } else {
    console.error('服务器错误:', err);
  }
});

module.exports = server;
