import React, { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(8, "Password required (min 8 characters)"),
});

export default function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const validate = () => {
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const errors = {};
      result.error.issues.forEach((i) => {
        const k = i.path[0];
        if (!errors[k]) errors[k] = i.message;
      });
      setFieldErrors(errors);
      return false;
    }
    setFieldErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    try {
      const result = await axios.post("http://localhost:3000/auth/adminlogin", values);

      if (result.data.loginStatus) {
        localStorage.setItem("valid", "true");
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userId", result.data.id);
        navigate("/dashboard");
      } else {
        setError(result.data.Error || "Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.Error || "Failed to login");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        {error && <div className="text-danger mb-2">{error}</div>}

        <h2>Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className={`form-control rounded-0 ${fieldErrors.email ? "is-invalid" : ""}`}
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              placeholder="Enter email"
            />
            {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className={`form-control rounded-0 ${fieldErrors.password ? "is-invalid" : ""}`}
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              placeholder="Enter password"
            />
            {fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password}</div>}
          </div>

          <button type="submit" className="btn btn-success w-100 rounded-0 mb-2">
            Log in
          </button>

          <p className="mt-2">
            No account? <Link to="/admin/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}