import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { author } from "@/contents/author";
import { menu } from "@/contents/menu";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <div className="bg-gradient-teal-emerald flex h-8 w-8 items-center justify-center rounded-full">
                <span className="text-primary-foreground text-sm font-bold">
                  {author.name
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              </div>
              <span className="text-lg font-bold">{author.name}</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              {author.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <div className="space-y-2">
              {menu.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary block transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-4 font-semibold">Connect</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href={author.socials.github} target="_blank">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={author.socials.linkedin} target="_blank">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={author.socials.twitter} target="_blank">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={author.socials.email}>
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Email</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 border-t pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} {author.name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
