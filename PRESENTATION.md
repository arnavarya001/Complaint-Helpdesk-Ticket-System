# Presentation Script & Slide Deck (10 Slides)
## PS08 — Complaint & Helpdesk Ticket System
**Student Name:** Arnav Arya  
**Course:** Web Development (Semester 3) — Assignment 6  

---

### Slide 1: Title & Problem Statement
- **Title:** Complaint & Helpdesk Ticket System
- **Subtitle:** A Full-Stack MERN Architecture for Customer Issue Resolution & SLA Tracking
- **Presenter:** Arnav Arya (Roll No: [Your Roll Number])
- **Course / Assignment:** Semester 3 Web Development — Assignment 6
- **Problem Statement:** Organizations struggle with scattered email threads, undocumented grievances, and delayed response times. The goal is to provide a single, structured portal for customers to lodge complaints and for administrators to triage, assign, and resolve them systematically.
- **Speaker Notes:**  
  *"Good morning everyone. Today I am presenting my Assignment 6 project: PS08 — Complaint and Helpdesk Ticket System. This is a full-stack MERN application built to solve the communication gap between customers seeking support and technical teams managing operational workloads."*

---

### Slide 2: Problem & Proposed Solution
- **The Problem:**
  - Lack of complaint tracking and status visibility for customers.
  - No clear department dispatch or priority queuing for support agents.
  - Inability to measure average resolution time and support performance.
- **Proposed Solution:**
  - Role-based self-service portal (Customer vs Admin).
  - Clear 4-stage lifecycle workflow: `Open` &rarr; `In Progress` &rarr; `Resolved` &rarr; `Closed`.
  - Real-time admin analytics dashboard displaying average resolution hours, priority breakdowns, and volume distributions.
- **Speaker Notes:**  
  *"Traditional grievance systems suffer from lack of traceability. My solution introduces strict business rules: users can edit or delete their issues only while they are Open, resolved tickets can be reopened once if unsatisfied, and closed tickets are permanently archived as read-only records."*

---

### Slide 3: User Roles & Core Capabilities
- **Customer Role:**
  - Account registration and secure JWT authentication.
  - Create tickets with Category, Priority, Description, and Screenshot attachments.
  - Track tickets with real-time status badges and filter by status.
  - Edit/Delete tickets only while in `Open` status.
  - Reopen a `Resolved` ticket once.
  - Interactive discussion comments with support agents.
- **Support / Admin Role:**
  - Master view of all customer tickets with search & multi-attribute filters.
  - Inline status update and department reassignment.
  - Full CRUD control over Support Departments (with live ticket counters).
  - Reply to customer tickets via comments.
  - Live analytics dashboard for ticket metrics.
- **Speaker Notes:**  
  *"We have two well-defined roles protected by backend middleware. Customers have complete control over their own submissions, while administrators oversee the entire dispatch pipeline."*

---

### Slide 4: Technology Stack
- **Frontend:**
  - **React.js & Vite:** High-performance SPA with fast hot module replacement.
  - **React Router DOM (v7):** Client-side routing, protected routes, and dynamic URL params (`useParams`, `useNavigate`).
  - **Vanilla CSS:** Custom design tokens, dark slate theme, responsive grid, and zero heavy UI libraries.
- **Backend:**
  - **Node.js & Express.js:** Modular MVC architecture with dedicated routers and controllers.
  - **Authentication:** Stateless JSON Web Tokens (JWT) & `bcryptjs` password hashing.
- **Database:**
  - **MongoDB & Mongoose:** Schema validation, relational references (`ref`), and aggregation pipelines.
- **Speaker Notes:**  
  *"I chose the MERN stack following the class project structure. By using pure Vanilla CSS, I avoided bulky external UI libraries while building an interface with micro-animations and clean visual hierarchy."*

---

### Slide 5: System Architecture & Workflow
- **Client-Server Flow:**
  - React SPA communicates with the Express REST API via fetch requests with `Bearer <JWT>` headers.
  - Centralized API client handles token injection and structured error unwrapping.
- **Ticket Lifecycle Workflow:**
  $$\text{Open} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved} \longrightarrow \text{Closed}$$
- **Key Backend Guards:**
  - `verifyToken`: Validates JWT signature on incoming HTTP requests.
  - `requireRole('admin')`: Restricts department mutations and dashboard analytics.
  - Ownership validation: Ensures customers can only inspect and comment on their own tickets.
