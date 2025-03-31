import React from "react";

type LoadingSpinnerProps = {
  size?: "small" | "medium" | "large";
  className?: string;
};

export default function LoadingSpinner({
  size = "medium",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "h-3 w-3 border",
    medium: "h-5 w-5 border-2",
    large: "h-8 w-8 border-2",
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full border-t-transparent border-indigo-600 animate-spin`}
      ></div>
    </div>
  );
}
