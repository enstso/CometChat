// src/views/Home.tsx
import { motion } from "framer-motion";
import Navbar from "../components/ui/Navbar";
import Button from "../components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-purple-200">
      <Navbar />

      <main className="flex flex-1 flex-col justify-center items-center text-center px-6 md:px-12 lg:px-24">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-extrabold text-purple-700 mb-6 max-w-4xl"
        >
          Welcome to <span className="text-blue-600">cometChat</span> — Your Real-Time Communication Hub
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-gray-700 text-lg md:text-xl max-w-3xl mb-10"
        >
          Connect instantly with friends, family, and colleagues using our fast, secure, and intuitive chat platform. Experience conversations like never before.
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            onClick={() => window.location.assign("/register")}
          >
            Get Started
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={() => window.location.assign("/login")}
          >
            Sign In
          </Button>
        </motion.div>
      </main>

      <footer className="text-center text-gray-600 py-6 select-none">
        &copy; {new Date().getFullYear()} cometChat — Crafted with 💜 and ⚡
      </footer>
    </div>
  );
}
