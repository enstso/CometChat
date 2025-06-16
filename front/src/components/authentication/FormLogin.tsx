import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

// Login form component
const FormLogin = () => {
  // Local state for email and password input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission event
  // Prevents default browser form submission and logs the input values to the console
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    // Container div centered vertically and horizontally with a gradient background
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <form
        onSubmit={handleSubmit}
        // Form styling: blurred background with semi-transparent white overlay, shadow, border, padding, rounded corners, max width, and vertical spacing between elements
        className="backdrop-blur-xl bg-white/40 shadow-xl border border-white/30 p-8 rounded-2xl w-full max-w-md space-y-6"
      >
        {/* Form title */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Sign In
        </h2>

        {/* Input fields container with vertical spacing */}
        <div className="space-y-4">
          {/* Email input controlled by state */}
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/80 border-gray-300 placeholder-gray-500"
          />
          {/* Password input controlled by state */}
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white/80 border-gray-300 placeholder-gray-500"
          />
        </div>

        {/* Submit button styled with purple background and hover effect */}
        <Button
          type="submit"
          className="w-full py-3 font-semibold bg-purple-600 hover:bg-purple-700 transition duration-300"
        >
          Log In
        </Button>

        {/* Link to registration page */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-purple-600 font-medium hover:underline"
          >
            Create one
          </a>
        </p>
      </form>
    </div>
  );
};

export default FormLogin;
