import { JSX } from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import type { PluggableList } from "unified";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { MDXImage } from "@/components/custom-image";
import { cn } from "@/lib/utils";

const components: MDXComponents = {
  Image: ({ caption, alt, ...props }) => (
    <MDXImage {...props} caption={caption} alt={alt} />
  ),
  a: ({ children, href }) => (
    <Link
      target="_blank"
      rel="noopener noreferrer nofollow"
      href={href}
      className="text-muted decoration-gray-a4 inline-flex items-center gap-1 underline decoration-1 underline-offset-2"
    >
      {children}
    </Link>
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn("border-gray-4 text-muted mt-6 border-l-2 pl-6", className)}
      {...props}
    />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-hidden overflow-y-auto">
      <table className={cn("w-full overflow-hidden", className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border-border border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border-border border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("mt-2 ml-2 list-decimal", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("mt-2 ml-2 list-disc", className)} {...props} />
  ),
  li: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("mt-2 ml-2 list-item", className)} {...props}>
      {children}
    </li>
  ),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}

export function MDX(props: JSX.IntrinsicAttributes & MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypePrettyCode,
              {
                theme: {
                  dark: "github-dark",
                  light: "github-light",
                },
                keepBackground: false,
                defaultLang: "tsx",
              },
            ],
          ] as PluggableList,
        },
      }}
    />
  );
}
