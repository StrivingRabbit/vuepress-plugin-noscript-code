import MarkdownIt from "markdown-it"
import Renderer from "markdown-it/lib/renderer"
import Token from "markdown-it/lib/token"
import { Context, Plugin } from '@vuepress/types';

const escapeHtml = (str: string) => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const noscriptCodePlugin = (md: MarkdownIt, pluginOptions: Options) => {
  const defaultRender = md.renderer.rules.fence || function (tokens: Token[], idx: number, options: any, env: any, renderer: Renderer) {
    return renderer.renderToken(tokens, idx, options);
  };

  md.renderer.rules.fence = (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, renderer: Renderer) => {
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

interface Options {
  AIPrompt?: string;
}

module.exports = (options: Options = {}, ctx: Context) => ({
  name: 'vuepress-plugin-noscript-code',
  extendMarkdown: (md: MarkdownIt) => {
    noscriptCodePlugin(md, options);
  }
} as Plugin);
