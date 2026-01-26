"use client";
import { acceptInvitation } from "../actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

type AcceptInvitationButtonProps = {
  token: string;
};

export function AcceptInvitationButton({
  token,
}: AcceptInvitationButtonProps): ReactNode {
  const t = useTranslations("Invite");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const handleAccept = async (): Promise<void> => {
    setIsPending(true);
    setError(null);

    const result = await acceptInvitation(token);

    if (result.error) {
      setError(result.error);
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-center text-destructive text-sm">
          {t(`errors.${error}`)}
        </p>
      )}
      <Button disabled={isPending} onClick={handleAccept}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          t("acceptInvitation")
        )}
      </Button>
    </div>
  );
}
