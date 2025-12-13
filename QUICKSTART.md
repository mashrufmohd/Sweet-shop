# 🚀 Quick Start Guide

## Local Development (5 Minutes)

### 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup Environment

```bash
# Backend - Create .env file in server folder
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your_secret_key_here
PORT=5000
```

### 3. Seed Database

```bash
cd server
node seed.js
```

This creates:
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Open Browser

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

---

## 🐳 Docker Quick Start (2 Minutes)

```bash
# Start everything (MongoDB + Backend + Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

Access at: http://localhost:5000

---

## ☁️ Deploy to Vercel (Frontend)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repo
5. Set **Root Directory** to `frontend`
6. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: Your backend API URL (e.g., `https://your-api.railway.app/api/v1`)
7. Click "Deploy"

Done! ✅

---

## 🚂 Deploy to Railway (Backend)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add **MongoDB** database from Railway
5. Set **Root Directory** to `server`
6. Add Environment Variables:
   - `MONGODB_URI`: (Auto-filled by Railway)
   - `JWT_SECRET`: Your secret key
   - `PORT`: 5000
   - `CORS_ORIGINS`: Your Vercel frontend URL
7. Click "Deploy"

Done! ✅

---

## 📋 Deployment Checklist

### Before First Deployment

- [ ] Create MongoDB database (MongoDB Atlas or Railway)
- [ ] Generate secure JWT_SECRET
- [ ] Update CORS_ORIGINS with frontend domain
- [ ] Run seed script on production database
- [ ] Test admin login works
- [ ] Test user registration works

### After Deployment

- [ ] Test all user flows
- [ ] Test admin CRUD operations
- [ ] Test image uploads
- [ ] Test cart and checkout
- [ ] Check mobile responsiveness
- [ ] Monitor error logs

---

## 🔧 Troubleshooting

### CORS Error
```
Access to fetch has been blocked by CORS policy
```
**Fix:** Add your frontend URL to `CORS_ORIGINS` in backend `.env`

### Database Connection Error
```
MongooseError: Could not connect to any servers
```
**Fix:** Check MongoDB connection string and whitelist your IP

### 404 on API Calls
```
Failed to fetch from API
```
**Fix:** Verify `VITE_API_URL` in frontend `.env.production`

---

## 📞 Need Help?

- Create an issue on GitHub
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides
- Review backend logs: `docker-compose logs backend`
- Review frontend console in browser DevTools

---

Happy Coding! 🎉
