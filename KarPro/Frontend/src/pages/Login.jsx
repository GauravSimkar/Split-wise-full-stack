import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../utils/toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth(); // 👈 user nikala
  const navigate = useNavigate();

  // 🔐 LOGIN PAGE GUARD
  if (user) {
    return <Navigate to="/groups" replace />;
  }

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      showSuccess("Login successful");
      navigate("/groups", { replace: true });
    } catch (err) {
      showError(err.response?.data?.message || "Login failed");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#0f172a] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 px-4">
    <div className="max-w-md w-full backdrop-blur-lg bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-white tracking-tight">Welcome</h2>
        <p className="text-purple-200/70 mt-2">Enter your credentials to access your account</p>
      </div>

      <div className="space-y-6">
        {/* Email Input */}
        <div className="relative group">
          <label className="block text-sm font-medium text-purple-100 mb-2 ml-1">Email Address</label>
          <input
            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/10 transition-all duration-300 placeholder-white/30"
            placeholder="hello@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="relative group">
          <div className="flex justify-between items-center mb-2 ml-1">
            <label className="text-sm font-medium text-purple-100">Password</label>
          </div>
          <input
            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/10 transition-all duration-300 placeholder-white/30"
            type="password"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={submit}
          className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 transform active:scale-[0.97]"
        >
          Login Now
        </button>
      </div>
    </div>
  </div>
);
};

export default Login;
