import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create a fresh axios instance with NO auth headers
const publicApi = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Steps in the forgot password flow
const STEPS = {
  VERIFY: 'VERIFY',
  OTP: 'OTP',
  RESET: 'RESET',
  SUCCESS: 'SUCCESS'
};

function ForgotPassword() {

  const [step, setStep] = useState(STEPS.VERIFY);
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpInputs, setOtpInputs] = useState(
    ['', '', '', '', '', '']
  );
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // Step 1 - Verify email or phone
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await publicApi.post(
        '/api/auth/forgot-password/verify',
        { identifier: identifier.trim() }
      );

      setEmail(response.data.email);

      // Show OTP for testing
      if (response.data.otp) {
        setMessage(
          `OTP sent! For testing your OTP is: ${response.data.otp}`
        );
      } else {
        setMessage(response.data.message);
      }

      setStep(STEPS.OTP);

    } catch (err) {
      console.error('Verify error:', err);
      setError(
        err.response?.data?.message ||
        'Verification failed! Please check your email or phone.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input boxes
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);
    setOtp(newOtpInputs.join(''));

    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle backspace in OTP boxes
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' &&
        !otpInputs[index] &&
        index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Step 2 - Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter all 6 digits!');
      return;
    }

    setLoading(true);

    try {
      await publicApi.post(
        '/api/auth/forgot-password/verify-otp',
        { email, otp }
      );

      setStep(STEPS.RESET);

    } catch (err) {
      console.error('OTP verify error:', err);
      setError(
        err.response?.data?.message ||
        'Invalid OTP! Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 3 - Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    // Validate new password
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError(
        'Password must contain at least one uppercase letter!'
      );
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setError(
        'Password must contain at least one lowercase letter!'
      );
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setError(
        'Password must contain at least one number!'
      );
      return;
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
      newPassword)) {
      setError(
        'Password must contain at least one special character!'
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      await publicApi.post(
        '/api/auth/forgot-password/reset',
        { email, otp, newPassword }
      );

      setStep(STEPS.SUCCESS);

    } catch (err) {
      console.error('Reset error:', err);
      setError(
        err.response?.data?.message ||
        'Password reset failed! Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center
                 justify-content-center"
      style={{
        background:
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>

      <div className="card shadow-lg" style={{ width: '440px' }}>
        <div className="card-body p-5">

          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">
              🏥 MedVault
            </h2>
            <p className="text-muted">Reset your password</p>
          </div>

          {/* Progress Steps */}
          <div className="d-flex justify-content-center
                          mb-4 gap-2 flex-wrap">
            {[
              { key: STEPS.VERIFY, label: '1. Verify' },
              { key: STEPS.OTP, label: '2. OTP' },
              { key: STEPS.RESET, label: '3. Reset' },
              { key: STEPS.SUCCESS, label: '4. Done' }
            ].map((s, index) => (
              <div
                key={s.key}
                className={`px-2 py-1 rounded small
                  ${step === s.key
                    ? 'bg-primary text-white fw-bold'
                    : Object.values(STEPS).indexOf(step) >
                      index
                    ? 'bg-success text-white'
                    : 'bg-light text-muted'}`}>
                {s.label}
              </div>
            ))}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger py-2 small">
              ❌ {error}
            </div>
          )}

          {/* Info Message */}
          {message && step === STEPS.OTP && (
            <div className="alert alert-info py-2 small">
              ℹ️ {message}
            </div>
          )}

          {/* STEP 1 — Verify Email or Phone */}
          {step === STEPS.VERIFY && (
            <form onSubmit={handleVerify}>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter your email or phone"
                  value={identifier}
                  onChange={(e) =>
                    setIdentifier(e.target.value)
                  }
                  required
                />
                <small className="text-muted">
                  Enter the email or phone number
                  registered with your account
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={loading || !identifier.trim()}>
                {loading ? (
                  <span>
                    <span className="spinner-border
                                     spinner-border-sm me-2">
                    </span>
                    Verifying...
                  </span>
                ) : (
                  '📧 Send OTP'
                )}
              </button>

            </form>
          )}

          {/* STEP 2 — Enter OTP */}
          {step === STEPS.OTP && (
            <form onSubmit={handleVerifyOtp}>

              <div className="mb-4">
                <label className="form-label fw-semibold
                                  text-center d-block">
                  Enter 6-Digit OTP
                </label>
                <p className="text-muted small text-center mb-3">
                  OTP sent to {email}
                </p>

                {/* OTP Input Boxes */}
                <div className="d-flex
                                justify-content-center
                                gap-2">
                  {otpInputs.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      className="form-control text-center
                                 fw-bold fs-4"
                      style={{
                        width: '50px',
                        height: '55px',
                        fontSize: '24px'
                      }}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          index, e.target.value
                        )
                      }
                      onKeyDown={(e) =>
                        handleOtpKeyDown(index, e)
                      }
                    />
                  ))}
                </div>

                {/* OTP count indicator */}
                <p className="text-center small mt-2
                              text-muted">
                  {otp.length}/6 digits entered
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg
                           w-100 mb-2"
                disabled={loading || otp.length !== 6}>
                {loading ? (
                  <span>
                    <span className="spinner-border
                                     spinner-border-sm me-2">
                    </span>
                    Verifying...
                  </span>
                ) : (
                  '✓ Verify OTP'
                )}
              </button>

              {/* Resend OTP */}
              <button
                type="button"
                className="btn btn-outline-secondary
                           w-100"
                onClick={() => {
                  setStep(STEPS.VERIFY);
                  setOtpInputs(['', '', '', '', '', '']);
                  setOtp('');
                  setError('');
                  setMessage('');
                }}>
                🔄 Resend OTP
              </button>

            </form>
          )}

          {/* STEP 3 — Reset Password */}
          {step === STEPS.RESET && (
            <form onSubmit={handleResetPassword}>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  New Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* Password strength indicators */}
                {newPassword && (
                  <div className="mt-2 p-2 bg-light rounded">
                    <small className={`d-block
                      ${newPassword.length >= 6
                        ? 'text-success' : 'text-danger'}`}>
                      {newPassword.length >= 6
                        ? '✓' : '✗'} Min 6 characters
                    </small>
                    <small className={`d-block
                      ${/[A-Z]/.test(newPassword)
                        ? 'text-success' : 'text-danger'}`}>
                      {/[A-Z]/.test(newPassword)
                        ? '✓' : '✗'} Uppercase letter
                    </small>
                    <small className={`d-block
                      ${/[a-z]/.test(newPassword)
                        ? 'text-success' : 'text-danger'}`}>
                      {/[a-z]/.test(newPassword)
                        ? '✓' : '✗'} Lowercase letter
                    </small>
                    <small className={`d-block
                      ${/[0-9]/.test(newPassword)
                        ? 'text-success' : 'text-danger'}`}>
                      {/[0-9]/.test(newPassword)
                        ? '✓' : '✗'} Number
                    </small>
                    <small className={`d-block
                      ${/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
                        .test(newPassword)
                        ? 'text-success' : 'text-danger'}`}>
                      {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
                        .test(newPassword)
                        ? '✓' : '✗'} Special character
                    </small>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                />
                {confirmPassword && (
                  <small className={
                    newPassword === confirmPassword
                      ? 'text-success'
                      : 'text-danger'
                  }>
                    {newPassword === confirmPassword
                      ? '✓ Passwords match'
                      : '✗ Passwords do not match'}
                  </small>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-success btn-lg w-100"
                disabled={
                  loading ||
                  newPassword !== confirmPassword
                }>
                {loading ? (
                  <span>
                    <span className="spinner-border
                                     spinner-border-sm me-2">
                    </span>
                    Resetting...
                  </span>
                ) : (
                  '🔒 Reset Password'
                )}
              </button>

            </form>
          )}

          {/* STEP 4 — Success */}
          {step === STEPS.SUCCESS && (
            <div className="text-center">
              <div style={{ fontSize: '80px' }}>✅</div>
              <h4 className="fw-bold text-success mt-3">
                Password Reset Successfully!
              </h4>
              <p className="text-muted">
                Your password has been updated.
                Please login with your new password.
              </p>
              <button
                className="btn btn-primary btn-lg
                           w-100 mt-3"
                onClick={() => navigate('/login')}>
                🔐 Go to Login
              </button>
            </div>
          )}

          {/* Back to Login */}
          {step !== STEPS.SUCCESS && (
            <div className="text-center mt-3">
              <Link
                to="/login"
                className="text-muted small">
                ← Back to Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;