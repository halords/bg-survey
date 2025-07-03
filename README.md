# 📝 Employee Character Reference Survey System

A full-stack web application designed to streamline the process of collecting character references for newly hired employees. Built with **React (Vite)** on the frontend, **Node.js + TypeScript** on the backend, and **MySQL** for data storage. The app features secure JWT authentication, **UUID-based one-time survey links**, and **SMTP email integration**. Styled using **Tailwind CSS** for a responsive and modern UI.

---

## ✨ Features

### 🔐 Authentication
- Simple login system using JWT
- All API calls from the frontend include `Authorization: Bearer <token>`
- ✅ `bcrypt` implementation is planned before deployment

### 🧑‍💼 Employee Dashboard
- Displays a list of all employees
- Each entry includes a **"View Responses"** button (shown in a modal)

### ➕ Add Survey
- Add a new employee and 3 required character references
- After submission:
  - Each reference is given a **unique UUID token**
  - A **Send Email** button will be available once the add survey has been sumbitted.
- Clicking the button sends the survey link to the reference via **SMTP**, using a preformatted HTML email template

### ⚙️ Configure Survey
- Add, edit, and delete survey questions
- Drag and drop to rearrange question order (if implemented)

### 🔒 Secure Tokenized Survey Links
- Each reference receives a **unique, one-time-use link**
- Links are invalidated after the survey is submitted
- Survey links **require no login**, making it easy for non-technical users to access

---

## 🖥️ Tech Stack

### 🧑‍🎨 Frontend
- [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- Axios for API calls
- JWT stored in localStorage or cookies

### 🧑‍💻 Backend
- Node.js with **TypeScript**
- Express.js for routing
- JWT for secure authentication
- UUID for generating one-time links
- Nodemailer for sending emails via SMTP

### 🗃 Database
- MySQL (with tables for users, employees, survey_references, survey, questions, and responses)

---

## 🚀 Getting Started

### 🔧 Prerequisites
- Node.js and npm
- MySQL Server
- SMTP credentials (Mailtrap, Gmail, SendGrid, etc.)

---

### 📦 Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/halords/bg-survey
   cd bg-survey
