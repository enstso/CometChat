import { cn } from "../../utils/cn";
import { motion } from "framer-motion";
import type { MotionInputProps } from "../../types/ui/input";

export default function Input({
  className,
  ...props
}: MotionInputProps) {
  return (
    <motion.input
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200",
        className
      )}
      {...props}
    />
  );
}
