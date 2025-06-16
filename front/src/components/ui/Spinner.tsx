import { motion } from "framer-motion";

export default function Spinner() {
  return (
    // Animated spinner using framer-motion for fade and scale effects
    <motion.div
      // Initial state: slightly transparent and scaled down
      initial={{ opacity: 0, scale: 0.8 }}
      // Animate to fully visible and normal scale
      animate={{ opacity: 1, scale: 1 }}
      // Transition duration for the animation
      transition={{ duration: 0.3 }}
      // Tailwind CSS classes for spinner appearance and continuous rotation
      className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-indigo-500"
    />
  );
}
