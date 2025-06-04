import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export default function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors",
        className
      )}
      {...props}
    />
  );
}