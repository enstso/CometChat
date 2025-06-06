import { useAuth0 } from "@auth0/auth0-react";
import type { LogoutOptions } from "@auth0/auth0-react";

export default function Navbar() {
  const { logout, isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm px-4 py-2 flex justify-between items-center">
        <div className="text-xl font-semibold text-gray-800">MonApp</div>
        <span className="text-gray-500 text-sm">Chargement...</span>
      </nav>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white shadow-sm px-4 py-2 flex justify-between items-center">
      <div className="text-xl font-semibold text-gray-800">MonApp</div>
      <div className="flex items-center gap-4">
        {user?.name && (
          <span className="text-gray-600">
            Connecté en tant que <strong>{user.nickname}</strong>
          </span>
        )}
        <button
          onClick={() => logout({ returnTo: window.location.origin } as LogoutOptions)}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-md text-sm"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
