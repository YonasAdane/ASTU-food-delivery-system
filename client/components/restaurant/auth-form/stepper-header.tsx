interface StepperHeaderProps {
  step: number;
}

const steps = ["Basic Info", "Location"];

export default function StepperHeader({ step }: StepperHeaderProps) {
  return (
    <div className="border-b p-6">
      <div className="flex justify-between text-sm font-semibold">
        <span>
          Step {step} of {steps.length}: {steps[step - 1]}
        </span>
        <span className="text-primary">
          {Math.round((step / steps.length) * 100)}%
        </span>
      </div>

      <div className="mt-3 h-2 w-full rounded bg-muted">
        <div
          className="h-full rounded bg-primary transition-all"
          style={{ width: `${(step / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
