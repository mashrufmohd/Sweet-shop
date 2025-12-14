# Sweet Shop Manager 🍬

A full-stack Sweet Shop Management System built with React, Node.js, Express, and MongoDB.

## 🎯 Features

### User Features
- 🔐 User registration and authentication
- 🛍️ Browse and search sweets
- 🛒 Shopping cart functionality
- 📦 Order history
- 🔍 Advanced search and filtering

### Admin Features
- 📊 Analytics dashboard
- ➕ Add new products
- ✏️ Edit product details
- 🗑️ Delete products
- 📈 Restock inventory
- 👥 View all orders
- 💰 Revenue tracking

## 🚀 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Shadcn/ui component library
- Zustand for state management
- React Router for navigation
- Framer Motion for animations

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- Multer for file uploads

## 📦 Project Structure

```
sweet-spot-manager/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities and API client
│   │   ├── store/        # Zustand stores
│   │   └── hooks/        # Custom hooks
│   └── package.json
├── server/               # Express backend
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & admin middleware
│   └── package.json
└── Dockerfile           # Multi-stage Docker build
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- MongoDB
- npm or yarn

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sweet-spot-manager.git
   cd sweet-spot-manager
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Seed database with demo users
   node seed.js
   
   # Start server
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000

## 🔑 Demo Credentials

### Admin User
- Email: `admin@example.com`
- Password: `admin123`

### Regular User
- Email: `user@example.com`
- Password: `user123`

## 🐳 Docker Deployment

```bash
# Using Docker Compose (includes MongoDB)
docker-compose up -d

# Or build and run manually
docker build -t sweet-spot-manager .
docker run -p 5000:5000 sweet-spot-manager
```

## 📚 API Documentation

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Sweets
- `GET /api/v1/sweets` - Get all sweets
- `GET /api/v1/sweets/search?q=query` - Search sweets
- `POST /api/v1/sweets` - Create sweet (Admin)
- `PUT /api/v1/sweets/:id` - Update sweet (Admin)
- `DELETE /api/v1/sweets/:id` - Delete sweet (Admin)
- `POST /api/v1/sweets/:id/purchase` - Purchase sweet
- `POST /api/v1/sweets/:id/restock` - Restock sweet (Admin)

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/my-orders` - Get user's orders
- `GET /api/v1/orders` - Get all orders (Admin)

### Analytics
- `GET /api/v1/analytics/dashboard` - Get dashboard stats (Admin)

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

**Frontend (Vercel)**
- Push to GitHub
- Import repository on Vercel
- Set root directory to `frontend`
- Add `VITE_API_URL` environment variable
- Deploy!

**Backend (Railway/Render)**
- Connect GitHub repository
- Set root directory to `server`
- Add environment variables
- Deploy!

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run build    # Test production build
npm run preview  # Preview production build

# Backend
cd server
npm test        # Run tests (if configured)
```

## 📱 Screenshots

![Home Page](screenshots/home.png)
![Shop Page](screenshots/shop.png)
![Admin Dashboard](screenshots/admin.png)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Shadcn/ui for the beautiful component library
- MongoDB for the database
- Vercel for hosting

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

Made with ❤️ by Your Name
