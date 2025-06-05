import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { calculateReadingTime } from "@/lib/reading-time";
import type { Post } from "@/types/post";

function readFile(filePath: string) {
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(rawContent);

    const slug = path.basename(filePath, path.extname(filePath));
    // Calculate reading time
    const readingTime = calculateReadingTime(content);

    return {
      ...frontmatter,
      readingTime,
      slug,
      content,
    } as Post;
  } catch (error) {
    console.error(`Failed to read or parse the file at ${filePath}:`, error);
    return null;
  }
}

function getFiles(dir: string): string[] {
  try {
    return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));
  } catch (error) {
    console.error(`Failed to read directory at ${dir}:`, error);
    return [];
  }
}

export function getAllPosts(): Post[] {
  const files = getFiles(path.join(process.cwd(), "src", "contents", "posts"));
  return files
    .map((file) =>
      readFile(path.join(process.cwd(), "src", "contents", "posts", file))
    )
    .filter((post): post is Post => post !== null && !!post.published);
}
