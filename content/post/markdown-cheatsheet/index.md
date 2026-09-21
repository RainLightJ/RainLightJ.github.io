---
title: "Markdown 排版效果速查"
date: 2026-09-03T07:00:00+08:00
draft: false
categories: ["前端"]
cover: "/images/covers/pixel_study.webp"
description: "把常用的 Markdown 语法全写一遍，既能看主题的渲染效果，也能当写作时的参考。"
---

这篇文章把常用语法都写了一遍。左边（宽屏）或顶部会出现目录，右下角有回到顶部的按钮，右上角可以切换深色模式。

## 文本样式

**加粗**、*斜体*、***粗斜体***、~~删除线~~、`行内代码`。

普通链接：[Hugo 官方文档](https://gohugo.io/documentation/)

上标下标要写 HTML：H<sub>2</sub>O、x<sup>2</sup>。因为 `hugo.toml` 里开了 `unsafe = true`，Markdown 中可以内嵌 HTML。

## 段落与换行

段落之间空一行即可。这是第一段。

这是第二段。如果想在同一段内强制换行，
在行尾打两个空格再回车。

## 列表

无序列表：

- 第一项
- 第二项
  - 嵌套项，缩进两个空格
  - 再一项
- 第三项

有序列表：

1. 安装 Hugo Extended
2. 创建站点并添加主题
3. 写文章
4. 推送到 GitHub

任务列表：

- [x] 装好 Hugo
- [x] 配好主题和自动部署
- [x] 推送成功
- [ ] 绑定自定义域名
- [ ] 加评论系统

## 代码

行内代码用反引号包住：`hugo server -D`。

代码块标注语言可以高亮：

```powershell
# 新建一篇文章
cd D:\HugoBlog
hugo new posts/my-post/index.md

# 本地预览，保存自动刷新
hugo server -D
```

```python
def fib(n):
    """斐波那契数列前 n 项"""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b


print(list(fib(10)))
```

```yaml
# GitHub Actions 片段
- name: Checkout
  uses: actions/checkout@v4
  with:
    submodules: recursive
```

```diff
- draft: true
+ draft: false
```

每个代码块右上角有复制按钮，鼠标移上去才显示。

## 表格

| 组件 | 选择 | 说明 |
|---|---|---|
| 生成器 | Hugo Extended | 必须是 extended，主题要编译 SCSS |
| 主题 | PaperMod | 深色模式、搜索、目录都自带 |
| 托管 | GitHub Pages | 免费，无流量限制 |
| 部署 | GitHub Actions | push 后自动构建 |

对齐方式用冒号控制：

| 左对齐 | 居中 | 右对齐 |
|:---|:---:|---:|
| abc | abc | abc |
| 较长的一段文字 | 中 | 3.14 |

## 引用

> 早优化是万恶之源。
>
> —— Donald Knuth

引用可以嵌套：

> 第一层
>
> > 第二层
> >
> > 里面也能放代码：`git push`

## 分隔线

---

## 图片

图片放在文章自己的目录里，和 `index.md` 平级，然后用相对路径引用：

```markdown
![说明文字](screenshot.png)
```

这篇文章没放图，所以这里只写语法。方括号里的文字是 alt 描述，屏幕阅读器会念出来，也是图片加载失败时的兜底文本，建议认真写。

封面图在 front matter 里配：

```yaml
cover:
  image: "cover.jpg"
  alt: "封面说明"
  caption: "图片下方的说明文字"
```

## 脚注

Hugo 支持脚注[^1]，点击会跳到页面底部，再点箭头能跳回来[^2]。

[^1]: 脚注写法是 `[^标识]`，然后在文章任意位置定义内容。
[^2]: 标识可以是数字也可以是单词，比如 `[^note]`，最终渲染出来都是按出现顺序编号。

## 中文排版的两个细节

`hugo.toml` 里开了 `hasCJKLanguage = true`，所以摘要按字数截断而不是按单词，中文摘要长度才正常。

标题里如果有中英文混排，比如「用 Hugo 搭建博客」，建议手动在中英文之间加空格，主题不会自动加。

## 目录

这篇文章顶部的目录是自动生成的，基于 `##` 和 `###` 标题。全站默认折叠，想默认展开就把 `hugo.toml` 里的 `TocOpen` 改成 `true`。

单篇文章想关掉目录，在 front matter 里加：

```yaml
ShowToc: false
```

Front matter 里的设置会覆盖全站配置，这个规则对所有参数都适用。

## 试试这些

改点东西看看效果，反正随时能改回来：

- 把 `hugo.toml` 里的 `defaultTheme` 从 `auto` 改成 `dark`，强制深色
- 加一篇 `draft: true` 的文章，确认它不出现在线上但能被 `hugo server -D` 预览到
- 点右上角的搜索，输入「Markdown」

看完这篇就可以删掉了：

```powershell
Remove-Item -Recurse D:\HugoBlog\content\posts\markdown-cheatsheet
```
