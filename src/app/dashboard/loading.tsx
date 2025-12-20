import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="h-16 border-b border-border/60 bg-background/80" />
      <div className="flex">
        <aside className="hidden md:block w-64 border-r border-border/60 bg-background/80 h-[calc(100vh-4rem)]">
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        </aside>
        <section className="flex-1 px-4 py-8 md:px-10">
          <div className="max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </section>
      </div>
    </div>
  );
}
