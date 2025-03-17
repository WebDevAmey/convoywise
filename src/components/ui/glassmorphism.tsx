
import { cn } from "@/lib/utils";
import React from "react";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "light" | "medium" | "heavy";
  className?: string;
  children: React.ReactNode;
}

export const GlassPanel = ({
  intensity = "medium",
  className,
  children,
  ...props
}: GlassPanelProps) => {
  const intensityClasses = {
    light: "bg-white/40 backdrop-blur-sm border border-white/50",
    medium: "bg-white/60 backdrop-blur-md border border-white/60",
    heavy: "bg-white/80 backdrop-blur-lg border border-white/70"
  };

  return (
    <div
      className={cn(
        "rounded-xl shadow-lg",
        intensityClasses[intensity],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
