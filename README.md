# PS08 — Complaint & Helpdesk Ticket System

A complete MERN stack web application for customer complaint submission, real-time ticket tracking, department assignment, and support SLA performance analytics.

Developed for **Assignment 6 (Web Development)**.

---

## 1. Problem Statement & Project Overview

Modern businesses and educational institutions require an organized, transparent system for users to report grievances, track resolutions, and communicate with support teams. Traditional email or manual complaint logs lead to delayed responses, lack of accountability, and lost issues.

The **Complaint & Helpdesk Ticket System** bridges this gap by providing:
- **Customers**: A portal to register, submit categorized complaints with optional screenshot attachments, track the lifecycle status of their tickets, and discuss issues directly via comment threads.
- **Support Team / Admins**: A triage management workspace to filter tickets by status and priority, create support departments, assign tickets, update workflow stages, and monitor overall resolution SLAs through a real-time dashboard.

---

## 2. Technology Stack

- **Frontend**:
  - React.js (v19) with Vite
  - React Router DOM (v7) for client-side routing & protected routes
  - Pure Vanilla CSS (custom design system, responsive layout, glassmorphic accents)
- **Backend**:
  - Node.js & Express.js (REST API architecture)
  - Mongoose & MongoDB (Atlas or local instance)
  - JWT (`jsonwebtoken`) for stateless session authorization
  - `bcryptjs` for secure salted password hashing
  - `cors` & `dotenv` for cross-origin security and environment management
- **Deployment Ready**:
  - Backend: Render / Railway / Heroku
  - Frontend: Vercel / Netlify (with SPA rewrite rules)

---

## 3. Key Features & Business Rules

### Customer Capabilities
- **Authentication**: Secure account registration and login with encrypted password storage.
- **Complaint Submission**: Create tickets specifying Title, Category (*Technical, Billing, Account, Hardware, General*), Priority (*Low, Medium, High*), detailed Description, and optional Screenshot URL.
- **My Tickets Dashboard**: Filter tickets by Status and Priority, or search by Ticket ID or Title.
- **Ticket Lifecycle Rules**:
  - Customers can **edit** or **delete** their ticket **only while status is "Open"**.
  - Once a ticket is marked **"Resolved"**, customers can **reopen it once**.
- **Interactive Discussion Thread**: Post comments and questions to support staff on active tickets.

### Support / Admin Capabilities
- **Administrative Triage**: Access all submitted tickets across all users.
- **Multi-criteria Filtering**: Filter tickets by status (*Open, In Progress, Resolved, Closed*), priority (*High, Medium, Low*), or category.
- **Department Management**: Create, update, and delete support departments with live ticket counters.
- **Department Assignment**: Assign or reassign tickets to specific departments (*Technical Support, Billing & Accounts, IT Infrastructure, Customer Service*).
- **Status Progression**: Transition tickets through the enforced workflow:
  $$\text{Open} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved} \longrightarrow \text{Closed}$$
- **Read-Only Enforced Archival**: When a ticket is marked **"Closed"**, it becomes read-only (status changes and new comments are blocked).
- **Admin Dashboard & Analytics**:
  - KPI cards: Total Complaints, Open, In Progress, Resolved, Closed counts.
  - Average Resolution Time: Dynamically calculated from database timestamps (`resolvedAt - createdAt`).
  - Priority breakdown bars (High, Medium, Low).
  - Category volume distribution.
  - Recent complaints table.

---

## 4. Test Login Credentials

For demonstration and viva evaluation, pre-seeded accounts are provided:

| Role | Email Address | Password | Description |
| :--- | :--- | :--- | :--- |
| **Admin / Support** | `admin@helpdesk.com` | `admin123` | Full access to Dashboard, All Tickets, and Departments |
| **Customer** | `john@example.com` | `user123` | Customer with active sample tickets & comments |
| **Customer** | `sarah@example.com` | `user123` | Customer with billing & technical tickets |
| **Customer** | `alex@example.com` | `user123` | Customer with hardware & infrastructure tickets |

*(The login page features 1-click quick-fill buttons for immediate testing).*

---

## 5. API Endpoints Specification

All endpoints are prefixed with `/api/`.

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new customer or admin account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |

### Tickets (`/api/tickets`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tickets` | Private | List tickets (Customer sees own; Admin sees all; supports query filters) |
| `POST` | `/api/tickets` | Private | Create a complaint ticket (generates unique `TKT-XXXX` ID) |
| `GET` | `/api/tickets/:id` | Private | Retrieve ticket details by ID with populated references |
| `PUT` | `/api/tickets/:id` | Private | Update ticket (Customer: Open only; Admin: Status, Dept, Priority) |
| `DELETE` | `/api/tickets/:id` | Private | Delete ticket (Customer: Open only; Admin: Allowed) |
| `POST` | `/api/tickets/:id/reopen` | Private | Reopen a Resolved ticket (enforces one-time limit) |

