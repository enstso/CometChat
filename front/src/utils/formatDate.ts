// Export a utility function named `formatDate` that formats a date string
export const formatDate = (isoString: string): string => {
  // Convert the ISO string to a JavaScript Date object
  const date = new Date(isoString);

  // Check if the date is invalid and return a fallback message if so
  if (isNaN(date.getTime())) return "Date invalide";

  // Format the date to a localized string using French formatting and the Paris timezone
  return date.toLocaleString("fr-FR", {
    day: "2-digit",        // Display day as 2 digits
    month: "2-digit",      // Display month as 2 digits
    year: "numeric",       // Display full numeric year
    hour: "2-digit",       // Display hour in 2 digits
    minute: "2-digit",     // Display minutes in 2 digits
    hour12: false,         // Use 24-hour format
    timeZone: "Europe/Paris", // Set the timezone to Paris
  });
};
