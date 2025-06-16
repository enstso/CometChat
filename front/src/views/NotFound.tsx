// Import Link component from react-router-dom for client-side navigation
import { Link } from "react-router-dom"; // Optional, remove if not using react-router

// Define NotFound component to display a 404 error page
const NotFound = () => {
  return (
    // Container that fills the viewport and centers content vertically and horizontally with a gradient background
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 text-center">
      
      {/* Large heading displaying "404" error code */}
      <h1 className="text-9xl font-extrabold text-purple-700 mb-6">404</h1>

      {/* Subtitle informing the user that the page was not found */}
      <p className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
        Oops! Page not found.
      </p>

      {/* Additional message describing the error */}
      <p className="mb-8 text-gray-600 max-w-md">
        The page you are looking for might have been removed, renamed, or is temporarily unavailable.
      </p>

      {/* Navigation link back to the home page */}
      {/* Uses Link for SPA navigation; fallback to <a> if not using react-router */}
      <Link
        to="/"
        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
