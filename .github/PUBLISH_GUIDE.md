# 📦 NPM 发布指南

## 前置准备

### 1. 确保 pnpm-lock.yaml 已提交

**重要**：`pnpm-lock.yaml` 必须提交到 Git 仓库，否则 GitHub Actions 构建会失败。

检查锁文件状态：
```bash
git status pnpm-lock.yaml

# 如果未提交，添加并提交
git add pnpm-lock.yaml
git commit -m "chore: add pnpm-lock.yaml"
git push origin main
```

### 2. 配置 NPM Token

在 GitHub 仓库中配置 NPM 访问令牌：

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 点击头像 → Access Tokens → Generate New Token
3. 选择 "Automation" 类型（用于 CI/CD）
4. 复制生成的 token
5. 在 GitHub 仓库设置中：
   - Settings → Secrets and variables → Actions
   - 点击 "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: 粘贴你的 npm token

### 3. 检查 package.json

确保以下字段正确配置：

```json
{
  "name": "fantasia-ui",
  "version": "0.2.31",
  "private": false,
  "publishConfig": {
    "registry": "https://registry.npmjs.org/",
    "access": "public"
  }
}
```

## 🚀 发布步骤

### 方式一：通过 Git Tag 自动发布（推荐）

1. **更新版本号**

```bash
# 补丁版本（0.2.31 → 0.2.32）
npm version patch

# 次版本（0.2.31 → 0.3.0）
npm version minor

# 主版本（0.2.31 → 1.0.0）
npm version major
```

2. **更新 CHANGELOG**

编辑 `CHANGELOG.md` 和 `CHANGELOG.zh-CN.md`，添加新版本的更新内容。

3. **提交更改**

```bash
git add .
git commit -m "chore: release v0.2.32"
```

4. **推送标签**

```bash
# 推送代码和标签
git push origin main --tags

# 或分别推送
git push origin main
git push origin v0.2.32
```

5. **GitHub Actions 自动构建发布**

推送标签后，GitHub Actions 会自动：
- 安装依赖
- 构建项目
- 发布到 npm

在 GitHub Actions 页面查看发布进度。

### 方式二：本地手动发布

如果需要手动发布：

1. **登录 npm**

```bash
npm login
```

2. **构建项目**

```bash
pnpm build
```

3. **发布**

```bash
npm publish
```

## 📋 发布检查清单

发布前请确认：

- [ ] 所有测试通过
- [ ] 构建成功（`pnpm build` 无错误）
- [ ] 版本号已更新
- [ ] CHANGELOG 已更新
- [ ] README 文档最新
- [ ] 所有更改已提交
- [ ] dist/ 目录未提交到 Git（已在 .gitignore 中）
- [ ] package.json 配置正确

## 🔍 验证发布

发布成功后验证：

1. **检查 npm 页面**

```bash
# 浏览器打开
https://www.npmjs.com/package/fantasia-ui
```

2. **本地测试安装**

```bash
# 创建测试项目
mkdir test-fantasia-ui
cd test-fantasia-ui
npm init -y
npm install fantasia-ui@latest

# 检查是否安装成功
ls node_modules/fantasia-ui/
```

3. **测试导入**

```javascript
// test.js
import { FButton, FCard } from 'fantasia-ui'
console.log('✅ Import successful')
```

## ⚠️ 常见问题

### 发布失败：pnpm-lock.yaml 缺失

错误信息：
```
ERR_PNPM_NO_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is absent
```

**原因**：`pnpm-lock.yaml` 文件未提交到 Git 仓库。

**解决方法**：
```bash
# 检查文件是否存在
ls pnpm-lock.yaml

# 如果文件存在但未提交
git add pnpm-lock.yaml
git commit -m "chore: add pnpm lockfile"
git push origin main

# 如果文件不存在，先安装依赖生成锁文件
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: add pnpm lockfile"
git push origin main
```

**注意**：lockfile 兼容性问题（"not compatible lockfile"）通常是因为 pnpm 版本不一致。工作流使用 pnpm 8，确保本地也使用相同版本。

### 发布失败：NPM_TOKEN 无效

检查：
1. Token 是否正确复制到 GitHub Secrets
2. Token 类型是否为 "Automation"
3. Token 是否过期

### 发布失败：版本号冲突

错误：`You cannot publish over the previously published versions`

解决：
```bash
# 更新版本号
npm version patch
git push origin main --tags
```

### GitHub Actions 构建超时

解决：
1. 检查内存设置（已配置 8GB）
2. 检查构建日志定位问题
3. 本地运行 `pnpm build` 排查错误

### 发布后类型提示不工作

检查：
1. `dist/index.d.ts` 是否存在
2. `package.json` 中 `types` 字段是否正确
3. 用户项目的 TypeScript 配置

## 📊 发布后

### 更新 GitHub Release

1. 在 GitHub 仓库创建 Release
2. 选择刚才推送的 tag
3. 复制 CHANGELOG 内容作为描述
4. 发布 Release

### 通知用户

如果有重大更新：
- 更新 README.md
- 在 Issues 中通知关注的用户
- 发布 Twitter/社交媒体公告（可选）

## 🔄 回滚发布

如果需要回滚：

```bash
# 废弃某个版本（不推荐删除）
npm deprecate fantasia-ui@0.2.32 "This version has critical bugs"

# 发布修复版本
npm version patch
npm publish
```

## 📚 相关文档

- [npm 发布文档](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [语义化版本](https://semver.org/lang/zh-CN/)
