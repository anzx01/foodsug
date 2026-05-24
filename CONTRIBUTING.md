# 贡献指南

欢迎为本项目做出贡献！请遵循以下指南。

## 报告问题

发现bug或有改进建议时，请提交GitHub Issue，包括：

- 清晰的问题描述
- 复现步骤
- 预期行为与实际行为
- 环境信息（操作系统、Node.js版本等）

## 提交代码

### 开发流程

1. **Fork并克隆项目**
   ```bash
   git clone https://github.com/your-username/food-glucemic-guide.git
   cd food-glucemic-guide
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **遵循代码规范**
   - 使用TypeScript
   - 遵循ESLint配置
   - 保持代码简洁易维护
   - 为复杂逻辑添加注释

4. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 功能描述"
   ```

5. **推送并创建Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### 提交规范

采用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范：

- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `refactor:` 代码重构
- `test:` 添加测试
- `chore:` 构建工具或依赖更新

## 代码审查

所有Pull Request都需要通过代码审查。请确保：

- [ ] 代码能够正常运行
- [ ] ESLint检查通过
- [ ] 新增功能有相应的测试
- [ ] 更新了相关文档
- [ ] 没有提交API密钥或敏感信息

## 许可证

提交代码表示你同意将代码贡献给本项目，并采用MIT许可证。

## 问题反馈

如有任何问题，请：

1. 查看已有的Issues和Discussions
2. 在GitHub上提交新Issue
3. 提供尽可能详细的信息

感谢你的贡献！
