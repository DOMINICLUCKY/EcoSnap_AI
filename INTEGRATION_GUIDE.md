# Frontend-Backend Integration Guide for EcoSnap

This guide shows how to connect your React frontend to the EcoSnap backend API.

## 🔗 Setting Up API Client

### 1. Create an API Service File

Create `src/services/api.js` in your frontend:

```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===========================
// SCANS API
// ===========================

export const getRecentScans = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/scans`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching scans:', error);
    return [];
  }
};

export const createScan = async (scanData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/scans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scanData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating scan:', error);
    throw error;
  }
};

export const deleteScan = async (scanId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/scans/${scanId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting scan:', error);
    throw error;
  }
};

// ===========================
// LEADERBOARD API
// ===========================

export const getLeaderboard = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export const getUserProfile = async (username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${username}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// ===========================
// STATS API
// ===========================

export const getGlobalStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
};

// ===========================
// HEALTH CHECK
// ===========================

export const checkHealth = async () => {
  try {
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};
```

### 2. Add Environment Variables

Create `.env` in the frontend root:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Use in Components

Example in Dashboard:

```javascript
import { useEffect, useState } from 'react'
import { getRecentScans, getGlobalStats } from '../services/api'

export default function Dashboard() {
  const [scans, setScans] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    // Fetch recent scans
    const fetchScans = async () => {
      const data = await getRecentScans()
      setScans(data)
    }

    // Fetch global stats
    const fetchStats = async () => {
      const data = await getGlobalStats()
      setStats(data)
    }

    fetchScans()
    fetchStats()
  }, [])

  return (
    <div>
      <h1>Total Items Detected: {stats?.totalScans || 0}</h1>
      <h2>Community Size: {stats?.totalUsers || 0}</h2>
      <h3>Carbon Saved: {stats?.totalCarbonSaved || 0} kg</h3>

      <h2>Recent Scans</h2>
      <ul>
        {scans.map(scan => (
          <li key={scan._id}>
            {scan.itemType} - {scan.confidence}% - {scan.location}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

Example in Leaderboard:

```javascript
import { useEffect, useState } from 'react'
import { getLeaderboard } from '../services/api'

export default function Leaderboard() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard()
      setUsers(data)
    }
    fetchLeaderboard()
  }, [])

  return (
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Scans</th>
          <th>Carbon Saved (kg)</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id}>
            <td>{user.rank}</td>
            <td>{user.username}</td>
            <td>{user.scans}</td>
            <td>{user.carbonSaved.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### 4. Handle Real-Time Updates (Optional)

Use polling:

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    fetchScans()
  }, 5000) // Update every 5 seconds

  return () => clearInterval(interval)
}, [])
```

Or WebSockets (advanced):

```javascript
const socket = io('http://localhost:5000')
socket.on('newScan', (scan) => {
  setScans(prev => [scan, ...prev])
})
```

## 🚀 Running Both Frontend & Backend

In separate terminals:

**Terminal 1 - Frontend:**
```bash
cd d:\EcoSnap
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd d:\EcoSnap\server
npm run dev
```

Both will be running:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🐛 Troubleshooting

### Backend not responding?
```bash
# Check if server is running
curl http://localhost:5000/health

# Check MongoDB connection in terminal output
# Should see: "✅ MongoDB Connected to EcoSnap"
```

### CORS errors?
- Make sure backend has `app.use(cors())` (it does ✓)
- Check firewall settings
- Verify API_BASE_URL is correct

### Database not storing data?
- Check `.env` file has correct MONGODB_URI
- Verify MongoDB Atlas cluster is active
- Check network access in MongoDB Atlas dashboard

## 📚 API Response Format

All endpoints return this format:

```javascript
{
  "success": true,
  "data": { ... },
  "message": "..."  // Optional
}

// On error:
{
  "success": false,
  "error": "Error message"
}
```

---

**Ready to integrate!** Start both servers and begin building the full-stack EcoSnap experience!
