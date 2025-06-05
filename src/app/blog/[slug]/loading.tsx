import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Back button skeleton */}
          <div className="mb-8">
            <Skeleton className="h-9 w-32" />
          </div>

          {/* Article header skeleton */}
          <div className="mb-8">
            <div className="mb-4 flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="mb-4 h-12 w-full" />
            <Skeleton className="mb-6 h-12 w-3/4" />
            <Skeleton className="mb-4 h-8 w-full" />
            <div className="flex justify-between">
              <div className="flex items-center">
                <Skeleton className="mr-3 h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="mb-1 h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>

          {/* Cover image skeleton */}
          <Skeleton className="mb-10 h-[400px] w-full rounded-lg" />

          {/* Content skeleton */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-24">
                <Skeleton className="mb-4 h-6 w-40" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-4/6" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            </div>
            <div className="space-y-6 lg:col-span-9">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
