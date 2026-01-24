import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface SubmitFooterProps {
  isSubmitting: boolean;
  submitLabel: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  isLastStep?: boolean;
}

export default function SubmitFooter({
  isSubmitting,
  submitLabel,
  onBack,
  onNext,
  isLastStep = false,
}: SubmitFooterProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
      <p className="text-sm text-muted-foreground">
        By continuing, you agree to our Terms of Service.
      </p>

      <div className="flex w-full gap-4 md:w-auto">
        {onBack && (
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back
          </Button>
        )}

        {isLastStep ? (
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
          >
            {submitLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
