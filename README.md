# 🚀 GigFlow - Freelance Marketplace Platform

A full-stack mini-freelance marketplace where clients can post jobs (Gigs) and freelancers can submit bids to work on them. Built as a technical assessment demonstrating complex database relationships, secure authentication, and real-time features.

🔗 **Live Demo:** [https://gigflow-beta.vercel.app](https://gigflow-beta.vercel.app)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Core Functionality](#core-functionality)
- [Bonus Features Implemented](#bonus-features-implemented)

---

## ✨ Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with HttpOnly cookies
- **Dual Role System**: Any user can be both a client (post gigs) and freelancer (bid on gigs)
- **Gig Management**: Full CRUD operations for job postings
- **Search & Filter**: Search gigs by title in real-time
- **Bidding System**: Freelancers can submit bids with custom messages and pricing
- **Smart Hiring Logic**: 
  - Client reviews all bids for their gig
  - Hire one freelancer with a single click
  - Automatic rejection of all other bids
  - Gig status automatically changes to "assigned"

### Bonus Features
- **Real-time Notifications** (Socket.io): Instant notifications when hired
- **Transaction Safety**: Atomic updates prevent race conditions during hiring

---

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite
- **Tailwind CSS** for styling
- **Redux Toolkit** / Context API for state management
- **Socket.io Client** for real-time updates
- **Axios** for API calls

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.io** for real-time communication
- **bcrypt** for password hashing

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jimittpopat-bit/gigflow.git
cd gigflow
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Set up environment variables**

Create `.env` files in both `server` and `client` directories based on the `.env.example` files provided.

**Server (.env)**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

**Client (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

5. **Start the development servers**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

6. **Access the application**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 🔐 Environment Variables

### Server Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/gigflow` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key_here` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Client Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Socket.io server URL | `http://localhost:5000` |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT cookie |
| POST | `/api/auth/logout` | Logout and clear cookie |

### Gigs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gigs` | Fetch all open gigs (supports search) |
| POST | `/api/gigs` | Create a new gig (authenticated) |
| GET | `/api/gigs/:id` | Get single gig details |
| PATCH | `/api/gigs/:id` | Update gig (owner only) |
| DELETE | `/api/gigs/:id` | Delete gig (owner only) |

### Bids
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bids` | Submit a bid on a gig |
| GET | `/api/bids/:gigId` | Get all bids for a gig (owner only) |
| PATCH | `/api/bids/:bidId/hire` | **Hire a freelancer** (atomic operation) |

---

## 📁 Project Structure

```
gigflow/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store (if using Redux)
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
│   ├── middleware/          # Auth & validation middleware
│   └── server.js
│
└── README.md
```

---

## 🎯 Core Functionality

### The Hiring Flow (Most Important)

This is the critical feature that demonstrates complex database operations:

1. **Client Posts a Gig**
   - Gig is created with status `"open"`

2. **Freelancers Submit Bids**
   - Multiple freelancers can bid on the same gig
   - Each bid includes a message and proposed price
   - All bids start with status `"pending"`

3. **Client Reviews Bids**
   - Client sees all bids for their gig
   - Can compare proposals and prices

4. **Client Clicks "Hire" on One Bid**
   - **Atomic Operation Ensures:**
     - Selected bid status → `"hired"`
     - All other bids for that gig → `"rejected"`
     - Gig status → `"assigned"`
     - Real-time notification sent to hired freelancer

### Database Schema

**User Model**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed)
}
```

**Gig Model**
```javascript
{
  title: String,
  description: String,
  budget: Number,
  ownerId: ObjectId (ref: User),
  status: String (enum: ['open', 'assigned'])
}
```

**Bid Model**
```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String,
  proposedPrice: Number,
  status: String (enum: ['pending', 'hired', 'rejected'])
}
```

---

## 🎁 Bonus Features Implemented

### ✅ Bonus 1: Transactional Integrity
- Implemented MongoDB transactions to prevent race conditions
- If two admins try to hire different freelancers simultaneously, only one succeeds
- Ensures data consistency and prevents double-hiring

### ✅ Bonus 2: Real-time Notifications
- Integrated Socket.io for instant updates
- When a freelancer is hired, they receive immediate notification
- No page refresh needed
- Notification displays: "You have been hired for [Gig Title]!"

---

## 🎥 Demo Video

📹 **[Watch 2-Minute Demo](YOUR_LOOM_LINK_HERE)**

The demo showcases:
- User registration and login
- Creating a new gig
- Multiple freelancers bidding
- Client reviewing bids
- Hiring process with real-time notification
- Automatic bid rejection

---

## 🔒 Security Features

- Passwords hashed with bcrypt
- JWT tokens stored in HttpOnly cookies (XSS protection)
- Protected routes with authentication middleware
- Authorization checks (only gig owners can hire)
- Input validation and sanitization

---

## 🚧 Future Enhancements

- Payment integration (Stripe/PayPal)
- User profiles with ratings and reviews
- File upload for gig attachments
- Advanced search filters (budget range, category)
- Chat system between clients and freelancers
- Email notifications

---

## 👨‍💻 Author

**Jimit Popat**
- GitHub: [@jimittpopat-bit](https://github.com/jimittpopat-bit)
- Portfolio: [Your Portfolio Link]

---

## 📝 License

This project was created as a technical assessment for ServiceHive.

---

## 🙏 Acknowledgments

Built as part of the Full Stack Development Internship assignment for ServiceHive. Special thanks to the team for providing this challenging and educational project.

---

**Note**: This is a demonstration project built within 2-3 days as part of a technical assessment. For production use, additional security hardening, testing, and features would be recommended.
