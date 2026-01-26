import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

export default function TeamLoading(): ReactNode {
  return (
    <div>
      <Skeleton className="mb-2 h-8 w-64" />
      <Skeleton className="mb-6 h-5 w-96" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div className="rounded-lg border p-4" key={i}>
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-8 w-12" />
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Skeleton className="mb-4 h-6 w-48" />
        <div className="rounded-lg border border-dashed p-8">
          <Skeleton className="mx-auto h-4 w-48" />
        </div>
      </div>
    </div>
  );
}