- **Speaker Notes:**  
  *"The architecture follows standard REST principles. All business logic is strictly enforced on the server in Mongoose controllers, so unauthorized operations cannot be bypassed from the client."*

---

### Slide 6: Database Collections & Schemas
- **User Collection:**
  - `name`, `email` (unique), `password` (bcrypt hash), `role` (`customer` | `admin`), `createdAt`.
- **Department Collection:**
  - `name` (unique), `description`, `createdAt`.
- **Ticket Collection:**
  - `ticketId` (readable unique string like `TKT-1024`), `title`, `category`, `priority` (`Low`, `Medium`, `High`), `description`, `screenshotUrl`, `customer` (ref: `User`), `department` (ref: `Department`), `status` (`Open`, `In Progress`, `Resolved`, `Closed`), `reopenCount`, `resolvedAt`, `createdAt`.
- **Comment Collection:**
  - `ticket` (ref: `Ticket`), `user` (ref: `User`), `text`, `createdAt`.
- **Speaker Notes:**  
  *"We have four core collections. The Ticket schema references both the User who reported the problem and the assigned Department. Resolution time is calculated using the difference between resolvedAt and createdAt."*

---

### Slide 7: Application Walkthrough & UI Showcase
- **Customer Portal:**
  - Clean ticket cards with color-coded status badges and priority tags.
  - New ticket form with real-time screenshot preview.
  - Ticket details view featuring an interactive lifecycle timeline progress bar and discussion thread.
- **Admin Dashboard:**
  - KPI metric cards: Open vs Resolved counts, In Progress, Closed.
  - Average resolution time in hours.
  - Visual CSS bar charts for Priority breakdown and Category distribution.
  - Department management with active ticket counters.
- **Speaker Notes:**  
  *"Here we see the user interface. Notice the visual progress indicator showing the exact stage of a ticket, and the Admin Dashboard providing instant insight into current support performance."*

---

### Slide 8: Testing Strategy & Verification Results
- **Automated Verification:**
  - Validated 14 test scenarios with a custom automated bash test suite.
- **Test Scenarios Covered:**
  - Incorrect password verification & duplicate email prevention (HTTP 401 & 400).
  - Role-based route protection: Customer attempting to fetch dashboard stats receives HTTP 403 Forbidden.
  - Customer can only edit/delete tickets in `Open` status; blocked when `Resolved` or `Closed`.
  - Reopening: Successfully reopens a `Resolved` ticket once; second reopening is blocked with HTTP 400.
  - Closed tickets are read-only: status mutations and comments are rejected.
  - Average resolution time calculation from seeded database records.
- **Speaker Notes:**  
  *"I thoroughly tested the system against all 14 assignment requirements, confirming that edge cases like multiple reopens or modifying closed tickets are strictly prevented."*

---

### Slide 9: Challenges & Key Learnings
- **Challenges Faced:**
  - Avoiding port 5000 conflicts on macOS where AirPlay Receiver intercepts incoming traffic. Resolved by configuring backend port 5001.
  - Enforcing strict status transition rules and preventing multiple ticket reopens on the backend.
  - Configuring SPA client routing with `vercel.json` rewrites to prevent 404s when directly refreshing dynamic routes like `/tickets/:id`.
- **Key Learning Outcomes:**
  - Structuring Mongoose schemas with ObjectId references and population.
  - Implementing JWT authentication and role authorization middleware in Express.
  - Managing application state cleanly in React using hooks and `localStorage`.
- **Speaker Notes:**  
  *"A key technical challenge was managing the ticket lifecycle states and handling macOS AirPlay port conflicts. This project reinforced my understanding of full-stack asynchronous communication and state management."*

---

### Slide 10: Conclusion & Demo Access
- **Summary:**
  - Successfully built and verified a full-featured MERN Complaint & Helpdesk Ticket System.
  - Compliant with all 18 development steps and assignment specifications.
- **Project Links:**
  - **GitHub Repository:** `https://github.com/arnavarya001/Complaint-Helpdesk-Ticket-System`
  - **Live Web Application:** `https://complaint-helpdesk-ticket-system.vercel.app/`
  - **Live Backend API:** `https://complaint-helpdesk-ticket-system.onrender.com/`
- **Thank You! Questions & Discussion**
- **Speaker Notes:**  
  *"Thank you for your time. The application is running locally and deployed to the web, ready for live demonstration. I am happy to answer any questions."*
