import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("profileImage", res.data.profileImage || "");
      alert("Login successful!");
      window.location.reload();
      navigate("/quizzes");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded w-25">
        <h2 className="text-center mb-3">Login</h2>
        <div className="mb-3">
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;