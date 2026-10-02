import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground shadow": variant === "default",
          "border-transparent bg-muted text-muted-foreground": variant === "secondary",
          "text-foreground": variant === "outline",
          "border-transparent bg-success text-success-foreground shadow": variant === "success",
          "border-transparent bg-warning text-warning-foreground shadow": variant === "warning",
          "border-transparent bg-danger text-danger-foreground shadow": variant === "danger",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
