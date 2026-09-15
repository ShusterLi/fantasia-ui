# 快速开始

## 安装

建议使用 pnpm：

```bash
pnpm add -D vitepress
```

或者使用 npm/yarn：

```bash
npm i -D vitepress
# 或
yarn add -D vitepress
```

## 本地启动

安装依赖后，运行：

```bash
pnpm run docs:dev
```

浏览器打开 http://localhost:5173

## 构建静态站点

```bash
pnpm run docs:build
pnpm run docs:serve
```

构建产物位于 `docs/.vitepress/dist`（或 VitePress 默认输出目录）。
