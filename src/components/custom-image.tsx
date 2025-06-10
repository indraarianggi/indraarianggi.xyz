"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

interface MDXImageProps extends ImageProps {
  alt: string;
  caption?: string;
}

export function MDXImage({ caption, alt, ...props }: MDXImageProps) {
  const [isImageLoading, setImageLoading] = useState(true);

  // TODO: add zoom in zoom out functionality

  return (
    <div className="flex flex-col space-y-4">
      <div
        className="relative z-10 aspect-video overflow-hidden rounded-lg"
        role="button"
      >
        <Image
          unoptimized
          alt={alt}
          width={1000}
          height={1000}
          sizes="100vw"
          style={{
            WebkitFilter: isImageLoading ? "blur(8px)" : "none",
          }}
          className="h-auto w-full rounded-lg object-cover object-center transition-all duration-[0.5s] ease-in"
          onLoad={() => setImageLoading(false)}
          {...props}
        />
      </div>
      {caption && <sub className="block text-center">{caption}</sub>}
    </div>
  );
}
