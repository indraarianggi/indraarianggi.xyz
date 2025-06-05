"use client";

import { toast } from "sonner";
import { Twitter, Linkedin, Facebook, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type ShareButtonsProps = {
  title: string;
};

export function ShareButtons({ title }: ShareButtonsProps) {
  const handleShare = (platform: string) => {
    const url = window.location.href;
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url).then(
          () => {
            toast("Link copied!", {
              description:
                "The article link has been copied to your clipboard.",
            });
          },
          (err) => {
            console.error("Could not copy text: ", err);
            toast.error("Copy failed", {
              description: "Could not copy the link to your clipboard.",
            });
          }
        );
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer rounded-full"
        onClick={() => handleShare("twitter")}
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer rounded-full"
        onClick={() => handleShare("linkedin")}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer rounded-full"
        onClick={() => handleShare("facebook")}
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer rounded-full"
        onClick={() => handleShare("copy")}
        aria-label="Copy link"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
