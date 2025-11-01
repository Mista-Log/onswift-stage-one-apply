import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PassCriteriaProps {
  hasPortfolio: boolean;
  hasExperience: boolean;
  hasThoughtfulAnswer: boolean;
}

export const PassCriteria = ({
  hasPortfolio,
  hasExperience,
  hasThoughtfulAnswer,
}: PassCriteriaProps) => {
  const criteria = [
    {
      label: "Portfolio link provided",
      met: hasPortfolio,
    },
    {
      label: "3+ years of experience",
      met: hasExperience,
    },
    {
      label: "Thoughtful response (50+ words)",
      met: hasThoughtfulAnswer,
    },
  ];

  return (
    <div className="bg-gradient-subtle border border-border rounded-xl p-5">
      <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
        Pass Criteria
      </h3>
      <div className="space-y-2.5">
        {criteria.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 transition-all duration-300",
              item.met && "animate-fade-in"
            )}
          >
            {item.met ? (
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 animate-checkmark" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground/40 flex-shrink-0" />
            )}
            <span
              className={cn(
                "text-sm transition-colors duration-300",
                item.met ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
