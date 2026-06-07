---

## 🗄️ Database Schema

```sql
users
  id, full_name, email, password, phone,
  role, enabled, available, specialization,
  gender, age, blood_group, hospital_name,
  hospital_address, hospital_city,
  experience, profile_picture,
  created_at, updated_at

appointments
  id, patient_id, doctor_id,
  appointment_date, appointment_time,
  status, notes, created_at

medical_records
  id, patient_id, doctor_id, diagnosis,
  prescription, medicine_schedule,
  notes, lab_results, created_at, updated_at

notifications
  id, user_id, message, is_read, created_at
```

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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch `git checkout -b feature/AmazingFeature`
3. Commit your changes `git commit -m 'Add AmazingFeature'`
4. Push to the branch `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📞 Contact

**Developer:** Charan  
**Email:** admin@medvault.com  
**Project:** MedVault Healthcare System

---

## 📄 License

This project is licensed under the MIT License.

---

⭐ **If you find this project helpful, please give it a star!** ⭐