# vuepress-plugin-noscript-code

[![npm version](https://badge.fury.io/js/vuepress-plugin-noscript-code.svg)](https://badge.fury.io/js/vuepress-plugin-noscript-code)

一个为 [VuePress](https://v2.vuepress.vuejs.org/) 设计的插件，旨在提升网站内容的 AI 可读性和 SEO 效果。

## 🎯 功能初衷

在现代 Web 开发中，我们使用 Markdown 编写文档，并通过代码块（```js）分享代码。VuePress 等工具会将其渲染成带有语法高亮的复杂 HTML 结构，这为人类用户提供了极佳的阅读体验。

然而，对于 AI 爬虫（如 Googlebot, ChatGPT 等）或禁用 JavaScript 的环境，这些由 JS 和 CSS 驱动的语法高亮内容可能难以被正确解析。它们看到的可能是一堆零散的 `<span>` 标签，而不是完整的、有意义的代码。

本插件的初衷是解决这一问题：**在渲染语法高亮代码块的同时，自动将原始、纯净的源码包裹在 `<noscript>` 标签中**。这样，AI 就能直接获取到未经任何处理的、格式化的代码，从而更准确地理解、索引和学习你的内容。

## ✨ 核心特性

- **零侵入性**：不影响现有代码块的渲染和用户体验，高亮、复制等功能依然正常工作。
- **AI 友好**：为 AI 提供纯净、结构化的代码源，提升内容可索引性。
- **SEO 增强**：有助于搜索引擎更好地理解页面中的代码内容。
- **安全可靠**：自动对代码中的 HTML 特殊字符进行转义，防止 XSS 攻击。
- **可定制**：支持 `AIPrompt` 参数，允许你为 AI 添加自定义指令。

## 📦 安装

```bash
npm install vuepress-plugin-noscript-code

# or

yarn add vuepress-plugin-noscript-code

# or

pnpm add vuepress-plugin-noscript-code
```

## 🚀 使用方法

在你的 VuePress 配置文件（`.vuepress/config.js` 或 `.vuepress/config.ts`）中引入并使用此插件：

### 基础用法

```javascript
// .vuepress/config.js
export default {
	plugins: ['vuepress-plugin-noscript-code'],
};
```

现在，你的 Markdown 文件中的任何代码块：

````markdown
```js
function hello(name) {
	console.log(`Hello, \${name}!`);
}
```
````

````

在构建后的 HTML 中，除了高亮的代码块，还会生成如下内容：

```html
<noscript>
  <p>示例源码如下（仅在无脚本环境下可见）</p>
  <pre><code class="language-js">function hello(name) {
  console.log(`Hello, \${name}!`);
}</code></pre>
</noscript>
````

### 用法：使用 `AIPrompt`

你可以通过 `AIPrompt` 选项为 AI 添加一个“提示”。这个提示会作为 HTML 注释插入到 `<noscript>` 块的顶部，用于指导 AI 如何处理接下来的代码。

例如，你可能希望 AI 将代码视为一个可执行示例，或者忽略其中的某些部分。

```javascript
// .vuepress/config.js
export default {
	plugins: [
    'vuepress-plugin-noscript-code'
		{
			// 定义一个全局的 AI 提示
			AIPrompt: 'AI_ANALYZE: The following code is a complete, runnable example. Please analyze its logic and purpose.',
		},
	],
};
```

应用此配置后，生成的 HTML 将会变成：

```html
<noscript>
	<p>AI_ANALYZE: The following code is a complete, runnable example. Please analyze its logic and purpose.</p>
	<pre><code class="language-js">function hello(name) {
  console.log(`Hello, \${name}!`);
}</code></pre>
</noscript>
```

## ⚙️ 配置选项

| 选项       | 类型     | 默认值 | 描述                                                                     |
| :--------- | :------- | :----- | :----------------------------------------------------------------------- |
| `AIPrompt` | `string` | `示例源码如下（仅在无脚本环境下可见）`   | AI 提示字符串，会作为 p 标签插入到 `<noscript>` 代码块之前。 |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT](LICENSE)
