import { motion } from "framer-motion";

export default function Spinner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-indigo-500"
    />
  );
}
