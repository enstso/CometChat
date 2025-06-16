import { Link } from "react-router-dom"; // Optional, remove if not using react-router

const NotFound = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 text-center">
      <h1 className="text-9xl font-extrabold text-purple-700 mb-6">404</h1>
      <p className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
        Oops! Page not found.
      </p>
      <p className="mb-8 text-gray-600 max-w-md">
        The page you are looking for might have been removed, renamed, or is temporarily unavailable.
      </p>

      {/* Use Link if your app uses react-router, otherwise fallback to <a> */}
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
