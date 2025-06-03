import Image from "next/image";
import Link from "next/link";
import { Download, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { author } from "@/contents/author";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background decoration */}
        <div className="from-secondary/5 via-primary/5 to-accent/5 absolute inset-0 bg-gradient-to-br" />
        <div className="bg-accent/10 absolute top-20 right-20 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute bottom-20 left-20 h-96 w-96 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-emerald-coral h-1 w-12 rounded-full" />
                  <span className="text-primary font-medium">About Me</span>
                </div>
                <h1 className="text-4xl leading-tight font-bold md:text-5xl md:leading-[1] lg:text-6xl">
                  Frontend Engineer{" "}
                  <span className="text-gradient-teal-emerald block">
                    Creative Problem Solver
                  </span>
                </h1>
                <p className="text-muted-foreground text-xl">
                  With over 6 years of experience in frontend development, I
                  specialize in creating responsive, accessible, and performant
                  user interfaces using modern web technologies and best
                  practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Left Column - Quick Info */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-6 text-center">
                      <Image
                        src={author.avatar}
                        alt={`${author.name} Profile`}
                        width={120}
                        height={120}
                        className="border-primary/20 mx-auto mb-4 rounded-full border-4"
                      />
                      <h2 className="mb-2 text-2xl font-bold">{author.name}</h2>
                      <p className="text-primary font-medium">
                        {author.occupation}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="text-primary h-4 w-4" />
                        <span>{author.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="text-primary h-4 w-4" />
                        <span>6+ years experience</span>
                      </div>
                    </div>

                    <Button
                      className="bg-primary hover:bg-primary/90 mt-6 w-full"
                      asChild
                    >
                      <Link
                        href="/resume.pdf"
                        target="_blank"
                        className="flex items-center"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Resume
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Story and Details */}
              <div className="space-y-8 lg:col-span-2">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="from-primary to-secondary h-1 w-8 rounded-full bg-gradient-to-r" />
                      <h3 className="text-2xl font-bold">My Journey</h3>
                    </div>
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        I started my journey in frontend development over 6
                        years ago, driven by a passion for creating beautiful
                        and functional user interfaces. What began as curiosity
                        about how websites work evolved into a career focused on
                        crafting exceptional user experiences.
                      </p>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        Throughout my career, I&apos;ve specialized in modern
                        frontend frameworks, responsive design, and performance
                        optimization. I&apos;ve worked with startups and
                        established companies, helping them build user-centric
                        applications that scale and perform beautifully across
                        all devices.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        When I&apos;m not coding, you can find me exploring new
                        frontend technologies or sharing my knowledge about
                        modern web development and design systems.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="from-secondary to-accent h-1 w-8 rounded-full bg-gradient-to-r" />
                      <h3 className="text-2xl font-bold">What I Do</h3>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
                        <h4 className="text-primary mb-2 font-semibold">
                          Frontend Development
                        </h4>
                        <p className="text-muted-foreground mb-3 text-sm">
                          Building responsive, accessible, and performant user
                          interfaces using modern frameworks and libraries.
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {[
                            "React",
                            "Next.js",
                            "TypeScript",
                            "Tailwind CSS",
                          ].map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="bg-primary/10 text-primary text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
                        <h4 className="text-primary mb-2 font-semibold">
                          UI/UX Implementation
                        </h4>
                        <p className="text-muted-foreground mb-3 text-sm">
                          Translating designs into pixel-perfect, interactive
                          interfaces with attention to user experience.
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {[
                            "Figma",
                            "CSS-In-JS",
                            "Animations",
                            "Responsive Design",
                          ].map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="bg-primary/10 text-primary text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
                        <h4 className="text-primary mb-2 font-semibold">
                          Performance Optimization
                        </h4>
                        <p className="text-muted-foreground mb-3 text-sm">
                          Optimizing applications for speed, accessibility, and
                          SEO using modern build tools and techniques.
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {[
                            "Webpack",
                            "Vite",
                            "Lighthouse",
                            "Core Web Vitals",
                          ].map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="bg-primary/10 text-primary text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
                        <h4 className="text-primary mb-2 font-semibold">
                          Testing & Quality
                        </h4>
                        <p className="text-muted-foreground mb-3 text-sm">
                          Ensuring code quality and reliability through
                          comprehensive testing strategies and best practices.
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {[
                            "Jest",
                            "Cypress",
                            "Testing Library",
                            "Storybook",
                          ].map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="bg-primary/10 text-primary text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
