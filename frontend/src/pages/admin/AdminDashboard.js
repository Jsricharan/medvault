import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { getAllAppointments } from '../../services/appointmentService';
import { getAdminStats } from '../../services/adminService';
import AllUsers from './AllUsers';
import AllAppointments from './AllAppointments';
import AllRecords from './AllRecords';
import SendNotification from './SendNotification';
import ProfileSettings from '../../components/ProfileSettings';
import useProfilePicture from '../../utils/useProfilePicture';

function AdminDashboard() {

  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState({});
  const [pendingCount, setPendingCount] = useState(0);
  const [unassignedCount, setUnassignedCount] = useState(0);
  const navigate = useNavigate();

  const fullName = localStorage.getItem('fullName');
  const email = localStorage.getItem('email');
  const profilePicture = useProfilePicture();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
      setPendingCount(data.pendingAppointments || 0);
      setUnassignedCount(
        data.unassignedAppointments || 0
      );
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Dashboard' },
    { id: 'users', icon: '👥', label: 'All Users' },
    {
      id: 'appointments',
      icon: '📅',
      label: 'Appointments',
      badge: pendingCount + unassignedCount
    },
    { id: 'records', icon: '🗂️', label: 'Medical Records' },
    { id: 'notifications', icon: '🔔',
      label: 'Send Notification' },
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
        background:
          'linear-gradient(135deg, #7f1d1d, #991b1b)',
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

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            background:
              'linear-gradient(135deg, #ef4444, #dc2626)',
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
          <span style={{
            background: 'rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.9)',
            padding: '2px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            ADMIN PORTAL
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('profile')}>
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(239,68,68,0.8)'
                }}
              />
            ) : (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, #ef4444, #dc2626)',
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
            <span style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {fullName}
            </span>
          </div>

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
              fontWeight: '500'
            }}>
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

          <div style={{
            padding: '0 16px 24px',
            borderBottom: '1px solid #f0f0f0',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #ef4444',
                  marginBottom: '10px'
                }}
              />
            ) : (
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, #ef4444, #dc2626)',
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
            <p style={{
              fontWeight: '600',
              fontSize: '14px',
              color: '#1e293b',
              margin: '0 0 2px'
            }}>
              {fullName}
            </p>
            <span style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '2px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              ADMIN
            </span>
          </div>

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
                background: activeTab === item.id
                  ? 'linear-gradient(135deg, #fee2e2, #fecaca)'
                  : 'transparent',
                borderLeft: activeTab === item.id
                  ? '3px solid #ef4444'
                  : '3px solid transparent',
                transition: 'all 0.2s',
                margin: '2px 0'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = '#fff5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background =
                    'transparent';
                }
              }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '18px' }}>
                  {item.icon}
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: activeTab === item.id
                    ? '600' : '500',
                  color: activeTab === item.id
                    ? '#dc2626' : '#64748b'
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

        {/* Main Content */}
        <div style={{
          flex: 1,
          padding: '28px',
          overflowY: 'auto'
        }}>
          {activeTab === 'home' && (
            <AdminHomeTab
              stats={stats}
              setActiveTab={setActiveTab}
              fullName={fullName}
            />
          )}
          {activeTab === 'users' && <AllUsers />}
          {activeTab === 'appointments' && (
            <AllAppointments
              onStatusChange={loadStats}
            />
          )}
          {activeTab === 'records' && <AllRecords />}
          {activeTab === 'notifications' && (
            <SendNotification />
          )}
          {activeTab === 'profile' && (
            <ProfileSettings accentColor="danger" />
          )}
        </div>
      </div>
    </div>
  );
}

