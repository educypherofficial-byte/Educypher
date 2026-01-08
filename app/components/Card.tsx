import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border border-neutral-800
        bg-neutral-900/50
        backdrop-blur
        p-6
        transition
        hover:border-emerald-500/40
        ${className}
      `}
    >
      {children}
    </div>
  );
}
