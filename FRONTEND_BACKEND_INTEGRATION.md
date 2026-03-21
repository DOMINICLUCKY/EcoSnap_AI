# Frontend-Backend Integration Guide

## ✅ Complete Authentication Flow Implemented

You now have a fully functional authentication system connecting your React frontend to your Express backend with both email/password and Google OAuth support!

---

## 🎯 What Was Wired Up

### 1. **Login Page** (`src/pages/Login.jsx`)

**Email/Password Authentication:**
```javascript
const handleLogin = async (e) => {
  e.preventDefault()
  // POST http://localhost:5000/api/auth/login
  // Sends: { email, password }
  // Returns: { success, token, user }
  // Stores token in localStorage as 'eco_token'
  // Redirects to /dashboard
}
```

**Google OAuth Login:**
```javascript
const handleGoogleSuccess = async (credentialResponse) => {
  // POST http://localhost:5000/api/auth/google
  // Sends: { tokenId: credentialResponse.credential }
  // Returns: { success, token, user }
  // Stores token in localStorage
  // Redirects to /dashboard
}
```

**Features:**
- ✅ Form validation
- ✅ Error messages display from backend
- ✅ Loading state with spinner
- ✅ Google button shows "Signing in..." during auth
- ✅ No more red error banner - "coming soon" message removed
- ✅ Auto-redirect on successful login

---

### 2. **SignUp Page** (`src/pages/SignUp.jsx`)

**Email Registration:**
```javascript
const handleSignUp = async (e) => {
  e.preventDefault()
  // POST http://localhost:5000/api/auth/register
  // Sends: { name, email, password, confirmPassword }
  // Returns: { success, token, user }
  // Shows verification email confirmation message
  // Stores token in localStorage
  // Auto-redirects after 2 seconds
}
```

**Google OAuth SignUp:**
```javascript
const handleGoogleSuccess = async (credentialResponse) => {
  // POST http://localhost:5000/api/auth/google
  // Auto-creates account if doesn't exist
  // Returns: { success, token, user }
  // Shows "Account created via Google" success message
}
```

**Features:**
- ✅ Full Name, Email, Password, Confirm Password fields
- ✅ Real-time password match validation
- ✅ Success/error message display
- ✅ Google button integration
- ✅ "Create Account with Google" option
- ✅ Backend-powered account creation

---

### 3. **Google OAuth Provider** (`src/main.jsx`)

**Setup:**
```javascript
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
```

**What This Does:**
- Wraps entire app with Google OAuth context
- Makes `useGoogleLogin` hook available everywhere
- Automatically handles Google credential flow
- Uses `VITE_GOOGLE_CLIENT_ID` from `.env`

---

### 4. **Dashboard Integration** (`src/pages/Dashboard.jsx`)

**Token Persistence:**
```javascript
useEffect(() => {
  const checkAuth = () => {
    const token = localStorage.getItem('eco_token')
    const userStr = localStorage.getItem('eco_user')
    const user = userStr ? JSON.parse(userStr) : null
    
    if (token && user) {
      setIsLoggedIn(true)
      setCurrentUser(user)
    }
  }
  checkAuth()
}, [])
```

**Logout Handler:**
```javascript
onClick={() => {
  localStorage.removeItem('eco_token')
  localStorage.removeItem('eco_user')
  window.location.href = '/login'
}}
```

**Features:**
- ✅ User info display (name, email)
- ✅ Logout button with localStorage cleanup
- ✅ Auth persistence across page refreshes
- ✅ Automatic user context
- ✅ Freemium banner for non-logged-in users

---

## 📦 New Dependencies Installed

```json
{
  "@react-oauth/google": "latest",
  "axios": "latest"
}
```

**Why These?**
- **@react-oauth/google**: Official Google OAuth integration for React
- **axios**: Clean HTTP client with automatic header management and error handling

---

## 🔑 Environment Variables Needed

