import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

export default function SettingsLoading(): ReactNode {
  return (
    <div>
      <Skeleton className="mb-6 h-8 w-24" />
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div
            className="flex items-center gap-3 rounded-lg border p-4"
            key={i}
          >
            <Skeleton className="size-5" />
            <div>
              <Skeleton className="mb-1 h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
