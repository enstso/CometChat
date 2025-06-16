import { cn } from "../../utils/cn";
import { motion } from "framer-motion";
import type { MotionButtonProps } from "../../types/ui/button";

export default function Button({
  className,
  ...props
}: MotionButtonProps) {
  return (
    // Animated button using framer-motion for smooth appearance effect
    <motion.button
      // Initial animation state: slightly transparent and scaled down
      initial={{ opacity: 0, scale: 0.95 }}
      // Animate to fully visible and normal scale
      animate={{ opacity: 1, scale: 1 }}
      // Transition configuration for animation timing and easing
      transition={{ duration: 0.3, ease: "easeOut" }}
      // Combine default styling with any additional className passed as prop
      className={cn(
        "bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition-all duration-200 text-sm",
        className
      )}
      // Spread remaining props such as onClick, type, etc.
      {...props}
    />
  );
}
