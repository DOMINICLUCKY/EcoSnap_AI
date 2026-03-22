require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const User = require('./models/User');

const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());

// ============================================
// MONGODB CONNECTION
// ============================================
mongoose.connect(process.env.MONGODB_URI, {
  ssl: true,
  tlsInsecure: true,
  retryWrites: true,
  w: 'majority'
})
  .then(() => {
    console.log('✅ MongoDB Connected to EcoSnap');
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  });

// ============================================
// MONGOOSE SCHEMAS & MODELS
// ============================================

// Scan Schema: Represents each trash detection scan
const ScanSchema = new mongoose.Schema({
  itemType: {
    type: String,
    required: true,
    default: 'Unknown'
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  location: {
    type: String,
    default: 'Unknown'
  },
  username: {
    type: String,
    default: 'Anonymous'
  },
  carbonSaved: {
    type: Number,
    default: 2.5
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  imageUrl: {
    type: String,
    default: null
  },
  upcycleIdea: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Create Scan model
const Scan = mongoose.model('Scan', ScanSchema);
// User model imported from models/User.js

// ============================================
// AUTHENTICATION ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// ============================================
// API ROUTES
// ============================================

/**
 * GET /api/scans
 * Fetch the 10 most recent scans sorted by createdAt descending
 */
app.get('/api/scans', async (req, res) => {
  try {
    const scans = await Scan.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    // Return as plain array for simpler frontend integration
    res.status(200).json(scans);
  } catch (error) {
    console.error('❌ Error fetching scans:', error.message);
    res.status(200).json([]);
  }
});

/**
 * POST /api/scans
 * Create a new scan document and save it to the database
 */
app.post('/api/scans', async (req, res) => {
  try {
    const { itemType, confidence, location, username, carbonSaved, latitude, longitude, imageUrl } = req.body;

    // Validation
    if (!itemType || confidence === undefined) {
      return res.status(400).json({
        success: false,
        error: 'itemType and confidence are required'
      });
    }

    if (confidence < 0 || confidence > 100) {
      return res.status(400).json({
        success: false,
        error: 'confidence must be between 0 and 100'
      });
    }

    // Create new scan
    const newScan = new Scan({
      itemType,
      confidence,
      location: location || 'Unknown',
      username: username || 'Anonymous',
      carbonSaved: carbonSaved || 2.5,
      latitude: latitude || null,
      longitude: longitude || null,
      imageUrl: imageUrl || null,
      createdAt: new Date()
    });

    // Save to database
    const savedScan = await newScan.save();

    // Update user stats if username provided
    if (username) {
      await User.findOneAndUpdate(
        { username },
        {
          $inc: { scans: 1, carbonSaved: carbonSaved || 2.5 },
          $set: { updatedAt: new Date() }
        },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Scan created successfully',
      data: savedScan
    });
  } catch (error) {
    console.error('❌ Error creating scan:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/leaderboard
 * Fetch users sorted by carbonSaved descending (global leaderboard)
 */
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ carbonSaved: -1 })
      .lean();
    
    // Add rank
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    res.status(200).json({
      success: true,
      count: rankedLeaderboard.length,
      data: rankedLeaderboard
    });
  } catch (error) {
    console.error('❌ Error fetching leaderboard:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/users/:username
 * Fetch a specific user's profile and stats
 */
app.get('/api/users/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('❌ Error fetching user:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/stats
 * Fetch global statistics (total scans, total carbon saved, etc.)
 */
app.get('/api/stats', async (req, res) => {
  try {
    const totalScans = await Scan.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalCarbonSaved = await User.aggregate([
      {
        $group: {
          _id: null,
          totalCarbon: { $sum: '$carbonSaved' }
        }
      }
    ]);

    const carbonSum = totalCarbonSaved.length > 0 ? totalCarbonSaved[0].totalCarbon : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalScans,
        totalUsers,
        totalCarbonSaved: parseFloat(carbonSum.toFixed(2))
      }
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/scans/user/:username
 * Fetch all scans for a specific user
 */
app.get('/api/scans/user/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const userScans = await Scan.find({ username })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(userScans);
  } catch (error) {
    console.error('❌ Error fetching user scans:', error.message);
    res.status(200).json([]);
  }
});

/**
 * GET /api/heatmap
 * Fetch scan locations for heatmap visualization
 */
app.get('/api/heatmap', async (req, res) => {
  try {
    const heatmapData = await Scan.find(
      { latitude: { $ne: null }, longitude: { $ne: null } }
    )
      .select('latitude longitude itemType confidence createdAt')
      .lean();

    res.status(200).json(heatmapData);
  } catch (error) {
    console.error('❌ Error fetching heatmap data:', error.message);
    res.status(200).json([]);
  }
});

/**
 * GET /api/stats/user/:username
 * Fetch detailed stats for a specific user
 */
app.get('/api/stats/user/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userScans = await Scan.find({ username }).lean();
    const itemCounts = {};
    
    userScans.forEach(scan => {
      itemCounts[scan.itemType] = (itemCounts[scan.itemType] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        ...user,
        totalScans: userScans.length,
        itemBreakdown: itemCounts,
        averageConfidence: userScans.length > 0 
          ? (userScans.reduce((sum, s) => sum + s.confidence, 0) / userScans.length).toFixed(2)
          : 0
      }
    });
  } catch (error) {
    console.error('❌ Error fetching user stats:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/scans/:id/upcycle
 * Save upcycle idea for a scan
 */
app.post('/api/scans/:id/upcycle', async (req, res) => {
  try {
    const { id } = req.params;
    const { upcycleIdea } = req.body;

    const updatedScan = await Scan.findByIdAndUpdate(
      id,
      { upcycleIdea },
      { new: true }
    );

    if (!updatedScan) {
      return res.status(404).json({
        success: false,
        error: 'Scan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Upcycle idea saved',
      data: updatedScan
    });
  } catch (error) {
    console.error('❌ Error saving upcycle idea:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/daily
 * Fetch daily scan statistics
 */
app.get('/api/analytics/daily', async (req, res) => {
  try {
    const dailyStats = await Scan.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          carbonSaved: { $sum: '$carbonSaved' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);

    res.status(200).json({
      success: true,
      data: dailyStats
    });
  } catch (error) {
    console.error('❌ Error fetching daily analytics:', error.message);
    res.status(200).json({ success: true, data: [] });
  }
});

/**
 * GET /api/top-items
 * Fetch most commonly detected items
 */
app.get('/api/top-items', async (req, res) => {
  try {
    const topItems = await Scan.aggregate([
      {
        $group: {
          _id: '$itemType',
          count: { $sum: 1 },
          avgConfidence: { $avg: '$confidence' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: topItems
    });
  } catch (error) {
    console.error('❌ Error fetching top items:', error.message);
    res.status(200).json({ success: true, data: [] });
  }
});

/**
 * DELETE /api/scans/:id
 * Delete a scan by ID (admin/user feature)
 */
app.delete('/api/scans/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedScan = await Scan.findByIdAndDelete(id);

    if (!deletedScan) {
      return res.status(404).json({
        success: false,
        error: 'Scan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Scan deleted successfully',
      data: deletedScan
    });
  } catch (error) {
    console.error('❌ Error deleting scan:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'EcoSnap Backend is running',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// ============================================
// SERVER STARTUP
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 EcoSnap Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 API Base: http://localhost:${PORT}/api`);
  console.log(`\n🔗 Available Endpoints:`);
  console.log(`\n   🔐 AUTHENTICATION ROUTES:`);
  console.log(`   POST   /api/auth/register                (Local signup)`);
  console.log(`   POST   /api/auth/login                   (Local login)`);
  console.log(`   POST   /api/auth/google                  (Google OAuth)`);
  console.log(`   GET    /api/auth/verify-email/:token     (Email verification)`);
  console.log(`   GET    /api/auth/me                      (Current user - protected)`);
  console.log(`\n   📊 SCAN & LEADERBOARD ROUTES:`);
  console.log(`   GET    /api/scans`);
  console.log(`   POST   /api/scans`);
  console.log(`   GET    /api/scans/user/:username          (User scan history)`);
  console.log(`   POST   /api/scans/:id/upcycle             (Save upcycle idea)`);
  console.log(`   DELETE /api/scans/:id`);
  console.log(`   GET    /api/leaderboard                   (Global rankings)`);
  console.log(`   GET    /api/users/:username               (User profile)`);
  console.log(`   GET    /api/stats                         (Global stats)`);
  console.log(`   GET    /api/stats/user/:username          (User detailed stats)`);
  console.log(`   GET    /api/heatmap                       (Location-based scans)`);
  console.log(`   GET    /api/analytics/daily               (Daily statistics)`);
  console.log(`   GET    /api/top-items                     (Most detected items)\n`);
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down EcoSnap Server...');
  mongoose.connection.close()
    .then(() => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error closing MongoDB connection:', error);
      process.exit(1);
    });
});
