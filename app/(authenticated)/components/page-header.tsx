import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  titleClassName?: string;
}

export function PageHeader({ 
  title, 
  description, 
  children, 
  titleClassName 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="flex flex-col items-center gap-1.5">
        <h1 className={cn("text-3xl font-bold tracking-tight text-center", titleClassName)}>
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-center">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center mt-4">
          {children}
        </div>
      )}
    </div>
  );
}