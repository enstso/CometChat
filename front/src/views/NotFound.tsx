
// src/views/NotFound.tsx
import React from "react";

// Composant fonctionnel pour afficher la page 404 (Page non trouvée)
const NotFound = () => {
  return (
    // Conteneur principal qui occupe toute la hauteur de l'écran, 
    // centre verticalement et horizontalement le contenu,
    // avec un joli fond dégradé (du bleu au violet)
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 text-center">
      
      {/* Titre principal 404 en très grand */}
      <h1 className="text-9xl font-extrabold text-purple-700 mb-6">404</h1>
      
      {/* Message d'erreur principal */}
      <p className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
        Oops! Page not found.
      </p>
      
      {/* Explication secondaire, texte plus léger et centré */}
      <p className="mb-8 text-gray-600 max-w-md">
        La page que vous cherchez a peut-être été supprimée, renommée ou est temporairement indisponible.
      </p>
      
      {/* Bouton pour retourner à la page d'accueil */}
      <a
        href="/"
        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
      >
        Retour à l'accueil
      </a>
    </div>
  );
};

export default NotFound;
