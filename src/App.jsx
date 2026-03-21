import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import VerifyEmail from './pages/VerifyEmail'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Heatmap from './pages/Heatmap'
import Leaderboard from './pages/Leaderboard'
import News from './pages/News'
import Profile from './pages/Profile'
import MapTest from './pages/MapTest'
import MapAlternative from './pages/MapAlternative'

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC PAGES - Full screen, no Layout */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        
        {/* TEST ROUTES - For debugging map issues */}
        <Route path="/map-test" element={<MapTest />} />
        <Route path="/map-alternative" element={<MapAlternative />} />
        
        {/* PROTECTED APP ROUTES - Wrapped with Layout & Sidebar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/news" element={<News />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

