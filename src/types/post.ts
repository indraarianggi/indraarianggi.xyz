import { ReactElement } from "react";

export type Post = {
  title: string;
  slug: string;
  content: ReactElement;
  readingTime: {
    minutes: number;
    text: string;
  };
  time: {
    created: string;
    updated: string;
  };
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  coverImage?: string;
  excerpt?: string;
  tags?: string[];
  published?: boolean;
};
