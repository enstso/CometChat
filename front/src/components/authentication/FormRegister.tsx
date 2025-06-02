// src/components/authentication/FormRegister.tsx
import React, { useState } from "react";

const FormRegister = () => {
  // États des champs du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fonction de soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Traitement d'inscription (à connecter à ton backend)
    console.log("Registering:", { email, password });
  };

  return (
   <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
 <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl bg-white/40 shadow-xl border border-white/30 p-8 rounded-2xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Create Account</h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-gray-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl text-white font-semibold bg-purple-600 hover:bg-purple-700 transition duration-300"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 font-medium hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
};

export default FormRegister;
