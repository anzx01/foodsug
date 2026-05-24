# 安全政策

## 安全报告

如果您发现了任何安全问题或漏洞，请立即通知开发团队，而不是公开发布。

## API密钥安全

### ⚠️ 重要提示

- **永远不要**将API密钥提交到git仓库
- **永远不要**在代码中硬编码敏感信息
- 使用环境变量（`.env`文件）管理所有敏感配置
- `.env`文件已添加到`.gitignore`中，不会被追踪

### 配置流程

1. 复制 `.env.example` 文件为 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 在 `.env` 文件中填入你的API密钥：
   ```bash
   DASHSCOPE_API_KEY=your-actual-api-key-here
   ```

3. 验证 `.env` 不在git追踪中：
   ```bash
   git status | grep .env  # 应该没有输出
   ```

### 获取API密钥

访问 [阿里云DashScope控制台](https://dashscope.console.aliyun.com/) 获取API密钥。

## 依赖安全

定期检查和更新依赖的安全更新：

```bash
npm audit
npm audit fix
```

## 生产部署

在生产环境中：

1. 使用专业的密钥管理服务（如AWS Secrets Manager、Azure Key Vault）
2. 启用HTTPS加密通信
3. 实施适当的身份验证和授权机制
4. 定期进行安全审计

## 数据隐私

本应用处理用户上传的图片和健康信息：

- 图片应在服务器端处理后删除
- 不应将用户数据保存到日志中
- 遵守相关的数据保护法规（如GDPR、CCPA等）
