"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

type Heading = {
  id: string;
  title: string;
  level: number;
};

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  const getHeadings = useCallback((): Heading[] => {
    // Query headings within the article content
    const articleElement = document.querySelector("article .prose");
    if (!articleElement) return [];

    return Array.from(articleElement.querySelectorAll("h2, h3"))
      .filter((heading) => heading.id)
      .map((heading) => ({
        id: heading.id,
        title: heading.textContent || "",
        level: Number(heading.tagName.toLowerCase().replace("h", "")),
      }));
  }, []);

  useEffect(() => {
    // Wait a bit for MDX content to render
    const timer = setTimeout(() => {
      const collectedHeadings = getHeadings();
      setHeadings(collectedHeadings);
    }, 100);

    return () => clearTimeout(timer);
  }, [getHeadings]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -80% 0px",
        threshold: 0.1,
      }
    );

    // Observe all section headings
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  const scroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 100;
      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="mb-3 font-semibold">Table of Contents</p>
      <nav className="space-y-1 text-sm">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={cn(
              "hover:text-primary block py-1 transition-colors",
              heading.level === 3 && "pl-4",
              activeId === heading.id
                ? "text-primary font-medium"
                : "text-muted-foreground"
            )}
            onClick={(e) => {
              e.preventDefault();
              scroll(heading.id);
            }}
          >
            {heading.title}
          </a>
        ))}
      </nav>
    </div>
  );
}
