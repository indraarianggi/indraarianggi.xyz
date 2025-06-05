import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function NoPosts({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card className={cn("border-0 shadow-lg", className)} {...props}>
      <CardContent className="px-6 py-12 text-center">
        <div className="bg-muted mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full">
          <span className="text-2xl">✍️</span>
        </div>
        <h3 className="mb-2 text-xl font-semibold">The Blog is Brewing...</h3>
        <p className="text-muted-foreground mb-6">
          Exciting content is in the works! Like a good cup of coffee, great
          articles take time to perfect. Check back soon for fresh insights and
          tech adventures.
        </p>
        <Button asChild>
          <Link href="/" className="inline-flex items-center">
            Explore Home <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
