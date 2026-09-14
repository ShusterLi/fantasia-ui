# GitHub 仓库设置指南 | GitHub Repository Setup Guide

## 📋 上传到 GitHub 前的检查清单 | Pre-upload Checklist

在将项目推送到 GitHub 之前，请确认以下事项：

Before pushing the project to GitHub, please confirm the following:

### ✅ 必须提交的文件 | Required Files to Commit

- [x] **源代码** | **Source code** (`packages/`, `scripts/`, etc.)
- [x] **配置文件** | **Configuration files** (`package.json`, `vite.config.ts`, `tsconfig.json`, etc.)
- [x] **pnpm-lock.yaml** - **非常重要！必须提交！** | **Very Important! Must be committed!**
- [x] **文档文件** | **Documentation** (All `.md` files)
- [x] **GitHub 工作流** | **GitHub Workflows** (`.github/workflows/`)
- [x] **LICENSE** 文件 | **LICENSE** file
- [x] **.gitignore** 文件
- [x] **.npmignore** 文件

### ❌ 不要提交的文件 | Files NOT to Commit

- [ ] `node_modules/` - 依赖包（已在 `.gitignore` 中）
- [ ] `dist/` - 构建输出（已在 `.gitignore` 中）
- [ ] `*.log` - 日志文件（已在 `.gitignore` 中）
- [ ] `.DS_Store` - macOS 系统文件（已在 `.gitignore` 中）

---

## 🚀 推送到 GitHub 的步骤 | Steps to Push to GitHub

### 1. 初始化 Git 仓库（如果还没有）| Initialize Git Repository (if not already done)

```bash
# 检查是否已初始化 Git
git status

# 如果未初始化，运行以下命令
git init
git add .
git commit -m "chore: initial commit"
```

### 2. 确认 pnpm-lock.yaml 已被跟踪 | Ensure pnpm-lock.yaml is Tracked

```bash
# 检查锁文件状态
git status pnpm-lock.yaml

# 如果显示未跟踪，添加并提交
git add pnpm-lock.yaml
git commit -m "chore: add pnpm lockfile for reproducible builds"
```

**为什么必须提交 lockfile？| Why Must Commit Lockfile?**
- ✅ 确保 CI/CD 构建可重现 | Ensures reproducible CI/CD builds
- ✅ 锁定依赖版本，避免版本冲突 | Locks dependency versions to avoid conflicts
- ✅ GitHub Actions 需要它来安装依赖 | GitHub Actions needs it to install dependencies

### 3. 创建 GitHub 仓库 | Create GitHub Repository

1. 访问 https://github.com/new
2. 填写仓库名称：`fantasia-ui`
3. 选择 **Public**（公开）或 **Private**（私有）
4. **不要**勾选 "Add a README file"（我们已有 README）
5. **不要**选择 ".gitignore" 和 "license"（我们已有这些文件）
6. 点击 "Create repository"

### 4. 连接本地仓库到 GitHub | Connect Local Repo to GitHub

```bash
# 替换 YOUR_USERNAME 为你的 GitHub 用户名
git remote add origin https://github.com/ShusterLi/fantasia-ui.git

# 或使用 SSH（推荐）
git remote add origin git@github.com:ShusterLi/fantasia-ui.git

# 验证远程仓库
git remote -v
```

### 5. 推送代码到 GitHub | Push Code to GitHub

```bash
# 推送主分支
git push -u origin main

# 或者如果你的默认分支是 master
git push -u origin master
```

---

## 🔐 配置 GitHub Secrets（用于自动发布）| Configure GitHub Secrets (for Auto-publishing)

在推送代码后，需要配置 NPM token 以启用自动发布功能：

After pushing code, configure NPM token to enable auto-publishing:

### 1. 生成 NPM Token | Generate NPM Token

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 点击头像 → **Access Tokens** → **Generate New Token**
3. 选择 **"Automation"** 类型
4. 复制生成的 token（只显示一次！）

### 2. 在 GitHub 添加 Secret | Add Secret in GitHub

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **"New repository secret"**
4. Name: `NPM_TOKEN`
5. Value: 粘贴你的 npm token
6. 点击 **"Add secret"**

---

## ⚙️ GitHub Actions 工作流说明 | GitHub Actions Workflows Explanation

项目包含两个自动化工作流：

The project includes two automation workflows:

### 1. CI 工作流（`.github/workflows/ci.yml`）

**触发条件 | Triggers**:
- 推送到 `main`、`master`、`develop` 分支
- 向这些分支提交 Pull Request

**功能 | Features**:
- 在 Node.js 18、20、22 上测试构建
- 自动安装依赖并构建项目
- 验证代码可以成功编译

### 2. 发布工作流（`.github/workflows/publish.yml`）

**触发条件 | Triggers**:
- 推送版本标签（如 `v0.2.32`）

**功能 | Features**:
- 自动构建项目
- 发布到 npm
- 需要配置 `NPM_TOKEN` secret

---

## 📦 如何发布新版本 | How to Publish a New Version

