import { useAuth0 } from "@auth0/auth0-react";
import type { LogoutOptions } from "@auth0/auth0-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { logout, isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm px-4 py-3 flex justify-between items-center animate-pulse">
        <div className="text-xl font-bold text-gray-800">CometChat</div>
        <span className="text-gray-500 text-sm">Loading...</span>
      </nav>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-white shadow-md px-4 py-3 flex justify-between items-center fixed top-0 w-full z-50"
    >
      <div className="text-xl font-bold text-indigo-600 tracking-tight">CometChat</div>
      <div className="flex items-center gap-4 text-sm">
        {user?.nickname && (
          <span className="text-gray-700 hidden sm:inline">
            Logged in as <strong>{user.nickname}</strong>
          </span>
        )}
        <button
          onClick={() => logout({ returnTo: window.location.origin } as LogoutOptions)}
          className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors px-4 py-1.5 rounded-md shadow-sm"
        >
          Logout
        </button>
      </div>
    </motion.nav>
  );
}
