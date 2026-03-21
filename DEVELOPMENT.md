# EcoSnap - Development Setup Guide

## Prerequisites
- Node.js 16+ (with npm)
- Modern browser (Chrome, Firefox, Safari, Edge)

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:5173
   ```

## Development Workflow

### File Structure
```
src/
├── App.jsx                 # Router setup
├── main.jsx               # React entry
├── index.css              # Design system
├── components/
│   └── Layout.jsx         # Main layout wrap
└── pages/
    ├── Dashboard.jsx      # Home page
    ├── LiveScanner.jsx    # Scanner page
    ├── Heatmap.jsx        # Map page
    └── Leaderboard.jsx    # Rankings page
```

### Making Changes
- Edit `.jsx` files - changes auto-reload (HMR)
- Edit `index.css` - styles update instantly
- Edit `tailwind.config.js` - restart dev server

### Component Naming
- Pages: PascalCase in `src/pages/`
- Components: PascalCase in `src/components/`
- Exports: `export default ComponentName`

## Design System Usage

### Colors (CSS Variables)
```css
--bg-base: #0f172a      /* Slate 900 */
--bg-card: #1e293b      /* Slate 800 */
--accent: #6366f1       /* Indigo 500 */
--border: rgba(51, 65, 85, 0.5)
```

### Reusable Classes
```jsx
<div className="card">...</div>           /* Container */
<button className="btn-primary">Text</button>  /* CTA */
<a className="sidebar-link">Link</a>     /* Nav item */
<span className="pulse-dot"></span>      /* Status */
```

### Tailwind Utilities
Standard Tailwind classes are available:
- Layout: `grid grid-cols-12 gap-6`
- Spacing: `px-4 py-3 mb-6`
- Colors: `bg-slate-700 text-white`
- Effects: `hover:bg-slate-600 transition-all`

## Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Build for production
npm run preview         # Preview production build

# Cleanup
npm ci                  # Clean install
rm -r node_modules      # Remove modules (then npm install)
```

## Debugging

### React DevTools
1. Install React DevTools browser extension
2. Open DevTools (F12)
3. Use "Components" tab to inspect React tree

### Network Issues
- Check browser console (F12)
- Verify localhost:5173 is accessible
- Check for port conflicts: `netstat -ano | findstr :5173`

## Performance Tips

1. **Code Splitting**: Routes are naturally split by Vite
2. **Image Optimization**: Use responsive images
3. **CSS**: Tailwind tree-shakes unused styles in production
4. **Bundle Size**: ~180KB JS + 14KB CSS (gzipped)

## Adding New Pages

1. Create `src/pages/NewPage.jsx`:
```jsx
export default function NewPage() {
  return (
    <div className="max-w-5xl mx-auto card">
      <h1>New Page</h1>
    </div>
  )
}
```

2. Add route in `src/App.jsx`:
```jsx
import NewPage from './pages/NewPage'

// Inside <Routes>
<Route path="/newpage" element={<NewPage />} />
```

3. Add nav item in `src/components/Layout.jsx`:
```jsx
{ name: 'New Page', path: '/newpage', icon: IconName }
```

## Production Deployment

Built files are in `dist/`:
- `dist/index.html` - Main entry
- `dist/assets/` - CSS & JS (hashed for caching)

Deploy to:
- Vercel: `vercel`
- Netlify: Drag `dist/` folder
- Traditional server: Copy `dist/` to web root

---

**Questions?** Check React, Vite, or Tailwind documentation.
