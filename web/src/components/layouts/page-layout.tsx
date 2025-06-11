import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "full";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  full: "max-w-full",
};

export function PageLayout({
  children,
  className,
  maxWidth = "4xl",
}: PageLayoutProps) {
  return (
    <main
      className={cn(
        "w-full mx-auto flex flex-col gap-4 px-4 py-10 sm:px-8 relative",
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </main>
  );
}
