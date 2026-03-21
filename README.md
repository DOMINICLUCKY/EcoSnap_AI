# 🌱 EcoSnap AI - Enterprise Trash Detection Platform

**"Where AI Meets Sustainability"**

A premium enterprise SaaS dashboard for AI-powered trash detection and community-driven upcycling. Built with React + Vite using the Slate & Indigo design system.

## 📋 Project Structure

```
EcoSnap/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main layout with sidebar & header
│   ├── pages/
│   │   ├── Dashboard.jsx       # KPI overview & real-time monitor
│   │   ├── LiveScanner.jsx     # Camera & upload interface
│   │   ├── Heatmap.jsx         # Geographic detection heatmap
│   │   └── Leaderboard.jsx     # Community rankings
│   ├── App.jsx                 # Main router configuration
│   ├── main.jsx                # React entry point
│   └── index.css               # Global design system
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS theme
├── postcss.config.js           # PostCSS plugins
└── package.json                # Dependencies & scripts
```

## 🎨 Design System

**Color Palette:**
- **Slate 900** (#0f172a) - Base background
- **Slate 800** (#1e293b) - Card backgrounds
- **Indigo 500** (#6366f1) - Primary accent
- **Emerald 500** - Success states
- **Blue 500** - Info states

**Components:**
- `.card` - Elevated containers with borders & shadows
- `.sidebar-link` - Navigation items with hover states
- `.sidebar-active` - Active nav item with glow effect
- `.btn-primary` - CTA buttons with gradient hover
- `.pulse-dot` - Animated status indicator

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production
```bash
npm run build
```

## 📱 Pages & Features

### Dashboard (`/`)
- **KPI Cards**: Items Detected, Carbon Saved, Community Rank
- **Recent Scans Table**: Real-time detection monitor with confidence scores
- **AI Upcycle Assistant**: Chat interface for creative reuse suggestions

### Live Scanner (`/scanner`)
- Camera capture interface
- Image upload functionality
- Recent scan history with confidence metrics

### Heatmap (`/heatmap`)
- Geographic distribution visualization
- Regional hotspot analysis
- Peak activity hours

### Leaderboard (`/leaderboard`)
- Global community rankings
- Carbon saved statistics
- User performance metrics

## 🛠️ Tech Stack

- **React 18.2** - UI framework
- **Vite 5.0** - Lightning-fast build tool
- **React Router v6** - Client-side routing
- **Tailwind CSS 3.3** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **Recharts** - Composable charting library

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing solution

### UI & Icons
- `lucide-react` - SVG icon set
- `tailwindcss` - Utility CSS framework

### Charts & Data
- `recharts` - React charting library

### Build Tools
- `vite` - Next generation bundler
- `@vitejs/plugin-react` - React plugin for Vite
- `postcss` & `autoprefixer` - CSS processing

## 🎯 Design Philosophy

**Enterprise-Grade Aesthetics:**
- Dark mode optimized for reduced eye strain
- Premium glassmorphism and layered backgrounds
- Consistent spacing and typography
- Smooth transitions and micro-interactions
- Accessible color contrast ratios

**Developer Experience:**
- Clean, modular component structure
- CSS variables for theme consistency
- @layer components for scalable styling
- TypeScript-ready (easily add types)

## 📝 License

© 2026 EcoSnap AI | Enterprise Edition

---

**Status:** ✅ Production Ready | Last Updated: March 2026
