#!/bin/bash

# 开发环境启动脚本
# 同时启动前端和模拟后端服务器

echo "🚀 启动食物血糖指数指南开发环境..."

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 启动模拟后端服务器
echo "🔧 启动模拟后端服务器..."
node mock-server.cjs &
BACKEND_PID=$!

# 等待后端服务器启动
sleep 2

# 检查后端是否启动成功
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ 后端服务器启动成功"
else
    echo "❌ 后端服务器启动失败"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# 启动前端开发服务器
echo "🎨 启动前端开发服务器..."
npm run dev

# 当前端服务停止时，也停止后端服务
echo "🛑 停止服务器..."
kill $BACKEND_PID 2>/dev/null
echo "✅ 所有服务已停止"