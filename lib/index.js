"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noscriptCodePlugin = void 0;
const escapeHtml = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
const noscriptCodePlugin = (md, pluginOptions) => {
    const defaultRender = md.renderer.rules.fence || function (tokens, idx, options, env, renderer) {
        return renderer.renderToken(tokens, idx, options);
    };
    md.renderer.rules.fence = (tokens, idx, options, env, renderer) => {
        const token = tokens[idx];
        const code = token.content.trim();
        const lang = token.info.trim();
        const defaultRenderedCode = defaultRender(tokens, idx, options, env, renderer);
        const noscriptContent = `<pre v-pre><code class="${options.langPrefix}${escapeHtml(lang)}">${escapeHtml(code)}</code></pre>`;
        const noscriptTag = `<div class="ai noscript" style="display: none;">
  <p>${pluginOptions.AIPrompt || '示例源码如下，请查看 pre > code 标签中的内容'}</p>
  ${noscriptContent}
</div>`;
        return defaultRenderedCode + noscriptTag;
    };
};
exports.noscriptCodePlugin = noscriptCodePlugin;
module.exports = (options = {}, ctx) => ({
    name: 'vuepress-plugin-noscript-code',
    extendMarkdown: (md) => {
        (0, exports.noscriptCodePlugin)(md, options);
    }
});
