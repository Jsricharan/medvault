# 🏥 MedVault — Frontend

![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?style=for-the-badge&logo=bootstrap)
![Axios](https://img.shields.io/badge/Axios-HTTP-green?style=for-the-badge)

> React frontend for MedVault Healthcare Management System

---

## 🔗 Backend Repository
[MedVault Backend](https://github.com/Jsricharan/medvault-backend)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

---

## 📁 Project Structure

---

## 🌐 Pages Overview

| Page | Route | Access |
|------|-------|--------|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Forgot Password | `/forgot-password` | Public |
| Patient Dashboard | `/patient/dashboard` | Patient |
| Doctor Dashboard | `/doctor/dashboard` | Doctor |
| Admin Dashboard | `/admin/dashboard` | Admin |

---

## 📸 Screenshots

### 🔐 Login & Authentication
| Login | Register |
|-------|----------|
| [![Login](screenshots/login.png)](screenshots/login.png) | [![Register](screenshots/register.png)](screenshots/register.png) |

### 🤒 Patient Portal
| Dashboard | Book Appointment | My Records |
|-----------|-----------------|------------|
| [![Dashboard](screenshots/patient-dashboard.png)](screenshots/patient-dashboard.png) | [![Book](screenshots/book-appointment.png)](screenshots/book-appointment.png) | [![Records](screenshots/my-records.png)](screenshots/my-records.png) |

### 👨‍⚕️ Doctor Portal
| Dashboard | Appointments | Create Record |
|-----------|-------------|---------------|
| [![Doctor](screenshots/doctor-dashboard.png)](screenshots/doctor-dashboard.png) | [![Appts](screenshots/doctor-appointments.png)](screenshots/doctor-appointments.png) | [![Create](screenshots/create-record.png)](screenshots/create-record.png) |

### 👑 Admin Panel
| Dashboard | Users | Appointments |
|-----------|-------|--------------|
| [![Admin](screenshots/admin-dashboard.png)](screenshots/admin-dashboard.png) | [![Users](screenshots/admin-users.png)](screenshots/admin-users.png) | [![Appts](screenshots/admin-appointments.png)](screenshots/admin-appointments.png) |

---

## ⚙️ Environment

Backend URL configured in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080';
```

---

## 📄 License

MIT License