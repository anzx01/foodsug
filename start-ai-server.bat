@echo off
echo 🚀 启动食物血糖指数指南 (真实AI模式)...

REM 检查.env.local文件是否存在
if not exist ".env.local" (
    echo ❌ 错误: .env.local文件不存在
    echo 💡 请创建.env.local文件并配置API密钥:
    echo    DASHSCOPE_API_KEY=your-api-key-here
    echo    DASHSCOPE_BASEURL=https://dashscope.aliyuncs.com/compatible-mode/v1
    pause
    exit /b 1
)

REM 检查API密钥是否配置
findstr "DASHSCOPE_API_KEY=" .env.local >nul
if errorlevel 1 (
    echo ❌ 错误: .env.local文件中未找到DASHSCOPE_API_KEY配置
    pause
    exit /b 1
)

echo ✅ 环境配置检查通过
echo.

REM 启动真实AI后端服务器
echo 🔧 启动真实AI后端服务器...
start "AI Backend Server" cmd /k "node real-server.cjs"

REM 等待后端服务器启动
timeout /t 3 /nobreak > nul

REM 检查后端是否启动成功
curl -s http://localhost:3001/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ 后端服务器启动失败
    pause
    exit /b 1
)

echo ✅ 后端服务器启动成功
echo.

REM 启动前端开发服务器
echo 🎨 启动前端开发服务器...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ AI服务启动完成！
echo 📱 前端: http://localhost:5173
echo 📡 后端API: http://localhost:3001
echo 🤖 AI模型: 通义千问 VL-Plus
echo 💡 现在可以上传真实的食物图片进行识别了！
echo.
echo 🔍 使用提示:
echo 1. 确保图片清晰，食物占据主要部分
echo 2. 图片尺寸必须大于10x10像素
echo 3. 支持JPEG、PNG、WebP等格式
echo.
echo 关闭此窗口不会停止服务，请手动关闭各个服务器窗口
pause