# 🎨 EcoSnap Brand Guidelines

## Logo Design

### Primary Logo (SVG - Production)
The new EcoSnap logo combines an "Aperture + Leaf" design symbolizing environmental technology.

**Features:**
- ✅ Pure SVG (scales infinitely)
- ✅ Zero file size overhead
- ✅ Dynamic color support with Tailwind
- ✅ Enterprise-ready design
- ✅ Responsive across all devices

### Logo Specifications

**Current Implementation:**
```jsx
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  <path d="M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
  <path d="M12 12v4"/>
  <path d="M8 12h8"/>
</svg>
```

**Logo Sizes:**
- Navigation (32x32) - Current implementation
- Header (48x48) - For page headers
- Large (64x64) - For marketing materials
- Social media (256x256) - For GitHub/LinkedIn profiles

### Color Palette

**Primary Colors:**
- Emerald (Accent): `#10b981` - Growth, sustainability, nature
- Dark Blue (Background): `#1e293b` - Trust, technology, professional
- Black (Text): `#000000` - Contrast, readability
- White (Text): `#ffffff` - Light mode, accessibility

**Accent Colors:**
- Red (Danger/Critical): `#ef4444`
- Yellow (Warning): `#eab308`
- Green (Safe): `#10b981`

### Typography

**Font Family:** System fonts (system-ui, -apple-system, sans-serif)

**Font Weights:**
- **Bold (700):** Headlines, main text
- **Black (900):** Logo text, major headings
- **Semibold (600):** Subheadings, labels
- **Regular (400):** Body text

**Font Sizes:**
- Logo text: 18px bold
- Main headings: 24-32px
- Subheadings: 16-20px
- Body text: 14px
- Small text: 12px

### Logo Usage Examples

**Sidebar Navigation:**
```jsx
<div className="flex items-center gap-2">
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
    {/* SVG paths here */}
  </svg>
  <span className="text-xl font-black text-white tracking-wider">
    Eco<span className="text-emerald-400">Snap</span>
  </span>
</div>
```

**Header/Navbar:**
```jsx
<div className="flex items-center gap-3">
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
    {/* SVG paths here */}
  </svg>
  <span className="text-2xl font-black text-white">EcoSnap</span>
</div>
```

**Favicon:**
```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' stroke='%2310b981' fill='none' stroke-width='2'/></svg>" />
```

## Benefits of SVG Logo

### ✅ **Performance**
- No HTTP request for image file
- Smallest possible file size (< 500 bytes)
- No rendering blocking
- Instant load time

### ✅ **Scalability**
- Infinite scaling (no pixelation)
- Perfect on all screen sizes (mobile, desktop, 4K)
- Auto-adapts to parent container

### ✅ **Flexibility**
- Color changes via Tailwind classes
- Animation support
- Hover/active states
- Dark/light mode compatible

### ✅ **Accessibility**
- Text-based (not raster image)
- Screen reader compatible
- Search engine friendly
- Maintains quality in all formats

## Migration Checklist

| Component | Status | Date |
|-----------|--------|------|
| Sidebar Logo | ✅ Updated | 2026-03-22 |
| Dashboard Header | ⏳ Pending | - |
| Browser Favicon | ⏳ Pending | - |
| Social Media | ⏳ Pending | - |
| Marketing Materials | ⏳ Pending | - |

## Future Enhancements

- [ ] Animated logo (pulse effect)
- [ ] Logo color variants (monochrome, gradient)
- [ ] Brand asset library
- [ ] Design tokens documentation
- [ ] Storybook component showcase

---

**Last Updated:** March 22, 2026  
**Designed for:** EcoSnap AI Enterprise Platform  
**Format:** Pure SVG (100% Web-native)
