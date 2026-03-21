# EcoSnap Authentication System - Complete Implementation Guide

## Overview

Enterprise-grade JWT authentication system with email verification, Google OAuth integration, and secure password hashing.

**Status:** ✅ Complete (Commit: `0cbb7b0`)

---

## 🔐 Backend Architecture

### 1. User Model (`server/models/User.js`)

**Purpose:** Secure user schema with password hashing

**Key Features:**
```javascript
- name: String (required)
- email: String (unique, required)
- password: String (hashed with bcryptjs, 10 salt rounds)
- isVerified: Boolean (default: false)
- authProvider: Enum ['local', 'google']
- totalScans: Number (default: 0)
- carbonSaved: Number (default: 0)
- verificationToken: String (20-char hex, 24hr expiry)
- streak: Number (for leaderboard)
```

**Pre-Save Hook:**
- Automatically hashes password using bcryptjs if modified
- Only runs when password is changed (doesn't re-hash on every update)
- Non-arrow function syntax required for Mongoose hooks

**Methods:**
- `matchPassword(enteredPassword)` - Compares plaintext with hashed password

---

### 2. Authentication Controller (`server/controllers/authController.js`)

#### **registerUser** - Local Account Creation

**Endpoint:** `POST /api/auth/register`

**Input:**
```json
{
  "name": "John Eco",
  "email": "john@example.com",
  "password": "Secure123!",
  "confirmPassword": "Secure123!"
}
```

**Logic:**
1. Validate all required fields
2. Check password match
3. Check for duplicate email (case-insensitive)
4. Generate verification token (20-char random hex)
5. Create user with `authProvider: 'local'`
6. Send verification email (Nodemailer)
7. Return JWT token (30-day expiration)

**Output:**
```json
{
  "success": true,
  "message": "Account created! Please verify your email.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Eco",
    "email": "john@example.com",
    "isVerified": false,
    "authProvider": "local"
  }
}
```

---

#### **loginUser** - Email/Password Authentication

**Endpoint:** `POST /api/auth/login`

**Input:**
```json
{
  "email": "john@example.com",
  "password": "Secure123!"
}
```

**Logic:**
1. Find user by email (case-insensitive)
2. Fetch password field explicitly (marked as `select: false`)
3. Compare with bcrypt.compare()
4. Return JWT token (30-day expiration)

**Output:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Eco",
    "email": "john@example.com",
    "isVerified": true,
    "totalScans": 42,
    "carbonSaved": 125.5
  }
}
```

---

#### **googleLogin** - OAuth 2.0 Token Validation

**Endpoint:** `POST /api/auth/google`

**Input:**
```json
{
  "tokenId": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFiYzEyMyJ9..."
}
```

**Logic:**
1. Verify Google tokenId using OAuth2Client
2. Extract email, name, picture from token payload
3. Check if user with email already exists:
   - **YES:** Generate JWT and return (201 status)
   - **NO:** Create new user with random 16-char password, `authProvider: 'google'`, `isVerified: true`
4. Return JWT token

**Output:**
```json
{
  "success": true,
  "message": "Account created via Google OAuth",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John via Google",
    "email": "john@gmail.com",
    "isVerified": true,
    "authProvider": "google"
  }
}
```

---

#### **verifyEmail** - Email Confirmation

**Endpoint:** `GET /api/auth/verify-email/:token`

**Logic:**
1. Find user with matching verification token
2. Verify token hasn't expired (24-hour window)
3. Set `isVerified = true`
4. Clear token fields

**Output:**
```json
{
  "success": true,
  "message": "Email verified successfully!",
  "user": {
    "id": "user_id",
    "name": "John Eco",
    "email": "john@example.com",
    "isVerified": true
  }
}
```

---

#### **protect** - Auth Middleware

**Purpose:** Verify JWT and attach user to request

**Implementation:**
1. Extract token from `Authorization: Bearer <token>` header
2. Verify JWT signature using `process.env.JWT_SECRET`
3. Decode token to get user ID
4. Query database for user
5. Attach user document to `req.user`
6. Proceed to next middleware

**Usage:**
```javascript
app.get('/api/protected-route', protect, (req, res) => {
  console.log(req.user) // Full user document
})
```

---

### 3. Email Service (`server/utils/emailService.js`)

**sendVerificationEmail(userEmail, token)**

- Configures nodemailer with Gmail SMTP
- Uses Gmail App Password (16 characters)
- Sends HTML email with:
  - Branded EcoSnap header
  - Verification link: `http://localhost:5173/verify-email/{token}`
  - Fallback copy-paste link
  - 24-hour expiration warning
  - Beautiful gradient design

**Email Template Features:**
- Dark theme matching EcoSnap brand
- Emerald accent colors
- Responsive HTML formatting
- Professional call-to-action button
- Support contact link

---

### 4. Auth Routes (`server/routes/authRoutes.js`)

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| POST | `/api/auth/register` | ❌ | Create new account |
| POST | `/api/auth/login` | ❌ | Email/password login |
| POST | `/api/auth/google` | ❌ | Google OAuth login |
| GET | `/api/auth/verify-email/:token` | ❌ | Confirm email address |
| GET | `/api/auth/me` | ✅ | Get current user (protected) |

---

## 🎨 Frontend Integration

### 1. Auth Service (`src/services/authService.js`)

**Centralized API consumption layer**

```javascript
authService.register({name, email, password, confirmPassword})
authService.login({email, password})
authService.googleLogin(tokenId)
authService.verifyEmail(token)
authService.getCurrentUser(token)
authService.logout()
authService.getToken() // Retrieve stored JWT
authService.getUser()  // Retrieve stored user object
authService.isAuthenticated() // Boolean check
```

