import React from "react";
import Stepper from "../Stepper/Stepper";

interface PageHeaderProps {
  steps: string[];
  currentStep: number;
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ steps, currentStep, title, subtitle }) => (
  <div className="text-center mb-8">
    <Stepper steps={steps} currentStep={currentStep} />
    <h1 className="text-3xl font-bold mb-2 text-gray-800">{title}</h1>
    {subtitle && <p className="text-gray-600">{subtitle}</p>}
  </div>
);

export default PageHeader;