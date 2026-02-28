import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="relative w-full max-w-xl mx-auto mb-8">
      {/* Background line */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0 rounded" />

      {/* Progress line */}
      <div
        className="absolute top-5 left-0 h-1 bg-indigo-500 z-0 rounded transition-all duration-300"
        style={{
          width: `${(currentStep / (steps.length - 1)) * 100}%`,
        }}
      />

      {/* Circles */}
      <div className="flex justify-between relative z-10">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step} className="flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted ? "bg-indigo-500 text-white" : isActive ? "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white scale-110" : "bg-gray-200 text-gray-600"}
                `}
              >
                {index + 1}
              </div>

              <span
                className={`mt-2 text-center text-sm font-medium
                  ${isCompleted || isActive ? "text-gray-800" : "text-gray-400"}`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;