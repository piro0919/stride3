import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

export default function MembersLoading(): ReactNode {
  return (
    <div>
      <Skeleton className="mb-6 h-8 w-32" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            className="flex items-center justify-between rounded-lg border p-4"
            key={i}
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div>
                <Skeleton className="mb-1 h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
