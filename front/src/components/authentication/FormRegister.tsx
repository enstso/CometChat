import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

// Registration form component
const FormRegister = () => {
  // Local state for email, password, and password confirmation fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle form submission event
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return; // Stop submission if passwords do not match
    }

    // Log registration data to the console
    console.log("Registering:", { email, password });
  };

  return (
    // Container div centered vertically and horizontally with gradient background
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <form
        onSubmit={handleSubmit}
        // Form styling with blur, semi-transparent white background, shadow, border, padding, rounded corners, max width, and vertical spacing
        className="backdrop-blur-xl bg-white/40 shadow-xl border border-white/30 p-8 rounded-2xl w-full max-w-md space-y-6"
      >
        {/* Form title */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Create Account
        </h2>

        {/* Container for input fields with vertical spacing */}
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
          {/* Password input */}
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white/80 border-gray-300 placeholder-gray-500"
          />
          {/* Confirm password input */}
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-white/80 border-gray-300 placeholder-gray-500"
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full py-3 font-semibold bg-purple-600 hover:bg-purple-700 transition duration-300"
        >
          Sign Up
        </Button>

        {/* Link to login page */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-600 font-medium hover:underline"
          >
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
};

export default FormRegister;
