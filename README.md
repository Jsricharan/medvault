<div align="center">

# 🏥 MedVault
### Healthcare Management System

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.6-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Security-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A production-ready full-stack Healthcare Management Platform**
built with Java Spring Boot REST API and React, enabling seamless interactions
between Patients, Doctors, and Administrators.

[📋 Features](#-features) •
[🛠️ Tech Stack](#️-tech-stack) •
[🚀 Installation](#-installation-guide) •
[📡 API Docs](#-api-endpoints) •
[📸 Screenshots](#-screenshots)

</div>

---

## 📖 Table of Contents

- [Project Description](#-project-description)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Authentication Flow](#-authentication-flow)
- [Installation Guide](#-installation-guide)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Default Credentials](#-default-credentials)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 📌 Project Description

**MedVault** is a comprehensive, full-stack healthcare management system that digitizes
and streamlines hospital workflows. The platform supports three roles:

- 🤒 **Patients** — Register, book appointments, view prescriptions and medical records,
  receive real-time notifications, track appointment status
- 👨‍⚕️ **Doctors** — Manage appointment requests with preset rejection reasons, create
  detailed medical records with medicine schedules, toggle availability status
- 👑 **Administrators** — Full system control over users, appointments, doctor assignments,
  notifications, and statistics

> Built to demonstrate enterprise-grade software engineering with clean architecture,
> JWT security, RESTful APIs, real-time notifications, and a professional UI.

---

## ✨ Features

### 🔐 Authentication & Security

| Feature | Description |
|---------|-------------|
| JWT Authentication | Stateless token-based auth with 24-hour expiry |
| Role-Based Access Control | Three distinct roles — Patient, Doctor, Admin |
| BCrypt Password Hashing | Industry-standard password encryption |
| Frontend Route Guard | Prevents unauthorized dashboard access by role |
| OTP Password Reset | Secure 4-step forgot password flow via OTP |
| Real-Time Email Check | Instant email availability validation |
| Strong Password Rules | Uppercase, lowercase, number, special character enforced |
| Country Phone Validation | Country-specific phone number length rules |
| Account Status Control | Admin can activate or deactivate any account |

---

### 🤒 Patient Features

| Feature | Description |
|---------|-------------|
| Health Summary Card | Displays blood group, age, gender, phone at a glance |
| Dynamic Health Tips | 15 health tips with shuffle — shows 3 random at a time |
| Doctor Discovery | Browse all doctors with specialization, hospital, availability |
| Smart Doctor Cards | Shows hospital name, city, experience, availability status |
| 2-Step Appointment Booking | Step 1 select doctor → Step 2 fill details |
| Fixed Time Slots | Morning 9:30AM–1PM and Evening 2PM–10PM |
| Real-Time Date/Time Validation | Blocks past dates and times with 30-min buffer |
| Appointment Search & Filter | Search by doctor name, date or problem description |
| Appointment Cancellation | Cancel PENDING or UNASSIGNED appointments |
| Medical Records Viewer | View diagnoses, prescriptions, medicine schedules |
| Rejection Reason Notifications | See exact reason when doctor declines |
| Auto Notifications | Notified on every appointment status change |
| Profile Management | Update phone, password, profile picture |

---

### 👨‍⚕️ Doctor Features

| Feature | Description |
|---------|-------------|
| Availability Toggle | Self-manage availability with real-time patient-side sync |
| Stats Dashboard | Total, pending, confirmed, completed appointment counts |
| Appointment Request Cards | Visual cards with patient info and problem description |
| Smart Accept Flow | Confirm dialog before accepting appointments |
| Decline with Preset Reasons | 7 preset reasons + mandatory custom "Other" option |
| Reason Sent to Patient | Rejection reason delivered to patient automatically |
| Patient Medical History | Full history modal before consultation |
| Medical Record Creation | Diagnosis, prescription, medicine timings (10 options) |
| Medicine Schedule Timings | Before/After Breakfast, Lunch, Dinner, Night, etc. |
| Hospital Info Management | Update hospital name, city, address, experience |
| New Appointment Notification | Instantly notified when patient books |
| Newest Appointments First | Latest requests always shown at top |

---

### 👑 Admin Features

| Feature | Description |
|---------|-------------|
| System Statistics Dashboard | Real-time counts of users, doctors, appointments |
| Full User Management | Search, filter by role, edit all user details |
| Hospital Info Editing | Update doctor hospital information directly |
| User Activate / Deactivate | Enable or disable any user account instantly |
| Reset User Password | Directly reset passwords for any account |
| All Appointments with Filters | ALL / PENDING / CONFIRMED / COMPLETED / CANCELLED tabs |
| Assign Doctor to Appointment | Assign unassigned requests — notifies both parties |
| Custom Notifications | Send custom alerts to any user in the system |
| Newest Appointments First | All lists sorted by latest entry |

---

### 🔔 Smart Notification System

- ✅ Patient notified when appointment is confirmed
- ❌ Patient notified when appointment is cancelled with reason
- ✔️ Patient notified when appointment is completed
- 📅 Doctor notified when patient books an appointment
- ⚠️ Admin notified when patient books without selecting a doctor
- 👨‍⚕️ Doctor notified when admin assigns them to an appointment
- 🏥 Patient notified when admin assigns a doctor to their appointment

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 21 | Core Programming Language |
| Spring Boot | 4.0.6 | Application Framework |
| Spring Security | 7.0 | Authentication & Authorization |
| Spring Data JPA | 4.0 | ORM & Database Access Layer |
| Hibernate | 7.2 | JPA Implementation |
| MySQL | 8.0 | Relational Database |
| JJWT | 0.12.6 | JWT Token Generation & Validation |
| Lombok | Latest | Boilerplate Code Reduction |
| SpringDoc OpenAPI | 2.3.0 | Swagger UI & API Documentation |
| Maven | 3.x | Build & Dependency Management |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI Component Framework |
| React Router DOM | 6 | Client-Side Navigation & Route Guards |
| Axios | Latest | HTTP Client & API Interceptors |
| Bootstrap | 5 | CSS Framework |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                   React 18  (Port 3000)                         │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│   │ Patient  │  │  Doctor  │  │  Admin   │  │  Auth Pages  │  │
│   │    UI    │  │    UI    │  │    UI    │  │ Login/Reg    │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │  HTTP Requests + Authorization: Bearer JWT
┌────────────────────────▼────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│                 Spring Boot (Port 8080)                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │             Spring Security Filter Chain                 │   │
│   │   CorsFilter → JwtAuthFilter → AuthorizationFilter      │   │
│   └─────────────────────────────────────────────────────────┘   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                   REST Controllers                        │   │
│   │  AuthCtrl │ AppointmentCtrl │ RecordCtrl │ AdminCtrl     │   │
│   │  NotificationCtrl │ ProfileCtrl │ ForgotPasswordCtrl     │   │
│   └─────────────────────────────────────────────────────────┘   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    Service Layer                          │   │
│   │  AuthService │ AppointmentService │ RecordService        │   │
│   │  NotificationService                                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  Repository Layer (JPA)                   │   │
│   │  UserRepo │ AppointmentRepo │ RecordRepo │ NotifRepo     │   │
│   └─────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │  JPA / Hibernate ORM
┌────────────────────────▼────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│                   MySQL 8.0 (Port 3306)                         │
│          users  │  appointments  │  medical_records              │
│                       notifications                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
medvault/
│
├── 📁 backend/                              Spring Boot REST API
│   ├── 📁 src/main/java/com/medvault/
│   │   ├── 📁 controller/
│   │   │   ├── AuthController.java          Register, Login, Email Check
│   │   │   ├── AppointmentController.java   Book, View, Update Status
│   │   │   ├── MedicalRecordController.java CRUD Medical Records
│   │   │   ├── NotificationController.java  Send, Read, Count
│   │   │   ├── AdminController.java         Users, Stats, Assignments
│   │   │   ├── ProfileController.java       Profile, Phone, Password, Hospital
│   │   │   └── ForgotPasswordController.java OTP Password Reset
│   │   ├── 📁 service/
│   │   │   ├── AuthService.java
│   │   │   ├── AppointmentService.java      Auto-notifications on status change
│   │   │   ├── MedicalRecordService.java
│   │   │   └── NotificationService.java
│   │   ├── 📁 repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── AppointmentRepository.java
│   │   │   ├── MedicalRecordRepository.java
│   │   │   └── NotificationRepository.java
│   │   ├── 📁 entity/
│   │   │   ├── User.java                    enabled + available fields
│   │   │   ├── Appointment.java             Nullable doctor field
│   │   │   ├── MedicalRecord.java           Medicine schedule JSON
│   │   │   ├── Notification.java
│   │   │   └── Role.java                    PATIENT / DOCTOR / ADMIN
│   │   ├── 📁 dto/
│   │   │   ├── RegisterRequest.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── AppointmentRequestDTO.java
│   │   │   ├── AppointmentResponseDTO.java
│   │   │   ├── MedicalRecordRequestDTO.java
│   │   │   ├── MedicalRecordResponseDTO.java
│   │   │   ├── NotificationRequestDTO.java
│   │   │   ├── NotificationResponseDTO.java
│   │   │   ├── ProfileUpdateDTO.java
│   │   │   └── UserUpdateDTO.java
│   │   ├── 📁 security/
│   │   │   ├── JwtAuthFilter.java           JWT validation on every request
│   │   │   └── CustomUserDetailsService.java
│   │   ├── 📁 config/
│   │   │   ├── SecurityConfig.java          Route permissions
│   │   │   ├── CorsConfig.java
│   │   │   └── SwaggerConfig.java           API documentation setup
│   │   ├── 📁 exception/
│   │   │   └── GlobalExceptionHandler.java  Consistent error responses
│   │   └── 📁 util/
│   │       └── JwtUtil.java                 Token generation & validation
│   ├── 📁 src/main/resources/
│   │   └── application.properties           Config (not pushed to GitHub)
│   └── pom.xml
│
├── 📁 frontend/                             React Web Application
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Toast.js                     Global toast notifications
│   │   │   ├── ConfirmDialog.js             Reusable confirmation popup
│   │   │   ├── CountryCodePicker.js         40 countries with flags
│   │   │   └── ProfileSettings.js           Shared profile editor
│   │   ├── 📁 pages/
│   │   │   ├── Login.js                     Glassmorphism dark design
│   │   │   ├── Register.js                  Multi-field validated form
│   │   │   ├── ForgotPassword.js            4-step OTP reset flow
│   │   │   ├── 📁 patient/
│   │   │   │   ├── PatientDashboard.js      Home, tips, quick access
│   │   │   │   ├── BookAppointment.js       2-step doctor booking
│   │   │   │   ├── MyAppointments.js        Search, filter, cancel
│   │   │   │   ├── MyRecords.js             Medical records viewer
│   │   │   │   ├── MyNotifications.js       Notification feed
│   │   │   │   └── DoctorsList.js           Doctor discovery page
│   │   │   ├── 📁 doctor/
│   │   │   │   ├── DoctorDashboard.js       Availability + stats
│   │   │   │   ├── DoctorAppointments.js    Accept/Decline + reasons
│   │   │   │   ├── DoctorNotifications.js
│   │   │   │   └── CreateMedicalRecord.js   Medicine timings
│   │   │   └── 📁 admin/
│   │   │       ├── AdminDashboard.js        Stats + quick actions
│   │   │       ├── AllUsers.js              CRUD all users
│   │   │       ├── AllAppointments.js       Filter + assign
│   │   │       ├── AllRecords.js            View all records
│   │   │       └── SendNotification.js      Custom notifications
│   │   ├── 📁 services/
│   │   │   ├── api.js                       Axios + JWT interceptor
│   │   │   ├── authService.js
│   │   │   ├── appointmentService.js
│   │   │   ├── medicalRecordService.js
│   │   │   ├── notificationService.js
│   │   │   ├── profileService.js
│   │   │   └── adminService.js
│   │   ├── 📁 utils/
│   │   │   ├── helpers.js                   Dr. prefix formatter
│   │   │   ├── specializations.js           38 medical specializations
│   │   │   ├── countryCodes.js              40 countries with validation
│   │   │   ├── medicalData.js               Blood groups, genders
│   │   │   └── useProfilePicture.js         Custom hook
│   │   ├── App.js                           Role-based route guards
│   │   └── index.js
│   └── package.json
│
├── 📁 screenshots/                          Project Screenshots
├── .gitignore
└── README.md
```

---

## 🗄️ Database Schema

### Entity Relationship Overview

```
users (1) ──────────────── (M) appointments
users (1) ──────────────── (M) medical_records (as patient)
users (1) ──────────────── (M) medical_records (as doctor)
users (1) ──────────────── (M) notifications
appointments (M) ────────── (1) users (doctor — nullable)
```

### `users` Table
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| id | BIGINT | PK, AUTO | Primary key |
| full_name | VARCHAR | NOT NULL | Full name |
| email | VARCHAR | UNIQUE | Login email |
| password | VARCHAR | NOT NULL | BCrypt hash |
| phone | VARCHAR | NOT NULL | With country code |
| role | ENUM | NOT NULL | PATIENT / DOCTOR / ADMIN |
| enabled | TINYINT | DEFAULT 1 | Admin controls account status |
| available | TINYINT | DEFAULT 1 | Doctor controls availability |
| specialization | VARCHAR | NULL | Doctors only |
| gender | VARCHAR | NULL | User gender |
| age | INT | NULL | Patients only |
| blood_group | VARCHAR(20) | NULL | Patients only |
| hospital_name | VARCHAR | NULL | Doctors only |
| hospital_address | VARCHAR | NULL | Doctors only |
| hospital_city | VARCHAR | NULL | Doctors only |
| experience | VARCHAR | NULL | Doctors only |
| profile_picture | LONGTEXT | NULL | Base64 image |
| created_at | DATETIME | AUTO | Creation time |
| updated_at | DATETIME | AUTO | Update time |

### `appointments` Table
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| id | BIGINT | PK, AUTO | Primary key |
| patient_id | BIGINT | FK → users | Patient reference |
| doctor_id | BIGINT | FK → users, NULL | Doctor reference (optional) |
| appointment_date | VARCHAR | NOT NULL | Selected date |
| appointment_time | VARCHAR | NOT NULL | Selected time slot |
| status | VARCHAR | NOT NULL | PENDING / CONFIRMED / CANCELLED / COMPLETED / UNASSIGNED |
| notes | TEXT | NOT NULL | Patient problem description |
| created_at | DATETIME | AUTO | Booking timestamp |

### `medical_records` Table
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| id | BIGINT | PK, AUTO | Primary key |
| patient_id | BIGINT | FK → users | Patient reference |
| doctor_id | BIGINT | FK → users | Doctor reference |
| diagnosis | VARCHAR | NOT NULL | Medical diagnosis |
| prescription | TEXT(5000) | NULL | Medicine prescriptions |
| medicine_schedule | TEXT | NULL | JSON medicine timings |
| notes | TEXT(2000) | NULL | Doctor notes |
| lab_results | TEXT(1000) | NULL | Lab test results |
| created_at | DATETIME | AUTO | Creation time |
| updated_at | DATETIME | AUTO | Update time |

### `notifications` Table
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| id | BIGINT | PK, AUTO | Primary key |
| user_id | BIGINT | FK → users | Recipient |
| message | TEXT | NOT NULL | Notification content |
| is_read | TINYINT | DEFAULT 0 | Read status |
| created_at | DATETIME | AUTO | Sent timestamp |

---

## 📡 API Endpoints

> 📚 **Full Interactive Docs:** `http://localhost:8080/swagger-ui.html`

### 🔐 Authentication — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Register new user (Patient/Doctor) |
| POST | `/login` | Public | Login — returns JWT token |
| GET | `/check-email?email=` | Public | Real-time email availability check |

### 📅 Appointments — `/api/appointments`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/book` | Patient | Book appointment (doctor optional) |
| GET | `/my` | Patient | Get own appointments (newest first) |
| GET | `/doctor` | Doctor | Get doctor's appointments |
| PUT | `/{id}/status?status=` | Doctor/Admin | Update status + auto-notify |
| GET | `/all` | Admin | All appointments system-wide |

### 🗂️ Medical Records — `/api/records`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create` | Doctor | Create medical record |
| GET | `/my` | Patient | Get own records |
| GET | `/patient/{id}` | Doctor | Get patient's full history |
| GET | `/all` | Admin | All records system-wide |
| PUT | `/{id}` | Doctor | Update existing record |
| DELETE | `/{id}` | Admin | Delete record |

### 🔔 Notifications — `/api/notifications`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/send` | Admin | Send to any user |
| GET | `/my` | All | Get own notifications |
| PUT | `/{id}/read` | All | Mark as read |
| DELETE | `/{id}` | All | Delete notification |
| GET | `/unread/count` | All | Get unread count |

### 👑 Admin — `/api/admin`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users` | Admin | All users |
| GET | `/doctors` | Admin | All doctors with availability |
| GET | `/patients` | Admin | All patients |
| GET | `/stats` | Admin | System statistics |
| PUT | `/users/{id}` | Admin | Full user update |
| PUT | `/users/{id}/toggle-status` | Admin | Activate / Deactivate |
| PUT | `/users/{id}/reset-password` | Admin | Reset password |
| GET | `/appointments` | Admin | All appointments |
| GET | `/appointments/unassigned` | Admin | Unassigned only |
| PUT | `/appointments/{id}/status` | Admin | Update status |
| PUT | `/appointments/{id}/assign-doctor` | Admin | Assign doctor + notify |

### ⚙️ Profile — `/api/profile`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | All | Get own profile |
| PUT | `/phone` | All | Update phone number |
| PUT | `/password` | All | Update password |
| PUT | `/picture` | All | Update profile picture (base64) |
| PUT | `/availability` | Doctor | Toggle availability on/off |
| PUT | `/hospital` | Doctor | Update hospital information |

---

## 🔑 Authentication Flow

```
1. User submits credentials (email + password)
           │
           ▼
2. AuthController → AuthService.login()
           │
           ▼
3. Find user by email in database
           │
     ┌─────┴──────┐
     │             │
  Found        Not Found
     │             │
     ▼             ▼
4. BCrypt.matches()   Throw: Invalid credentials
     │
   ┌─┴──┐
Match  No Match
   │      │
   ▼      ▼
5. Check  Throw: Invalid credentials
 enabled
   │
   ▼
6. JwtUtil.generateToken(email, role)
           │
           ▼
7. Return AuthResponse { token, role, fullName, email }
           │
           ▼
8. Frontend stores in localStorage
           │
           ▼
9. Role-based redirect:
   PATIENT → /patient/dashboard
   DOCTOR  → /doctor/dashboard
   ADMIN   → /admin/dashboard
           │
           ▼
10. Every API call includes:
    Authorization: Bearer <token>
           │
           ▼
11. JwtAuthFilter validates token on each request
    → Extracts email + role
    → Sets SecurityContext
    → Allows or blocks request
```

---

## 🚀 Installation Guide

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Java JDK | 21+ | [oracle.com](https://www.oracle.com/java/technologies/downloads/) |
| Maven | 3.8+ | [maven.apache.org](https://maven.apache.org/download.cgi) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| MySQL | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

---

### Step 1 — Clone Repository

```bash
git clone https://github.com/Jsricharan/medvault.git
cd medvault
```

---

### Step 2 — Database Setup

Open MySQL Workbench or MySQL CLI:

```sql
-- Create database
CREATE DATABASE medvault_db;
USE medvault_db;

-- Tables auto-created by Hibernate on first run

-- Fix columns if needed
ALTER TABLE users
ADD COLUMN IF NOT EXISTS available TINYINT(1) NOT NULL DEFAULT 1;

UPDATE users SET available = 1;

-- Insert default admin account
INSERT INTO users (
    full_name, email, password, phone,
    role, enabled, available, created_at, updated_at
) VALUES (
    'Admin',
    'admin@medvault.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lVVS',
    '+911234567890',
    'ADMIN', 1, 1, NOW(), NOW()
);
```

> Default admin password: `admin123`

---

### Step 3 — Backend Configuration

Navigate to backend folder and create configuration file:

```bash
cd backend/src/main/resources
```

Create `application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/medvault_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT Configuration
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000

# Swagger UI
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true
springdoc.swagger-ui.try-it-out-enabled=true
springdoc.swagger-ui.display-request-duration=true
```

---

### Step 4 — Run Backend

```bash
cd medvault/backend
mvn clean install
mvn spring-boot:run
```

✅ Backend running at: `http://localhost:8080`
✅ Swagger UI at: `http://localhost:8080/swagger-ui.html`

---

### Step 5 — Run Frontend

```bash
cd medvault/frontend
npm install
npm start
```

✅ Frontend running at: `http://localhost:3000`

---

## 🔧 Environment Variables

### Backend — `application.properties`

| Property | Required | Description |
|----------|----------|-------------|
| `spring.datasource.url` | ✅ | MySQL connection string |
| `spring.datasource.username` | ✅ | MySQL username |
| `spring.datasource.password` | ✅ | MySQL password |
| `jwt.secret` | ✅ | 64-char hex JWT signing key |
| `jwt.expiration` | ✅ | Token expiry in milliseconds |

> ⚠️ `application.properties` is in `.gitignore` — never push secrets to GitHub

---

## ▶️ Running the Application

### Start Order (Important)

```
1. Start MySQL Server
2. Start Spring Boot Backend (port 8080)
3. Start React Frontend (port 3000)
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| 🌐 Application | http://localhost:3000 | Main web app |
| ⚙️ Backend API | http://localhost:8080 | REST API |
| 📚 Swagger UI | http://localhost:8080/swagger-ui.html | API Documentation |
| 📄 API JSON | http://localhost:8080/api-docs | OpenAPI Spec |

---

## 🔑 Default Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@medvault.com | admin123 | Full system access |
| Doctor | Register at `/register` | Your choice | Doctor dashboard |
| Patient | Register at `/register` | Your choice | Patient dashboard |

> ⚠️ Change default admin credentials after first login in production!

---

## 📸 Screenshots

> All screenshots are stored in the `screenshots/` folder.
> Click any thumbnail below to view the full screenshot.

---

### 🔐 Authentication

| Screen | Preview |
|--------|---------|
| Login Page | [<img src="screenshots/01-login-page.png" width="200">](screenshots/01-login-page.png) |
| Registration Page | [<img src="screenshots/02-register-page.png" width="200">](screenshots/02-register-page.png) |
| Form Validation Errors | [<img src="screenshots/04-register-validation.png" width="200">](screenshots/04-register-validation.png) |
| Forgot Password — OTP Flow | [<img src="screenshots/03-forgot-password-otp.png" width="200">](screenshots/03-forgot-password-otp.png) |
| Login Error with Register Hint | [<img src="screenshots/25-login-error.png" width="200">](screenshots/25-login-error.png) |
| Real-Time Email Check | [<img src="screenshots/26-email-available-check.png" width="200">](screenshots/26-email-available-check.png) |

---

### 🤒 Patient Dashboard

| Screen | Preview |
|--------|---------|
| Patient Home — Health Summary | [<img src="screenshots/05-patient-home.png" width="200">](screenshots/05-patient-home.png) |
| Dynamic Health Tips — Shuffle | [<img src="screenshots/27-health-tips-shuffle.png" width="200">](screenshots/27-health-tips-shuffle.png) |
| Browse Doctors List | [<img src="screenshots/06-patient-doctors-list.png" width="200">](screenshots/06-patient-doctors-list.png) |
| Unavailable Doctor Card | [<img src="screenshots/29-unavailable-doctor-card.png" width="200">](screenshots/29-unavailable-doctor-card.png) |
| Book Appointment Step 1 | [<img src="screenshots/07-book-appointment-step1.png" width="200">](screenshots/07-book-appointment-step1.png) |
| Book Appointment Step 2 | [<img src="screenshots/08-book-appointment-step2.png" width="200">](screenshots/08-book-appointment-step2.png) |
| Time Slot Dropdown | [<img src="screenshots/45-time-slot-dropdown.png" width="200">](screenshots/45-time-slot-dropdown.png) |
| My Appointments | [<img src="screenshots/09-patient-appointments.png" width="200">](screenshots/09-patient-appointments.png) |
| Search Appointments | [<img src="screenshots/43-patient-appointment-search.png" width="200">](screenshots/43-patient-appointment-search.png) |
| Cancel Confirmation Dialog | [<img src="screenshots/30-cancel-appointment-dialog.png" width="200">](screenshots/30-cancel-appointment-dialog.png) |
| Medical Records | [<img src="screenshots/10-patient-medical-records.png" width="200">](screenshots/10-patient-medical-records.png) |
| Patient Notifications | [<img src="screenshots/23-notifications-patient.png" width="200">](screenshots/23-notifications-patient.png) |
| Rejection Reason in Notification | [<img src="screenshots/50-rejection-reason-notification.png" width="200">](screenshots/50-rejection-reason-notification.png) |
| Profile Settings | [<img src="screenshots/28-patient-profile.png" width="200">](screenshots/28-patient-profile.png) |

---

### 👨‍⚕️ Doctor Dashboard

| Screen | Preview |
|--------|---------|
| Doctor Home — Available | [<img src="screenshots/11-doctor-home.png" width="200">](screenshots/11-doctor-home.png) |
| Doctor Home — Unavailable | [<img src="screenshots/15-doctor-unavailable.png" width="200">](screenshots/15-doctor-unavailable.png) |
| Doctor Stats Cards | [<img src="screenshots/44-doctor-stats-cards.png" width="200">](screenshots/44-doctor-stats-cards.png) |
| Appointment Requests | [<img src="screenshots/12-doctor-appointments.png" width="200">](screenshots/12-doctor-appointments.png) |
| Decline — Preset Reasons | [<img src="screenshots/13-doctor-decline-modal.png" width="200">](screenshots/13-doctor-decline-modal.png) |
| Decline — Custom Reason | [<img src="screenshots/34-doctor-decline-other.png" width="200">](screenshots/34-doctor-decline-other.png) |
| Patient Medical History | [<img src="screenshots/31-doctor-patient-history.png" width="200">](screenshots/31-doctor-patient-history.png) |
| Create Medical Record | [<img src="screenshots/14-doctor-create-record.png" width="200">](screenshots/14-doctor-create-record.png) |
| Doctor Notifications | [<img src="screenshots/32-doctor-notifications.png" width="200">](screenshots/32-doctor-notifications.png) |
| Doctor Profile & Hospital | [<img src="screenshots/33-doctor-profile-hospital.png" width="200">](screenshots/33-doctor-profile-hospital.png) |

---

### 👑 Admin Dashboard

| Screen | Preview |
|--------|---------|
| Admin Home — Statistics | [<img src="screenshots/16-admin-home.png" width="200">](screenshots/16-admin-home.png) |
| Manage All Users | [<img src="screenshots/17-admin-users.png" width="200">](screenshots/17-admin-users.png) |
| Edit User Details | [<img src="screenshots/18-admin-edit-user.png" width="200">](screenshots/18-admin-edit-user.png) |
| Deactivate User | [<img src="screenshots/38-admin-deactivate-user.png" width="200">](screenshots/38-admin-deactivate-user.png) |
| Reset User Password | [<img src="screenshots/37-admin-reset-password.png" width="200">](screenshots/37-admin-reset-password.png) |
| All Appointments | [<img src="screenshots/19-admin-appointments.png" width="200">](screenshots/19-admin-appointments.png) |
| Assign Doctor | [<img src="screenshots/20-admin-assign-doctor.png" width="200">](screenshots/20-admin-assign-doctor.png) |
| All Medical Records | [<img src="screenshots/36-admin-medical-records.png" width="200">](screenshots/36-admin-medical-records.png) |
| Send Notification | [<img src="screenshots/35-admin-send-notification.png" width="200">](screenshots/35-admin-send-notification.png) |

---

### 📚 Swagger API Documentation

| Screen | Preview |
|--------|---------|
| Swagger UI Overview | [<img src="screenshots/21-swagger-ui-overview.png" width="200">](screenshots/21-swagger-ui-overview.png) |
| Authentication Endpoints | [<img src="screenshots/22-swagger-auth-endpoints.png" width="200">](screenshots/22-swagger-auth-endpoints.png) |
| Appointment Endpoints | [<img src="screenshots/41-swagger-appointment-endpoints.png" width="200">](screenshots/41-swagger-appointment-endpoints.png) |
| Authorize with JWT | [<img src="screenshots/39-swagger-authorize.png" width="200">](screenshots/39-swagger-authorize.png) |
| Live API Testing | [<img src="screenshots/40-swagger-try-it-out.png" width="200">](screenshots/40-swagger-try-it-out.png) |

---

### 🔔 System Features

| Screen | Preview |
|--------|---------|
| Toast Notification | [<img src="screenshots/24-toast-notification.png" width="200">](screenshots/24-toast-notification.png) |
| Confirmation Dialog | [<img src="screenshots/42-confirm-dialog.png" width="200">](screenshots/42-confirm-dialog.png) |

## 🔮 Future Enhancements

| Feature | Priority | Description |
|---------|----------|-------------|
| Cloud Deployment | 🔴 High | Deploy on Railway or Render for live demo URL |
| Mobile Responsive Design | 🔴 High | Fully responsive layout for all screen sizes |
| Unit & Integration Tests | 🔴 High | JUnit + Mockito test coverage for services |
| Video Consultation | 🟡 Medium | WebRTC-based doctor-patient video calls |
| Appointment Reschedule | 🟡 Medium | Allow rescheduling confirmed appointments |
| Medical PDF Export | 🟡 Medium | Download medical records as PDF |
| Admin Analytics Charts | 🟡 Medium | Visual charts for system reports |
| Email Integration | 🟡 Medium | Real email delivery for OTP and alerts |
| Doctor Working Hours | 🟡 Medium | Define and enforce schedule per doctor |
| Pagination | 🟡 Medium | Handle large data sets efficiently |
| Dark Mode | 🟢 Low | System-wide dark/light theme toggle |
| Audit Logs | 🟢 Low | Track all admin and doctor actions |
| Rate Limiting | 🟢 Low | Brute force login attack protection |
| Push Notifications | 🟢 Low | Real-time browser push alerts |
| Multi-Language Support | 🟢 Low | Internationalization (i18n) |

---

## 🔧 Troubleshooting

### Backend Won't Start

```
❌ Problem: Cannot connect to database
✅ Fix: Make sure MySQL is running on port 3306
✅ Fix: Verify credentials in application.properties
✅ Fix: Ensure medvault_db database exists

❌ Problem: Port 8080 already in use
✅ Fix (Windows):
   netstat -ano | findstr :8080
   taskkill /PID <PID> /F
```

### Frontend Issues

```
❌ Problem: npm install fails
✅ Fix:
   rm -rf node_modules
   npm cache clean --force
   npm install

❌ Problem: Cannot connect to server
✅ Fix: Ensure backend is running on port 8080
✅ Fix: Check api.js has correct base URL
```

### Database Issues

```sql
-- Doctors showing as unavailable
UPDATE users SET available = 1 WHERE role = 'DOCTOR';

-- Missing column error
ALTER TABLE users
ADD COLUMN IF NOT EXISTS available TINYINT(1) NOT NULL DEFAULT 1;

ALTER TABLE medical_records
ADD COLUMN IF NOT EXISTS medicine_schedule TEXT;
```

### GitHub Push Issues

```
❌ Problem: Authentication failed
✅ Fix: Use Personal Access Token (not password)
   GitHub → Settings → Developer Settings
   → Personal Access Tokens → Generate new token
   → Select repo permissions → Copy token
   → Use as password when git asks

❌ Problem: remote origin already exists
✅ Fix:
   git remote remove origin
   git remote add origin https://github.com/Jsricharan/medvault.git
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Clone** your fork
   ```bash
   git clone https://github.com/YOUR_USERNAME/medvault.git
   ```
3. **Create** a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make** your changes and test them
5. **Commit** with a clear message
   ```bash
   git commit -m "feat: add appointment reschedule feature"
   ```
6. **Push** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a **Pull Request** with a clear description

### Commit Message Convention

| Prefix | Use For |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation |
| `style:` | Formatting |
| `refactor:` | Code restructure |
| `test:` | Adding tests |
| `chore:` | Maintenance |

---

## 📄 License

```
MIT License

Copyright (c) 2026 Sri Charan J

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👨‍💻 Author

<div align="center">

### Sri Charan J

*Full Stack Developer — Java Spring Boot & React*

[![GitHub](https://img.shields.io/badge/GitHub-Jsricharan-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Jsricharan)

---

**⭐ Star this repository if you found it helpful! ⭐**

*Built with ❤️ using Java Spring Boot & React*

</div>