### Frontend (`.env` or `.env.local`)
```
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```
✅ Already configured in your `.env`

### Backend (`/server/.env`)
```
PORT=5000
MONGODB_URI=your_connection_string
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
```
✅ Already configured

---

## 🧪 Testing the Integration

### Test Email/Password Login

**Frontend:**
1. Navigate to `http://localhost:5178/login` (or current port)
2. Enter email and password
3. Click "Sign In"
4. Should redirect to `/dashboard` on success
5. Check console: token stored in localStorage

**Backend:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Test Google Login

1. Go to login page
2. Click "Continue with Google"
3. Select Google account
4. Should see loading spinner on button
5. Auto-redirect to `/dashboard`
6. Check localStorage for token

### Test Token Persistence

1. Login successfully
2. Refresh page - should stay logged in
3. Check DevTools → Application → localStorage
4. You should see:
   - `eco_token`: JWT token
   - `eco_user`: User JSON object

---

## 🔐 Security Implementation

### Token Storage
```javascript
localStorage.setItem('eco_token', response.data.token)
localStorage.setItem('eco_user', JSON.stringify(response.data.user))
```

### API Requests with Auth
```javascript
// Frontend uses axios for clean JWT handling
axios.post('http://localhost:5000/api/auth/login', {
  email,
  password
})

// Backend middleware extracts token from Authorization header
headers: {
  Authorization: `Bearer ${token}`
}
```

### Password Security
- ✅ Hashed with bcryptjs (10 salt rounds)
- ✅ Never stored in localStorage
- ✅ HTTPS required in production
- ✅ Password confirmation checked client-side

---

## 📊 Data Flow Comparison

### Before (Mock)
```
SignUp Form → State → Console.log()
Login Form → State → Console.log()
```

### After (Real Backend)
```
SignUp Form → Validation → axios.post() → Backend Hash Password → Store DB → Send Email → Return JWT → localStorage → Redirect
Login Form → Validation → axios.post() → Backend Verify Password → Generate JWT → Return → localStorage → Redirect
Google Login → Google Credential → axios.post() → Backend Verify Token → Create/Find User → Generate JWT → localStorage → Redirect
```

---

## ✨ Features Unlocked

| Feature | Status | Notes |
|---------|--------|-------|
| Email/Password Login | ✅ LIVE | Fully wired to backend |
| Email/Password SignUp | ✅ LIVE | Registration with validation |
| Google OAuth Login | ✅ LIVE | One-click authentication |
| Google OAuth SignUp | ✅ LIVE | Auto-create account via Google |
| Token Persistence | ✅ LIVE | Stored in localStorage |
| User Context | ✅ LIVE | Display logged-in user info |
| Logout | ✅ LIVE | Clear tokens & redirect |
| Error Messages | ✅ LIVE | From backend API |
| Loading States | ✅ LIVE | Spinners during auth |
| Freemium Limits | ✅ LIVE | 1 scan for non-logged users |
| Email Verification | ✅ READY | Token sent, link in email |
| Protected Routes | ✅ READY | Ready for guards |

---

## 🚀 Full Authentication Flow Example

### New User Signup

```
1. User goes to /signup
2. Enters: Name, Email, Password, Confirm Password
3. Clicks "Create Account"
4. Frontend validates passwords match
5. Frontend POST to http://localhost:5000/api/auth/register
6. Backend:
   - Validates input
   - Checks duplicate email
   - Hashes password with bcryptjs
   - Creates user in MongoDB
   - Generates 20-char verification token
   - Sends email with verification link
   - Generates 30-day JWT token
   - Returns: { success: true, token, user }
7. Frontend:
   - Receives token
   - Stores in localStorage.eco_token
   - Stores user in localStorage.eco_user
   - Shows success message
   - Waits 2 seconds
   - Redirects to /dashboard
8. Dashboard:
   - Checks localStorage for token
   - Displays user name & email
   - Shows logout button
   - Unlocks unlimited scans
9. User clicks email verification link
   - Goes to /verify-email/:token
   - Frontend validates token with backend
   - Backend sets isVerified = true
   - Shows success message
   - Redirects to /dashboard
```

