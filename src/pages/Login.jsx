/**
 * Login.jsx — Log-in page ("/login")
 *
 * Collects an email and password and signs the user in. After a successful
 * login it sends them back to the page they came from (or home). Already
 * logged-in users are bounced straight to home.
 */
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "../styles/auth.css";

function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || "/";

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    navigate(redirectPath, { replace: true });
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-label">Welcome Back</p>

        <h1>Log In</h1>

        <p>
          Log in to create posts, preserve media, and participate in the
          archive.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <p className="form-message error-message">{errorMessage}</p>
          )}

          <div className="form-field">
            <label htmlFor="login-email">Email</label>

            <input
              id="login-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Password</label>

            <input
              id="login-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;