// Admin Home Tab with Stats
function AdminHomeTab({ stats, setActiveTab, fullName }) {

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers || 0,
      icon: '👥',
      color: '#6366f1',
      bg: '#ede9fe',
      tab: 'users'
    },
    {
      label: 'Total Doctors',
      value: stats.totalDoctors || 0,
      icon: '👨‍⚕️',
      color: '#10b981',
      bg: '#d1fae5',
      tab: 'users'
    },
    {
      label: 'Total Patients',
      value: stats.totalPatients || 0,
      icon: '🤒',
      color: '#0ea5e9',
      bg: '#e0f2fe',
      tab: 'users'
    },
    {
      label: 'Total Appointments',
      value: stats.totalAppointments || 0,
      icon: '📅',
      color: '#f59e0b',
      bg: '#fef3c7',
      tab: 'appointments'
    },
    {
      label: 'Pending Appointments',
      value: stats.pendingAppointments || 0,
      icon: '⏳',
      color: '#f97316',
      bg: '#fff7ed',
      tab: 'appointments'
    },
    {
      label: 'Unassigned Requests',
      value: stats.unassignedAppointments || 0,
      icon: '⚠️',
      color: '#ef4444',
      bg: '#fee2e2',
      tab: 'appointments'
    },
  ];

  return (
    <div>

      {/* Welcome Banner */}
      <div style={{
        background:
          'linear-gradient(135deg, #7f1d1d, #991b1b, #b91c1c)',
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
          background: 'rgba(239, 68, 68, 0.2)',
          filter: 'blur(30px)'
        }}/>
        <h2 style={{
          color: 'white',
          fontSize: '26px',
          fontWeight: '700',
          margin: '0 0 8px'
        }}>
          Welcome back, {fullName?.split(' ')[0]}! 👑
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          margin: '0 0 20px',
          fontSize: '15px'
        }}>
          Here's what's happening in MedVault today.
        </p>
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={() => setActiveTab('appointments')}
            style={{
              background:
                'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow:
                '0 4px 15px rgba(239, 68, 68, 0.4)'
            }}>
            View Appointments
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '10px',
              color: 'white',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
            Manage Users
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <h5 style={{
        color: '#1e293b',
        fontWeight: '700',
        marginBottom: '16px',
        fontSize: '16px'
      }}>
        System Overview
      </h5>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {statCards.map((card, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(card.tab)}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              border: '1px solid #f1f5f9',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                'translateY(-4px)';
              e.currentTarget.style.boxShadow =
                '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 2px 10px rgba(0,0,0,0.05)';
            }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: card.bg,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0
            }}>
              {card.icon}
            </div>
            <div>
              <p style={{
                fontSize: '28px',
                fontWeight: '800',
                color: card.color,
                margin: '0 0 2px',
                lineHeight: 1
              }}>
                {card.value}
              </p>
              <p style={{
                fontSize: '13px',
                color: '#64748b',
                margin: 0,
                fontWeight: '500'
              }}>
                {card.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h5 style={{
        color: '#1e293b',
        fontWeight: '700',
        marginBottom: '16px',
        fontSize: '16px'
      }}>
        Quick Actions
      </h5>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px'
      }}>
        {[
          {
            icon: '👥',
            label: 'Manage Users',
            desc: 'Edit user details',
            tab: 'users',
            color: '#6366f1',
            bg: '#ede9fe'
          },
          {
            icon: '📅',
            label: 'Appointments',
            desc: 'Review requests',
            tab: 'appointments',
            color: '#f59e0b',
            bg: '#fef3c7'
          },
          {
            icon: '🗂️',
            label: 'Medical Records',
            desc: 'View all records',
            tab: 'records',
            color: '#0ea5e9',
            bg: '#e0f2fe'
          },
          {
            icon: '🔔',
            label: 'Notifications',
            desc: 'Send alerts',
            tab: 'notifications',
            color: '#ef4444',
            bg: '#fee2e2'
          },
        ].map((action, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(action.tab)}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              border: '1px solid #f1f5f9',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                'translateY(-4px)';
              e.currentTarget.style.boxShadow =
                '0 8px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 2px 10px rgba(0,0,0,0.05)';
            }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: action.bg,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              marginBottom: '12px'
            }}>
              {action.icon}
            </div>
            <p style={{
              fontWeight: '600',
              fontSize: '14px',
              color: '#1e293b',
              margin: '0 0 4px'
            }}>
              {action.label}
            </p>
            <p style={{
              fontSize: '12px',
              color: '#94a3b8',
              margin: 0
            }}>
              {action.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;