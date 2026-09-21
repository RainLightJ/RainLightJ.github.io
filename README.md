# RainLight 的个人博客 (RainLight's Blog)

> **基于 Hugo + Reimu 主题深度定制的高性能雨夜像素风知识库博客**  
> 搭载昼夜双动态横幅壁纸、悬浮黑胶小圆环胶囊音乐播放器（无限拖拽 + 点击折叠）、五大专属知识库文件夹分类专区，黑白分明的高对比度极简排版。

---

## 目录
- [1. 网站前端界面与项目文件出处对照表](#1-网站前端界面与项目文件出处对照表)
- [2. 博客完整文件结构](#2-博客完整文件结构)
- [3. 分类（Categories）核心细节：文件目录与排序机制](#3-分类categories核心细节文件目录与排序机制)
- [4. 文章发布与日常笔记标准模板](#4-文章发布与日常笔记标准模板)
- [5. 左上角黑胶小圆环胶囊播放器说明](#5-左上角黑胶小圆环胶囊播放器说明)
- [6. public 文件夹解析与发布说明](#6-public-文件夹解析与发布说明)
- [7. 常用维护与构建命令](#7-常用维护与构建命令)

---

## 1. 网站前端界面与项目文件出处对照表

| 视觉区域 | 呈现效果 | 核心文件 / 资源路径 | 说明与修改方式 |
| :--- | :--- | :--- | :--- |
| **昼夜动态横幅** | 白天：灵梦动漫少女横幅<br>黑夜：深蓝高楼夜景与耳机少年 | `static/images/banner_light.webp`<br>`static/images/banner_dark.webp`<br>`static/custom.js` | 随右上角太阳/月亮切换按钮或系统模式秒级联动切换。 |
| **点击泡泡特效** | 白天：灵梦朱砂红/樱花绯红泡泡<br>黑夜：原版深蓝星海荧光泡泡 | `static/custom.css` (`--red-0` ~ `--red-4`) | 白天热情活泼，夜间深邃沉浸。 |
| **文章标题排版** | H2：圆角微光底衬 + 左侧 5px 亮蓝竖条<br>H3：精致短竖标 + 底边浅虚线 | `static/custom.css` (第 13 节)<br>`hugo.toml` (`anchor_icon = false`) | 彻底移除了粗重下划线与红光小胶囊，隐藏 `#` 锚点链接。 |
| **顶部大标题/副标题** | 横幅中央高光纯白大字与立体投影 | `hugo.toml` (`title`, `params.subtitle.text`) | 高对比度立体阴影在 `custom.css` 中定义。 |
| **顶部导航栏** | 首页、分类、其他、关于（无下拉干扰） | `hugo.toml` (`[[params.menu]]`) | 极简平铺直达，彻底移除归档与标签入口。 |
| **黑胶胶囊播放器** | 悬浮左上角，支持拖拽、折叠、跨页连播 | `static/custom.js`<br>`static/custom.css`<br>`static/mp3/` | Pointer Events 无限拖拽；点击 ◀ 或唱片收拢为 52px 纯圆盘；PJAX 保证换页音乐不断流。 |
| **分类文件夹专区** | 前端、后端、运维、上位机、其他 5 大卡片 | `layouts/_default/terms.html`<br>`static/custom.css` | 点击导航「分类」进入 `/categories/`，带 Emoji 与悬浮动效。 |
| **侧边栏小组件** | 分类列表、最新文章（零标签） | `hugo.toml` (`widgets = ['category', 'recent_posts']`) | 仅保留最核心两项，彻底根除标签云与冗余归档。 |
| **雨丝与玻璃水滴** | 随页面滑落的液态雨丝与水滴动画 | `static/custom.js` (`initRain`) | 原生 Canvas 绘制，轻量节能，自适应分辨率。 |

---

## 2. 博客完整文件结构

```text
d:\HugoBlog\
├── content/                    # 博客核心内容库
│   ├── post/                   # 文章专区（Page Bundles 独立文件夹）
│   │   ├── hello-world/        # 运维分类示例
│   │   ├── markdown-cheatsheet/# 前端分类示例
│   │   ├── backend-architecture/# 后端分类示例
│   │   ├── upper-computer-serial/# 上位机分类示例
│   │   ├── useful-gadgets/     # 其他分类示例
│   │   └── note-template/      # 日常技术笔记与开发实战标准范本
│   └── about.md                # 关于页面
│
├── static/                     # 静态资源（原样部署至发布站点）
│   ├── avatar/                 # 个人头像（avatar.jpg）
│   ├── images/                 # 昼夜壁纸（banner_light/dark.webp）与封面图
│   ├── mp3/                    # 音乐播放器音频库（自动扫描遍历）
│   ├── custom.css              # 全局美化样式（排版、标题、泡泡分色、卡片动效）
│   └── custom.js               # 全局交互脚本（播放器驱动、拖拽、折叠记忆、雨丝）
│
├── layouts/                    # 自定义模板覆盖层（最高优先级，无侵入重构）
│   ├── _default/
│   │   ├── terms.html          # 分类文件夹大卡片聚合专区模板（/categories/）
│   │   └── section.html        # 目录与列表防警告渲染模板
│   └── partials/
│       ├── loader.html         # 开屏旋转加载微光动画
│       ├── header.html         # 顶部极简平铺导航栏
│       ├── sidebar/commonBar.html # 侧边栏作者卡片
│       └── widget/             # 防穿透小组件覆盖（空文件屏蔽 tag/tagcloud/archive）
│
├── archetypes/default.md       # 新文章创建标准模板（无标签纯净版）
├── hugo.toml                   # 站点全局核心配置文件
└── README.md                   # 博客开发与维护手册（本文档）
```

---

## 3. 分类（Categories）核心细节：文件目录与排序机制

博客采用**五大专属分类体系**（前端、后端、运维、上位机、其他），不使用散碎的标签（Tags）。

### 3.1 分类文件在哪个目录？
分类属于内容驱动型架构，涉及以下两个核心位置：
1. **分类专区展示模板**：
   - 文件路径：`layouts/_default/terms.html`
   - 作用：当访问 `/categories/` 时，由该模板负责渲染大文件夹卡片、Emoji 图标、文章统计与动画。
2. **文章分类定义位置**：
   - 目录路径：`content/post/<文章目录>/index.md`
   - 作用：每篇文章在头部 Front-matter 中声明归属分类。例如：
     ```yaml
     categories:
       - "前端"   # 可选：前端 / 后端 / 运维 / 上位机 / 其他
     ```

### 3.2 分类顺序是如何决定的？如何调节？
分类专区（`/categories/`）中的显示顺序由 `layouts/_default/terms.html` 第 12 行控制：
```go
{{- $order := slice "前端" "后端" "运维" "上位机" "其他" -}}
```
- **调节方法**：只需直接在 `slice` 数组中调换分类名称的前后顺序（例如将 `"后端"` 换到最前面），专区卡片就会严格按照该顺序固定排列。未在列表中声明的新分类将自动排在末尾。

---

## 4. 文章发布与日常笔记标准模板

### 4.1 新建文章命令
```powershell
hugo new post/my-article/index.md
```
系统将依据 `archetypes/default.md` 自动创建纯净模板。

### 4.2 推荐头部 Front-matter 元数据
```yaml
---
title: "文章标题"
date: 2026-09-21T21:00:00+08:00
draft: false
description: "简明扼要的摘要，将展示在首页卡片与专区列表中。"
cover: "/images/covers/pixel_tech.webp"
categories:
  - "前端"
---
```

---

## 5. 左上角黑胶小圆环胶囊播放器说明

```text
┌────────────────────────────────────────────────────────┐
│  ╭──╮   Lofi Rain Study                         (歌名) │
│  │◎│   ⏮   ▶   ⏭   ◀                  (操作控制栏) │
│  ╰──╯                                                  │
│ (黑胶圆盘)                                             │
└────────────────────────────────────────────────────────┘
```

1. **添加歌曲**：直接将音频（`.mp3`, `.flac`, `.wav`, `.ogg`, `.m4a`）扔进 `static/mp3/` 目录，Hugo 自动扫描读取，零配置。
2. **点击折叠与展开**：
   - 点击控制栏最右侧的 `◀` 按钮，或直接点击左侧黑胶圆盘，播放器平滑收拢为 **52px 正圆黑胶悬浮唱片**（带外光环律动）；
   - 折叠后鼠标悬停有微光呼吸放大效果，**点击圆盘任何位置立即重新张开展开**；
   - 自动在本地记住折叠状态，刷新依然保持。
3. **无限次自由拖拽**：
   - 采用标准 `Pointer Events` 规范，彻底解决 Chromium 浏览器只能拖动一次的假死 bug，支持屏幕任意拖曳并自动持久化位置。
4. **PJAX 跨页不中断**：
   - 切换页面、浏览分类、阅读文章时，只有主体内容异步换页，音频持续播放不断流。

---

## 6. public 文件夹解析与发布说明

### 6.1 public 文件夹是什么？为什么会觉得“重复”？
- **源码与产物的区别**：
  - `content/`、`static/`、`layouts/` 是**项目源代码**；
  - `public/` 则是 Hugo 执行 `hugo` 构建命令后**生成的最终静态 HTML/CSS 产物**。
- **“重复”的错觉来源**：
  - 例如 `static/images/` 里的图片，在编译后会被复制一份放入 `public/images/` 中；
  - 本地编辑时如果频繁修改或者删除了旧文件（如旧的标签 tags、归档 archives），旧的静态 HTML 可能会残留在 `public/` 中。

### 6.2 彻底清理与净化 public
在打包发布前，建议一键彻底重构（系统已预置）：
```powershell
# 1. 彻底删除旧构建产物
Remove-Item -Path public -Recurse -Force

# 2. 干净构建编译（自动去除垃圾）
hugo --gc --minify
```
执行后 `public/` 仅会保留当前最新生效的页面（标签 tags、废弃 archives 已彻底零残留）。

---

## 7. 常用维护与构建命令

```powershell
# 启动本地实时预览（支持草稿与热重载，端口 3231）
hugo server -D -p 3231

# 生产环境干净打包（输出到 public/）
hugo --gc --minify
```

---
*文档更新时间：2026 年 9 月*
