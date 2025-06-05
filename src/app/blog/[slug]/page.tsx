import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/share-buttons";
import { TableOfContents } from "@/components/table-of-contents";
import { author } from "@/contents/author";
import { getAllPosts } from "@/lib/mdx";
import { MDX } from "@/components/mdx-component";

const posts = getAllPosts();

export async function generateStaticParams() {
  if (!posts || posts.length === 0) {
    return [{ slug: "not-found" }];
  }

  return posts.map((post) => ({
    slug: `${post.slug}`,
  }));
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    // TODO: Open Graph
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = posts.find((post) => post.slug === slug);

  console.log(post);

  if (!post) {
    return notFound();
  }

  const postAuthor = post.author || {
    name: author.name,
    occupation: author.occupation,
    avatar: author.avatar,
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Back to blog link */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all articles
              </Link>
            </Button>
          </div>

          {/* Article header */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="text-muted-foreground mb-6 text-xl">
                {post.excerpt}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <Image
                  src={postAuthor.avatar}
                  alt={postAuthor.name}
                  width={40}
                  height={40}
                  className="mr-3 rounded-full"
                />
                <div>
                  <p className="font-medium">{postAuthor.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {postAuthor.occupation}
                  </p>
                </div>
              </div>
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.time.created).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readingTime.text}
                </div>
              </div>
            </div>
          </div>

          {/* Cover image */}
          {post.coverImage ? (
            <div className="mb-10 overflow-hidden rounded-lg">
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                width={1200}
                height={600}
                className="h-auto w-full"
              />
            </div>
          ) : null}

          {/* Article layout with sidebar */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Sidebar with table of contents */}
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-24">
                <TableOfContents />
                <div className="mt-8">
                  <p className="mb-3 font-medium">Share this article</p>
                  <ShareButtons title={post.title} />
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="lg:col-span-9">
              <article className="prose prose-neutral dark:prose-invert max-w-none">
                <MDX source={post.content} />
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
