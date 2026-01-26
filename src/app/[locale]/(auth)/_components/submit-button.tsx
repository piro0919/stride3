"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: ReactNode;
};

export function SubmitButton({ children }: SubmitButtonProps): ReactNode {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending} type="submit">
      {pending ? <Loader2 className="size-4 animate-spin" /> : children}
    </Button>
  );
}
