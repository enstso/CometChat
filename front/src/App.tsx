// src/App.tsx
// Import necessary components and routing utilities from react-router-dom
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/authorization/PrivateRoute";
import Login from "./views/Login";
import Register from "./views/Register";
import NotFound from "./views/NotFound"; // Import NotFound component for unmatched routes
import ChatView from "./views/Chat";
import AuthCallback from "./views/AuthCallback";
import Home from "./views/Home";

// Main application component managing all routes
function App() {
  return (
    // Router wraps all route definitions for client-side navigation
    <Router>
      <Routes>
        {/* Root route displaying the Home page */}
        <Route path="/" element={<Home />} />

        {/* Route handling authentication callback */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected route for chat view, only accessible if authenticated */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatView />
            </PrivateRoute>
          }
        />

        {/* Route for login page */}
        <Route path="/login" element={<Login />} />

        {/* Route for registration page */}
        <Route path="/register" element={<Register />} />

        {/* Wildcard route to catch all undefined routes and show 404 NotFound page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
