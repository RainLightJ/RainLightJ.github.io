---
title: "第一篇文章：博客搭建完成"
date: 2026-09-02T21:00:00+08:00
draft: false
categories: ["运维"]
cover: "/images/covers/pixel_tech.webp"
description: "用 Hugo + GitHub Pages 搭起了这个博客，记录一下技术栈和日常发布流程。"
---

这个博客用 Hugo 生成静态页面，托管在 GitHub Pages 上，全程零成本。

## 技术栈

| 组件 | 选择 | 作用 |
|---|---|---|
| 静态站点生成器 | Hugo Extended v0.165.0 | 把 Markdown 编译成 HTML |
| 主题 | PaperMod | 简洁、支持深色模式和搜索 |
| 托管 | GitHub Pages | 免费，无流量限制 |
| 自动部署 | GitHub Actions | push 后自动构建上线 |

用 extended 版本是必需的，PaperMod 依赖 SCSS 编译，普通版会构建失败。

## 日常发布流程

新建一篇文章：

```bash
hugo new posts/文章目录名/index.md
```

本地预览，改动会实时刷新：

```bash
hugo server -D
```

浏览器打开 `http://localhost:1313` 即可。`-D` 表示包含草稿。

写完发布：

```bash
git add .
git commit -m "新文章：xxx"
git push
```

推送后 GitHub Actions 自动构建，一到两分钟线上生效。

## 关于草稿

Front Matter 里 `draft: true` 的文章不会被构建，所以草稿可以放心提交推送，不会出现在线上。这等于有了一个带完整版本历史的私人草稿箱。

要发布时把它改成 `draft: false`。

## 图片怎么放

每篇文章是一个目录（Page Bundle），图片和 `index.md` 放在一起：

```
content/posts/my-post/
├── index.md
├── cover.jpg
└── screenshot.png
```

Markdown 里直接用相对路径引用：

```markdown
![截图](screenshot.png)
```

这样删文章时图片跟着走，不会在 `static/` 里堆孤儿文件。

注意手机原图不要直接放进去，一张四五 MB，而且 Git 会保留每个历史版本，删掉也不会让仓库变小。另外原图带 GPS 信息，仓库是公开的。
