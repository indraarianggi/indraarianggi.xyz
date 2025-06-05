export type Post = {
  title: string;
  slug: string;
  content: string;
  readingTime: {
    minutes: number;
    text: string;
  };
  time: {
    created: string;
    updated: string;
  };
  author?: {
    name: string;
    avatar: string;
    occupation: string;
  };
  coverImage?: string;
  excerpt?: string;
  tags?: string[];
  published?: boolean;
};
