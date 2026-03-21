# EcoSnap Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │           React App (App.jsx)                          │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  BrowserRouter (react-router-dom)               │  │   │
│  │  │                                                  │  │   │
│  │  │  ┌────────────────────────────────────────────┐ │  │   │
│  │  │  │  <Layout.jsx> (wrapper)                   │ │  │   │
│  │  │  │  ┌──────────────┐     ┌─────────────────┐│ │  │   │
│  │  │  │  │   SIDEBAR    │     │     HEADER      ││ │  │   │
│  │  │  │  │ w-64 Fixed   │     │    h-16 Sticky  ││ │  │   │
│  │  │  │  │              │     │  LIVE DATA      ││ │  │   │
│  │  │  │  │ • Dashboard  │     │  🟢 Pulsing     ││ │  │   │
│  │  │  │  │ • Scanner    │     └─────────────────┘│ │  │   │
│  │  │  │  │ • Heatmap    │                         │ │  │   │
│  │  │  │  │ • Leaderboard│     ┌─────────────────┐│ │  │   │
│  │  │  │  └──────────────┘     │   <Outlet />    ││ │  │   │
│  │  │  │                       │   (Page Content)││ │  │   │
│  │  │  │                       │                 ││ │  │   │
│  │  │  │                       └─────────────────┘│ │  │   │
│  │  │  └────────────────────────────────────────────┘ │  │   │
│  │  │                                                  │  │   │
│  │  │  Routes:                                        │  │   │
│  │  │  ├─ / → <Dashboard />                          │  │   │
│  │  │  ├─ /scanner → <LiveScanner />                │  │   │
│  │  │  ├─ /heatmap → <Heatmap />                    │  │   │
│  │  │  └─ /leaderboard → <Leaderboard />            │  │   │
│  │  │                                                  │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ Compiled by Vite
                              │
┌─────────────────────────────┴──────────────────────────────────┐
│            Development Files (src/)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ├─ App.jsx              (Router configuration)               │
│  ├─ main.jsx             (React entry point)                  │
│  ├─ index.css            (Design system & Tailwind)           │
│  │                                                            │
│  ├─ components/                                               │
│  │  └─ Layout.jsx        (Main layout wrapper)               │
│  │                                                            │
│  └─ pages/                                                     │
│     ├─ Dashboard.jsx     (KPI + Scans + AI Chat)             │
│     ├─ LiveScanner.jsx   (Camera + Upload interface)         │
│     ├─ Heatmap.jsx       (Geographic visualization)          │
│     └─ Leaderboard.jsx   (Community rankings)                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
└── Layout
    ├── Sidebar
    │   └── NavItems (Dashboard, Scanner, Heatmap, Leaderboard)
    ├── Header
    │   └── LIVE DATA Badge (Pulsing Indicator)
    └── Outlet (Dynamic Page Content)
        ├── Dashboard
        │   ├── KPI Cards (3x col-span-4)
        │   ├── Scans Table (col-span-8)
        │   └── AI Assistant Chat (col-span-4)
        ├── LiveScanner
        │   ├── Camera Interface
        │   ├── Upload Interface
        │   └── Recent Scans
        ├── Heatmap
        │   ├── Map Container
        │   └── Regional Stats
        └── Leaderboard
            ├── Rankings Table
            └── Community Stats
