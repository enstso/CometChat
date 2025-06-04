import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  );
}