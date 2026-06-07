import React, { useState, useEffect, useRef } from 'react';
import {
  getProfile,
  updatePhone,
  updatePassword,
  updateProfilePicture,
  saveProfilePicToStorage,
  getProfilePicFromStorage
} from '../services/profileService';

import { updateHospitalInfo } from '../services/profileService';

function ProfileSettings({ accentColor = 'primary' }) {

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Phone update state
  const [phoneForm, setPhoneForm] = useState({
    countryCode: '+91',
    phone: ''
  });
  const [phoneMessage, setPhoneMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Password update state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // Profile picture state
  const [picMessage, setPicMessage] = useState('');
  const [picError, setPicError] = useState('');
  const [previewPic, setPreviewPic] = useState(null);
  const fileInputRef = useRef(null);
  const [hospitalForm, setHospitalForm] = useState({
    hospitalName: '',
    hospitalAddress: '',
    hospitalCity: '',
    experience: ''
  });
  const [hospitalMessage, setHospitalMessage] = useState('');
  const [hospitalError, setHospitalError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);

      if (data.profilePicture) {
        saveProfilePicToStorage(data.profilePicture);
        setPreviewPic(data.profilePicture);
      } else {
        saveProfilePicToStorage(null);
        setPreviewPic(null);
      }

      if (data.hospitalName) {
        setHospitalForm({
          hospitalName: data.hospitalName || '',
          hospitalAddress: data.hospitalAddress || '',
          hospitalCity: data.hospitalCity || '',
          experience: data.experience || ''
        });
      }

      if (data.phone) {
        setPhoneForm({
          countryCode: '+91',
          phone: data.phone
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // PHONE UPDATE
  // ========================
  const handlePhoneUpdate = async (e) => {
    e.preventDefault();
    setPhoneMessage('');
    setPhoneError('');

    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(phoneForm.phone)) {
      setPhoneError(
        'Enter valid phone number (7-15 digits, no spaces)!'
      );
      return;
    }

    const newFullPhone = `${phoneForm.countryCode}${phoneForm.phone}`;
    const currentPhone = profile?.phone || '';
    const phoneWithoutCode = currentPhone.replace(
      phoneForm.countryCode, ''
    );

    if (
      newFullPhone === currentPhone ||
      phoneForm.phone === currentPhone ||
      phoneForm.phone === phoneWithoutCode
    ) {
      setPhoneError(
        `❌ New number cannot be same as old number! ` +
        `Current: ${currentPhone} → New: ${newFullPhone}`
      );
      return;
    }

    try {
      await updatePhone(newFullPhone);
      setPhoneMessage(
        `✅ Phone updated from ${currentPhone} to ${newFullPhone}!`
      );
      loadProfile();
      setTimeout(() => setPhoneMessage(''), 4000);
    } catch (err) {
      setPhoneError(
        err.response?.data?.message ||
        'Failed to update phone number!'
      );
    }
  };

  // ========================
  // PASSWORD UPDATE
  // ========================
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (!passwordForm.currentPassword) {
      setPasswordError('Current password is required!');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError(
        'New password must be at least 6 characters!'
      );
      return;
    }

    if (!/[A-Z]/.test(passwordForm.newPassword)) {
      setPasswordError(
        'New password must contain at least one uppercase letter!'
      );
      return;
    }

    if (!/[a-z]/.test(passwordForm.newPassword)) {
      setPasswordError(
        'New password must contain at least one lowercase letter!'
      );
      return;
    }

    if (!/[0-9]/.test(passwordForm.newPassword)) {
      setPasswordError(
        'New password must contain at least one number!'
      );
      return;
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
      passwordForm.newPassword)) {
      setPasswordError(
        'New password must contain at least one special character!'
      );
      return;
    }

    if (passwordForm.newPassword !==
        passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match!');
      return;
    }

    if (passwordForm.currentPassword ===
        passwordForm.newPassword) {
      setPasswordError(
        'New password must be different from current password!'
      );
      return;
    }

    try {
      await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      setPasswordMessage('Password updated successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message ||
        'Failed to update password!'
      );
    }
  };

  // ========================
  // PROFILE PICTURE
  // ========================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPicError('Please select an image file!');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPicError('Image size must be less than 10MB!');
      return;
    }

    setPicError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setPreviewPic(compressedBase64);
        setPicError('');

        const originalSize = (file.size / 1024).toFixed(1);
        const compressedSize = (
          (compressedBase64.length * 0.75) / 1024
        ).toFixed(1);
        console.log(
          `Original: ${originalSize}KB → Compressed: ${compressedSize}KB`
        );
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handlePictureUpdate = async () => {
    setPicMessage('');
    setPicError('');

    if (!previewPic) {
      setPicError('Please select an image first!');
      return;
    }

    try {
      await updateProfilePicture(previewPic);
      setPicMessage('Profile picture updated successfully!');
      saveProfilePicToStorage(previewPic);
      setProfile(prev => ({ ...prev, profilePicture: previewPic }));
      window.dispatchEvent(new Event('profilePictureUpdated'));
      setTimeout(() => setPicMessage(''), 3000);
    } catch (err) {
      setPicError('Failed to update profile picture!');
    }
  };

  const handleRemovePicture = async () => {
    try {
      await updateProfilePicture(null);
      saveProfilePicToStorage(null);
      setPreviewPic(null);
      setProfile(prev => ({ ...prev, profilePicture: null }));
      window.dispatchEvent(new Event('profilePictureUpdated'));
      setPicMessage('Profile picture removed!');
      setTimeout(() => setPicMessage(''), 3000);
    } catch (err) {
      setPicError('Failed to remove profile picture!');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className={`spinner-border text-${accentColor}`}></div>
        <p className="mt-2 text-muted">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="row g-4">

      {/* Left Column - Profile Picture + Info */}
      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-body text-center py-4">

            {/* Profile Picture */}
            <div className="position-relative d-inline-block mb-3">
              {previewPic ? (
                <img
                  src={previewPic}
                  alt="Profile"
                  className="rounded-circle"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    border: `3px solid var(--bs-${accentColor})`
                  }}
                />
              ) : (
                <div
                  className={`rounded-circle bg-${accentColor}
                              d-flex align-items-center
                              justify-content-center`}
                  style={{ width: '100px', height: '100px' }}>
                  <span className="text-white fw-bold"
                        style={{ fontSize: '40px' }}>
                    {profile?.fullName?.charAt(0)}
                  </span>
                </div>
              )}

              {/* File upload info */}
              <div className="mt-2 mb-2">
                <small className="text-muted">
                  Supported: JPG, PNG, GIF, WebP
                </small>
                <br />
                <small className="text-muted">Max size: 10MB</small>
                <br />
                <small className="text-success">
                  ✓ Images are auto-compressed for best quality
                </small>
              </div>

              {/* Camera Icon Overlay */}
              <button
                className="btn btn-sm btn-dark rounded-circle
                           position-absolute bottom-0 end-0"
                style={{ width: '30px', height: '30px', padding: '0' }}
                onClick={() => fileInputRef.current.click()}>
                📷
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange}
            />

            {/* User Info */}
            <h5 className="fw-bold mb-1">{profile?.fullName}</h5>
            <p className="text-muted small mb-1">{profile?.email}</p>
            <p className="text-muted small mb-1">📞 {profile?.phone}</p>

            {profile?.gender && (
              <p className="text-muted small mb-1">
                👤 {profile?.gender}
              </p>
            )}
            {profile?.age && (
              <p className="text-muted small mb-1">
                🎂 Age: {profile?.age} years
              </p>
            )}
            {profile?.bloodGroup && (
              <p className="text-muted small mb-1">
                🩸 Blood Group: {profile?.bloodGroup}
              </p>
            )}
            {profile?.specialization && (
              <p className="text-success small mb-2">
                🏥 {profile?.specialization}
              </p>
            )}

            <span className={`badge bg-${accentColor}`}>
              {profile?.role}
            </span>

            <p className="text-muted small mt-2 mb-0">
              Member since:{' '}
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : 'N/A'}
            </p>

            {/* Picture Action Buttons */}
            <div className="mt-3 d-flex gap-2 justify-content-center">
              <button
                className={`btn btn-sm btn-${accentColor}`}
                onClick={() => fileInputRef.current.click()}>
                📷 Change Photo
              </button>
              {previewPic && (
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleRemovePicture}>
                  🗑️ Remove
                </button>
              )}
            </div>

            {picMessage && (
              <div className="alert alert-success mt-2 py-1 small">
                {picMessage}
              </div>
            )}
            {picError && (
              <div className="alert alert-danger mt-2 py-1 small">
                {picError}
              </div>
            )}

            {previewPic && previewPic !== profile?.profilePicture && (
              <button
                className="btn btn-success btn-sm w-100 mt-2"
                onClick={handlePictureUpdate}>
                💾 Save Photo
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Right Column - Update Forms */}
      <div className="col-md-8">

        {/* Update Phone Number */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <h6 className="mb-0 fw-bold">📞 Update Phone Number</h6>
          </div>
          <div className="card-body p-4">

            {phoneMessage && (
              <div className="alert alert-success py-2">
                {phoneMessage}
              </div>
            )}
            {phoneError && (
              <div className="alert alert-danger py-2">
                {phoneError}
              </div>
            )}

            <form onSubmit={handlePhoneUpdate}>

              {/* Current Phone Display */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Current Phone Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={profile?.phone || 'Not set'}
                  disabled
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </div>

              {/* New Phone Number */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  New Phone Number
                </label>
                <div className="input-group">
                  <select
                    className="form-select"
                    style={{ maxWidth: '120px' }}
                    value={phoneForm.countryCode}
                    onChange={(e) => setPhoneForm({
                      ...phoneForm,
                      countryCode: e.target.value
                    })}>
                    <option value="+91">+91 India</option>
                    <option value="+1">+1 USA</option>
                    <option value="+44">+44 UK</option>
                    <option value="+61">+61 Australia</option>
                    <option value="+971">+971 UAE</option>
                    <option value="+65">+65 Singapore</option>
                    <option value="+60">+60 Malaysia</option>
                    <option value="+49">+49 Germany</option>
                    <option value="+33">+33 France</option>
                    <option value="+86">+86 China</option>
                  </select>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter new number"
                    value={phoneForm.phone}
                    onChange={(e) => {
                      // Only digits
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setPhoneForm({ ...phoneForm, phone: val });
                    }}
                  />
                </div>
              </div>

              {/* Comparison Preview */}
              {phoneForm.phone && (
                <div className="alert alert-light border mb-3 py-2">
                  <small className="d-block text-muted mb-1">
                    Preview:
                  </small>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-secondary">
                      Old: {profile?.phone || 'Not set'}
                    </span>
                    <span>→</span>
                    <span className={`badge ${
                      phoneForm.phone === (profile?.phone || '')
                        .replace(phoneForm.countryCode, '')
                        ? 'bg-danger'
                        : 'bg-success'
                    }`}>
                      New: {phoneForm.countryCode}{phoneForm.phone}
                    </span>
                  </div>
                  {phoneForm.phone === (profile?.phone || '')
                    .replace(phoneForm.countryCode, '') && (
                    <small className="text-danger mt-1 d-block">
                      ✗ Same as current number!
                    </small>
                  )}
                </div>
              )}

              <button
                type="submit"
                className={`btn btn-${accentColor} w-100`}>
                📞 Update Phone Number
              </button>
            </form>
          </div>
        </div>

        {/* Update Password */}
        <div className="card shadow-sm">
          <div className="card-header bg-white py-3 d-flex
                          justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">🔒 Update Password</h6>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowPasswords(!showPasswords)}>
              {showPasswords ? '🙈 Hide' : '👁️ Show'}
            </button>
          </div>
          <div className="card-body p-4">

            {passwordMessage && (
              <div className="alert alert-success py-2">
                {passwordMessage}
              </div>
            )}
            {passwordError && (
              <div className="alert alert-danger py-2">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordUpdate}>

              {/* Current Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Current Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value
                  })}
                  required
                />
              </div>

              {/* New Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  New Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value
                  })}
                  required
                />

                {/* Password strength indicators */}
                {passwordForm.newPassword && (
                  <div className="mt-1 p-2 bg-light rounded">
                    <small className={`d-block ${
                      passwordForm.newPassword.length >= 6
                        ? 'text-success' : 'text-danger'
                    }`}>
                      {passwordForm.newPassword.length >= 6
                        ? '✓' : '✗'} Min 6 characters
                    </small>
                    <small className={`d-block ${
                      /[A-Z]/.test(passwordForm.newPassword)
                        ? 'text-success' : 'text-danger'
                    }`}>
                      {/[A-Z]/.test(passwordForm.newPassword)
                        ? '✓' : '✗'} Uppercase letter
                    </small>
                    <small className={`d-block ${
                      /[a-z]/.test(passwordForm.newPassword)
                        ? 'text-success' : 'text-danger'
                    }`}>
                      {/[a-z]/.test(passwordForm.newPassword)
                        ? '✓' : '✗'} Lowercase letter
                    </small>
                    <small className={`d-block ${
                      /[0-9]/.test(passwordForm.newPassword)
                        ? 'text-success' : 'text-danger'
                    }`}>
                      {/[0-9]/.test(passwordForm.newPassword)
                        ? '✓' : '✗'} Number
                    </small>
                    <small className={`d-block ${
                      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
                        .test(passwordForm.newPassword)
                        ? 'text-success' : 'text-danger'
                    }`}>
                      {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
                        .test(passwordForm.newPassword)
                        ? '✓' : '✗'} Special character
                    </small>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Confirm New Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmNewPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    confirmNewPassword: e.target.value
                  })}
                  required
                />
                {passwordForm.confirmNewPassword && (
                  <small className={
                    passwordForm.newPassword ===
                    passwordForm.confirmNewPassword
                      ? 'text-success' : 'text-danger'
                  }>
                    {passwordForm.newPassword ===
                     passwordForm.confirmNewPassword
                      ? '✓ Passwords match'
                      : '✗ Passwords do not match'}
                  </small>
                )}
              </div>

              {/* Hospital Info - Only for Doctors */}
              {profile?.role === 'DOCTOR' && (
                <div className="card shadow-sm mt-4">
                  <div className="card-header bg-white py-3">
                    <h6 className="mb-0 fw-bold">
                      🏥 Hospital Information
                    </h6>
                  </div>
                  <div className="card-body p-4">

                    {hospitalMessage && (
                      <div className="alert alert-success py-2">
                        {hospitalMessage}
                      </div>
                    )}
                    {hospitalError && (
                      <div className="alert alert-danger py-2">
                        {hospitalError}
                      </div>
                    )}

                    <div className="row g-3">

                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">
                          Hospital Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Apollo Hospital"
                          value={hospitalForm.hospitalName}
                          onChange={(e) => setHospitalForm({
                            ...hospitalForm,
                            hospitalName: e.target.value
                          })}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">
                          Hospital City
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Mumbai"
                          value={hospitalForm.hospitalCity}
                          onChange={(e) => setHospitalForm({
                            ...hospitalForm,
                            hospitalCity: e.target.value
                          })}
                        />
                      </div>

                      <div className="col-md-12">
                        <label className="form-label fw-semibold small">
                          Hospital Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. 123 Main Street, Mumbai"
                          value={hospitalForm.hospitalAddress}
                          onChange={(e) => setHospitalForm({
                            ...hospitalForm,
                            hospitalAddress: e.target.value
                          })}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">
                          Years of Experience
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. 10 years"
                          value={hospitalForm.experience}
                          onChange={(e) => setHospitalForm({
                            ...hospitalForm,
                            experience: e.target.value
                          })}
                        />
                      </div>

                      <div className="col-12">
                        <button
                          className={`btn btn-${accentColor} w-100`}
                          onClick={async () => {
                            try {
                              await updateHospitalInfo(hospitalForm);
                              setHospitalMessage(
                                'Hospital info updated successfully!'
                              );
                              setTimeout(() =>
                                setHospitalMessage(''), 3000
                              );
                            } catch (err) {
                              setHospitalError(
                                'Failed to update hospital info!'
                              );
                              setTimeout(() =>
                                setHospitalError(''), 3000
                              );
                            }
                          }}>
                          🏥 Update Hospital Info
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-danger w-100 mt-3">
                🔒 Update Password
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProfileSettings;