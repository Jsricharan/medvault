import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { getUnreadCount } from '../../services/notificationService';
import {
  getProfile,
  toggleAvailability
} from '../../services/profileService';
import DoctorAppointments from './DoctorAppointments';
import CreateMedicalRecord from './CreateMedicalRecord';
import DoctorNotifications from './DoctorNotifications';
import ProfileSettings from '../../components/ProfileSettings';
import useProfilePicture from '../../utils/useProfilePicture';

// --- HELPER DATA & FUNCTIONS ADDED TO PREVENT RUNTIME CRASHES ---
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const quickActions = [
  { label: 'Appointments', desc: 'Manage your schedule', icon: '📅', tab: 'appointments', bg: '#ede9fe' },
  { label: 'Create Record', desc: 'Write patient history', icon: '📋', tab: 'createRecord', bg: '#d1fae5' },
  { label: 'Notifications', desc: 'View unread alerts', icon: '🔔', tab: 'notifications', bg: '#fef3c7' },
  { label: 'Settings', desc: 'Update profile details', icon: '⚙️', tab: 'profile', bg: '#e0f2fe' }
];

function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName');
  const email = localStorage.getItem('email');
  const profilePicture = useProfilePicture();

  useEffect(() => {
    loadUnreadCount();
    loadAvailability();
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const loadAvailability = async () => {
    try {
      const profile = await getProfile();

      // Use 'available' field - default true
      // Only false if explicitly set
      const isAvail =
        profile.available !== false &&
        profile.available !== 0;

      setIsAvailable(isAvail);

      // Save to localStorage
      const email = localStorage.getItem('email');
      localStorage.setItem(
        `availability_${email}`,
        String(isAvail)
      );

      console.log(
        'Availability loaded:',
        isAvail,
        'Profile available field:',
        profile.available
      );
    } catch (err) {
      console.error('Availability error:', err);
      // Default to available if error
      setIsAvailable(true);
    }
  };

  const handleToggleAvailability = async () => {
    setAvailabilityLoading(true);
    try {
      const response = await toggleAvailability();
      const newVal = response.available;
      setIsAvailable(newVal);

      // Save to localStorage
      const email = localStorage.getItem('email');
      localStorage.setItem(
        `availability_${email}`,
        String(newVal)
      );

      setAvailabilityMessage(response.message);
      setTimeout(() =>
        setAvailabilityMessage(''), 3000
      );
    } catch (err) {
      console.error('Toggle error:', err);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'appointments', icon: '📅', label: 'Appointments' },
    { id: 'createRecord', icon: '📋', label: 'Create Record' },
    { id: 'notifications', icon: '🔔', label: 'Notifications', badge: unreadCount },
    { id: 'profile', icon: '⚙️', label: 'Profile Settings' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f4f8',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      {/* Navbar */}
      <nav style={{
        background: 'linear-gradient(135deg, #064e3b, #065f46)',
        padding: '0 32px',
        height: '65px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>🏥</div>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '20px', letterSpacing: '1px' }}>MEDVAULT</span>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>DOCTOR PORTAL</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Availability Toggle Button */}
          <button
            onClick={handleToggleAvailability}
            disabled={availabilityLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: availabilityLoading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              transition: 'all 0.3s',
              background: isAvailable ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: isAvailable ? '#6ee7b7' : '#fca5a5',
              border: isAvailable ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(239,68,68,0.4)'
            }}>
            <div style={{
              width: '36px',
              height: '20px',
              borderRadius: '10px',
              background: isAvailable ? '#10b981' : '#ef4444',
              position: 'relative',
              transition: 'background 0.3s'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '2px',
                left: isAvailable ? '18px' : '2px',
                transition: 'left 0.3s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}/>
            </div>
            {availabilityLoading ? <span>Updating...</span> : isAvailable ? <span>🟢 Available</span> : <span>🔴 Unavailable</span>}
          </button>

          {/* Bell */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setActiveTab('notifications')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700'
              }}>{unreadCount}</span>
            )}
          </div>

          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: isAvailable ? '2px solid rgba(16,185,129,0.8)' : '2px solid rgba(239,68,68,0.8)' }} />
            ) : (
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isAvailable ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px' }}>
                {fullName?.charAt(0)}
              </div>
            )}
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500' }}>{fullName}</span>
          </div>

          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', padding: '7px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
            LOG OUT
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <div style={{
          width: '240px',
          minHeight: 'calc(100vh - 65px)',
          background: 'white',
          boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
          padding: '24px 0',
          position: 'sticky',
          top: '65px',
          height: 'calc(100vh - 65px)',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '0 16px 20px', borderBottom: '1px solid #f0f0f0', marginBottom: '8px', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: isAvailable ? '3px solid #10b981' : '3px solid #ef4444' }} />
              ) : (
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isAvailable ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '24px' }}>
                  {fullName?.charAt(0)}
                </div>
              )}
              <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '14px', height: '14px', borderRadius: '50%', background: isAvailable ? '#10b981' : '#ef4444', border: '2px solid white' }}/>
            </div>

            <p style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b', margin: '0 0 4px' }}>{fullName}</p>
            <span style={{ background: isAvailable ? '#d1fae5' : '#fee2e2', color: isAvailable ? '#059669' : '#dc2626', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'inline-block', marginBottom: '8px' }}>
              {isAvailable ? '🟢 Available' : '🔴 Unavailable'}
            </span>
            <br/>
            <span style={{ background: '#d1fae5', color: '#059669', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>DOCTOR</span>
          </div>

          {availabilityMessage && (
            <div style={{ margin: '0 12px 8px', padding: '8px 12px', borderRadius: '8px', background: isAvailable ? '#d1fae5' : '#fee2e2', color: isAvailable ? '#059669' : '#dc2626', fontSize: '12px', fontWeight: '500', textAlign: 'center' }}>
              {availabilityMessage}
            </div>
          )}

          {menuItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', cursor: 'pointer',
                background: activeTab === item.id ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : 'transparent',
                borderLeft: activeTab === item.id ? '3px solid #10b981' : '3px solid transparent',
                transition: 'all 0.2s', margin: '2px 0'
              }}
              onMouseEnter={(e) => { if (activeTab !== item.id) e.currentTarget.style.background = '#f0fdf4'; }}
              onMouseLeave={(e) => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: activeTab === item.id ? '600' : '500', color: activeTab === item.id ? '#059669' : '#64748b' }}>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span style={{ background: '#ef4444', color: 'white', borderRadius: '20px', padding: '1px 8px', fontSize: '11px', fontWeight: '700' }}>{item.badge}</span>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {/* Unavailable Banner */}
          {!isAvailable && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>🔴</span>
                <div>
                  <p style={{ fontWeight: '700', color: '#dc2626', margin: '0 0 2px', fontSize: '14px' }}>You are currently unavailable</p>
                  <p style={{ color: '#ef4444', margin: 0, fontSize: '13px' }}>Patients cannot book appointments with you. Toggle to Available when ready.</p>
                </div>
              </div>
              <button onClick={handleToggleAvailability} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '8px', color: 'white', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Go Available
              </button>
            </div>
          )}

          {activeTab === 'home' && (
            <DoctorHomeTab
              fullName={fullName}
              setActiveTab={setActiveTab}
              isAvailable={isAvailable}
              onToggle={handleToggleAvailability}
              availabilityLoading={availabilityLoading}
            />
          )}
          {activeTab === 'appointments' && <DoctorAppointments />}
          {activeTab === 'createRecord' && <CreateMedicalRecord />}
          {activeTab === 'notifications' && <DoctorNotifications onRead={loadUnreadCount} />}
          {activeTab === 'profile' && <ProfileSettings accentColor="success" />}
        </div>
      </div>
    </div>
  );
}

