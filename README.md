# 食物血糖指数指南 (Food Glucemic Guide)

基于AI的食物识别和血糖指数分析应用，帮助糖尿病患者和关注健康的人群科学管理饮食。

## 功能特性

- 🍽️ **AI食物识别**: 使用通义千问视觉模型智能识别食物
- 📊 **血糖指数分析**: 提供准确的GI值和分类
- 🥗 **营养成分估算**: 详细的热量、碳水、蛋白质等营养信息
- 💡 **个性化建议**: 针对糖尿病患者的饮食建议
- 📱 **响应式设计**: 支持手机、平板等设备
- 🌏 **中文优化**: 专门针对中式食物识别优化

## 技术栈

### 前端
- Vite + TypeScript
- React 18
- Tailwind CSS
- shadcn/ui
- React Router

### 后端
- Express.js
- OpenAI SDK
- 通义千问 VL-Plus 模型
- CORS 跨域支持

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0
- 通义千问 API Key (从阿里云DashScope获取)

### 安装步骤

1. **克隆项目**
```bash
git clone <YOUR_GIT_URL>
cd food-glucemic-guide-main
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local 文件，填入你的API密钥
DASHSCOPE_API_KEY=your-actual-api-key-here
```

4. **启动后端服务**

**选项1: 模拟服务器 (推荐用于测试)**
```bash
npm run server:mock
```

**选项2: 真实AI服务器 (使用通义千问)**
```bash
# 确保.env.local文件中配置了API密钥
# DASHSCOPE_API_KEY=your-api-key-here
# DASHSCOPE_BASEURL=https://dashscope.aliyuncs.com/compatible-mode/v1

# 启动真实AI服务器
npm run server:ai
```

**选项3: 传统Express服务器 (需要依赖)**
```bash
# 首先安装依赖
npm install express cors openai

# 启动服务器
npm run server
```

5. **启动前端服务**
```bash
npm run dev
```

6. **访问应用**
- 前端: http://localhost:5173
- 后端API: http://localhost:3001
- 健康检查: http://localhost:3001/api/health

> **注意**: 模拟服务器返回随机数据用于测试，真实AI服务器需要通义千问API密钥

## API接口

### 食物分析接口
```
POST /api/analyze-food
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

**响应格式:**
```json
{
  "success": true,
  "data": {
    "food_name": "红烧肉",
    "gi_value": 75,
    "suitable_for_diabetics": false,
    "recommendation": "建议适量搭配蔬菜食用，控制份量",
    "estimated_nutrition": {
      "calories": 320,
      "carbs": 12,
      "protein": 18,
      "fat": 24,
      "fiber": 0.5
    }
  }
}
```

## 项目结构

```
food-glucemic-guide-main/
├── src/                    # 前端源码
│   ├── components/        # UI组件
│   ├── pages/            # 页面组件
│   ├── data/             # 数据文件
│   └── hooks/            # 自定义Hook
├── resource/             # 静态资源
│   ├── images/           # 食物图片
│   └── foods.json        # 食物数据库
├── server.js             # 后端服务器
├── .env.example          # 环境变量模板
└── package.json          # 项目配置
```

## 使用说明

### 1. 食物库浏览
- 在食物库页面可以查看各种食物的GI值
- 支持按GI等级筛选 (低/中/高)
- 显示详细的营养成分信息

### 2. AI食物识别
- 拍照或从相册选择食物图片
- AI自动识别食物种类和营养成分
- 提供针对糖尿病患者的饮食建议

### 3. 血糖记录
- 记录每日血糖数据
- 生成可视化图表
- 追踪血糖变化趋势

## 注意事项

### API密钥安全
- 请勿将API密钥提交到版本控制系统
- 建议使用环境变量管理敏感信息
- 生产环境请使用安全的密钥管理方案

### 图片上传限制
- 支持常见图片格式 (JPEG, PNG, WebP)
- 图片大小建议不超过10MB
- Base64编码会增大约33%的体积

## 开发指南

### 启动开发环境
```bash
# 同时启动前后端服务 (需要两个终端)
npm run server:dev  # 终端1: 启动后端
npm run dev         # 终端2: 启动前端
```

### 构建生产版本
```bash
# 构建前端
npm run build

# 预览构建结果
npm run preview
```

## 获取API密钥

1. 访问 [阿里云DashScope控制台](https://dashscope.console.aliyun.com/)
2. 注册/登录阿里云账号
3. 开通通义千问服务
4. 创建API Key
5. 将API Key配置到环境变量中

## 故障排除

### 常见问题

1. **"Failed to fetch" 错误**
   - **解决方法**: 启动模拟服务器 `npm run server:mock`
   - **原因**: 后端服务器未启动或端口被占用
   - **检查**: 访问 http://localhost:3001/api/health 测试服务器状态

2. **API调用失败**
   - 检查API密钥是否正确设置 (使用真实AI服务器时)
   - 确认网络连接正常
   - 查看后端日志获取详细错误信息

3. **图片识别不准确**
   - 确保图片清晰度足够
   - 避免光线过暗或过曝
   - 食物应占据图片主要部分

4. **跨域问题**
   - 确认后端CORS配置正确
   - 检查前端API请求地址

5. **端口占用错误**
   ```bash
   # 查找占用3001端口的进程
   netstat -ano | findstr :3001   # Windows
   lsof -i :3001                  # macOS/Linux

   # 终止进程或使用其他端口
   ```

6. **依赖安装问题**
   ```bash
   # 清理并重新安装依赖
   rm -rf node_modules package-lock.json
   npm install
   npm install express cors openai  # 安装后端依赖
   ```

### 快速启动检查清单

**测试模式:**
- [ ] 启动模拟后端: `npm run server:mock`
- [ ] 启动前端: `npm run dev`
- [ ] 测试API: 访问 http://localhost:3001/api/health
- [ ] 上传图片测试识别功能

**真实AI模式:**
- [ ] 检查.env.local配置API密钥
- [ ] 启动AI后端: `npm run server:ai`
- [ ] 启动前端: `npm run dev`
- [ ] 测试API: 访问 http://localhost:3001/api/health
- [ ] 上传真实食物图片测试识别功能

## 贡献指南

欢迎提交Issue和Pull Request来改进项目！

## 许可证

本项目基于 MIT 许可证开源。

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e71d72ee-91e1-417d-9283-32701ec336f3) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
