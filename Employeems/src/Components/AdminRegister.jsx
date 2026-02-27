import React, { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().email("Invalid email").max(120),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .max(128, "Too long")
    .regex(/[a-z]/, "Must include 1 lowercase letter")
    .regex(/[A-Z]/, "Must include 1 uppercase letter")
    .regex(/\d/, "Must include 1 number")
    .regex(/[@$!%*?&()[\]{}<>^#~+=_\-\\/|:;"',.]/, "Must include 1 special character"),
});

export default function AdminRegister() {
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const validate = () => {
    const result = registerSchema.safeParse(values);
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
      const res = await axios.post("http://localhost:3000/auth/adminregister", values);
      if (res.data.Status) {
        navigate("/admin/login");
      } else {
        setError(res.data.Error || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.Error || "Server error while registering");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        {error && <div className="text-danger mb-2">{error}</div>}

        <h2>Admin Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Name</label>
            <input
              className={`form-control rounded-0 ${fieldErrors.name ? "is-invalid" : ""}`}
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              placeholder="Enter full name"
            />
            {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
          </div>

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
              placeholder="Strong password"
            />
            {fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password}</div>}
          </div>

          <button type="submit" className="btn btn-success w-100 rounded-0 mb-2">
            Register
          </button>

          <p className="mt-2">
            Already have an account? <Link to="/admin/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
} 
