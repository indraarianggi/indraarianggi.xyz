import { NoPosts } from "@/components/no-posts";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/mdx";

export default async function BlogPage() {
  const posts = await getAllPosts().sort((a, b) => {
    return (
      new Date(b.time.created).getTime() - new Date(a.time.created).getTime()
    );
  });

  console.log({ posts });

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background decoration */}
        <div className="from-secondary/5 to-primary/5 absolute inset-0 bg-gradient-to-br via-transparent" />
        <div className="bg-accent/10 absolute top-20 right-20 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute bottom-20 left-20 h-96 w-96 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="from-secondary to-primary h-1 w-12 rounded-full bg-gradient-to-r" />
                  <span className="text-primary font-medium">
                    Technical Writing
                  </span>
                </div>
                <h1 className="text-4xl leading-tight font-bold md:text-5xl md:leading-[1.15] lg:text-6xl">
                  Insights on{" "}
                  <span className="text-gradient-emerald-coral block">
                    Development & Technology
                  </span>
                </h1>
                <p className="text-muted-foreground max-w-3xl text-xl">
                  Sharing lessons learned and insights gained throughout my
                  journey as a software engineer. From technical discoveries to
                  problem-solving approaches and everything I&apos;ve picked up
                  along the way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            {/* TODO: Search and Filter */}

            {/* TODO: Featured Posts */}

            {/* Posts Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {posts.length === 0 ? (
                <NoPosts className="md:col-span-2" />
              ) : null}

              {posts.map((post) => (
                <PostCard
                  key={post.slug}
                  title={post.title}
                  date={post.time.created}
                  readingTime={post.readingTime}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  tags={post.tags}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
