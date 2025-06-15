import { cn } from "../../utils/cn";
import { motion } from "framer-motion";
import type { MotionButtonProps } from "../../types/ui/button";

export default function Button({
  className,
  ...props
}: MotionButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition-all duration-200 text-sm",
        className
      )}
      {...props}
    />
  );
}