**Features:**
- All endpoints point to `http://localhost:5000/api/auth`
- Automatically stores token in localStorage
- Stores user object in localStorage
- Includes `Authorization: Bearer <token>` header for protected endpoints
- Comprehensive error handling and messages

---

### 2. Login Page (`src/pages/Login.jsx`)

**Features:**
- Email/password form inputs
- Mail and Lock icons (lucide-react)
- Google OAuth button (UI ready)
- Form validation
- Error message display with red styling
- Loading state management
- Redirect to `/dashboard` on success
- Links to signup and landing page

**Integration:**
- Calls `authService.login()` on submit
- Stores token and user in localStorage
- Shows error alerts for invalid credentials
- Disabled button during loading

---

### 3. SignUp Page (`src/pages/SignUp.jsx`)

**Features:**
- Full Name, Email, Password, Confirm Password inputs
- Real-time password match validation
- User, Mail, Lock icons
- Google OAuth button (UI ready)
- Error display (red background)
- Success display (green background)
- Disabled button when passwords don't match

**Integration:**
- Calls `authService.register()` on submit
- Validates password confirmation on client-side
- Shows success message with email verification note
- Redirects to `/dashboard` after 2 seconds
- Links to login and landing page

---

### 4. Email Verification Page (`src/pages/VerifyEmail.jsx`)

**States:**
1. **Verifying:** Loading spinner while checking token
2. **Success:** Green checkmark, countdown to dashboard redirect
3. **Error:** Red alert, links to create new account or login

**Features:**
- Extracts token from URL params
- Calls `authService.verifyEmail(token)` on mount
- Auto-redirects to `/dashboard` after 3 seconds
- Responsive glassmorphic design
- Error recovery options

---

### 5. Updated Dashboard (`src/pages/Dashboard.jsx`)

**Auth Integration:**
```javascript
// Check auth on component mount
useEffect(() => {
  const token = authService.getToken()
  const user = authService.getUser()
  if (token && user) {
    setIsLoggedIn(true)
    setCurrentUser(user)
  }
}, [])
```

**Features:**
- User info display at top: name, email, login status
- Logout button with redirect to `/login`
- Freemium warning for guests (after 1 scan)
- Scan limit enforced for non-logged-in users
- Profile card styling with emerald accent

---

### 6. Updated Routes (`src/App.jsx`)

```javascript
// PUBLIC ROUTES (no sidebar)
/ → Landing
/login → Login
/signup → SignUp
/verify-email/:token → VerifyEmail

// PROTECTED ROUTES (with Layout sidebar)
/dashboard → Dashboard
/heatmap → Heatmap
/leaderboard → Leaderboard
/news → News
/profile → Profile
```

---

## 🛠 Environment Variables

**Backend (.env in `/server`):**
```
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/ecosnap?retryWrites=true&w=majority
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_key_here_generate_with_crypto

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com

# Email Service (Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
```

**Steps to Get Gmail App Password:**
1. Enable 2-Factor Authentication on Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy 16-character password

---

## 🚀 Testing the Auth System

### Create Account
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "confirmPassword": "Test123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Get Current User (Protected)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📊 Data Flow

### Signup Flow
```
SignUp Form
    ↓
authService.register() → POST /api/auth/register
    ↓
Server: hashPassword → createUser → sendVerificationEmail
    ↓
Return JWT + User Object
    ↓
Frontend: store in localStorage
    ↓
Show success message "Check your email"
    ↓
2-second delay → Redirect to /dashboard
    ↓
User clicks email link → /verify-email/:token
    ↓
VerifyEmail page validates token
    ↓
Server: Sets isVerified = true
    ↓
Redirect to /dashboard
```

### Login Flow
```
Login Form
    ↓
authService.login() → POST /api/auth/login
    ↓
Server: findUser → comparePassword → generateJWT
    ↓
Return JWT + User Object
    ↓
Frontend: store in localStorage
    ↓
Redirect to /dashboard
    ↓
Dashboard checks localStorage → shows user info + logout button
```

### Protected Route Access
```
Request to /api/auth/me
    ↓
Frontend includes: Authorization: Bearer jwt_token
    ↓
Server: protect middleware decodes JWT
    ↓
Server: queries user from database
    ↓
Attaches req.user = user document
    ↓
Route handler uses req.user
```

---

## ✅ Completed Features

- [x] Secure User Model with password hashing (bcryptjs)
- [x] JWT authentication (30-day tokens)
- [x] Email/password login with validation
- [x] Account creation with email verification
- [x] Verification token system (24-hour expiration)
- [x] Email verification notifications (Nodemailer)
- [x] Google OAuth 2.0 integration
- [x] Protect middleware for guarded routes
- [x] Frontend Login page with API integration
- [x] Frontend SignUp page with validation
- [x] Email Verification page with token handling
- [x] Auth service layer (centralized API calls)
- [x] Token persistence in localStorage
- [x] User context display in Dashboard
- [x] Logout functionality
- [x] Freemium paywall for non-logged-in users
- [x] Route separation (public vs protected)

---

## ⏳ Future Enhancements

- [ ] Password reset flow with email link
- [ ] Two-factor authentication (2FA)
- [ ] Social login refinement (Facebook, GitHub)
- [ ] Account settings/profile management
- [ ] Session management (token refresh)
- [ ] OAuth token scope management
- [ ] Admin user roles/permissions
- [ ] Account deactivation/deletion
- [ ] Email change verification
- [ ] Suspicious login notifications

---

## 🔗 Related Documentation

- **BRANDING.md** - Logo, colors, typography
- **SECURITY.md** - Security incident response, credential rotation
- **.env.example** - Environment variable templates

---

**Last Updated:** March 22, 2026
**Commit:** `0cbb7b0`