### Comments (`/api/comments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/comments/ticket/:ticketId` | Private | Fetch discussion comments for a ticket |
| `POST` | `/api/comments/ticket/:ticketId` | Private | Post a comment/reply (blocked on Closed tickets) |

### Departments (`/api/departments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/departments` | Private | List all departments with active ticket counts |
| `POST` | `/api/departments` | Admin | Create a new department |
| `PUT` | `/api/departments/:id` | Admin | Update department details |
| `DELETE` | `/api/departments/:id` | Admin | Delete department and unassign tickets |

### Dashboard Analytics (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Admin | Compute status counts, category stats, priorities, and avg resolution time |

---

## 6. Installation & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas connection string)
- Git

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Assignment-6
```

### 2. Configure Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` based on `.env.example`:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/complaint_helpdesk
JWT_SECRET=helpdesk_secret_jwt_token_key_assignment6_2026
CLIENT_URL=http://localhost:5173
```

Seed the database with sample tickets, departments, and users:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
# or npm start
```
The backend API will run on `http://localhost:5001`.

### 3. Configure Frontend
In a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` based on `.env.example`:
```env
VITE_API_URL=http://localhost:5001/api
```

Start the Vite development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173/`.

---

## 7. Project Structure

```
Assignment-6/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose connection logic
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, JWT
│   │   ├── commentController.js  # Ticket discussion replies
│   │   ├── dashboardController.js# Statistical calculations & SLAs
│   │   ├── departmentController.js# Department management
│   │   └── ticketController.js   # Ticket CRUD & status workflows
│   ├── middleware/
│   │   ├── authHandler.js        # JWT verification & role authorization
│   │   └── errorHandler.js       # Centralized error responses
│   ├── models/
│   │   ├── Comment.js            # Comment Mongoose schema
│   │   ├── Department.js         # Department Mongoose schema
│   │   ├── Ticket.js             # Ticket Mongoose schema
│   │   └── User.js               # User Mongoose schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── departmentRoutes.js
│   │   └── ticketRoutes.js
│   ├── .env.example
│   ├── package.json
│   ├── seed.js                   # 12 sample tickets & demo accounts
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/
│   │   └── _redirects            # Netlify SPA redirect
│   ├── src/
│   │   ├── api/
│   │   │   ├── authApi.js
│   │   │   ├── client.js         # Fetch client with auto JWT
│   │   │   ├── commentApi.js
│   │   │   ├── dashboardApi.js
│   │   │   ├── departmentApi.js
│   │   │   └── ticketApi.js
│   │   ├── components/
│   │   │   ├── Alert.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PriorityBadge.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── TicketForm.jsx    # Shared form component
│   │   ├── pages/
│   │   │   ├── AdminTickets.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Departments.jsx
│   │   │   ├── EditTicket.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NewTicket.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── TicketDetails.jsx
│   │   │   └── Tickets.jsx
│   │   ├── App.css               # Comprehensive custom styles
│   │   ├── App.jsx               # Routes and auth state
│   │   ├── index.css             # Theme variables & base resets
│   │   └── main.jsx              # React entry point with BrowserRouter
│   ├── index.html
│   ├── package.json
│   ├── vercel.json               # Vercel SPA redirect
│   └── vite.config.js
│
├── PRESENTATION.md               # 10-slide presentation script & outline
├── YOUTUBE_DEMO_GUIDE.md         # Video demonstration walkthrough
└── README.md
```

---

## 8. Deployment Guide

### Backend Deployment (Render)
1. Push code to your GitHub repository.
2. In Render, create a new **Web Service** connected to your repository.
3. Set **Root Directory** to `backend`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI
   - `JWT_SECRET`: A strong secret key
   - `PORT`: `5001` (or let Render set it dynamically via `process.env.PORT`)
   - `CLIENT_URL`: Your deployed frontend URL

### Frontend Deployment (Vercel / Netlify)
1. In Vercel, import your GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Add environment variable:
   - `VITE_API_URL`: Your deployed Render backend URL + `/api` (e.g. `https://helpdesk-backend.onrender.com/api`).
5. Deploy. `vercel.json` will ensure direct refreshes on dynamic URLs (e.g. `/tickets/6ad71...`) redirect to `index.html`.

---

## 9. Live Deployment URL

- **GitHub Repository**: [Complaint-Helpdesk-Ticket-System](https://github.com/arnavarya001/Complaint-Helpdesk-Ticket-System)
- **Frontend Live App**: [Live Demo](https://complaint-helpdesk-system.vercel.app)
- **Backend API URL**: [Backend Health Check](https://complaint-helpdesk-system.onrender.com/)

---

## 10. Student Information
- **Name**: Arnav Arya
- **Assignment**: Assignment 6 — Individual MERN Project
- **Problem Statement**: PS08 — Complaint & Helpdesk Ticket System
- **Deadline**: October 21, 2026
