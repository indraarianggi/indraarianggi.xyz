"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/react/ui/Button";

type Theme = "light" | "dark" | "system";

export function ThemeToggler() {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);

    // Get initial theme
    const getResolvedTheme = (): "light" | "dark" => {
      const stored = localStorage.getItem("theme") as Theme | null;

      if (stored === "dark") return "dark";
      if (stored === "light") return "light";

      // For "system" or no preference, check system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    };

    setCurrentTheme(getResolvedTheme());

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const stored = localStorage.getItem("theme");
      // Only update if theme is set to system or not set
      if (!stored || stored === "system") {
        setCurrentTheme(getResolvedTheme());
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // Update localStorage
    localStorage.setItem("theme", newTheme);

    // Update DOM
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);

    // Update state
    setCurrentTheme(newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
