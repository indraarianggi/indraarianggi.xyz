export type MarkdownHeading = {
  depth: number;
  slug: string;
  text: string;
};

export type TocItem = MarkdownHeading & {
  depth: 2;
  children: TocChild[];
};

export type TocChild = MarkdownHeading & {
  depth: 3;
};

export function buildTocTree(headings: MarkdownHeading[]): TocItem[] {
  const tree: TocItem[] = [];
  let currentRoot: TocItem | undefined;

  for (const heading of headings) {
    if (heading.depth === 2) {
      currentRoot = { ...heading, depth: 2, children: [] };
      tree.push(currentRoot);
      continue;
    }

    if (heading.depth === 3 && currentRoot) {
      currentRoot.children.push({ ...heading, depth: 3 });
    }
  }

  return tree;
}
