import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterHint, setShowRegisterHint] =
    useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (showRegisterHint) setShowRegisterHint(false);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowRegisterHint(false);
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('fullName', data.fullName);
      localStorage.setItem('email', data.email);

      if (data.role === 'PATIENT') {
        navigate('/patient/dashboard');
      } else if (data.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else if (data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      }

    } catch (err) {
      const status = err.response?.status;
      const backendMsg =
        err.response?.data?.message ||
        err.response?.data || '';

      if (!err.response) {
        setError(
          'Cannot connect to server! ' +
          'Please make sure the backend is running.'
        );
      } else if (status === 403 || status === 401) {
        setError(
          'Account not found or wrong password! ' +
          'Please register first or check your credentials.'
        );
        setShowRegisterHint(true);
      } else if (status === 400) {
        setError('Invalid email or password!');
      } else if (status === 500) {
        setError('Server error! Please try again later.');
      } else {
        setError(
          String(backendMsg) || 'Login failed!'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background:
        'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', sans-serif"
    }}>

      {/* Background glow circles */}
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.1)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'fixed',
        bottom: '10%',
        right: '10%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'rgba(236, 72, 153, 0.1)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}/>

      <div style={{
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1
      }}>

        {/* Glass Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
        }}>

          {/* Logo */}
          <div style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              background:
                'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '32px',
              boxShadow:
                '0 8px 20px rgba(99, 102, 241, 0.4)'
            }}>
              🏥
            </div>
            <h2 style={{
              color: 'white',
              fontWeight: '700',
              fontSize: '28px',
              margin: '0 0 6px'
            }}>
              MedVault
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '14px',
              margin: 0
            }}>
              Your trusted healthcare platform
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#fca5a5',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          {/* Register Hint */}
          {showRegisterHint && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <p style={{
                color: '#fcd34d',
                fontSize: '13px',
                margin: '0 0 10px'
              }}>
                Don't have an account yet?
              </p>
              <Link
                to="/register"
                style={{
                  background:
                    'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                📝 Register Now — It's Free!
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '13px',
                fontWeight: '600',
                display: 'block',
                marginBottom: '8px',
                letterSpacing: '0.5px'
              }}>
                EMAIL ADDRESS
              </label>
              <div style={{ position: 'relative' }}>

                {/* Email SVG Icon */}
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: 'rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 46px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor =
                      'rgba(99, 102, 241, 0.8)';
                    e.target.style.background =
                      'rgba(255,255,255,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      'rgba(255,255,255,0.1)';
                    e.target.style.background =
                      'rgba(255,255,255,0.07)';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '13px',
                fontWeight: '600',
                display: 'block',
                marginBottom: '8px',
                letterSpacing: '0.5px'
              }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>

                {/* Lock SVG Icon */}
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: 'rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <rect
                      x="3" y="11"
                      width="18" height="11"
                      rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>

                {/* Password Input */}
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 48px 14px 46px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor =
                      'rgba(99, 102, 241, 0.8)';
                    e.target.style.background =
                      'rgba(255,255,255,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      'rgba(255,255,255,0.1)';
                    e.target.style.background =
                      'rgba(255,255,255,0.07)';
                  }}
                />

                {/* Eye SVG Button - Inside field */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: showPassword
                      ? 'rgba(255,255,255,0.8)'
                      : 'rgba(255,255,255,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      showPassword
                        ? 'rgba(255,255,255,0.8)'
                        : 'rgba(255,255,255,0.35)';
                  }}
                  title={showPassword
                    ? 'Hide password'
                    : 'Show password'}>

                  {showPassword ? (
                    // Eye slash - password visible
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    // Eye - password hidden
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>

              </div>
            </div>

            {/* Forgot Password */}
            <div style={{
              textAlign: 'right',
              marginBottom: '28px'
            }}>
              <Link
                to="/forgot-password"
                style={{
                  color: '#818cf8',
                  fontSize: '13px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                background: loading
                  ? 'rgba(99, 102, 241, 0.5)'
                  : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading
                  ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading
                  ? 'none'
                  : '0 8px 20px rgba(99, 102, 241, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform =
                    'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 28px rgba(99, 102, 241, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  'translateY(0)';
                e.currentTarget.style.boxShadow =
                  loading
                    ? 'none'
                    : '0 8px 20px rgba(99, 102, 241, 0.4)';
              }}>
              {loading ? (
                <>
                  <span className="spinner-border
                                   spinner-border-sm">
                  </span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '24px 0'
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'rgba(255,255,255,0.1)'
            }}/>
            <span style={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: '12px'
            }}>
              OR
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'rgba(255,255,255,0.1)'
            }}/>
          </div>

          {/* Register Link */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '14px',
              margin: 0
            }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: '#818cf8',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}>
                Create Account
              </Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.2)',
          fontSize: '12px',
          marginTop: '20px',
          margin: '20px 0 0'
        }}>
          🔐 Secure & Encrypted Healthcare Platform
        </p>

      </div>
    </div>
  );
}

export default Login;