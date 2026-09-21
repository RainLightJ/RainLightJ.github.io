# RainLight 的个人博客 (RainLight's Blog)

> **基于 Hugo + Reimu 主题深度定制的高性能雨夜像素风知识库博客**  
> 搭载昼夜双动态横幅壁纸、悬浮黑胶小圆环胶囊音乐播放器（无限拖拽 + 点击折叠）、五大专属知识库文件夹分类专区，黑白分明的高对比度极简排版。

- 🌐 **博客线上访问地址 (GitHub Pages)**: [https://RainLightJ.github.io/](https://RainLightJ.github.io/)
- 📦 **GitHub 部署仓库**: [RainLightJ/RainLightJ.github.io](https://github.com/RainLightJ/RainLightJ.github.io)
- 💾 **GitHub 源码备份仓库**: [RainLightJ/HugoBlog-backup](https://github.com/RainLightJ/HugoBlog-backup)

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
| **黑胶胶囊播放器** | 悬浮左上角，支持拖拽、折叠、跨页连播 | `static/custom.js`<br>`static/custom.css`<br>`static/mp3/` | 电脑 + 手机端全平台丝滑触控拖拽；点击 ◀ 或唱片收拢为 52px 纯圆盘；PJAX 保证换页音乐不断流。 |
| **分类文件夹专区** | 前端、后端、运维、其他 4 大卡片 | `layouts/_default/terms.html`<br>`static/custom.css` | 点击导航「分类」进入 `/categories/`，带 Emoji 与悬浮动效。 |
| **侧边栏小组件** | 分类列表、最新文章（零标签） | `hugo.toml` (`widgets = ['category', 'recent_posts']`) | 仅保留最核心两项，彻底根除标签云与冗余归档。 |
| **雨丝与玻璃水滴** | 随页面滑落的液态雨丝与水滴动画 | `static/custom.js` (`initRain`) | 原生 Canvas 绘制，轻量节能，自适应分辨率。 |
| **开屏加载微光** | 旋转黑胶星轨罗盘 + “正在加载中...” | `layouts/partials/loader.html` | 告别旧式太极，现代雨夜科技微光质感。 |
| **页脚 Footer** | 极简留白微光横线（无冗余标识） | `layouts/partials/footer.html` | 彻底移除 `@2026` 与 `Powered by Hugo / Reimu` 杂音。 |

---

## 2. 博客完整文件结构

```text
d:\HugoBlog\
├── content/                    # 博客核心内容库
│   ├── post/                   # 文章专区（Page Bundles 独立文件夹模式）
│   │   ├── hello-rainlight/    # 初始纯净创作笔记范例
│   │   └── _index.md           # 文章根节点配置
│   └── about.md                # 关于页面
│
├── static/                     # 静态资源（原样部署至发布站点）
│   ├── avatar/                 # 个人头像（avatar.jpg）
│   ├── images/                 # 昼夜壁纸（banner_light/dark.webp）与封面图
│   ├── mp3/                    # 音乐播放器音频库（自动扫描遍历）
│   ├── custom.css              # 全局美化样式（排版、移动端自适应、标题、泡泡分色）
│   └── custom.js               # 全局交互脚本（播放器驱动、触控拖拽、折叠记忆、雨丝）
│
├── layouts/                    # 自定义模板覆盖层（最高优先级，无侵入重构）
│   ├── _default/
│   │   ├── terms.html          # 分类文件夹大卡片聚合专区模板（/categories/）
│   │   └── section.html        # 目录与列表防警告渲染模板
│   └── partials/
│       ├── loader.html         # 开屏旋转黑胶星轨罗盘加载动画
│       ├── footer.html         # 极简纯净页脚（已移除版权与主题链接）
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

博客采用**知识库分类体系**（当前预设：前端、后端、运维、其他），不使用散碎的标签（Tags）。

### 3.1 分类文件在哪个目录？
分类属于**内容驱动型架构**，涉及以下两个核心位置：
1. **分类专区展示模板**：
   - 文件路径：`layouts/_default/terms.html`
   - 作用：当访问 `/categories/` 时，由该模板负责渲染大文件夹卡片、Emoji 图标、文章统计与动画。
2. **文章分类定义位置**：
   - 目录路径：`content/post/<文章目录>/index.md`
   - 作用：每篇文章在头部 Front-matter 中声明归属分类。例如：
     ```yaml
     categories:
       - "前端"   # 可选：前端 / 后端 / 运维 / 其他 / 或您自定义的任何新分类
     ```

### 3.2 如何新增一个全新分类？（三步搞定）
在 Hugo 中，分类是**自动生成**的，您完全不需要手动去创建专门的分类目录：
- **第一步：在文章里直接使用新分类名**  
  在任意一篇笔记的头部写入新分类，例如：
  ```yaml
  categories:
    - "算法与刷题"
  ```
  保存后，Hugo 会自动生成 `/categories/算法与刷题/` 分类列表页。
- **第二步：设置分类在「分类专区」中的排列顺序（可选）**  
  打开 `layouts/_default/terms.html` 第 11 行，把新分类加到排序列表中：
  ```go
  {{- $order := slice "前端" "后端" "运维" "算法与刷题" "其他" -}}
  ```
- **第三步：为新分类指定一个专属 Emoji 图标（可选）**  
  在 `layouts/_default/terms.html` 第 30 行左右添加判断：
  ```go
  {{- if eq $categoryName "算法与刷题" }}{{ $icon = "🧠" }}{{ end -}}
  ```
  如果未指定图标，系统将自动使用默认的 `📁` 文件夹图标，非常安全。

---

## 4. 文章发布与日常笔记标准写作指南

### 4.1 新建文章目录的两种方式

#### 方式 A：命令行一键创建（推荐）
在项目根目录运行以下命令：
```powershell
hugo new post/my-new-note/index.md
```
系统会自动在 `content/post/` 下生成 `my-new-note` 专属文件夹，并基于 `archetypes/default.md` 填充好干净的头部模版。

#### 方式 B：手动图形化新建
1. 打开 `content/post/` 目录；
2. 新建一个以文章英文、拼音命名的子文件夹（例如 `vue3-setup-guide`）；
3. 在该文件夹内新建一个文本文件，命名为 `index.md`；
4. 如果文章有截图、插图，直接把图片（如 `pic1.png`）扔进这个文件夹，在 Markdown 里直接写 `![截图](./pic1.png)` 即可！这就是 Hugo 的 **Page Bundles 模式**，图片与文章紧密聚合，极其整洁。

### 4.2 标准文章头部 Front-matter 模板
直接复制以下内容到你的 `index.md` 最开头：
```yaml
---
title: "我的文章标题"
date: 2026-09-22T10:00:00+08:00
draft: false
description: "这里写一段简短的摘要说明，会在首页卡片和分类列表展示。"
cover: "/images/covers/pixel_tech.webp"   # 封面图路径
categories:
  - "前端"                               # 所属分类：前端 / 后端 / 运维 / 其他
---

## 1. 章节标题

```

---

## 5. 灵动微光音频胶囊（对手机深度优化）

```text
折叠状态（极简微光微胶囊）：
┌────────────────────────┐
│  ❚❙❘  BGM              │   (发光音频律动波浪条 + BGM 标识，轻触即开)
└────────────────────────┘

展开状态（完整音乐控制舱）：
┌────────────────────────────────────────────────────────┐
│  ❚❙❘  Lofi Rain Study          ⏮   ▶   ⏭   ✕      │
└────────────────────────────────────────────────────────┘
```

1. **添加歌曲**：直接将音频（`.mp3`, `.flac`, `.wav`, `.ogg`, `.m4a`）扔进 `static/mp3/` 目录，Hugo 自动扫描读取，零配置。
2. **极速顺滑交互（全新原生逻辑）**：
   - **折叠态**：优雅收纳为精致圆角微光胶囊（`35px` 高），内置 3 根随着音乐节奏上下跳动的发光音浪条；
   - **点击即开**：无论电脑鼠标还是手机触控，轻点小胶囊**100% 秒级平滑展开**，彻底告别拖拽冲突与死锁；
   - **一键折叠**：点击控制栏右侧的 `✕` 按钮（或再次轻点音浪区）即刻顺滑缩回微胶囊，大拇指单手轻松操作。
3. **手机端专属深度优化**：
   - 自动贴靠在屏幕左上角导航栏下方（`top: 54px; left: 10px;`），小巧灵动，绝不遮挡任何文章标题与页面正文；
   - 展开宽度自适应屏幕，杜绝横向溢出。
4. **PJAX 跨页连播**：
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
# 1. 启动本地实时预览（支持草稿与热重载，端口 3231）
hugo server -D -p 3231

# 2. 本地生产环境干净编译测试（输出到 public/）
hugo --gc --minify

# 3. 提交并推送到 GitHub（自动触发 GitHub Actions 构建并部署到 GitHub Pages）
git add .
git commit -m "更新博客内容与配置"
git push origin main        # 推送到主仓库，GitHub Actions 自动发布到 https://RainLightJ.github.io/
git push backup main        # 可选：同步备份到源码备份仓库
```

---
*文档更新时间：2026 年 9 月*
