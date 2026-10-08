/*
  Shiki transformer for Markdown code blocks. Each block gets a header slate
  with its language and a copy button, so the button never sits on top of a
  long first line or scrolls away with wide code. The click is handled by a
  delegated listener in BaseLayout.

  Minimal HAST shapes are declared here because shiki and hast are only
  transitive dependencies.
*/
type HastText = { type: 'text'; value: string };
type HastElement = {
  type: 'element';
  tagName: string;
  properties: Record<string, unknown>;
  children: HastNode[];
};
type HastNode = HastText | HastElement | { type: string; [key: string]: unknown };
type HastRoot = { type: 'root'; children: HastNode[] };

/** Languages that are not worth naming on the slate. */
const unnamed = new Set(['', 'text', 'txt', 'plaintext', 'plain']);

const el = (tagName: string, properties: Record<string, unknown>, children: HastNode[] = []): HastElement => ({
  type: 'element',
  tagName,
  properties,
  children,
});
const text = (value: string): HastText => ({ type: 'text', value });

export function codeBlockHeader(lang: string): HastElement {
  const name = unnamed.has(lang.toLowerCase()) ? [] : [el('span', { className: ['code-lang', 'label'] }, [text(lang)])];
  return el('div', { className: ['code-head'] }, [
    ...name,
    // Both labels stay in the DOM so the swap can crossfade; the button's
    // name is fixed and the status line announces the result.
    el('button', { type: 'button', className: ['code-copy', 'label'], dataCodeCopy: '', ariaLabel: 'Copy code' }, [
      el('span', { className: ['code-copy-text'], dataFor: 'idle', ariaHidden: 'true' }, [text('Copy')]),
      el('span', { className: ['code-copy-text'], dataFor: 'copied', ariaHidden: 'true' }, [text('Copied')]),
      el('span', { className: ['code-copy-text'], dataFor: 'selected', ariaHidden: 'true' }, [text('Selected')]),
    ]),
    el('span', { className: ['sr-only'], role: 'status', dataCodeStatus: '' }),
  ]);
}

export function codeBlockTransformer() {
  return {
    name: 'code-block',
    // The wrapper owns the surface colour, so the theme's inline background
    // would only show as a seam under the header.
    pre(this: unknown, node: HastElement) {
      const style = node.properties.style;
      if (typeof style === 'string') {
        node.properties.style = style
          .split(';')
          .filter((rule) => rule.trim() && !rule.trim().startsWith('background-color'))
          .join(';');
      }
    },
    root(this: { options: { lang: string } }, root: HastRoot) {
      root.children = [el('div', { className: ['code-block'] }, [codeBlockHeader(this.options.lang), ...root.children])];
    },
  };
}
