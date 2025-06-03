export default function BlogPage() {
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
    </div>
  );
}
