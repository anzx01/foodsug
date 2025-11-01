@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    食物血糖指数指南 - 启动脚本
echo ========================================
echo.

echo [1/3] 检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js环境正常

echo.
echo [2/3] 安装项目依赖...
if not exist "node_modules" (
    echo 正在安装依赖包...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已存在
)

echo.
echo [3/3] 选择启动模式:
echo.
echo 1. 模拟服务器 (推荐用于测试)
echo    - 返回预设的随机食物数据
echo    - 不需要API密钥
echo    - 响应速度快
echo.
echo 2. 真实AI服务器
echo    - 使用通义千问AI识别食物
echo    - 需要配置API密钥
echo    - 提供真实的营养分析
echo.
echo 3. 停止所有服务
echo.
set /p choice="请选择 (1-3): "

if "%choice%"=="1" (
    echo.
    echo 🚀 启动模拟服务器...
    echo 服务地址: http://localhost:3001
    echo 按 Ctrl+C 停止服务
    echo.
    npm run server:mock
) else if "%choice%"=="2" (
    echo.
    echo 🔍 检查API配置...
    if not exist ".env" (
        echo ❌ 错误: 未找到.env文件
        echo 请创建.env文件并配置通义千问API密钥:
        echo DASHSCOPE_API_KEY=your-api-key-here
        echo DASHSCOPE_BASEURL=https://dashscope.aliyuncs.com/compatible-mode/v1
        pause
        exit /b 1
    )
    echo ✅ API配置文件存在
    echo.
    echo 🚀 启动真实AI服务器...
    echo 服务地址: http://localhost:3001
    echo 按 Ctrl+C 停止服务
    echo.
    npm run server:ai
) else if "%choice%"=="3" (
    echo.
    echo 🛑 正在停止所有服务...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        echo 停止进程 %%a
        taskkill /f /pid %%a >nul 2>&1
    )
    echo ✅ 所有服务已停止
    echo.
    pause
) else (
    echo ❌ 无效选择
    pause
    exit /b 1
)

echo.
echo 脚本执行完成
pause