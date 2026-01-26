import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

export default function TeamsLoading(): ReactNode {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div className="rounded-lg border p-4" key={i}>
            <Skeleton className="mb-2 h-6 w-48" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
