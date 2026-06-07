import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { getUnreadCount } from '../../services/notificationService';
import MyAppointments from './MyAppointments';
import BookAppointment from './BookAppointment';
import MyRecords from './MyRecords';
import MyNotifications from './MyNotifications';
import ProfileSettings from '../../components/ProfileSettings';
import DoctorsList from './DoctorsList';
import useProfilePicture from '../../utils/useProfilePicture';

// ==========================================
// CONSTANTS & UTILITY FUNCTIONS
// ==========================================
const ALL_HEALTH_TIPS = [
  {
    icon: '💧',
    title: 'Stay Hydrated',
    tip: 'Drink at least 8 glasses of water daily to maintain good health and flush toxins.',
    color: '#0ea5e9',
    bg: '#e0f2fe'
  },
  {
    icon: '🏃',
    title: 'Stay Active',
    tip: '30 minutes of exercise daily reduces risk of chronic diseases by up to 50%.',
    color: '#10b981',
    bg: '#d1fae5'
  },
  {
    icon: '😴',
    title: 'Sleep Well',
    tip: '7-9 hours of quality sleep is essential for physical and mental recovery.',
    color: '#8b5cf6',
    bg: '#ede9fe'
  },
  {
    icon: '🥗',
    title: 'Eat Balanced',
    tip: 'Include fruits, vegetables, proteins and whole grains in every meal.',
    color: '#22c55e',
    bg: '#dcfce7'
  },
  {
    icon: '🧘',
    title: 'Manage Stress',
    tip: 'Practice meditation or deep breathing for 10 minutes daily to reduce stress.',
    color: '#f59e0b',
    bg: '#fef3c7'
  },
  {
    icon: '🦷',
    title: 'Oral Hygiene',
    tip: 'Brush twice daily and floss once. Poor oral health links to heart disease.',
    color: '#06b6d4',
    bg: '#cffafe'
  },
  {
    icon: '☀️',
    title: 'Vitamin D',
    tip: '15-20 minutes of morning sunlight daily helps boost immunity and mood.',
    color: '#f97316',
    bg: '#fff7ed'
  },
  {
    icon: '🚭',
    title: 'Avoid Smoking',
    tip: 'Quitting smoking reduces heart disease risk by 50% within one year.',
    color: '#ef4444',
    bg: '#fee2e2'
  },
  {
    icon: '🫁',
    title: 'Deep Breathing',
    tip: 'Practice deep breathing 5 minutes daily to improve lung capacity and reduce anxiety.',
    color: '#3b82f6',
    bg: '#dbeafe'
  },
  {
    icon: '🧴',
    title: 'Skin Care',
    tip: 'Apply SPF 30+ sunscreen daily to prevent skin damage and reduce cancer risk.',
    color: '#ec4899',
    bg: '#fce7f3'
  },
  {
    icon: '🩺',
    title: 'Regular Checkups',
    tip: 'Annual health checkups catch problems early when they are most treatable.',
    color: '#6366f1',
    bg: '#ede9fe'
  },
  {
    icon: '🧠',
    title: 'Mental Health',
    tip: 'Talk to someone you trust about your feelings. Mental health is as important as physical.',
    color: '#8b5cf6',
    bg: '#ede9fe'
  },
  {
    icon: '🍎',
    title: 'Eat Less Sugar',
    tip: 'Reducing sugar intake lowers risk of diabetes, obesity and tooth decay.',
    color: '#dc2626',
    bg: '#fee2e2'
  },
  {
    icon: '🚶',
    title: 'Walk More',
    tip: '10,000 steps a day improves cardiovascular health and burns calories effectively.',
    color: '#059669',
    bg: '#d1fae5'
  },
  {
    icon: '💊',
    title: 'Take Medicines',
    tip: 'Always complete prescribed medication courses even if you feel better early.',
    color: '#0284c7',
    bg: '#e0f2fe'
  }
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================
function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fullName = localStorage.getItem('fullName');
  const email = localStorage.getItem('email');
  const profilePicture = useProfilePicture();

  useEffect(() => {
    loadUnreadCount();
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'doctors', icon: '👨‍⚕️', label: 'Doctors' },
    { id: 'book', icon: '➕', label: 'Book Appointment' },
    { id: 'appointments', icon: '📅', label: 'My Appointments' },
    { id: 'records', icon: '🗂️', label: 'Medical Records' },
    { id: 'notifications', icon: '🔔', label: 'Notifications', badge: unreadCount },
    { id: 'profile', icon: '⚙️', label: 'Profile Settings' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f4f8',
      fontFamily: "'Segoe UI', sans-serif"
    }}>

      {/* Top Navbar */}
      <nav style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
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

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🏥
          </div>
          <span style={{
            color: 'white',
            fontWeight: '700',
            fontSize: '20px',
            letterSpacing: '1px'
          }}>
            MEDVAULT
          </span>
        </div>

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          {/* Notification Bell */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setActiveTab('notifications')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700'
              }}>
                {unreadCount}
              </span>
            )}
          </div>

          {/* User Info Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(99,102,241,0.8)'
                }}
              />
            ) : (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '16px'
              }}>
                {fullName?.charAt(0)}
              </div>
            )}
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500' }}>
              {fullName}
            </span>
          </div>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white',
              padding: '7px 16px',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}>
            LOG OUT
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex' }}>

        {/* Navigation Sidebar */}
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

          {/* Sidebar Mini Profile Overview */}
          <div style={{ padding: '0 16px 24px', borderBottom: '1px solid #f0f0f0', marginBottom: '8px', textAlign: 'center' }}>
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #6366f1',
                  marginBottom: '10px'
                }}
              />
            ) : (
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '24px',
                margin: '0 auto 10px'
              }}>
                {fullName?.charAt(0)}
              </div>
            )}
            <p style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b', margin: '0 0 2px' }}>
              {fullName}
            </p>
            <span style={{
              background: '#ede9fe',
              color: '#6366f1',
              padding: '2px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              PATIENT
            </span>
          </div>

          {/* Interactive Navigation links */}
          {menuItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                cursor: 'pointer',
                background: activeTab === item.id ? 'linear-gradient(135deg, #ede9fe, #ddd6fe)' : 'transparent',
                borderLeft: activeTab === item.id ? '3px solid #6366f1' : '3px solid transparent',
                transition: 'all 0.2s',
                margin: '2px 0'
              }}
              onMouseEnter={(e) => { if (activeTab !== item.id) e.currentTarget.style.background = '#f8f7ff'; }}
              onMouseLeave={(e) => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: activeTab === item.id ? '600' : '500',
                  color: activeTab === item.id ? '#6366f1' : '#64748b'
                }}>
                  {item.label}
                </span>
              </div>
              {item.badge > 0 && (
                <span style={{
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '20px',
                  padding: '1px 8px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Rendering Router Container view */}
        <div style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {activeTab === 'home' && (
            <>
              <HomeTab fullName={fullName} setActiveTab={setActiveTab} unreadCount={unreadCount} />
              <HealthSummary />
            </>
          )}
          {activeTab === 'doctors' && <DoctorsList />}
          {activeTab === 'book' && <BookAppointment onBooked={() => setActiveTab('appointments')} />}
          {activeTab === 'appointments' && <MyAppointments />}
          {activeTab === 'records' && <MyRecords />}
          {activeTab === 'notifications' && <MyNotifications onRead={loadUnreadCount} />}
          {activeTab === 'profile' && <ProfileSettings accentColor="primary" />}
        </div>

      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================
function HomeTab({ fullName, setActiveTab, unreadCount }) {
  
  // Pick 3 random tips initially using lazy state initialization
  const [displayedTips, setDisplayedTips] = useState(() =>
    shuffleArray(ALL_HEALTH_TIPS).slice(0, 3)
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickStats = [
    { label: 'Book Appointment', icon: '📅', color: '#6366f1', bg: '#ede9fe', tab: 'book', desc: 'Schedule a new visit' },
    { label: 'My Records', icon: '🗂️', color: '#0ea5e9', bg: '#e0f2fe', tab: 'records', desc: 'View medical history' },
    { label: 'Find Doctors', icon: '👨‍⚕️', color: '#10b981', bg: '#d1fae5', tab: 'doctors', desc: 'Browse our doctors' },
    { label: 'Notifications', icon: '🔔', color: '#f59e0b', bg: '#fef3c7', tab: 'notifications', desc: unreadCount > 0 ? `${unreadCount} unread` : 'All caught up' },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.15)',
          filter: 'blur(30px)'
        }}/>
        <h2 style={{ color: 'white', fontSize: '26px', fontWeight: '700', margin: '0 0 8px' }}>
          {getGreeting()}, {fullName?.split(' ')[0]}! 👋
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 20px', fontSize: '15px' }}>
          Welcome to your health dashboard. How are you feeling today?
        </p>
        <button
          onClick={() => setActiveTab('book')}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
          + Book Appointment
        </button>
      </div>

      {/* Quick Access Cards */}
      <h5 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '16px', fontSize: '16px' }}>
        Quick Access
      </h5>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {quickStats.map((item, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(item.tab)}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              transition: 'all 0.2s',
              border: '1px solid #f1f5f9'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: item.bg,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              marginBottom: '12px'
            }}>
              {item.icon}
            </div>
            <p style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b', margin: '0 0 4px' }}>
              {item.label}
            </p>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Health Tips - Dynamic 3 from 15 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h5 style={{
          color: '#1e293b',
          fontWeight: '700',
          margin: 0,
          fontSize: '16px'
        }}>
          Health Tips
        </h5>
        <button
          onClick={() => {
            const shuffled = shuffleArray(ALL_HEALTH_TIPS).slice(0, 3);
            setDisplayedTips(shuffled);
          }}
          style={{
            background: '#ede9fe',
            border: 'none',
            borderRadius: '8px',
            color: '#6366f1',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
          🔄 Shuffle Tips
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px'
      }}>
        {displayedTips.map((tip, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              border: '1px solid #f1f5f9',
              transition: 'all 0.3s'
            }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: tip.bg,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              marginBottom: '12px'
            }}>
              {tip.icon}
            </div>
            <p style={{
              fontWeight: '600',
              fontSize: '14px',
              color: '#1e293b',
              margin: '0 0 6px'
            }}>
              {tip.title}
            </p>
            <p style={{
              fontSize: '13px',
              color: '#64748b',
              margin: 0,
              lineHeight: '1.5'
            }}>
              {tip.tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HealthSummary() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { getProfile } = await import('../../services/profileService');
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Profile error:', err);
      }
    };
    loadProfile();
  }, []);

  if (!profile) return null;

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '28px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      border: '1px solid #f1f5f9'
    }}>
      <h6 style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 16px', fontSize: '15px' }}>
        🏥 My Health Summary
      </h6>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { icon: '🩸', label: 'Blood Group', value: profile.bloodGroup || 'Not set', color: '#ef4444', bg: '#fee2e2' },
          { icon: '🎂', label: 'Age', value: profile.age ? `${profile.age} years` : 'Not set', color: '#6366f1', bg: '#ede9fe' },
          { icon: '👤', label: 'Gender', value: profile.gender || 'Not set', color: '#0ea5e9', bg: '#e0f2fe' },
          { icon: '📞', label: 'Phone', value: profile.phone || 'Not set', color: '#10b981', bg: '#d1fae5' }
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: item.bg,
              borderRadius: '12px',
              padding: '14px',
              textAlign: 'center'
            }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{item.icon}</div>
            <p style={{ fontWeight: '700', color: item.color, margin: '0 0 2px', fontSize: '14px' }}>
              {item.value}
            </p>
            <p style={{ color: '#64748b', margin: 0, fontSize: '11px', fontWeight: '500' }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientDashboard;