@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    食物血糖指数指南 - 停止服务脚本
echo ========================================
echo.

echo 🛑 正在查找并停止所有相关服务...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 ^| findstr LISTENING') do (
    echo 停止占用端口3001的进程: %%a
    taskkill /f /pid %%a >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ 进程 %%a 已停止
    ) else (
        echo ❌ 无法停止进程 %%a
    )
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo 停止占用端口5173的进程: %%a
    taskkill /f /pid %%a >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ 进程 %%a 已停止
    ) else (
        echo ❌ 无法停止进程 %%a
    )
)

echo.
echo 🔍 检查端口状态...
timeout /t 2 >nul

netstat -ano | findstr :3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  端口3001仍被占用
) else (
    echo ✅ 端口3001已释放
)

netstat -ano | findstr :5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  端口5173仍被占用
) else (
    echo ✅ 端口5173已释放
)

echo.
echo 🎉 所有服务已停止完成！
echo.
pause