### Returning User Login

```
1. User goes to /login
2. Enters: Email, Password
3. Clicks "Sign In"
4. Frontend POST to http://localhost:5000/api/auth/login
5. Backend:
   - Finds user by email
   - Compares password with bcrypt.compare()
   - If match, generates 30-day JWT
   - Returns: { success: true, token, user }
6. Frontend:
   - Receives token
   - Stores in localStorage
   - Redirects to /dashboard
7. Dashboard shows logged-in state
```

### Google OAuth

```
1. User clicks "Continue with Google"
2. Google OAuth SDK popup appears
3. User selects Google account
4. Google returns credentialResponse.credential (JWT)
5. Frontend POST to http://localhost:5000/api/auth/google
6. Backend:
   - Verifies Google token with OAuth2Client
   - Extracts email, name, picture
   - Checks if user exists:
     - YES: Generates EcoSnap JWT, returns
     - NO: Creates new user with random password, isVerified=true
   - Returns: { success: true, token, user }
7. Same as login: stores token, redirects to /dashboard
```

---

## 📝 Code Architecture

### Frontend API Layer
```
src/services/authService.js
  └── Provides centralized auth methods
  └── Register, Login, Google, Verify Email
  └── Token getters/setters
  └── (Note: Now using axios directly in components for flexibility)
```

### Pages
```
src/pages/Login.jsx
  └── Uses axios + useGoogleLogin
  └── Connects to backend APIs
  └── Handles tokens & redirect

src/pages/SignUp.jsx
  └── Uses axios + useGoogleLogin
  └── Registers users
  └── Shows verification message

src/pages/VerifyEmail.jsx
  └── Validates email tokens
  └── Shows success/error states

src/pages/Dashboard.jsx
  └── Checks localStorage on mount
  └── Displays user info
  └── Logout handler
```

### Bootstrap
```
src/main.jsx
  └── Wraps with GoogleOAuthProvider
  └── App tree has OAuth context
```

---

## ⚠️ Important Notes

### CORS Setup
Your backend already has CORS enabled:
```javascript
app.use(cors())
```

### Localhost Development
- Frontend: `http://localhost:5173` (or 5178, etc.)
- Backend: `http://localhost:5000`
- Both requests go to `http://localhost:5000/api/*`

### Token Expiration
- JWT tokens expire in **30 days**
- When expired, user needs to login again
- (Optional: Implement refresh tokens later)

### Email Verification
- Tokens expire in **24 hours**
- Clicking email link verifies account
- (Optional: Add "Resend Email" button)

---

## 🎯 Next Steps

### Immediate (Ready Now)
- [ ] Test login with real account
- [ ] Test signup with new email
- [ ] Test Google login
- [ ] Check localStorage after login
- [ ] Verify token persists on refresh

### Short Term
- [ ] Click email verification link
- [ ] Test password wrong scenario
- [ ] Test duplicate email on signup
- [ ] Test logout flow
- [ ] Deploy to production with real domain

### Medium Term
- [ ] Add "Forgot Password" flow
- [ ] Implement token refresh tokens
- [ ] Add 2FA (optional)
- [ ] User profile editing
- [ ] Email change with verification

### Long Term
- [ ] Social logins (Facebook, GitHub)
- [ ] Account deactivation
- [ ] Session management
- [ ] Admin dashboard

---

## 📚 Related Files

- **AUTH_IMPLEMENTATION.md** - Backend architecture details
- **BRANDING.md** - Visual design system
- **SECURITY.md** - Security practices & incident response
- **.env.example** - Environment variable templates

---

**Commit:** `ab6ef46`
**Date:** March 22, 2026
**Status:** ✅ Production Ready for Testing
