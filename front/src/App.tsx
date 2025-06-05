// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import NotFound from "./views/NotFound"; // Import du composant NotFound
import ChatView from "./views/Chat";
import AuthCallback from "./views/AuthCallback";

// Composant principal de l'application qui gère les routes
function App() {
  return (
    <Router>
      <Routes>
        {/* Route racine affichant la page d'accueil */}
        <Route path="/" element={<h1>Home Page</h1>} />

        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route path="/chat" element={<ChatView />} />
        {/* Route pour la page de connexion */}
        <Route path="/login" element={<Login />} />

        {/* Route pour la page d'inscription */}
        <Route path="/register" element={<Register />} />

        {/* Route wildcard : capture toutes les autres routes non définies
            et affiche la page 404 (NotFound) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
