import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary-400 rounded-full text-white shadow-sm hover:bg-primary-500 transition-all duration-500 ease-in-out",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "hover:bg-primary-400 bg-transparent shadow-sm border-primary-500 text-primary-600 w-full rounded-full border-2 hover:text-white transition-all duration-500 ease-in-out",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        secondary:
          "group rounded-full bg-primary-400 hover:bg-primary-500 relative overflow-hidden text-white transition-all duration-300 hover:pr-9 hover:shadow-lg",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {variant === "secondary" ? (
          <>
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -left-full h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-500 group-hover:left-full" />
            </div>

            {/* Button content */}
            <span className="relative z-10 flex items-center">
              <span className="transition-all duration-500 group-hover:-translate-x-3">
                {children}
              </span>
              <ArrowRight
                strokeWidth={2.5}
                className="absolute -left-4 h-4 w-4 opacity-0 transition-all duration-500 group-hover:left-full group-hover:opacity-100"
              />
            </span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
