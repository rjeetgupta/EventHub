import { CheckCircle } from 'lucide-react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="relative">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 relative">
            <div className="flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-linear-to-r from-green-500 to-emerald-500 text-white'
                    : index === currentStep
                    ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white'
                    : 'bg-muted text-muted-foreground border-2 border-border'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`text-sm mt-2 text-center transition-colors duration-300 ${
                  index === currentStep
                    ? 'text-orange-500 font-semibold'
                    : index < currentStep
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {step}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-0.5 -z-10">
                <div
                  className={`h-full transition-all duration-300 ${
                    index < currentStep
                      ? 'bg-linear-to-r from-green-500 to-emerald-500'
                      : 'bg-border'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Mobile Step Labels */}
      <div className="sm:hidden mt-4 text-center">
        <p className="text-sm font-medium text-orange-500">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
        </p>
      </div>
    </div>
  );
}