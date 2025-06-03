import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Code,
  Github,
  Linkedin,
  Palette,
  Sparkles,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { author } from "@/contents/author";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background decoration */}
        <div className="from-primary/5 via-secondary/5 to-accent/5 absolute inset-0 bg-gradient-to-br" />
        <div className="bg-accent/10 absolute top-20 right-20 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute bottom-20 left-20 h-96 w-96 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left Column - Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-teal-emerald h-1 w-12 rounded-full" />
                    <span className="text-primary font-medium">
                      {author.occupation}
                    </span>
                  </div>
                  <h1 className="text-4xl leading-tight font-bold md:text-5xl md:leading-[1] lg:text-6xl">
                    Building Modern{" "}
                    <span className="text-gradient-smooth block">
                      User Interfaces
                    </span>{" "}
                    with Precision
                  </h1>
                  <p className="text-muted-foreground max-w-xl text-xl">
                    I craft exceptional user experiences through modern frontend
                    technologies, responsive design, and performance
                    optimization. Passionate about creating intuitive interfaces
                    that users love.
                  </p>
                </div>

                {/* Call to Action */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Link href="/about" className="flex items-center">
                      Discover My Story
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Link href="/experience">View My Work</Link>
                  </Button>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-6 pt-4">
                  <span className="text-muted-foreground text-sm">
                    Connect with me:
                  </span>
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-primary hover:bg-primary/10"
                    >
                      <Link href={author.socials.github} target="_blank">
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-primary hover:bg-primary/10"
                    >
                      <Link href={author.socials.linkedin} target="_blank">
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-primary hover:bg-primary/10"
                    >
                      <Link href={author.socials.twitter}>
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Twitter</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className="relative">
                <div className="relative z-10">
                  <Image
                    src={author.avatar}
                    alt={`${author.name} - ${author.occupation}`}
                    width={400}
                    height={400}
                    className="mx-auto rounded-2xl border-4 border-white shadow-2xl dark:border-gray-800"
                  />
                </div>
                {/* Floating elements */}
                <div className="bg-primary absolute -top-4 -right-4 rounded-xl p-3 text-white shadow-lg">
                  <Code className="h-6 w-6" />
                </div>
                <div className="bg-secondary absolute -bottom-4 -left-4 rounded-xl p-3 text-white shadow-lg">
                  <Palette className="h-6 w-6" />
                </div>
                <div className="bg-accent absolute top-1/2 -right-8 rounded-lg p-2 text-white shadow-lg">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TODO: Section - Featured Projects / Posts */}

      {/* Skills */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-left">
              <div className="mb-4 flex items-center gap-2">
                <div className="bg-gradient-teal-emerald h-1 w-12 rounded-full" />
                <span className="text-primary font-medium">Expertise</span>
              </div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Technologies I Work With
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                A comprehensive toolkit of modern frontend technologies,
                frameworks, and tools that I use to build user interfaces and
                experiences.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {author.skills.map((skill) => (
                <div
                  key={skill}
                  className="bg-card hover:bg-primary/5 hover:border-primary/30 group rounded-lg border p-4 text-center transition-all duration-300"
                >
                  <span className="group-hover:text-primary font-medium transition-colors">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
