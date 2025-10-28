"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noscriptCodePlugin = void 0;
// 为了安全地转义 HTML 特殊字符，防止代码中的 < > 等破坏 HTML 结构
const escapeHtml = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
const noscriptCodePlugin = (md, options) => {
    // 默认的 fence 渲染函数
    const defaultRender = md.renderer.rules.fence || function (tokens, idx, options, env, renderer) {
        return renderer.renderToken(tokens, idx, options);
    };
    // 覆盖 fence 渲染规则
    md.renderer.rules.fence = (tokens, idx, options, env, renderer) => {
        const token = tokens[idx];
        const code = token.content.trim();
        const lang = token.info.trim();
        // 1. 调用默认渲染，生成标准的 <pre><code>...</code></pre> 块
        const defaultRenderedCode = defaultRender(tokens, idx, options, env, renderer);
        // 2. 创建 <noscript> 块，内容是转义后的源码
        //    使用 <pre> 保持格式，<code> 语义化
        const noscriptContent = `<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(code)}</code></pre>`;
        const noscriptTag = `<noscript>
  <p>${options.AIPrompt || '示例源码如下（仅在无脚本环境下可见）'}</p>
  ${noscriptContent}
</noscript>`;
        // 3. 将两者拼接起来返回
        //    默认代码块在前，<noscript> 在后
        return defaultRenderedCode + noscriptTag;
    };
};
exports.noscriptCodePlugin = noscriptCodePlugin;
// VuePress 插件需要导出一个对象
module.exports = (options = {}, ctx) => ({
    name: 'vuepress-plugin-noscript-code',
    extendMarkdown: (md) => {
        (0, exports.noscriptCodePlugin)(md, options);
    },
});
