import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-300",
              step === currentStep
                ? "bg-gradient-primary text-white shadow-medium scale-110"
                : step < currentStep
                ? "bg-success text-white"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div
              className={cn(
                "w-12 h-1 mx-1 rounded-full transition-all duration-300",
                step < currentStep ? "bg-success" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
      <span className="ml-3 text-sm font-medium text-muted-foreground">
        Stage {currentStep} of {totalSteps}
      </span>
    </div>
  );
};
