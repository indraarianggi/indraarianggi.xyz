"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
// import { X } from "lucide-react";
// import { Button } from "@/components/ui/button";

interface MDXImageProps extends ImageProps {
  alt: string;
  caption?: string;
}

export function MDXImage({ caption, alt, ...props }: MDXImageProps) {
  // const [isOpen, setIsOpen] = useState(false);
  const [isImageLoading, setImageLoading] = useState(true);
  console.log(caption);

  // TODO: add zoom in zoom out functionality

  return (
    <Image
      unoptimized
      alt={alt}
      width={1000}
      height={1000}
      sizes="100vw"
      style={{
        objectFit: "contain",
        width: "100%",
        height: "auto",
        objectPosition: "center",
        WebkitFilter: isImageLoading ? "blur(8px)" : "none",
        transition: "all 0.5s ease",
      }}
      onLoad={() => setImageLoading(false)}
      {...props}
    />
  );
}
