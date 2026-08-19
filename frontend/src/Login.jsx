import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/auth`;

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("signin");

  const [signIn, setSignIn] = useState({ identifier: "", password: "" });
  const [signUp, setSignUp] = useState({ username: "", email: "", password: "", confirm: "" });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    if (!signIn.identifier.trim()) return setError("Enter your username or email.");
    if (!signIn.password.trim()) return setError("Enter your password.");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE}/login`, {
        identifier: signIn.identifier,
        password: signIn.password,
      });
      localStorage.setItem("user", res.data.username);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (!signUp.username.trim()) return setError("Username is required.");
    if (!signUp.email.trim()) return setError("Email is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUp.email)) return setError("Enter a valid email.");
    if (signUp.password.length < 6) return setError("Password must be at least 6 characters.");
    if (signUp.password !== signUp.confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await axios.post(`${BASE}/register`, {
        username: signUp.username,
        email: signUp.email,
        password: signUp.password,
      });
      localStorage.setItem("user", signUp.username);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t) => { setTab(t); setError(""); };

  return (
    <div className="login-page">
      <div className="login-glow" />

      <div className="login-card">
        <div className="login-logo">
          <span className="logo-icon">⚡</span>
          <h1>Code<span>Tracker</span></h1>
        </div>
        <p className="login-sub">Track your coding journey. Stay consistent.</p>

        {/* TABS */}
        <div className="login-tabs">
          <button className={`tab-btn ${tab === "signin" ? "active" : ""}`} onClick={() => switchTab("signin")}>Sign In</button>
          <button className={`tab-btn ${tab === "signup" ? "active" : ""}`} onClick={() => switchTab("signup")}>Sign Up</button>
        </div>

        {/* SIGN IN */}
        {tab === "signin" && (
          <form onSubmit={handleSignIn} className="login-form">
            <div className="login-field">
              <label>Username or Email</label>
              <input
                type="text"
                placeholder="Enter username or email"
                value={signIn.identifier}
                onChange={e => setSignIn({ ...signIn, identifier: e.target.value })}
                autoFocus
              />
            </div>
            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={signIn.password}
                onChange={e => setSignIn({ ...signIn, password: e.target.value })}
              />
            </div>
            {error && <p className="login-error">⚠ {error}</p>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Sign In →"}
            </button>
            <p className="switch-hint">Don't have an account? <button type="button" className="switch-link" onClick={() => switchTab("signup")}>Sign Up</button></p>
          </form>
        )}

        {/* SIGN UP */}
        {tab === "signup" && (
          <form onSubmit={handleSignUp} className="login-form">
            <div className="login-field">
              <label>Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={signUp.username}
                onChange={e => setSignUp({ ...signUp, username: e.target.value })}
                autoFocus
              />
            </div>
            <div className="login-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={signUp.email}
                onChange={e => setSignUp({ ...signUp, email: e.target.value })}
              />
            </div>
            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={signUp.password}
                onChange={e => setSignUp({ ...signUp, password: e.target.value })}
              />
            </div>
            <div className="login-field">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={signUp.confirm}
                onChange={e => setSignUp({ ...signUp, confirm: e.target.value })}
              />
            </div>
            {error && <p className="login-error">⚠ {error}</p>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Create Account →"}
            </button>
            <p className="switch-hint">Already have an account? <button type="button" className="switch-link" onClick={() => switchTab("signin")}>Sign In</button></p>
          </form>
        )}
      </div>
    </div>
  );
}
