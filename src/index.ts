import MarkdownIt from "markdown-it"
import Renderer from "markdown-it/lib/renderer"
import Token from "markdown-it/lib/token"
import { Context, Plugin } from '@vuepress/types';

// 为了安全地转义 HTML 特殊字符，防止代码中的 < > 等破坏 HTML 结构
const escapeHtml = (str: string) => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const noscriptCodePlugin = (md: MarkdownIt, options: Options) => {
  // 默认的 fence 渲染函数
  const defaultRender = md.renderer.rules.fence || function (tokens: Token[], idx: number, options: any, env: any, renderer: Renderer) {
    return renderer.renderToken(tokens, idx, options);
  };

  // 覆盖 fence 渲染规则
  md.renderer.rules.fence = (tokens: Token[], idx: number, options: any, env: any, renderer: Renderer) => {
    const token = tokens[idx];
    const code = token.content.trim();
    const lang = token.info.trim();

    // 1. 调用默认渲染，生成标准的 <pre><code>...</code></pre> 块
    const defaultRenderedCode = defaultRender(tokens, idx, options, env, renderer);

    // 2. 创建 <noscript> 块，内容是转义后的源码
    //    使用 <pre> 保持格式，<code> 语义化
    const noscriptContent = `<pre v-pre><code class="language-${escapeHtml(lang)}">${escapeHtml(code)}</code></pre>`;
    const noscriptTag = `<noscript>
  <p>${options.AIPrompt || '示例源码如下（仅在无脚本环境下可见）'}</p>
  ${noscriptContent}
</noscript>`;

    return defaultRenderedCode + noscriptTag;
  };
};

interface Options {
  AIPrompt?: string;
}

// VuePress 插件需要导出一个对象
module.exports = (options: Options = {}, ctx: Context) => ({
  name: 'vuepress-plugin-noscript-code',
  extendMarkdown: (md: MarkdownIt) => {
    noscriptCodePlugin(md, options);
  },
} as Plugin);