详细步骤请参考：[发布指南](./.github/PUBLISH_GUIDE.md)

For detailed steps, refer to: [Publish Guide](./.github/PUBLISH_GUIDE.md)

**快速流程 | Quick Process**:

```bash
# 1. 更新版本号
npm version patch  # 0.2.31 → 0.2.32

# 2. 更新 CHANGELOG
# 手动编辑 CHANGELOG.md 和 CHANGELOG.zh-CN.md

# 3. 提交更改
git add .
git commit -m "chore: release v0.2.32"

# 4. 推送代码和标签
git push origin main --tags

# 5. GitHub Actions 会自动构建并发布到 npm！
```

---

## 🔍 验证设置 | Verify Setup

### 检查 Git 状态 | Check Git Status

```bash
# 查看未提交的文件
git status

# 确保 pnpm-lock.yaml 已提交
git log --oneline -- pnpm-lock.yaml

# 查看远程仓库
git remote -v
```

### 检查 .gitignore | Check .gitignore

```bash
# 确认 dist/ 和 node_modules/ 被忽略
cat .gitignore | grep -E "^(dist|node_modules)"
```

### 检查 GitHub Actions | Check GitHub Actions

推送后，访问你的 GitHub 仓库：
After pushing, visit your GitHub repository:

1. 点击 **"Actions"** 标签页
2. 查看是否有工作流运行
3. 检查构建状态是否成功

---

## ⚠️ 常见问题 | Common Issues

### Q1: GitHub Actions 构建失败："pnpm-lock.yaml is absent"

**原因 | Cause**: lockfile 未提交到仓库

**解决 | Solution**:
```bash
git add pnpm-lock.yaml
git commit -m "chore: add pnpm lockfile"
git push origin main
```

### Q2: GitHub Actions 构建失败："not compatible lockfile"

**原因 | Cause**: 本地 pnpm 版本与 CI 环境不一致

**解决 | Solution**:
```bash
# 检查本地 pnpm 版本
pnpm --version

# 如果版本不是 8.x，升级到 8
npm install -g pnpm@8

# 重新生成 lockfile
rm pnpm-lock.yaml
pnpm install

# 提交新的 lockfile
git add pnpm-lock.yaml
git commit -m "chore: regenerate lockfile with pnpm 8"
git push origin main
```

### Q3: 发布失败："NPM_TOKEN 无效"

**原因 | Cause**: NPM token 未配置或已过期

**解决 | Solution**:
1. 生成新的 NPM token（选择 "Automation" 类型）
2. 在 GitHub 仓库 Settings → Secrets 中更新 `NPM_TOKEN`

### Q4: 推送被拒绝："Updates were rejected"

**原因 | Cause**: 远程仓库有更新，本地仓库落后

**解决 | Solution**:
```bash
# 拉取远程更新
git pull origin main --rebase

# 如果有冲突，解决后继续
git add .
git rebase --continue

# 重新推送
git push origin main
```

---

## 📚 相关文档 | Related Documentation

- [发布指南](./.github/PUBLISH_GUIDE.md) - 详细的发布流程
- [贡献指南](./CONTRIBUTING.md) - 如何贡献代码
- [构建问题解决方案](./BUILD_FIX.md) - 构建问题排查
- [GitHub Actions 文档](https://docs.github.com/en/actions) - 官方文档

---

## 🎯 推荐的工作流程 | Recommended Workflow

### 日常开发 | Daily Development

```bash
# 1. 创建功能分支
git checkout -b feature/new-component

# 2. 开发和测试
pnpm dev
pnpm build

# 3. 提交更改
git add .
git commit -m "feat: add new component"

# 4. 推送到 GitHub
git push origin feature/new-component

# 5. 在 GitHub 上创建 Pull Request
```

### 发布新版本 | Publishing New Version

```bash
# 1. 确保在主分支
git checkout main
git pull origin main

# 2. 更新版本
npm version patch

# 3. 更新文档
# 编辑 CHANGELOG.md

# 4. 提交并推送
git add .
git commit -m "chore: release v0.2.32"
git push origin main --tags

# 5. GitHub Actions 自动发布到 npm
```

---

## ✅ 最终检查清单 | Final Checklist

在推送之前，运行这些命令确认一切正常：

Before pushing, run these commands to confirm everything is OK:

```bash
# ✅ 检查 Git 状态
git status

# ✅ 确认 lockfile 存在
ls pnpm-lock.yaml

# ✅ 本地构建测试
pnpm install
pnpm build

# ✅ 检查构建输出
ls dist/

# ✅ 验证类型定义
ls dist/index.d.ts

# ✅ 查看远程仓库配置
git remote -v
```

如果所有检查都通过，就可以放心推送了！

If all checks pass, you're ready to push!

---

**需要帮助？| Need Help?**

如有问题，请在 GitHub 创建 Issue：
If you have questions, create an issue on GitHub:

https://github.com/ShusterLi/fantasia-ui/issues

---

**祝你好运！🎉 | Good Luck! 🎉**
