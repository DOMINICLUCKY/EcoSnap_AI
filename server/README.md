# EcoSnap Backend Server

**Production-ready Node.js/Express backend with MongoDB integration for the EcoSnap AI trash detection platform.**

## 📋 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Middleware**: CORS, JSON body parser
- **Development**: Nodemon for auto-reload
- **Environment**: dotenv for config management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free cluster available)
- npm or yarn

### Installation

```bash
cd server
npm install
```

### Environment Setup

1. **Create a `.env` file** in the server folder:
```env
MONGODB_URI=mongodb+srv://adarshmund07_db_user:<YOUR_PASSWORD>@ecosnap.0cte9yh.mongodb.net/ecosnap?retryWrites=true&w=majority
PORT=5000
```

2. **Replace `<YOUR_PASSWORD>`** with your MongoDB Atlas password

3. **Create the `.env` file:**
```bash
cp .env.sample .env
# Then edit .env and add your MongoDB password
```

### Development

```bash
npm run dev
```

Expected output:
```
✅ MongoDB Connected to EcoSnap
🚀 EcoSnap Server running on port 5000
📍 Health check: http://localhost:5000/health
📊 API Base: http://localhost:5000/api
```

### Production

```bash
npm start
```

## 📊 Database Models

### Scan Schema
```javascript
{
  _id: ObjectId,
  itemType: String,          // e.g., "Plastic Bottle", "Glass Jar"
  confidence: Number,        // 0-100
  location: String,          // e.g., "Manhattan, NY"
  username: String,          // Creator of the scan
  carbonSaved: Number,       // kg CO2 equivalent
  latitude: Number,          // Optional GPS
  longitude: Number,         // Optional GPS
  imageUrl: String,          // Optional image URL
  createdAt: Date            // Auto-generated
}
```

### User Schema
```javascript
{
  _id: ObjectId,
  username: String,          // Unique username
  email: String,             // Optional
  carbonSaved: Number,       // Total accumulated
  scans: Number,             // Total scans submitted
  location: String,          // User location
  joinedAt: Date,            // Auto-generated
  updatedAt: Date            // Auto-updated
}
```

## 🔌 API Endpoints

### Health Check
```bash
GET /health
# Returns: { status: "ok", message: "...", timestamp: "..." }
```

### Scans

**Get Recent Scans (10 most recent)**
```bash
GET /api/scans

# Response:
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "itemType": "Plastic Bottle",
      "confidence": 99,
      "location": "Manhattan, NY",
      "username": "EcoWarrior_NYC",
      "carbonSaved": 2.5,
      "createdAt": "2026-03-21T10:30:00Z"
    },
    ...
  ]
}
```

**Create New Scan**
```bash
POST /api/scans
Content-Type: application/json

{
  "itemType": "Plastic Bottle",
  "confidence": 99,
  "location": "Manhattan, NY",
  "username": "EcoWarrior_NYC",
  "carbonSaved": 2.5,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "imageUrl": "https://..."
}

# Response:
{
  "success": true,
  "message": "Scan created successfully",
  "data": { ... }
}
```

**Delete Scan**
```bash
DELETE /api/scans/:id

# Response:
{
  "success": true,
  "message": "Scan deleted successfully",
  "data": { ... }
}
```

### Users & Leaderboard

**Get Global Leaderboard**
```bash
GET /api/leaderboard

# Response:
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "...",
      "username": "EcoWarrior_NYC",
      "carbonSaved": 156.8,
      "scans": 247,
      "location": "New York",
      "rank": 1
    },
    ...
  ]
}
```

**Get User Profile**
```bash
GET /api/users/:username

# Example: GET /api/users/EcoWarrior_NYC

# Response:
{
  "success": true,
  "data": {
    "username": "EcoWarrior_NYC",
    "carbonSaved": 156.8,
    "scans": 247,
    "location": "New York",
    "joinedAt": "2025-06-15T..."
  }
}
```

### Statistics

**Get Global Stats**
```bash
GET /api/stats

# Response:
{
  "success": true,
  "stats": {
    "totalScans": 2847,
    "totalUsers": 47300,
    "totalCarbonSaved": 8100000
  }
}
```

## 🔒 Security Considerations

- ✅ CORS enabled for frontend integration
- ✅ Environment variables for sensitive data
- ✅ Input validation on POST requests
- ✅ MongoDB connection error handling
- ⚠️ TODO: Add authentication/JWT tokens
- ⚠️ TODO: Add request rate limiting
- ⚠️ TODO: Add API key validation

## 📦 Project Structure

```
server/
├── index.js                 # Main server file
├── .env                     # Environment variables (NOT in git)
├── .env.sample              # Sample env file
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies & scripts
├── package-lock.json        # Locked dependency versions
└── node_modules/            # Installed packages
```

## 🚀 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create and deploy
heroku create ecosnap-api
git push heroku main
```

### Deploy to Railway/Render

1. Push code to GitHub
2. Connect repository to railway.app or render.com
3. Set environment variables
4. Deploy

### DockerFile (Coming Soon)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing Endpoints

### Using cURL

```bash
# Create a scan
curl -X POST http://localhost:5000/api/scans \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "Plastic Bottle",
    "confidence": 95,
    "location": "Brooklyn, NY",
    "username": "TestUser",
    "carbonSaved": 2.5
  }'

# Get scans
curl http://localhost:5000/api/scans

# Get leaderboard
curl http://localhost:5000/api/leaderboard

# Get stats
curl http://localhost:5000/api/stats
```

### Using Postman

1. Import collection (coming soon)
2. Set `{{BASE_URL}}` to `http://localhost:5000`
3. Execute requests

## 📈 Performance Optimization

- **Lean queries**: Use `.lean()` for read-only operations
- **Indexing**: Created on `createdAt` for faster sorts
- **Pagination**: Can be added to `/api/scans` endpoint
- **Caching**: Consider Redis for hot data

## 🐛 Debugging

### Enable verbose logging:
```javascript
mongoose.set('debug', true);
```

### Check MongoDB connection:
```bash
curl http://localhost:5000/health
```

### Monitor MongoDB:
- Use MongoDB Atlas dashboard
- Check Metrics & Activity tabs

## 🔄 Next Steps

1. ✅ Connect MongoDB Atlas
2. ✅ Run development server
3. 🔜 Integrate with frontend React app
4. 🔜 Add image upload functionality
5. 🔜 Add user authentication
6. 🔜 Add API rate limiting
7. 🔜 Deploy to production

## 📝 License

© 2026 EcoSnap AI | Enterprise Edition

---

**Questions?** Check MongoDB Compass or Atlas dashboard for database inspection.
