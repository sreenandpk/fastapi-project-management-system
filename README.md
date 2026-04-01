# 🚀 FastAPI Project Management System

A full-stack **Project Management System** built with **FastAPI, PostgreSQL, and Next.js**, featuring authentication, role-based access control (RBAC), task assignment with due dates, and a fully dockerized setup for seamless development and deployment.

---

## 📌 Overview

This system enables organizations to manage projects and tasks efficiently with structured roles:

* 👑 **Admin**

  * Manage users
  * Create projects
  * Assign tasks with due dates
  * Monitor system via dashboard

* 👨‍💻 **Developer**

  * View assigned projects
  * Work on assigned tasks
  * Update task status

---

## 🛠 Tech Stack

### Backend

* FastAPI
* PostgreSQL
* SQLAlchemy
* JWT Authentication

### Frontend

* Next.js (App Router)
* React
* Tailwind CSS

### DevOps

* Docker & Docker Compose

---

## ✨ Features

* 🔐 JWT Authentication (Access + Refresh Tokens)
* 👑 Role-Based Access Control (Admin / Developer)
* 📊 Dashboard with real-time statistics
* 📁 Project Management (CRUD)
* ✅ Task Management (Create, Assign, Update Status)
* 📅 Task Due Date with validation (no past dates)
* 🌍 IST Timezone support for tasks
* 🔍 Advanced filtering & pagination
* 🚫 Duplicate task prevention per project
* 🌐 RESTful API with Swagger Docs
* 🐳 Fully Dockerized (one-command setup)
* ⚡ Auto database setup + admin creation

---

## 🚀 Quick Start (Docker)

### 1️⃣ Clone the repository

```bash id="q8n2c4"
git clone https://github.com/sreenandpk/fastapi-project-management-system.git
cd fastapi-project-management-system
```

---

### 2️⃣ Setup environment

```bash id="mchz8p"
cp backend/.env.docker.example backend/.env.docker
```

👉 Windows:

```powershell id="j5r6tr"
copy backend\.env.docker.example backend\.env.docker
```

---

### 3️⃣ Run the application

```bash id="j6q0g1"
docker-compose up --build
```

---

## 🌐 Access the Application

* Frontend → http://localhost:3000
* Backend API → http://localhost:8000
* Swagger Docs → http://localhost:8000/docs

---

## 🔐 Customize Admin Credentials

Before running the project, you can customize admin credentials:

Edit:

```env id="2rlp2v"
backend/.env.docker
```

```env id="pq2c8s"
ADMIN_EMAIL=your_email@example.com
ADMIN_PASSWORD=your_secure_password
ADMIN_NAME=Your Name
```

👉 Admin user is automatically created on startup

---

## 🗄 Database Design

### 👤 User

* id, name, email, password_hash, role
* Relationships:

  * owns projects
  * assigned tasks
  * created tasks

---

### 📁 Project

* id, name, description, owner_id
* Relationships:

  * belongs to admin
  * contains tasks

---

### ✅ Task

* id, title, description, status
* project_id, assigned_to, created_by
* due_date (with timezone support)
* created_at, updated_at

---

### 🔐 RefreshToken

* token, user_id, expires_at

---

### 🔄 Relationships

```plaintext id="js08a0"
User (Admin)
   └── Projects
         └── Tasks
              ├── assigned_to → Developer
              └── created_by → Admin
```

---

## ⚙️ Service Layer Architecture

The backend follows a **layered architecture**:

* **CRUD Layer** → Database operations
* **Service Layer** → Business logic & validation
* **API Layer** → Routes

### Key Logic

* Only Admin can create users, projects, and tasks
* Developers can update only their assigned tasks
* Task due date validation (no past deadlines)
* IST timezone handling for consistency
* Duplicate task prevention per project

---

## 🔗 API Endpoints

### Auth

* POST `/api/v1/auth/login`
* POST `/api/v1/auth/refresh`
* POST `/api/v1/auth/logout`

### Users

* POST `/api/v1/users/`
* GET `/api/v1/users/`

### Projects

* GET `/api/v1/projects/`
* GET `/api/v1/projects/{id}`
* POST `/api/v1/projects/`
* DELETE `/api/v1/projects/{id}`

### Tasks

* GET `/api/v1/tasks/`
* GET `/api/v1/tasks/{id}`
* POST `/api/v1/tasks/`
* PATCH `/api/v1/tasks/{id}/status`
* PATCH `/api/v1/tasks/{id}/assign`

### Dashboard

* GET `/api/v1/dashboard/`

---

## 📬 Postman Collection

A ready-to-use Postman collection is included for testing all API endpoints.

📁 Location:

```plaintext id="zj2p1t"
docs/postmanCollection.json
```

### Usage:

1. Open Postman
2. Click Import
3. Select the JSON file
4. Start testing APIs

---

## 📸 Screenshots

*Add your screenshots here*

```md id="bn3r6d"
![Login](screenshots/login.png)
![Dashboard](screenshots/dashboard.png)
![Swagger](screenshots/swagger.png)
```

---

## ⚠️ Notes

* If ports are already in use, update them in `docker-compose.yml`
* Do NOT commit `.env` files (already ignored for security)

---

## 🏆 Future Improvements

* Deployment (AWS / Render / Railway)
* CI/CD pipeline
* Email notifications
* Advanced analytics dashboard

---

## 🙌 Author

**Sreenand PK**
Full Stack Developer (FastAPI + Next.js)

GitHub: https://github.com/sreenandpk
