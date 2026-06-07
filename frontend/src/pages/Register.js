import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import specializations from '../utils/specializations';
import countryCodes from '../utils/countryCodes';
import CountryCodePicker from '../components/CountryCodePicker';
import { bloodGroups, genders } from '../utils/medicalData';
import axios from 'axios';

function Register() {

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryCode: '+91',
    phone: '',
    role: '',
    specialization: '',
    gender: '',
    age: '',
    bloodGroup: 'NA'
  });

  const [emailAvailable, setEmailAvailable]   = useState(null);
  const [checkingEmail, setCheckingEmail]     = useState(false);
  const [errors, setErrors]                   = useState({});
  const [error, setError]                     = useState('');
  const [success, setSuccess]                 = useState('');
  const [loading, setLoading]                 = useState(false);

  const navigate = useNavigate();

  // ===========================
  // PHONE PATTERN VALIDATION
  // ===========================
  const validatePhonePattern = (phone, countryCode) => {
    if (/^(\d)\1+$/.test(phone)) {
      return 'Phone number cannot be all the same digit!';
    }

    const ascending  = '0123456789';
    const descending = '9876543210';
    if (ascending.includes(phone) || descending.includes(phone)) {
      return 'Phone number cannot be a sequential pattern!';
    }

    for (let i = 0; i <= phone.length - 5; i++) {
      const chunk = phone.slice(i, i + 5);
      if (ascending.includes(chunk) || descending.includes(chunk)) {
        return 'Invalid phone number!';
      }
    }

    for (let patLen = 2; patLen <= Math.floor(phone.length / 2); patLen++) {
      const pattern  = phone.slice(0, patLen);
      const repeated = pattern.repeat(Math.ceil(phone.length / patLen)).slice(0, phone.length);
      if (repeated === phone) {
        return 'Phone number cannot be a repeated pattern!';
      }
    }

    const startingDigitRules = {
      '+91':  { valid: ['6','7','8','9'], label: 'India' },
      '+1':   { valid: ['2','3','4','5','6','7','8','9'], label: 'US/Canada' },
      '+44':  { valid: ['7'], label: 'UK mobile' },
      '+61':  { valid: ['4'], label: 'Australia mobile' },
      '+92':  { valid: ['3'], label: 'Pakistan mobile' },
      '+880': { valid: ['1'], label: 'Bangladesh mobile' },
      '+977': { valid: ['9'], label: 'Nepal mobile' },
      '+94':  { valid: ['7'], label: 'Sri Lanka mobile' },
      '+971': { valid: ['5'], label: 'UAE mobile' },
      '+966': { valid: ['5'], label: 'Saudi Arabia mobile' },
      '+974': { valid: ['3','5','6','7'], label: 'Qatar mobile' },
      '+65':  { valid: ['8','9'], label: 'Singapore mobile' },
      '+60':  { valid: ['1'], label: 'Malaysia mobile' },
      '+62':  { valid: ['8'], label: 'Indonesia mobile' },
      '+63':  { valid: ['9'], label: 'Philippines mobile' },
      '+66':  { valid: ['0','6','8','9'], label: 'Thailand mobile' },
      '+81':  { valid: ['0','7','8','9'], label: 'Japan mobile' },
      '+82':  { valid: ['0','1'], label: 'South Korea mobile' },
      '+86':  { valid: ['1'], label: 'China mobile' },
      '+49':  { valid: ['1','2','3','4','5','6','7','8','9'], label: 'Germany' },
      '+33':  { valid: ['0','6','7'], label: 'France mobile' },
      '+39':  { valid: ['3'], label: 'Italy mobile' },
      '+34':  { valid: ['6','7'], label: 'Spain mobile' },
      '+7':   { valid: ['9'], label: 'Russia mobile' },
      '+55':  { valid: ['9'], label: 'Brazil mobile' },
      '+27':  { valid: ['6','7','8'], label: 'South Africa mobile' },
      '+234': { valid: ['7','8','9'], label: 'Nigeria mobile' },
      '+254': { valid: ['7','1'], label: 'Kenya mobile' },
      '+20':  { valid: ['1'], label: 'Egypt mobile' },
    };

    const rule = startingDigitRules[countryCode];
    if (rule && !rule.valid.includes(phone[0])) {
      return `${rule.label} numbers must start with ${rule.valid.join(' or ')}!`;
    }

    if (/(.)\1{4,}/.test(phone)) {
      return 'Phone number cannot have 5+ consecutive repeated digits!';
    }

    return null;
  };

  // ===========================
  // VALIDATION RULES
  // ===========================
  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required!';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters!';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const disposableDomains = [
      'mailinator.com', 'tempmail.com', 'guerrillamail.com',
      'yopmail.com', 'trashmail.com', 'fakeinbox.com',
      'maildrop.cc', 'throwaway.email'
    ];

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required!';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address!';
    } else if (formData.email.includes('..')) {
      newErrors.email = 'Email cannot contain consecutive dots!';
    } else if (formData.email.includes(' ')) {
      newErrors.email = 'Email cannot contain spaces!';
    } else if (disposableDomains.includes(formData.email.split('@')[1]?.toLowerCase())) {
      newErrors.email = 'Disposable emails are not allowed!';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required!';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters!';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Must contain at least one uppercase letter!';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Must contain at least one lowercase letter!';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Must contain at least one number!';
    } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) {
      newErrors.password = 'Must contain at least one special character!';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password!';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match!';
    }

    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);
    const minLen = selectedCountry?.minLength || 7;
    const maxLen = selectedCountry?.maxLength || 15;

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required!';
    } else if (!/^[0-9]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone must contain digits only!';
    } else if (formData.phone.length < minLen) {
      newErrors.phone = `Must be exactly ${minLen} digits for ${selectedCountry?.country || 'this country'}!`;
    } else if (formData.phone.length > maxLen) {
      newErrors.phone = `Cannot exceed ${maxLen} digits for ${selectedCountry?.country || 'this country'}!`;
    } else {
      const patternErr = validatePhonePattern(formData.phone, formData.countryCode);
      if (patternErr) newErrors.phone = patternErr;
    }

    if (!formData.role) {
      newErrors.role = 'Please select your role!';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender!';
    }

    if (formData.role === 'PATIENT') {
      if (!formData.age) {
        newErrors.age = 'Age is required!';
      } else if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
        newErrors.age = 'Please enter a valid age (1-120)!';
      }
    }

    if (formData.role === 'DOCTOR' && !formData.specialization) {
      newErrors.specialization = 'Please select your specialization!';
    }

    return newErrors;
  };

  // ===========================
  // EMAIL CHECK
  // ===========================
  const checkEmailAvailability = async (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailAvailable(null);
      return;
    }
    setCheckingEmail(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/auth/check-email?email=${email}`
      );
      setEmailAvailable(!response.data.exists);
    } catch (err) {
      console.error('Email check error:', err);
      // ✅ FIX: On error (backend down / CORS), set null so form isn't blocked
      setEmailAvailable(null);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'email') {
      setEmailAvailable(null);
      clearTimeout(window.emailCheckTimer);
      window.emailCheckTimer = setTimeout(() => {
        checkEmailAvailability(value);
      }, 800);
    }
  };

  // ===========================
  // ✅ FIX: isFormValid as useMemo so it recomputes on every state change
  // ===========================
  const isFormValid = useMemo(() => {
    // Full name
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) return false;

    // Email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) return false;
    if (formData.email.includes('..') || formData.email.includes(' ')) return false;

    // ✅ Only block if CONFIRMED taken (false). null = unknown = allow through
    if (emailAvailable === false) return false;

    // Password — ALL checks must pass
    if (!formData.password) return false;
    if (formData.password.length < 6) return false;
    if (!/[A-Z]/.test(formData.password)) return false;
    if (!/[a-z]/.test(formData.password)) return false;
    if (!/[0-9]/.test(formData.password)) return false;
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) return false;

    // Confirm password
    if (!formData.confirmPassword || formData.password !== formData.confirmPassword) return false;

    // Phone
    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);
    const minLen = selectedCountry?.minLength || 7;
    const maxLen = selectedCountry?.maxLength || 15;
    if (!formData.phone || !/^[0-9]+$/.test(formData.phone)) return false;
    if (formData.phone.length < minLen || formData.phone.length > maxLen) return false;
    if (validatePhonePattern(formData.phone, formData.countryCode) !== null) return false;

    // Role & Gender
    if (!formData.role)   return false;
    if (!formData.gender) return false;

    // Role-specific
    if (formData.role === 'PATIENT') {
      if (!formData.age) return false;
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 1 || age > 120) return false;
    }
    if (formData.role === 'DOCTOR' && !formData.specialization) return false;

    return true;
  }, [formData, emailAvailable]);

  // ===========================
  // SUBMIT
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (emailAvailable === false) {
      setError('This email is already registered!');
      return;
    }

    setLoading(true);
    try {
      const fullPhone    = `${formData.countryCode}${formData.phone}`;
      const registerData = {
        fullName:       formData.fullName.trim(),
        email:          formData.email.trim().toLowerCase(),
        password:       formData.password,
        phone:          fullPhone,
        role:           formData.role,
        gender:         formData.gender || '',
        bloodGroup:     formData.bloodGroup || 'NA',
        specialization: formData.role === 'DOCTOR' ? formData.specialization : '',
        age:            formData.role === 'PATIENT' && formData.age ? parseInt(formData.age) : null
      };

      console.log('Sending registration:', { ...registerData, password: '***' });

      const response = await register(registerData);
      setSuccess('Registration successful! Redirecting...');

      localStorage.setItem('token',    response.token);
      localStorage.setItem('role',     response.role);
      localStorage.setItem('fullName', response.fullName);
      localStorage.setItem('email',    response.email);

      setTimeout(() => {
        if (response.role === 'PATIENT')      navigate('/patient/dashboard');
        else if (response.role === 'DOCTOR')  navigate('/doctor/dashboard');
        else if (response.role === 'ADMIN')   navigate('/admin/dashboard');
      }, 1000);

    } catch (err) {
      console.error('Registration error:', err);
      console.error('Response:', err.response?.data);

      const msg =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        String(err.response?.data)  ||
        err.message;

      if (!err.response) {
        setError('❌ Cannot connect to server! Make sure backend is running.');
      } else if (String(msg).includes('EMAIL_ALREADY_EXISTS')) {
        setError('❌ Email already registered! Please login instead.');
      } else {
        setError('❌ ' + (msg || 'Registration failed!'));
      }
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>

      <div className="card shadow-lg" style={{ width: '520px' }}>
        <div className="card-body p-5">

          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">🏥 MedVault</h2>
            <p className="text-muted">Create your account</p>
          </div>

          {error   && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Full Name <span className="text-danger ms-1">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Email Address <span className="text-danger ms-1">*</span>
              </label>
              <div className="input-group">
                <input
                  type="email"
                  className={`form-control
                    ${errors.email ? 'is-invalid' : ''}
                    ${emailAvailable === true  ? 'is-valid'   : ''}
                    ${emailAvailable === false ? 'is-invalid' : ''}`}
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <span className="input-group-text">
                  {checkingEmail ? (
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  ) : emailAvailable === true ? (
                    <span className="text-success fw-bold">✓</span>
                  ) : emailAvailable === false ? (
                    <span className="text-danger fw-bold">✗</span>
                  ) : (
                    <span className="text-muted">@</span>
                  )}
                </span>
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {!checkingEmail && emailAvailable === true && (
                <small className="text-success d-block mt-1">✓ Great! This email is available</small>
              )}
              {!checkingEmail && emailAvailable === false && (
                <div className="mt-1">
                  <small className="text-danger d-block">✗ This email is already registered!</small>
                  <small className="text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary">Login here</Link>
                  </small>
                </div>
              )}
              {checkingEmail && (
                <small className="text-muted d-block mt-1">🔍 Checking email availability...</small>
              )}

              {formData.email && !checkingEmail && (
                <div className="mt-2 p-2 bg-light rounded">
                  <small className={`d-block ${formData.email.includes('@') ? 'text-success' : 'text-danger'}`}>
                    {formData.email.includes('@') ? '✓' : '✗'} Contains @ symbol
                  </small>
                  <small className={`d-block ${/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) ? 'text-success' : 'text-danger'}`}>
                    {/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) ? '✓' : '✗'} Valid email format
                  </small>
                  <small className={`d-block ${!formData.email.includes(' ') ? 'text-success' : 'text-danger'}`}>
                    {!formData.email.includes(' ') ? '✓' : '✗'} No spaces
                  </small>
                  <small className={`d-block ${!formData.email.includes('..') ? 'text-success' : 'text-danger'}`}>
                    {!formData.email.includes('..') ? '✓' : '✗'} No consecutive dots
                  </small>
                  <small className={`d-block ${formData.email.includes('@') && formData.email.split('@')[1]?.includes('.') ? 'text-success' : 'text-danger'}`}>
                    {formData.email.includes('@') && formData.email.split('@')[1]?.includes('.') ? '✓' : '✗'} Valid domain
                  </small>
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Gender <span className="text-danger ms-1">*</span>
              </label>
              <select
                className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                name="gender"
                value={formData.gender}
                onChange={handleChange}>
                <option value="">-- Select Gender --</option>
                {genders.map((g, index) => (
                  <option key={index} value={g}>{g}</option>
                ))}
              </select>
              {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
            </div>
          {/* Age - only for patients */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Age <span className="text-danger ms-1">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                  name="age"
                  placeholder="Enter your age"
                  value={formData.age}
                  min="1"
                  max="120"
                  onChange={handleChange}
                />
                {errors.age && <div className="invalid-feedback">{errors.age}</div>}
              </div>
              
            {/* Blood Group */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Blood Group
                <span className="text-muted ms-1 fw-normal small">(Optional)</span>
              </label>
              <select
                className="form-select"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}>
                <option value="NA">Not Sure / Don't Know (NA)</option>
                {bloodGroups.map((bg, index) => (
                  <option key={index} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Password <span className="text-danger ms-1">*</span>
              </label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}

              {formData.password && (
                <div className="mt-2 p-2 bg-light rounded">
                  <small className="fw-semibold text-muted d-block mb-1">Password Requirements:</small>
                  <small className={`d-block ${formData.password.length >= 6 ? 'text-success' : 'text-danger'}`}>
                    {formData.password.length >= 6 ? '✓' : '✗'} Minimum 6 characters
                  </small>
                  <small className={`d-block ${/[A-Z]/.test(formData.password) ? 'text-success' : 'text-danger'}`}>
                    {/[A-Z]/.test(formData.password) ? '✓' : '✗'} At least one uppercase letter (A-Z)
                  </small>
                  <small className={`d-block ${/[a-z]/.test(formData.password) ? 'text-success' : 'text-danger'}`}>
                    {/[a-z]/.test(formData.password) ? '✓' : '✗'} At least one lowercase letter (a-z)
                  </small>
                  <small className={`d-block ${/[0-9]/.test(formData.password) ? 'text-success' : 'text-danger'}`}>
                    {/[0-9]/.test(formData.password) ? '✓' : '✗'} At least one number (0-9)
                  </small>
                  <small className={`d-block ${/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) ? 'text-success' : 'text-danger'}`}>
                    {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) ? '✓' : '✗'} At least one special character (!@#$%^&*)
                  </small>
                  <div className="mt-2">
                    <small className="text-muted">Strength: </small>
                    {(() => {
                      let strength = 0;
                      if (formData.password.length >= 6) strength++;
                      if (/[A-Z]/.test(formData.password)) strength++;
                      if (/[a-z]/.test(formData.password)) strength++;
                      if (/[0-9]/.test(formData.password)) strength++;
                      if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) strength++;
                      const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
                      const colors = ['', 'danger', 'warning', 'info', 'primary', 'success'];
                      return (
                        <div>
                          <div className="progress mt-1" style={{ height: '6px' }}>
                            <div
                              className={`progress-bar bg-${colors[strength]}`}
                              style={{ width: `${(strength / 5) * 100}%` }}>
                            </div>
                          </div>
                          <small className={`text-${colors[strength]}`}>{labels[strength]}</small>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Confirm Password <span className="text-danger ms-1">*</span>
              </label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )}
              {formData.confirmPassword && !errors.confirmPassword && (
                <small className={formData.password === formData.confirmPassword ? 'text-success' : 'text-danger'}>
                  {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </small>
              )}
            </div>

            {/* Phone with Country Code */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Phone Number <span className="text-danger ms-1">*</span>
              </label>
              <div className="d-flex gap-2">
                <CountryCodePicker
                  value={formData.countryCode}
                  onChange={(code) => {
                    setFormData(prev => ({ ...prev, countryCode: code, phone: '' }));
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                />
                <div className="flex-grow-1">
                  <input
                    type="text"
                    className={`form-control
                      ${errors.phone ? 'is-invalid' : ''}
                      ${formData.phone && !errors.phone && (() => {
                        const c = countryCodes.find(x => x.code === formData.countryCode);
                        const basicOk =
                          formData.phone.length >= (c?.minLength || 7) &&
                          formData.phone.length <= (c?.maxLength || 15);
                        return basicOk && validatePhonePattern(formData.phone, formData.countryCode) === null;
                      })() ? 'is-valid' : ''}`}
                    name="phone"
                    placeholder={(() => {
                      const c = countryCodes.find(x => x.code === formData.countryCode);
                      if (c?.minLength === c?.maxLength) return `Enter ${c.minLength} digits`;
                      return c ? `Enter ${c.minLength}-${c.maxLength} digits` : 'Enter phone number';
                    })()}
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      const selectedCountry = countryCodes.find(c => c.code === formData.countryCode);
                      const maxLen = selectedCountry?.maxLength || 15;
                      if (value.length <= maxLen) {
                        setFormData(prev => ({ ...prev, phone: value }));
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                      }
                    }}
                    maxLength={countryCodes.find(c => c.code === formData.countryCode)?.maxLength || 15}
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
              </div>

              {(() => {
                const c = countryCodes.find(x => x.code === formData.countryCode);
                if (!c) return null;
                const basicOk =
                  formData.phone.length >= c.minLength &&
                  formData.phone.length <= c.maxLength &&
                  /^[0-9]+$/.test(formData.phone);
                const patternError = basicOk
                  ? validatePhonePattern(formData.phone, formData.countryCode)
                  : null;
                const isValid = basicOk && patternError === null;
                const isEmpty = formData.phone.length === 0;

                return (
                  <div className="mt-1">
                    <small className="text-muted d-block">
                      📱 {c.country} phone:{' '}
                      {c.minLength === c.maxLength
                        ? `exactly ${c.minLength} digits`
                        : `${c.minLength} to ${c.maxLength} digits`}
                    </small>
                    {!isEmpty && (
                      <div className="mt-1">
                        <div className="d-flex justify-content-between">
                          <small className={isValid ? 'text-success' : 'text-danger'}>
                            {isValid
                              ? `✓ Valid ${c.country} number`
                              : patternError
                              ? `✗ ${patternError}`
                              : formData.phone.length < c.minLength
                              ? `✗ Need ${c.minLength - formData.phone.length} more digit(s)`
                              : `✗ Too many digits`}
                          </small>
                          <small className={isValid ? 'text-success' : 'text-muted'}>
                            {formData.phone.length}/{c.maxLength}
                          </small>
                        </div>
                        <div className="progress mt-1" style={{ height: '4px' }}>
                          <div
                            className={`progress-bar ${isValid ? 'bg-success' : 'bg-primary'}`}
                            style={{ width: `${Math.min((formData.phone.length / c.maxLength) * 100, 100)}%` }}>
                          </div>
                        </div>
                      </div>
                    )}
                    {isValid && (
                      <small className="text-success d-block mt-1">
                        ✓ Full number: {formData.countryCode}{formData.phone}
                      </small>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Role */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Register As <span className="text-danger ms-1">*</span>
              </label>
              <select
                className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                name="role"
                value={formData.role}
                onChange={handleChange}
                required>
                <option value="">-- Select Role --</option>
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
              </select>
              {errors.role && <div className="invalid-feedback">{errors.role}</div>}
            </div>

            {/* Specialization - only for doctors */}
            {formData.role === 'DOCTOR' && (
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Specialization <span className="text-danger ms-1">*</span>
                </label>
                <select
                  className={`form-select ${errors.specialization ? 'is-invalid' : ''}`}
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}>
                  <option value="">-- Select Specialization --</option>
                  {specializations.map((spec, index) => (
                    <option key={index} value={spec}>{spec}</option>
                  ))}
                </select>
                {errors.specialization && (
                  <div className="invalid-feedback">{errors.specialization}</div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 mt-2"
              disabled={loading || !isFormValid}>
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

          </form>

          <div className="text-center mt-4">
            <p className="text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-semibold">Sign in here</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;