# 🧪 EcoSnap API Examples - Test Your Backend

Use these examples to test your backend API. Ensure the backend is running on `http://localhost:5000`.

## Quick Start Test

**Terminal Command:**
```bash
curl http://localhost:5000/health
```

**Expected Response (200 OK):**
```json
{
  "status": "ok",
  "message": "EcoSnap Backend is running",
  "timestamp": "2026-03-21T10:30:00.000Z"
}
```

---

## 📊 Test Endpoints

### 1. CREATE A SCAN (POST)

**PowerShell:**
```powershell
$body = @{
    itemType = "Plastic Bottle"
    confidence = 99
    location = "Manhattan, NY"
    username = "EcoWarrior_NYC"
    carbonSaved = 2.5
    latitude = 40.7128
    longitude = -74.0060
} | ConvertTo-Json

curl.exe -X POST http://localhost:5000/api/scans `
  -H "Content-Type: application/json" `
  -d $body
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/scans \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "Plastic Bottle",
    "confidence": 99,
    "location": "Manhattan, NY",
    "username": "EcoWarrior_NYC",
    "carbonSaved": 2.5
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Scan created successfully",
  "data": {
    "_id": "609f8a2c8b1f2a3b4c5d6e7f",
    "itemType": "Plastic Bottle",
    "confidence": 99,
    "location": "Manhattan, NY",
    "username": "EcoWarrior_NYC",
    "carbonSaved": 2.5,
    "latitude": 40.7128,
    "longitude": -74.0060,
    "createdAt": "2026-03-21T10:30:00.000Z"
  }
}
```

---

### 2. GET RECENT SCANS (GET)

**PowerShell:**
```powershell
curl.exe http://localhost:5000/api/scans
```

**cURL:**
```bash
curl http://localhost:5000/api/scans
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "609f8a2c8b1f2a3b4c5d6e7f",
      "itemType": "Plastic Bottle",
      "confidence": 99,
      "location": "Manhattan, NY",
      "username": "EcoWarrior_NYC",
      "carbonSaved": 2.5,
      "createdAt": "2026-03-21T10:30:00.000Z"
    },
    {
      "_id": "609f8a2c8b1f2a3b4c5d6e7e",
      "itemType": "Glass Jar",
      "confidence": 94,
      "location": "Brooklyn, NY",
      "username": "GreenGuardian",
      "carbonSaved": 1.8,
      "createdAt": "2026-03-21T10:25:00.000Z"
    },
    ...
  ]
}
```

---

### 3. GET GLOBAL LEADERBOARD (GET)

**PowerShell:**
```powershell
curl.exe http://localhost:5000/api/leaderboard
```

**cURL:**
```bash
curl http://localhost:5000/api/leaderboard
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "609f8a2c8b1f2a3b4c5d6e7f",
      "username": "EcoWarrior_NYC",
      "carbonSaved": 156.8,
      "scans": 247,
      "location": "New York",
      "joinedAt": "2025-06-15T...",
      "rank": 1
    },
    {
      "_id": "609f8a2c8b1f2a3b4c5d6e7e",
      "username": "GreenGuardian",
      "carbonSaved": 142.3,
      "scans": 189,
      "location": "Los Angeles",
      "joinedAt": "2025-07-20T...",
      "rank": 2
    },
    ...
  ]
}
```

---

### 4. GET USER PROFILE (GET)

**PowerShell:**
```powershell
curl.exe http://localhost:5000/api/users/EcoWarrior_NYC
```

**cURL:**
```bash
curl http://localhost:5000/api/users/EcoWarrior_NYC
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "609f8a2c8b1f2a3b4c5d6e7f",
    "username": "EcoWarrior_NYC",
    "email": "user@example.com",
    "carbonSaved": 156.8,
    "scans": 247,
    "location": "New York",
    "joinedAt": "2025-06-15T12:30:00.000Z",
    "updatedAt": "2026-03-21T10:30:00.000Z"
  }
}
```

---

### 5. GET GLOBAL STATISTICS (GET)

**PowerShell:**
```powershell
curl.exe http://localhost:5000/api/stats
```

**cURL:**
```bash
curl http://localhost:5000/api/stats
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "stats": {
    "totalScans": 2847,
    "totalUsers": 47300,
    "totalCarbonSaved": 8100000
  }
}
```

---

