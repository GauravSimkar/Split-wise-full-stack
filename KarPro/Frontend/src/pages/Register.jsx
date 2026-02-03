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
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border p-2 w-full mb-3"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-black text-white w-full py-2 rounded"
      >
        Register
      </button>

      <p className="text-sm text-center mt-3">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
