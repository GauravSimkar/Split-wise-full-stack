import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { showSuccess, showError } from "../utils/toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    if (!name || !email || !password) {
      showError("All fields are required");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password
      });

      showSuccess("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      showError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#0f172a] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 px-4">
    <div className="max-w-md w-full backdrop-blur-xl bg-white/10 p-8 rounded-[2rem] shadow-2xl border border-white/10">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          Join Us
        </h2>
        <p className="text-purple-200/60 mt-2 text-sm">Create your account in seconds</p>
      </div>

      <div className="space-y-5">
        {/* Name Input */}
        <div>
          <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-2 ml-1">Full Name</label>
          <input
            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/10 transition-all duration-300 placeholder-white/20"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-2 ml-1">Email Address</label>
          <input
            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/10 transition-all duration-300 placeholder-white/20"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-2 ml-1">Password</label>
          <input
            type="password"
            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/10 transition-all duration-300 placeholder-white/20"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Register Button */}
        <button
          onClick={submit}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 transform active:scale-[0.98] hover:shadow-purple-500/40"
        >
          Create Account
        </button>

        {/* Footer Link */}
        <p className="text-center text-sm text-purple-200/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-bold hover:text-purple-400 transition-colors underline-offset-4 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  </div>
);
};

export default Register;
