"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-impulso-gold disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-impulso-gold text-impulso-navy hover:bg-impulso-yellow",
        secondary:
          "bg-white text-impulso-navy border border-slate-200 hover:bg-slate-50",
        whatsapp: "bg-impulso-success text-white hover:bg-emerald-600",
        ghost: "bg-transparent text-white hover:bg-white/10",
      },
      size: {
        default: "min-h-11 h-11 px-5 py-2 text-sm sm:text-sm",
        sm: "min-h-10 h-10 rounded-lg px-3 text-sm",
        lg: "min-h-12 h-12 rounded-xl px-6 text-base sm:px-8",
        choice: "min-h-12 h-12 px-4 min-w-[7rem] text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
