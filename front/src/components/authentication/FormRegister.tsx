import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../../services/requestsGql";
import Input from "../ui/Input";
import Button from "../ui/Button";

const FormRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [registerUser, { loading }] = useMutation(REGISTER_USER);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      const { data } = await registerUser({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      if (data?.registerUser?.success) {
        setSuccessMsg("User successfully registered!");
        setTimeout(() => {
          navigate("/login");
        }, 1500); 
      } else {
        setErrorMsg(data?.registerUser?.message || "Registration failed");
      }
    } catch (err: unknown) {
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
        onSubmit={handleSubmit}
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
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/80 border-gray-300 placeholder-gray-500"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white/80 border-gray-300 placeholder-gray-500"
          />
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-white/80 border-gray-300 placeholder-gray-500"
          />
        </div>

        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

        <Button
          type="submit"
          className="w-full py-3 font-semibold bg-purple-600 hover:bg-purple-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
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

export default FormRegister;
