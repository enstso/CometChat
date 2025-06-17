// Import the `ComponentPropsWithoutRef` type from React.
// This type is used to extract all props for a specific component type, excluding `ref` handling.
import type { ComponentPropsWithoutRef } from "react";

// Import the `motion` object from Framer Motion, which allows animating components like `input`
import { motion } from "framer-motion";

// Define and export a type alias `MotionInputProps`
// This represents all valid props for an animated Framer Motion <input> element,
// without including the `ref` attribute
export type MotionInputProps = ComponentPropsWithoutRef<typeof motion.input>;