// Doctor Home Tab Component
function DoctorHomeTab({ fullName, setActiveTab, isAvailable, onToggle, availabilityLoading }) {
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { getDoctorAppointments } = await import('../../services/appointmentService');
      const data = await getDoctorAppointments();
      if (Array.isArray(data)) {
        setStats({
          total: data.length,
          pending: data.filter(a => a.status === 'PENDING').length,
          confirmed: data.filter(a => a.status === 'CONFIRMED').length,
          completed: data.filter(a => a.status === 'COMPLETED').length
        });
      }
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: isAvailable ? 'linear-gradient(135deg, #064e3b, #065f46, #047857)' : 'linear-gradient(135deg, #7f1d1d, #991b1b, #b91c1c)',
        borderRadius: '20px', padding: '32px', marginBottom: '28px', position: 'relative', overflow: 'hidden', transition: 'background 0.5s'
      }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: isAvailable ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', filter: 'blur(30px)' }}/>
        <h2 style={{ color: 'white', fontSize: '26px', fontWeight: '700', margin: '0 0 8px' }}>
          {getGreeting()}, Dr. {fullName?.split(' ')[0]}! 👋
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 20px', fontSize: '15px' }}>
          {isAvailable ? 'You are available for appointments today.' : 'You are currently unavailable for appointments.'}
        </p>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => setActiveTab('appointments')} style={{ background: isAvailable ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', borderRadius: '10px', color: 'white', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: isAvailable ? '0 4px 15px rgba(16, 185, 129, 0.4)' : '0 4px 15px rgba(239, 68, 68, 0.4)' }}>
            View Appointments
          </button>

          <button onClick={onToggle} disabled={availabilityLoading} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', color: 'white', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: availabilityLoading ? 'not-allowed' : 'pointer', transition: 'all 0.3s' }}>
            <div style={{ width: '40px', height: '22px', borderRadius: '11px', background: isAvailable ? '#10b981' : '#6b7280', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: isAvailable ? '20px' : '2px', transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}/>
            </div>
            {availabilityLoading ? 'Updating...' : isAvailable ? '🟢 Set Unavailable' : '🔴 Set Available'}
          </button>
        </div>
      </div>

      {/* FIXED: Availability Status Card (Properly Closed) */}
      <div style={{
        background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        border: `2px solid ${isAvailable ? '#a7f3d0' : '#fecaca'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: isAvailable ? '#d1fae5' : '#fee2e2', display: 'flex', alignItems: 'center', justifyBox: 'center', justifyContent: 'center', fontSize: '24px' }}>
            {isAvailable ? '🟢' : '🔴'}
          </div>
          <div>
            <p style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 4px', fontSize: '15px' }}>
              Appointment Status: <span style={{ color: isAvailable ? '#059669' : '#dc2626' }}>{isAvailable ? 'Available' : 'Unavailable'}</span>
            </p>
            <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>
              {isAvailable ? 'Patients can book appointments with you' : 'Patients cannot book appointments with you'}
            </p>
          </div>
        </div>

        <button onClick={onToggle} disabled={availabilityLoading} style={{ padding: '10px 24px', border: 'none', borderRadius: '10px', background: isAvailable ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontSize: '14px', fontWeight: '600', cursor: availabilityLoading ? 'not-allowed' : 'pointer', boxShadow: isAvailable ? '0 4px 12px rgba(239,68,68,0.3)' : '0 4px 12px rgba(16,185,129,0.3)', whiteSpace: 'nowrap' }}>
          {availabilityLoading ? 'Updating...' : isAvailable ? '🔴 Go Unavailable' : '🟢 Go Available'}
        </button>
      </div>

      {/* Stats Cards Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Appointments', value: stats.total, icon: '📅', color: '#6366f1', bg: '#ede9fe' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: '#f59e0b', bg: '#fef3c7' },
          { label: 'Confirmed', value: stats.confirmed, icon: '✅', color: '#10b981', bg: '#d1fae5' },
          { label: 'Completed', value: stats.completed, icon: '✔️', color: '#0ea5e9', bg: '#e0f2fe' }
        ].map((stat, i) => (
          <div
            key={i}
            onClick={() => setActiveTab('appointments')}
            style={{
              background: 'white', borderRadius: '16px', padding: '20px', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '14px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '26px', fontWeight: '800', color: stat.color, margin: 0, lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0', fontWeight: '500' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h5 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '16px', fontSize: '16px' }}>Quick Actions</h5>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {quickActions.map((action, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(action.tab)}
            style={{ background: 'white', borderRadius: '16px', padding: '20px', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}>
            <div style={{ width: '44px', height: '44px', background: action.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' }}>
              {action.icon}
            </div>
            <p style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b', margin: '0 0 4px' }}>{action.label}</p>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{action.desc}</p>
          </div>
        ))}
      </div>

      {/* Clinical Reminders */}
      <h5 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '16px', fontSize: '16px' }}>Clinical Reminders</h5>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { icon: '📝', title: 'Update Records', tip: 'Keep patient medical records up to date after every consultation.', bg: '#ede9fe' },
          { icon: '⏰', title: 'Timely Response', tip: 'Confirm or reschedule appointments promptly to help patients plan.', bg: '#d1fae5' },
          { icon: '💊', title: 'Clear Prescriptions', tip: 'Always add clear medicine schedules so patients understand their dosage.', bg: '#fef3c7' },
        ].map((tip, index) => (
          <div key={index} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            <div style={{ width: '44px', height: '44px', background: tip.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' }}>
              {tip.icon}
            </div>
            <p style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b', margin: '0 0 6px' }}>{tip.title}</p>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>{tip.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorDashboard;