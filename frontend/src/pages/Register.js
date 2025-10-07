import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const res = await api.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data);
      } else {
        alert("Error registering user");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded"
        style={{ width: "400px" }}
      >
        <h2 className="text-center mb-3">Register</h2>

        <div className="mb-3">
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
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
            required
            minLength={6}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Profile Image (Optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-decoration-none">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
