import React from 'react';
import { Check, CircleDot } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index < currentStep 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : index === currentStep 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : 'border-gray-300 text-gray-300'
                }`}
              >
                {index < currentStep ? (
                  <Check size={20} />
                ) : index === currentStep ? (
                  <CircleDot size={20} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span 
                className={`mt-2 text-xs ${
                  index <= currentStep ? 'text-gray-700 font-medium' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-0.5 mx-2 ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;