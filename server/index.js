require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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
    enum: ['Plastic Bottle', 'Glass Jar', 'Aluminum Can', 'Plastic Bag', 'Metal Cans', 'Organic Waste', 'Paper', 'Other'],
    default: 'Other'
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
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// User Schema: Represents leaderboard users
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    default: null
  },
  carbonSaved: {
    type: Number,
    default: 0
  },
  scans: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    default: 'Unknown'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create models from schemas
const Scan = mongoose.model('Scan', ScanSchema);
const User = mongoose.model('User', UserSchema);

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
    
    res.status(200).json({
      success: true,
      count: scans.length,
      data: scans
    });
  } catch (error) {
    console.error('❌ Error fetching scans:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
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
  console.log(`   GET  /api/scans`);
  console.log(`   POST /api/scans`);
  console.log(`   GET  /api/leaderboard`);
  console.log(`   GET  /api/users/:username`);
  console.log(`   GET  /api/stats`);
  console.log(`   DELETE /api/scans/:id`);
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
