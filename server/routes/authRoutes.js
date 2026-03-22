const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  verifyEmail,
  protect
} = require('../controllers/authController');

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * POST /api/auth/register
 * Register a new local user
 * Body: { name, email, password, confirmPassword }
 */
router.post('/register', registerUser);

/**
 * POST /api/auth/login
 * Login with email and password
 * Body: { email, password }
 */
router.post('/login', loginUser);

/**
 * POST /api/auth/google
 * Login with Google OAuth token
 * Body: { tokenId }
 */
router.post('/google', googleLogin);

/**
 * GET /api/auth/verify-email/:token
 * Verify email with token
 * Params: { token }
 */
router.get('/verify-email/:token', verifyEmail);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

/**
 * GET /api/auth/me
 * Get current authenticated user
 * Headers: { Authorization: 'Bearer <token>' }
 */
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isVerified: req.user.isVerified,
      totalScans: req.user.totalScans,
      carbonSaved: req.user.carbonSaved,
      authProvider: req.user.authProvider,
      streak: req.user.streak
    }
  });
});

module.exports = router;
