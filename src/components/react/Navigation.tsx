"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/react/ui/Button";
import { ThemeToggler } from "@/components/react/ThemeToggler";
import { author } from "@/data/author";
import { menu } from "@/data/menu";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    // Get current pathname on client side
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <>
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-99 w-full border-b backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
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
            </a>

            {/* Desktop Navigation */}
            <div className="hidden items-center space-x-8 md:flex">
              <nav className="flex items-center space-x-8">
                {menu.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "hover:text-primary text-sm font-medium transition-colors",
                      currentPath === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
              <ThemeToggler />
            </div>

            {/* Mobile Theme Toggle */}
            <div className="md:hidden">
              <ThemeToggler />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Floating Menu Button with Popup */}
        <div className="fixed right-6 bottom-6 z-50">
          {/* Menu Popup */}
          <div
            className={cn(
              "fixed right-4 bottom-24 left-4 transition-all duration-300",
              isOpen
                ? "pointer-events-auto visible translate-y-0 scale-100 opacity-100"
                : "pointer-events-none invisible translate-y-4 scale-95 opacity-0"
            )}
          >
            <div className="bg-background/95 rounded-2xl border p-4 shadow-2xl backdrop-blur-md">
              <div className="flex flex-col space-y-2">
                {menu.map((item, index) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "hover:bg-primary/10 hover:text-primary rounded-xl px-6 py-4 text-center text-base font-medium transition-all duration-200",
                      currentPath === item.href
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground"
                    )}
                    style={{
                      animationDelay: isOpen ? `${index * 50}ms` : "0ms",
                    }}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Toggle Button */}
          <Button
            variant="default"
            size="icon"
            className="bg-primary hover:bg-primary/90 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="relative flex h-6 w-6 items-center justify-center">
              <Menu
                className={cn(
                  "absolute h-6 w-6 transition-all duration-300",
                  isOpen ? "scale-0 rotate-90" : "scale-100 rotate-0"
                )}
              />
              <X
                className={cn(
                  "absolute h-6 w-6 transition-all duration-300",
                  isOpen ? "scale-100 rotate-0" : "scale-0 -rotate-90"
                )}
              />
            </div>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </>
  );
}
