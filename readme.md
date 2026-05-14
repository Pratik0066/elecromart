# 🚀 ElectroMart - AI-Powered MERN E-Commerce

A high-performance, full-stack electronics e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). This project integrates conversational AI for product discovery, smart recommendations, and secure Razorpay payments.

## 🌟 Key Features

- **Conversational AI Guide**: A smart chatbot assistant that uses keyword extraction and regex-based search to help users find electronics using natural language.
- **AI-Driven Recommendations**: Product pages automatically suggest related items within the same category to enhance user discovery.
- **Premium Flagship UI**: A modern, high-tech interface built with Tailwind CSS, featuring glassmorphism, high-fidelity dark-mode cards, and custom Lucide iconography.
- **Secure Razorpay Integration**: Fully functional payment gateway tailored for the Indian market with secure server-side verification.
- **Advanced State Management**: Powered by Redux Toolkit and RTK Query for efficient data caching and seamless UI transitions.
- **Robust Security**: JWT-based authentication using HTTP-only cookies and protected middleware layers.

## 📸 Project Showreel

### 🚀 Premium Hero Section
![Hero Section](./assets/hero-section.jpg)

### 🤖 AI Shopping Assistant
<p align="center">
  <img src="./assets/ai-chatbot.jpg" width="400" alt="AI Chatbot Preview">
</p>

### 📱 Responsive Product Grid
![Product Grid](./assets/product-grid.jpg)
---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **AI Engine**: Custom Regex-based Semantic Logic
- **Payments**: Razorpay SDK
- **Icons & UI**: Lucide-React, Plus Jakarta Sans Typography

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v16+)
- MongoDB Atlas account
- Razorpay Dashboard (for API keys)

### 2. Environment Variables

Create a `.env` file in your **backend root folder** and add:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Installation

Bash

# Install backend dependencies

npm install

# Install frontend dependencies

cd frontend && npm install

### 4. Run the Project

Bash

# Run both frontend and backend concurrently

npm run dev

📁 Project Structure
Plaintext
├── backend/
│ ├── controllers/ # Order, Product, and User business logic
│ ├── models/ # Mongoose Schemas (Product, User, Order)
│ ├── routes/ # API endpoints (Mounted in server.js)
│ └── server.js # Express entry point & middleware config
├── frontend/
│ ├── src/
│ │ ├── components/ # AI Chat, Hero, Header, SearchBox
│ │ ├── pages/ # Home, Product, Cart, and Profile views
│ │ └── slices/ # Redux API logic (RTK Query)
└── uploads/ # Product image storage

🤖 AI Logic Overview
The AI Shopping Assistant uses a specialized controller that:

Receives natural language input from the user.

Extracts core keywords and handles search logic.

Performs a multi-field search across the database (name, brand, category).

Returns rich product cards directly within the chat interface.

💳 Payment Verification
Payments are secured using HMAC SHA256 signatures. The backend verifies every Razorpay transaction before updating order status to isPaid, ensuring a tamper-proof checkout experience.
