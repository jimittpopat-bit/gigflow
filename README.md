🚀 GigFlow - Freelance Marketplace Platform

A full-stack mini-freelance marketplace where clients can post jobs (Gigs) and freelancers can submit bids to work on them. Built to demonstrate full-stack development skills including database relationships, authentication, state management, and deployment.

## 🔗 Live Links
- **Frontend:** https://gigflow-beta.vercel.app  
- **Backend:** https://gigflow-nlol.onrender.com  
- **GitHub Repo:** https://github.com/jimittpopat-bit/gigflow

## 🎥 Demo Video
- **Drive Link:** https://drive.google.com/file/d/1_zNWyWLHAibmi3T--bR0rIzQXqJRLdpA/view?usp=vids_web

---

## 📋 Table of Contents
- Features
- Tech Stack
- Getting Started
- Environment Variables
- API Endpoints
- Project Structure
- Core Functionality
- Bonus Features Implemented

---

## ✨ Features

### Core Features
- **User Authentication:** Secure JWT-based authentication with HttpOnly cookies
- **Dual Role System:** Any user can be both a client (post gigs) and freelancer (bid on gigs)
- **Gig Management:** Full CRUD operations for job postings
- **Search & Filter:** Search gigs by title in real-time
- **Bidding System:** Freelancers can submit bids with custom messages and pricing
- **Smart Hiring Logic:**
  - Client reviews all bids for their gig
  - Hire one freelancer with a single click
  - Automatic rejection of all other bids
  - Gig status automatically changes to `"assigned"`

### Bonus Features
- **Real-time Notifications (Socket.io):** Instant notifications when hired
- **Transaction Safety:** Atomic updates prevent race conditions during hiring

---

## 🛠️ Tech Stack

### Frontend
- React.js + Vite
- Tailwind CSS
- State Management (Redux Toolkit / Context API)
- Socket.io Client
- Axios

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication (HttpOnly Cookies)
- Socket.io
- bcrypt

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm / yarn

### Installation

#### 1) Clone Repository
```bash
git clone https://github.com/jimittpopat-bit/gigflow.git
cd gigflow
```

#### 2) Install Dependencies
Backend:
```bash
cd server
npm install
```

Frontend:
```bash
cd ../client
npm install
```

#### 3) Setup Environment Variables
Create `.env` files in both `server` and `client` directories using the `.env.example` files.

**Server (.env)**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

**Client (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

#### 4) Run the Project
Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

Frontend runs at: http://localhost:5173  
Backend runs at: http://localhost:5000

---

## 🔐 Environment Variables

### Server Environment Variables
| Variable | Description | Example |
|---------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/gigflow |
| JWT_SECRET | Secret key for JWT signing | your_secret_key_here |
| JWT_EXPIRE | JWT expiration time | 7d |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

### Client Environment Variables
| Variable | Description | Example |
|---------|-------------|---------|
| VITE_API_URL | Backend API base URL | http://localhost:5000/api |
| VITE_SOCKET_URL | Socket.io server URL | http://localhost:5000 |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT cookie |
| POST | /api/auth/logout | Logout and clear cookie |

### Gigs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/gigs | Fetch all open gigs (supports search) |
| POST | /api/gigs | Create a new gig (authenticated) |
| GET | /api/gigs/:id | Get single gig details |
| PATCH | /api/gigs/:id | Update gig (owner only) |
| DELETE | /api/gigs/:id | Delete gig (owner only) |

### Bids
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/bids | Submit a bid on a gig |
| GET | /api/bids/:gigId | Get all bids for a gig (owner only) |
| PATCH | /api/bids/:bidId/hire | Hire a freelancer (atomic operation) |

---

## 📁 Project Structure
```
gigflow/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── store/           # State management
│   │   ├── services/        # API service calls
│   │   └── App.jsx
│   └── package.json
│
├── server/                  # Express backend
│   ├── models/              # MongoDB schemas
│   │   ├── User.js
│   │   ├── Gig.js
│   │   └── Bid.js
│   ├── routes/              # API route handlers
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth middleware
│   └── server.js
│
└── README.md
```

---

## 🎯 Core Functionality

### The Hiring Flow (Most Important)
This is the critical feature demonstrating relational data consistency:

1. **Client posts a Gig**
   - Gig created with status `"open"`

2. **Freelancers submit bids**
   - Multiple bids on same gig
   - Each bid includes message + proposed price
   - All bids start with status `"pending"`

3. **Client reviews bids**
   - Client sees all bids only for gigs they own

4. **Client clicks Hire on one bid**
   Atomic operation ensures:
   - Selected bid: `"hired"`
   - All other bids: `"rejected"`
   - Gig status: `"assigned"`
   - Real-time notification sent to hired freelancer

---

## 👨‍💻 Author
**Jimit Popat**  
GitHub: https://github.com/jimittpopat-bit

---

## 📝 License
This project was created for internship technical assessment submission purposes.