```

## Data Flow (Example: Dashboard)

```
┌─ Dashboard.jsx
│
├─ Local State
│ ├─ chatMessages (AI Assistant history)
│ └─ inputValue (Chat input buffer)
│
├─ Static Mock Data
│ ├─ KPI values (2,847 items, 84kg carbon saved, #12 rank)
│ ├─ Scan entries (4 dummy scans with confidence scores)
│ └─ Leaderboard entries
│
├─ Event Handlers
│ └─ handleSendMessage() → Updates chat, simulates bot response
│
└─ Rendered Output
  ├── Grid Layout (12 columns)
  ├── Card Components (with .card class)
  ├── Button Interactions (btn-primary class)
  └── Table Rows (hover states, action buttons)
```

## Styling Architecture

```
index.css (Design System)
├── Tailwind Directives (base, components, utilities)
├── CSS Variables (--bg-base, --bg-card, --accent, --border)
├── Global Styles (body, antialiasing, fonts)
└── Component Classes
    ├── .card (elevated container with shadow)
    ├── .sidebar-link (nav item with hover)
    ├── .sidebar-active (active nav state with glow)
    ├── .btn-primary (action button with effects)
    └── .pulse-dot (animated status indicator)

Tailwind CSS (Utility Classes)
├── Color Palette
│   ├── Slate (900 → 100 shades)
│   └── Indigo (500, 600)
├── Layout Utilities
│   ├── Flexbox (flex, items-center, justify-between)
│   └── Grid (grid, grid-cols-12, col-span-*)
├── Spacing
│   ├── Padding (px-4, py-3, p-8)
│   └── Margin (mb-6, mt-4, gap-3)
└── Interactive States
    ├── Hover (hover:bg-slate-700)
    ├── Focus (focus:ring-indigo-500)
    └── Transitions (transition-all)
```

## Build Pipeline

```
Development
├─ npm run dev
├─ Vite dev server @ localhost:5173
└─ Hot Module Replacement (HMR) enabled

Production
├─ npm run build
├─ Assets Compiled
│  ├─ JavaScript minified & chunked
│  ├─ CSS tree-shaken (unused Tailwind removed)
│  └─ Assets hashed for caching
└─ Output: dist/ folder (ready to deploy)

Output Files
├─ dist/index.html (0.42 KB gzipped)
├─ dist/assets/index-******.css (14.38 KB → 3.69 KB gzipped)
└─ dist/assets/index-******.js (177.79 KB → 56.36 KB gzipped)
```

## Page Layout Specifications

### Dashboard (/)
```
┌─────────────────────────────────────────────────────┐
│  Items Detected    │   Carbon Saved   │ Community #12│
│      2,847         │      84 kg       │    ↑3 pos   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Recent Scans Monitor                AI Upcycle    │
│  ┌─────────────────────┐            ┌──────────┐  │
│  │ ID  │Type  │Conf │  │            │  Chat    │  │
│  │     │      │     │  │            │ History  │  │
│  │     │      │     │  │            ├──────────┤  │
│  │     │      │     │  │            │ [Input]  │  │
│  │ [View] [Upcycle]  │  │            │ [Send]   │  │
│  └─────────────────────┘            └──────────┘  │
│  col-span-8                         col-span-4    │
├─────────────────────────────────────────────────────┤
```

### LiveScanner (/scanner)
```
┌──────────────────────────────────────────┐
│                                          │
│  📷 Launch Camera  │  📤 Upload Image   │
│                                          │
├──────────────────────────────────────────┤
│  Recent Scans                            │
│  Scan #1001, Scan #1002, Scan #1003     │
└──────────────────────────────────────────┘
     max-w-5xl mx-auto card
```

### Leaderboard (/leaderboard)
```
┌──────────────────────────────────────────┐
│  Rank  │ Name    │ Scans │ Carbon Saved │
│   🥇   │ User1   │ 5432  │  156.8 kg    │
│   🥈   │ User2   │ 4891  │  142.3 kg    │
│   🥉   │ User3   │ 4156  │  118.9 kg    │
│   4#   │ User4   │ 3842  │  109.2 kg    │
│  ...   │  ...    │ ...   │   ...        │
├──────────────────────────────────────────┤
│ Community Scans: 284.5K                 │
│ CO₂ Prevented: 8.1M kg                  │
│ Active Users: 47.3K                     │
└──────────────────────────────────────────┘
     max-w-5xl mx-auto card
```

## Tech Stack Summary

```
┌─────────────────────────────────────┐
│         Framework Layer              │
├─────────────────────────────────────┤
│ React 18.2 (Components & State)     │
│ React Router v6 (Page Navigation)   │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Styling Layer               │
├─────────────────────────────────────┤
│ Tailwind CSS 3.3 (Utilities)        │
│ PostCSS + Autoprefixer (Processing) │
│ CSS Variables (Theme System)        │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│        UI Component Layer           │
├─────────────────────────────────────┤
│ Lucide React (147 Icons)            │
│ Recharts (Charting)                 │
│ Native HTML5 Elements               │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│        Build & Setup Layer          │
├─────────────────────────────────────┤
│ Vite 5.0 (Bundler & Dev Server)    │
│ npm (Package Manager)               │
└─────────────────────────────────────┘
```

---

This architecture ensures:
✅ **Modularity** - Components are reusable and maintainable  
✅ **Performance** - Tree-shaking, code splitting, HMR  
✅ **Scalability** - Easy to add new pages/features  
✅ **Consistency** - Unified design system across app  
✅ **Developer Experience** - Fast feedback loops with Vite  