### 6. DELETE SCAN BY ID (DELETE)

First, create a scan and note the `_id`, then delete it:

**PowerShell:**
```powershell
curl.exe -X DELETE http://localhost:5000/api/scans/609f8a2c8b1f2a3b4c5d6e7f
```

**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/scans/609f8a2c8b1f2a3b4c5d6e7f
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Scan deleted successfully",
  "data": {
    "_id": "609f8a2c8b1f2a3b4c5d6e7f",
    "itemType": "Plastic Bottle",
    ...
  }
}
```

---

## 🔥 Batch Test Script (PowerShell)

Copy and run this entire script to test all endpoints:

```powershell
# Test Health
Write-Host "🔍 Testing Health Check..." -ForegroundColor Green
curl.exe http://localhost:5000/health
Write-Host "`n"

# Create Scans
Write-Host "📝 Creating Scan 1..." -ForegroundColor Green
$body1 = @{
    itemType = "Plastic Bottle"
    confidence = 99
    location = "Manhattan, NY"
    username = "TestUser"
    carbonSaved = 2.5
} | ConvertTo-Json
curl.exe -X POST http://localhost:5000/api/scans `
  -H "Content-Type: application/json" `
  -d $body1
Write-Host "`n"

# Get Recent Scans
Write-Host "📊 Getting Recent Scans..." -ForegroundColor Green
curl.exe http://localhost:5000/api/scans
Write-Host "`n"

# Get Leaderboard
Write-Host "🏆 Getting Leaderboard..." -ForegroundColor Green
curl.exe http://localhost:5000/api/leaderboard
Write-Host "`n"

# Get Stats
Write-Host "📈 Getting Global Stats..." -ForegroundColor Green
curl.exe http://localhost:5000/api/stats
Write-Host "`n"

# Get User Profile
Write-Host "👤 Getting User Profile..." -ForegroundColor Green
curl.exe http://localhost:5000/api/users/TestUser
```

---

## 📮 Postman Collection (Import)

Create a file named `EcoSnap.postman_collection.json`:

```json
{
  "info": {
    "name": "EcoSnap API",
    "version": "1.0"
  },
  "item": [
    {
      "name": "Health",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/health"
      }
    },
    {
      "name": "Get Scans",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/api/scans"
      }
    },
    {
      "name": "Create Scan",
      "request": {
        "method": "POST",
        "url": "{{BASE_URL}}/api/scans",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"itemType\": \"Plastic Bottle\",\n  \"confidence\": 99,\n  \"location\": \"Manhattan, NY\",\n  \"username\": \"TestUser\",\n  \"carbonSaved\": 2.5\n}"
        }
      }
    },
    {
      "name": "Get Leaderboard",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/api/leaderboard"
      }
    },
    {
      "name": "Get Stats",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/api/stats"
      }
    }
  ],
  "variable": [
    {
      "key": "BASE_URL",
      "value": "http://localhost:5000"
    }
  ]
}
```

1. Open Postman
2. Click Import
3. Paste the JSON above
4. Set variable `BASE_URL` to `http://localhost:5000`
5. Run requests

---

## ✅ Full Workflow Test

This sequence demonstrates the full EcoSnap workflow:

```bash
# 1. Check server health
curl http://localhost:5000/health

# 2. Create your first scan
curl -X POST http://localhost:5000/api/scans \
  -H "Content-Type: application/json" \
  -d '{"itemType":"Plastic Bottle","confidence":99,"username":"MyName","location":"NYC"}'

# 3. Check recent scans (should see your scan)
curl http://localhost:5000/api/scans

# 4. Check leaderboard (should see your name)
curl http://localhost:5000/api/leaderboard

# 5. Check your profile
curl http://localhost:5000/api/users/MyName

# 6. Check global stats
curl http://localhost:5000/api/stats
```

---

## 🐛 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "itemType and confidence are required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "User not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 💡 Pro Tips

1. **Copy Scan IDs** - Use returned `_id` for DELETE operations
2. **Test Validation** - Try creating scan with invalid confidence (> 100)
3. **Monitor MongoDB** - Check Atlas dashboard as you create scans
4. **Use Environment Variables** - Store API URLs in `.env`
5. **Add Headers** - Always use `Content-Type: application/json` for POST

---

**All tests passing?** Your backend is production-ready! 🎉

Connect it to your React frontend using the integration guide.
