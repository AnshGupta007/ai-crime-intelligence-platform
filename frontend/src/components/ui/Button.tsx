import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "destructive";
    size?: "default" | "sm" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
        const base = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

        let variantStyles = "bg-indigo-600 text-white hover:bg-indigo-500";
        if (variant === "outline") variantStyles = "border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800";
        if (variant === "ghost") variantStyles = "bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white";
        if (variant === "destructive") variantStyles = "bg-rose-600 text-white hover:bg-rose-500";

        let sizeStyles = "h-9 px-4 py-2";
        if (size === "sm") sizeStyles = "h-8 px-3 text-xs";
        if (size === "lg") sizeStyles = "h-10 px-6 text-base";

        return (
            <button ref={ref} className={`${base} ${variantStyles} ${sizeStyles} ${className}`} {...props}>
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
export default Button;
