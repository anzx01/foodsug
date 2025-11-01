@echo off
echo 🚀 启动食物血糖指数指南开发环境...

REM 检查是否安装了依赖
if not exist "node_modules" (
    echo 📦 安装依赖...
    npm install
)

REM 启动模拟后端服务器
echo 🔧 启动模拟后端服务器...
start "Backend Server" cmd /k "node mock-server.cjs"

REM 等待后端服务器启动
timeout /t 3 /nobreak > nul

REM 启动前端开发服务器
echo 🎨 启动前端开发服务器...
start "Frontend Server" cmd /k "npm run dev"

echo ✅ 开发环境启动完成！
echo 📱 前端: http://localhost:5173
echo 📡 后端API: http://localhost:3001
echo 💡 关闭此窗口不会停止服务，请手动关闭各个服务器窗口
pause