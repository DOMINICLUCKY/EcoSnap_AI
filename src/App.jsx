import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
        {/* TEST ROUTES - For debugging map issues */}
        <Route path="/map-test" element={<MapTest />} />
        <Route path="/map-alternative" element={<MapAlternative />} />
        
        {/* MAIN APP ROUTES */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
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

