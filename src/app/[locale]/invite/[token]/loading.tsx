import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

export default function InviteLoading(): ReactNode {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Skeleton className="mb-2 h-8 w-48" />
      <Skeleton className="mb-6 h-5 w-64" />
      <Skeleton className="h-10 w-40" />
    </div>
  );
}
