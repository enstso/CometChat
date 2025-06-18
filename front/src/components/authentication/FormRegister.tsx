import React, { useState } from "react"; // Import React and the useState hook
import { useNavigate } from "react-router-dom"; // Import hook for navigation
import { useMutation } from "@apollo/client"; // Import GraphQL mutation hook
import { REGISTER_USER } from "../../services/requestsGql"; // Import the REGISTER_USER GraphQL mutation
import Input from "../ui/Input"; // Import a custom Input component
import Button from "../ui/Button"; // Import a custom Button component

const FormRegister = () => {
  const [email, setEmail] = useState(""); // State for storing the email input
  const [password, setPassword] = useState(""); // State for storing the password input
  const [confirmPassword, setConfirmPassword] = useState(""); // State for storing the confirm password input
  const [errorMsg, setErrorMsg] = useState(""); // State for storing an error message
  const [successMsg, setSuccessMsg] = useState(""); // State for storing a success message

  const [registerUser, { loading }] = useMutation(REGISTER_USER); // Initialize the registerUser mutation with loading state
  const navigate = useNavigate(); // Hook for navigating between routes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form's default submission behavior
    setErrorMsg(""); // Reset error message
    setSuccessMsg(""); // Reset success message

    if (password !== confirmPassword) {
      // Validate password match
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      // Call the GraphQL mutation with form input variables
      const { data } = await registerUser({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      if (data?.registerUser?.success) {
        // If registration is successful, show success message and navigate to login page
        setSuccessMsg("User successfully registered!");
        setTimeout(() => {
          navigate("/login");
        }, 1500); 
      } else {
        // If registration failed, show server-provided or default error message
        setErrorMsg(data?.registerUser?.message || "Registration failed");
      }
    } catch (err: unknown) {
      // Handle unexpected errors
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <form
        onSubmit={handleSubmit} // Handle form submission
        className="backdrop-blur-xl bg-white/40 shadow-xl border border-white/30 p-8 rounded-2xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Create Account
        </h2>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            required
            className="bg-white/80 border-gray-300 placeholder-gray-500"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
            className="bg-white/80 border-gray-300 placeholder-gray-500"
          />
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
            required
            className="bg-white/80 border-gray-300 placeholder-gray-500"
          />
        </div>

        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>} {/* Display error message */}
        {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>} {/* Display success message */}

        <Button
          type="submit"
          className="w-full py-3 font-semibold bg-purple-600 hover:bg-purple-700 transition duration-300"
          disabled={loading} // Disable button when mutation is loading
        >
          {loading ? "Signing up..." : "Sign Up"} {/* Show loading or default text */}
        </Button>

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

export default FormRegister; // Export the component
