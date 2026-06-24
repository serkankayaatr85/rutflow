"use client";

import { useState } from "react";
import { Loader2, FlaskConical, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { requestSampleAction } from "@/lib/actions/products";

interface RequestSampleButtonProps {
  productId: string;
  representativeId: string;
  alreadyRequested: boolean;
}

export function RequestSampleButton({
  productId,
  representativeId,
  alreadyRequested,
}: RequestSampleButtonProps) {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(alreadyRequested);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);
    const result = await requestSampleAction(productId, representativeId);
    setPending(false);

    if (!result.success) {
      setError(result.message ?? "Talep gönderilemedi.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <Button size="sm" variant="secondary" disabled className="w-full">
        <Check className="h-3.5 w-3.5" />
        Talep Gönderildi
      </Button>
    );
  }

  return (
    <div className="w-full">
      <Button size="sm" variant="outline" className="w-full" onClick={handleClick} disabled={pending}>
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FlaskConical className="h-3.5 w-3.5" />}
        Numune Talep Et
      </Button>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
