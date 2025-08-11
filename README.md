# Jumia-mn-Jumia 🛒
Modern e-commerce platform with Jumia-inspired features and admin dashboard.

## Features 🚀

- **User System** 👥  
  JWT authentication with email verification
- **Product Management** 📦  
  Category/subcategory organization with image uploads
- **Shopping Cart** 🛒  
  Real-time updates and checkout system
- **Order Tracking** 📮  
  Status updates (Pending/Shipped/Delivered)
- **Admin Dashboard** 👑  
  Full CRUD operations for products/categories
- **Responsive Design** 📱  
  Mobile-first UI with Tailwind CSS

## Tech Stack ⚙️

**Frontend**  
⚛️ React | 🎨 Tailwind CSS | 🛣️ React Router | 🔄 Context API

**Backend**  
🚀 Node.js | 🌐 Express | 🍃 MongoDB | 🔐 JWT

**Services**  
📧 Nodemailer | 🌍 CORS | 🖼️ Image Upload

## Installation 💻

1. **Clone Repository**
```bash
git clone https://github.com/wahib-elbessali/jumia-mn-jumia.git
cd jumia-mn-jumia
```

2. **Install Dependencies**
```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

3. **Environment Setup**  
Create `.env` files with these values:

**server/.env**
```env
PORT=5000
MONGO_URI=mongodb+srv://your-mongo-uri
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-email-password
CLIENT_ORIGIN=http://localhost:5173
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Usage** 🚀
```bash
# Start backend
cd server && npm start

# Start frontend
cd ../client && npm run dev
```

## Project Structure 📂
```
jumia-mn-jumia/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── utils/
│
└── server/
    ├── models/
    ├── routes/
    └── utils/
```

## API Endpoints 🌐

| Method | Endpoint                     | Description         |
|--------|------------------------------|---------------------|
| POST   | /api/auth/register           | User registration   |
| POST   | /api/auth/login              | User login          |
| GET    | /api/products                | Get all products    |
| POST   | /api/admin/products          | Create product      |
| PUT    | /api/admin/products/:id      | Update product      |

