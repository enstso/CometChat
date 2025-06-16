import { cn } from "../../utils/cn";
import { motion } from "framer-motion";
import type { MotionInputProps } from "../../types/ui/input";

export default function Input({
  className,
  ...props
}: MotionInputProps) {
  return (
    // Animated input element using framer-motion for fade and slide-in effect
    <motion.input
      // Initial state: transparent and slightly shifted downwards
      initial={{ opacity: 0, y: 10 }}
      // Animate to fully visible and positioned correctly
      animate={{ opacity: 1, y: 0 }}
      // Animation duration configuration
      transition={{ duration: 0.3 }}
      // Combine default styling with any additional className passed as prop
      className={cn(
        "w-full border border-gray-300 rounded-xl px-4 py-2 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200",
        className
      )}
      // Spread remaining props such as type, value, onChange, placeholder, etc.
      {...props}
    />
  );
}
