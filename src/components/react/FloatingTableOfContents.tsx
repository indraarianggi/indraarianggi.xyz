"use client";

import { useState, useEffect } from "react";
import { List, X } from "lucide-react";
import { TableOfContents } from "@/components/react/TableOfContents";
import { ShareButtons } from "@/components/react/ShareButtons";
import { Button } from "@/components/react/ui/Button";
import { cn } from "@/lib/utils";

type FloatingTableOfContentsProps = {
  title: string;
  defaultOpen?: boolean;
};

export function FloatingTableOfContents({
  title,
  defaultOpen = false,
}: FloatingTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Set default open state based on screen size
  useEffect(() => {
    const handleResize = () => {
      // lg breakpoint is 1536px
      if (window.innerWidth >= 1536) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Listen for resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/20 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          "fixed top-0 right-0 w-80 transform transition-transform duration-300 ease-in-out",
          isOpen ? "z-70 translate-x-0" : "z-30 translate-x-full"
        )}
      >
        {/* Floating Action Button */}
        <div
          className={cn("absolute top-28 -left-8", isOpen ? "z-70" : "z-30")}
        >
          <Button
            variant="outline"
            size="icon"
            className="bg-background h-8 w-8 rounded-r-none border border-r-0 transition-all duration-200"
            onClick={toggleSidebar}
            aria-label="Toggle table of contents"
          >
            {isOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
          </Button>
        </div>

        <div className="relative grid h-dvh grid-rows-[auto_1fr_auto] gap-4 pr-4 pb-4">
          {/* Header */}
          <div className="p-4 opacity-0">
            <h3 className="font-semibold">
              Table of Contents and Share Buttons
            </h3>
          </div>

          {/* Table of Contents */}
          <div className="bg-background overflow-y-auto rounded-lg border p-4">
            <TableOfContents />
          </div>

          {/* Share Buttons */}
          <div className="bg-background rounded-lg border p-4">
            <p className="mb-3 text-sm font-medium">Share this post</p>
            <ShareButtons title={title} />
          </div>
        </div>

        {/* <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Navigation</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSidebar}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 space-y-6 p-6">
            <div className="bg-muted/30 rounded-lg border p-4">
              <TableOfContents />
            </div>

            <div className="bg-muted/30 rounded-lg border p-4">
              <p className="mb-3 text-sm font-medium">Share this post</p>
              <ShareButtons title={title} />
            </div>
          </div>
        </div> */}
      </aside>
    </>
  );
}
