// Define and export a utility function named `cn` (short for "class names")
// This function helps conditionally join CSS class names into a single string
export function cn(...classes: (string | false | null | undefined)[]) {
  // Filter out any falsy values (false, null, undefined, "") from the array of classes
  // and join the remaining class names with a space separator
  return classes.filter(Boolean).join(" ");
}
