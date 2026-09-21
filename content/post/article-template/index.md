---
title: "文章发布标准模版（支持一键复制）"
date: 2026-09-21T23:50:00+08:00
draft: false
description: "专为笔记软件（Typora / Obsidian / Notion）定制的开箱即用发布模版，包含同目录图片引用、代码块与排版规范。"
cover: "cover.webp"
categories:
  - "其他"
---

> **写在前面**：本篇文章放置在 **「其他」** 分类下，既作为全站的实时发布样例，也作为可随时查阅复制的模版。  
> 💡 **核心规范**：文章及其专属图片存放在**同一个专属文件夹**内（Page Bundle 模式），结构最整洁，永不丢失外链！

---

## 1. 结构与文件规范（这样放最好看）

假设您要写一篇属于 **「前端」** 分类的新文章，标题叫 `Vue3最佳实践`：

### 📁 推荐文件夹结构
```text
d:\HugoBlog\content\post\
└── vue3-best-practices\          <-- 1. 新建文章专属文件夹（用英文/拼音）
    ├── index.md                  <-- 2. 文章核心正文文件（固定叫 index.md）
    ├── cover.webp                <-- 3. 本文专属封面图（直接放同级）
    └── demo-pic.webp             <-- 4. 本文专属截图或流程图（直接放同级）
```

### 🖼️ 同目录图片如何引用？
- **头部封面图声明**：直接写文件名即可，无需长路径：
  ```yaml
  cover: "cover.webp"
  ```
- **正文插图引用**：直接使用相对路径 `./图片名`：
  ```markdown
  ![前端架构演示图](./demo-pic.webp)
  ```

---

## 2. 效果实测：同目录图片直接渲染展示

以下图片就是存放在本文章同级目录下的 `demo-pic.webp`：

![同目录插图渲染演示](./demo-pic.webp)

---

## 3. 可直接复制的标准 Markdown 模版

您可以直接**点击代码块右上角的复制按钮**，将以下内容完整粘贴到您的笔记软件（如 Typora、Obsidian、Notion、VSCode）中进行创作：

````markdown
---
title: "这里填写文章标题"
date: 2026-09-22T10:00:00+08:00
draft: false
description: "在此处写 1~2 句话作为文章摘要，会在首页卡片与搜索结果中展示。"
cover: "cover.webp"
categories:
  - "前端"
---

> **导读 / 背景**：简要阐述这篇笔记的核心目标、适用环境与解决的痛点。

---

## 1. 核心原理与概念

这里书写文章的一级核心论点，支持行内加粗 **重点内容**，或行内代码 `npm install`：

- **核心特性 1**：清晰明了的分析说明；
- **核心特性 2**：常见场景与解决方案；
- **注意事项**：踩坑记录与排查要点。

---

## 2. 关键代码示例

```typescript
// 示例代码块：支持语法高亮与行号
interface UserConfig {
  theme: 'dark' | 'light';
  rainEffect: boolean;
  autoplay: boolean;
}

export function initializeBlog(config: UserConfig): void {
  console.log('雨夜知识库博客已初始化:', config);
}
```

---

## 3. 插图与架构图展示

将配图保存到当前文章同级文件夹中，然后直接引用：

![示例配图说明](./demo-pic.webp)

---

## 4. 总结与对比分析

| 特性维度 | 传统散落模式 | Page Bundles 独立文件夹模式 (推荐) |
| :--- | :--- | :--- |
| **图片存放** | 全部平铺在 static/，难以查找 | 与对应 index.md 存放在同级，一目了然 |
| **复制迁移** | 拷贝文章时容易漏掉插图 | 直接拷贝整个文件夹，插图随身携带 |
| **维护成本** | 删除文章后留下一堆孤儿图片 | 删文章即删文件夹，零残余垃圾 |

> [!TIP]
> **写作小贴士**：保存时请确保文章头部 `draft: false`，若设为 `true` 则会被视作本地草稿，发布后在线上不展示。
````

---

## 4. 快速发布三部曲

当您在笔记软件写好并保存后，在控制台运行：
```powershell
git add .
git commit -m "发布新文章"
git push origin main
```
GitHub Actions 将在 1 分钟内自动将文章渲染并上线！
