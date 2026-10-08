import { describe, expect, it } from 'vitest';
import { codeBlockHeader, codeBlockTransformer } from '../src/lib/code-block';

type Node = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: Node[]; value?: string };

const textOf = (node: Node): string =>
  node.type === 'text' ? (node.value ?? '') : (node.children ?? []).map(textOf).join('');

describe('codeBlockHeader', () => {
  it('names the language and offers a copy button with a fixed name', () => {
    const header = codeBlockHeader('ts') as Node;
    const [lang, button, status] = header.children!;
    expect(textOf(lang)).toBe('ts');
    expect(button.tagName).toBe('button');
    expect(button.properties).toMatchObject({ type: 'button', ariaLabel: 'Copy code', dataCodeCopy: '' });
    expect(status.properties).toMatchObject({ role: 'status' });
  });

  it('leaves plain text unnamed', () => {
    const header = codeBlockHeader('plaintext') as Node;
    expect(header.children![0].tagName).toBe('button');
  });
});

describe('codeBlockTransformer', () => {
  it('wraps the block and drops only the theme background', () => {
    const transformer = codeBlockTransformer();
    const pre: Node = {
      type: 'element',
      tagName: 'pre',
      properties: { style: 'background-color:#ffffff;color:#0e1116' },
      children: [],
    };
    transformer.pre.call(undefined, pre as never);
    expect(pre.properties!.style).toBe('color:#0e1116');

    const root = { type: 'root' as const, children: [pre] };
    transformer.root.call({ options: { lang: 'bash' } }, root as never);
    const [wrapper] = root.children as Node[];
    expect(wrapper.properties).toMatchObject({ className: ['code-block'] });
    expect(wrapper.children!.map((child) => child.tagName)).toEqual(['div', 'pre']);
  });
});
