/**
 * SysDraw - Register Page
 * Matches design: left purple section + right form panel
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [form, setForm] = useState({
    fullName: '', username: '', email: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data.token, data.user);
      navigate('/editor');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root auth-root--register">
      {/* ── Left Panel (purple with illustration) ── */}
      <div className="auth-right auth-right--left">
        {/* Vertical purple stripe decoration */}
        <div className="auth-stripe" />
        <div className="auth-illustration auth-illustration--monitor">
          {/* Stylised monitor SVG */}
          <svg viewBox="0 0 300 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="monitor-svg">
            {/* Monitor body */}
            <rect x="30" y="40" width="180" height="140" rx="14" fill="#2d2b6b" />
            <rect x="42" y="52" width="156" height="116" rx="8" fill="#3a3880" />
            {/* Screen content bars */}
            <circle cx="62" cy="70" r="8" fill="#f0a060" />
            <circle cx="80" cy="70" r="8" fill="#7c6ef7" />
            <rect x="50" y="90" width="120" height="8" rx="4" fill="#5a56a8" opacity="0.5" />
            <rect x="50" y="108" width="80" height="6" rx="3" fill="#5a56a8" opacity="0.4" />
            <rect x="50" y="122" width="100" height="22" rx="6" fill="#22c8a0" opacity="0.6" />
            <circle cx="200" cy="80" r="10" fill="#7c6ef7" />
            {/* Stand */}
            <rect x="100" y="180" width="40" height="30" rx="4" fill="#b0aed0" />
            <rect x="75" y="208" width="90" height="10" rx="5" fill="#a0aec0" />
            {/* Floating envelope card */}
            <rect x="155" y="28" width="72" height="58" rx="12" fill="#5cf0c0" opacity="0.85" transform="rotate(8 155 28)" />
            <polyline points="155,40 191,62 227,40" stroke="white" strokeWidth="3" fill="none" transform="rotate(8 155 28)" />
          </svg>
        </div>
        {/* Logo bottom-left */}
        <div className="auth-logo auth-logo--corner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 2v6h6M8 13h8M8 17h5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── Right Panel (form) ── */}
      <div className="auth-left fade-in" style={{ flex: 1.1 }}>
        <div className="auth-form-wrap" style={{ marginLeft: 'auto', marginRight: '10%' }}>
          <h2 className="auth-title" style={{ textAlign: 'center', marginBottom: 24 }}>
            Please Fill out form to Register!
          </h2>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {[
              { label: 'Full name:', name: 'fullName', type: 'text' },
              { label: 'Username:', name: 'username', type: 'text' },
              { label: 'Email:', name: 'email', type: 'email' },
              { label: 'Password:', name: 'password', type: 'password' },
              { label: 'Confirm Password:', name: 'confirmPassword', type: 'password' },
            ].map(({ label, name, type }) => (
              <div className="auth-field" key={name}>
                <label>{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="auth-switch">
            Yes i have an account?&nbsp;
            <Link to="/login"><strong>Login</strong></Link>
          </p>

          <div className="auth-socials">
            <a href="#!" className="social-icon" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#7c6ef7">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#!" className="social-icon" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#7c6ef7">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
            <a href="#!" className="social-icon" aria-label="Telegram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c6ef7" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
