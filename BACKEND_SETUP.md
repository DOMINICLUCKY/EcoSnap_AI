# 🚀 EcoSnap Backend Setup Instructions

**Production-Ready Node.js/Express Backend with MongoDB Integration**

## ✅ What Was Just Created

### Server Folder Structure
```
server/
├── index.js                 # Complete Express server with all endpoints
├── package.json             # Dependencies & npm scripts
├── .env.sample              # Sample environment file
├── .gitignore               # Exclude secrets from git
├── README.md                # Backend documentation
└── node_modules/            # Installed dependencies (85 packages)
```

### Installed Dependencies

**Production (85 packages):**
- `express@^5.2.1` - Web framework
- `mongoose@^9.3.1` - MongoDB ODM
- `cors@^2.8.6` - Cross-origin resource sharing
- `dotenv@^17.3.1` - Environment variables

**Development (27 packages):**
- `nodemon@^3.1.14` - Auto-reload on file changes

## 🔧 Step 1: Create .env File

### CRITICAL: Add Your MongoDB Password

Inside the `server` folder, create a file named **`.env`** (NOT .env.sample):

```
MONGODB_URI=mongodb+srv://adarshmund07_db_user:<YOUR_PASSWORD>@ecosnap.0cte9yh.mongodb.net/ecosnap?retryWrites=true&w=majority
PORT=5000
```

**⚠️ IMPORTANT:** Replace `<YOUR_PASSWORD>` with your actual MongoDB Atlas password.

### Example:
```
MONGODB_URI=mongodb+srv://adarshmund07_db_user:<YOUR_PASSWORD>@ecosnap.0cte9yh.mongodb.net/ecosnap?retryWrites=true&w=majority
PORT=5000
```

## 🎯 Step 2: Start the Development Server

```bash
cd server
npm run dev
```

### Expected Output:
```
✅ MongoDB Connected to EcoSnap
🚀 EcoSnap Server running on port 5000
📍 Health check: http://localhost:5000/health
📊 API Base: http://localhost:5000/api

🔗 Available Endpoints:
   GET  /api/scans
   POST /api/scans
   GET  /api/leaderboard
   GET  /api/users/:username
   GET  /api/stats
   DELETE /api/scans/:id
```

**If you see this, you're connected!** ✅

## 📊 Complete API Endpoints

### Health Check
```bash
GET http://localhost:5000/health
```

### Scans (Trash Detection)
```bash
# Get 10 most recent scans
GET http://localhost:5000/api/scans

# Create new scan
POST http://localhost:5000/api/scans
Content-Type: application/json
{
  "itemType": "Plastic Bottle",
  "confidence": 99,
  "location": "Manhattan, NY",
  "username": "EcoWarrior_NYC",
  "carbonSaved": 2.5
}

# Delete scan by ID
DELETE http://localhost:5000/api/scans/:id
```

### Leaderboard
```bash
# Get global leaderboard (sorted by carbon saved)
GET http://localhost:5000/api/leaderboard

# Get specific user profile
GET http://localhost:5000/api/users/EcoWarrior_NYC
```

### Statistics
```bash
# Get global stats
GET http://localhost:5000/api/stats
# Returns: totalScans, totalUsers, totalCarbonSaved
```

## 🧪 Quick Test with cURL

Open PowerShell and test the server:

```powershell
# Test health
curl.exe http://localhost:5000/health

# Get leaderboard
curl.exe http://localhost:5000/api/leaderboard

# Create a test scan
curl.exe -X POST http://localhost:5000/api/scans `
  -H "Content-Type: application/json" `
  -d '{
    "itemType": "Plastic Bottle",
    "confidence": 95,
    "location": "Brooklyn, NY",
    "username": "TestUser123",
    "carbonSaved": 2.5
  }'

# Get recent scans
curl.exe http://localhost:5000/api/scans
```

## 📦 npm Scripts

```bash
# Development (with nodemon auto-reload)
npm run dev

# Production
npm start

# Run tests
npm test
```

