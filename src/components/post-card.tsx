import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Post } from "@/types/post";

interface PostCardProps extends React.ComponentProps<"div"> {
  title: string;
  date: string;
  readingTime: Post["readingTime"];
  slug: string;
  excerpt?: string;
  tags?: string[];
}

export function PostCard({
  title,
  date,
  readingTime,
  slug,
  excerpt,
  tags = [],
  className,
  ...props
}: PostCardProps) {
  return (
    <Card
      className={cn(
        "group cursor-pointer border-0 shadow-lg transition-all duration-300 hover:shadow-xl",
        className
      )}
      {...props}
    >
      <CardHeader>
        <div className="text-muted-foreground mb-2 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {readingTime?.text || "Quick read"}
          </div>
        </div>
        <CardTitle className="group-hover:text-primary transition-colors">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {excerpt ? (
          <p className="text-muted-foreground mb-4">{excerpt}</p>
        ) : null}
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary hover:text-white"
        >
          <Link href={`/blog/${slug}`} className="flex items-center">
            Read More
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
