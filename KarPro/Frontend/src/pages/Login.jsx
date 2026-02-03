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
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Login</h2>
      <input
        className="border p-2 w-full"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mt-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={submit}
        className="mt-3 bg-black text-white px-4 py-2"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