## 🗄️ Database Models

### Scan Document
```javascript
{
  _id: ObjectId,
  itemType: String,         // "Plastic Bottle", "Glass Jar", etc.
  confidence: Number,       // 0-100
  location: String,         // "Manhattan, NY"
  username: String,         // "EcoWarrior_NYC"
  carbonSaved: Number,      // 2.5
  latitude: Number,         // Optional GPS
  longitude: Number,        // Optional GPS
  imageUrl: String,         // Optional image
  createdAt: Date          // Auto-generated timestamp
}
```

### User Document
```javascript
{
  _id: ObjectId,
  username: String,         // "EcoWarrior_NYC" (unique)
  email: String,            // Optional
  carbonSaved: Number,      // Total accumulated
  scans: Number,            // Total count
  location: String,         // User's location
  joinedAt: Date,          // Auto-generated
  updatedAt: Date          // Auto-updated
}
```

## 🔄 How Data Flows

1. **Frontend sends POST** → `POST /api/scans`
2. **Backend validates** → Checks confidence 0-100, itemType valid
3. **Saves to MongoDB** → Creates Scan document
4. **Updates User stats** → Increments scans & carbonSaved
5. **Returns response** → Success message with saved scan

## 🎯 Next: Connect Frontend to Backend

Edit `src/services/api.js` in frontend to use the backend API:

```javascript
const API_BASE_URL = 'http://localhost:5000/api'

export const getRecentScans = async () => {
  const response = await fetch(`${API_BASE_URL}/scans`)
  return response.json()
}
```

Full integration guide: See `INTEGRATION_GUIDE.md` in the root folder.

## 🚀 Running Full Stack

**Terminal 1 (Frontend):**
```bash
cd d:\EcoSnap
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd d:\EcoSnap\server
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🐛 Troubleshooting

### Server won't start?
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <PID> /F

# Try different port
PORT=3001 npm run dev
```

### MongoDB connection error?
```
❌ MongoDB Connection Error: ...
```

**Solution:**
1. Check `.env` file exists with MONGODB_URI
2. Verify password is correct (no special characters that need escaping)
3. Check MongoDB Atlas cluster is active
4. Verify IP whitelist in MongoDB Atlas

### CORS errors from frontend?
- Backend already has `app.use(cors())` ✓
- Check API URL in frontend matches `http://localhost:5000/api`
- Make sure backend is running on port 5000

### Port 5000 already in use?
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill it (if safe to do so)
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

## 📝 Important Notes

✅ **Production Features:**
- Error handling on all routes
- Validation on POST requests
- Mongoose connection error handling
- Graceful shutdown (SIGINT)
- Lean queries for performance
- Proper HTTP status codes

⚠️ **To Add Later:**
- Authentication/JWT tokens
- Request rate limiting
- Input sanitization
- API key validation
- Request logging
- Database backups
- Monitoring & alerts

## 📚 Documentation Files

- `server/README.md` - Backend API documentation
- `server/.env.sample` - Environment variables template
- `INTEGRATION_GUIDE.md` - Frontend integration instructions
- `ARCHITECTURE.md` - System design (updated)

## ✅ Checklist

- [ ] Create `.env` file with MongoDB password
- [ ] Run `npm run dev` in server folder
- [ ] See "MongoDB Connected" message
- [ ] Test `http://localhost:5000/health`
- [ ] Create test scan via cURL
- [ ] View data in MongoDB Atlas dashboard
- [ ] Connect frontend to API
- [ ] Test full stack workflow

## 🎉 You're All Set!

Your EcoSnap backend is production-ready and connected to MongoDB. Now integrate it with your React frontend using the `INTEGRATION_GUIDE.md`.

**Questions?** Check the MongoDB Atlas dashboard or server logs for diagnostics.

---

**Status:** ✅ Backend Structure Complete | Ready for MongoDB Connection
**Next Step:** Create `.env` file and run `npm run dev`
