// Import the type `ComponentPropsWithoutRef` from React.
// This utility type extracts all the props from a given component (in this case, a `motion.button`), excluding refs.
import type { ComponentPropsWithoutRef } from "react";

// Import the `motion` object from Framer Motion to enable animation support for components
import { motion } from "framer-motion";

// Define and export a type alias `MotionButtonProps`
// This type represents all the valid props for a Framer Motion animated <button> component
export type MotionButtonProps = ComponentPropsWithoutRef<typeof motion.button>;
