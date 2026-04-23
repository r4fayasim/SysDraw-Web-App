/**
 * SysDraw - Login Page
 * Matches design: left form panel + right purple section with 3D laptop illustration
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.token, data.user);
      navigate('/editor');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      {/* ── Left Panel ── */}
      <div className="auth-left fade-in">
        {/* Decorative blob bottom-left */}
        <div className="auth-blob" />

        <div className="auth-form-wrap">
          {/* Logo */}
          <div className="auth-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 2v6h6M8 13h8M8 17h5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <h2 className="auth-title">Welcome Back!</h2>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label>Username:</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>

            <div className="auth-field">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <p className="auth-switch">
            Dont&nbsp;have and account?&nbsp;
            <Link to="/register"><strong>Register</strong></Link>
          </p>

          {/* Social icons */}
          <div className="auth-socials">
            {/* Facebook */}
            <a href="#!" aria-label="Facebook" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#7c6ef7">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a href="#!" aria-label="WhatsApp" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#7c6ef7">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
            {/* Telegram */}
            <a href="#!" aria-label="Telegram" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c6ef7" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Right Panel (purple) ── */}
      <div className="auth-right">
        <div className="auth-illustration">
          {/* Stylised laptop SVG */}
          <svg viewBox="0 0 340 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="laptop-svg">
            {/* Screen */}
            <rect x="60" y="20" width="200" height="140" rx="10" fill="#2d2b6b" />
            <rect x="70" y="30" width="180" height="120" rx="6" fill="#3a3880" />
            {/* Keyboard base */}
            <ellipse cx="160" cy="180" rx="130" ry="18" fill="#d0cef0" />
            <rect x="50" y="162" width="220" height="18" rx="4" fill="#bbb8e0" />
            {/* Decorative lines on screen */}
            <rect x="85" y="70" width="100" height="8" rx="3" fill="#5a56a8" opacity="0.6" />
            <rect x="85" y="88" width="70" height="6" rx="3" fill="#5a56a8" opacity="0.4" />
            {/* Floating chart card */}
            <rect x="195" y="10" width="70" height="70" rx="12" fill="#8480f8" opacity="0.85" transform="rotate(-12 195 10)" />
            <circle cx="238" cy="44" r="20" fill="none" stroke="#f0a" strokeWidth="6" transform="rotate(-12 195 10)" />
            <circle cx="238" cy="44" r="20" fill="none" stroke="#a0f" strokeWidth="6" strokeDasharray="30 100" transform="rotate(-12 195 10)" />
            {/* Decorative lines floating */}
            <rect x="35" y="110" width="28" height="6" rx="3" fill="#f0c060" opacity="0.9" transform="rotate(-20 35 110)" />
            <rect x="50" y="130" width="28" height="6" rx="3" fill="#f080c0" opacity="0.8" transform="rotate(-20 50 130)" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Login;
