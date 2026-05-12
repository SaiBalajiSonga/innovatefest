# InnovateFest UI Redesign Prompt
### For: Gemini 2.5 Pro (High)

---

You are a senior product designer and frontend engineer at a top-tier tech company
(think Linear, Vercel, Stripe, Raycast). Your job is to completely redesign the UI
of an existing React + Tailwind CSS hackathon registration portal called "InnovateFest".

## Non-negotiables
- ZERO emojis anywhere in the UI. Replace every single one with a proper inline SVG icon.
- No childish or "AI-generated" aesthetics.
- The result must feel like a premium SaaS product or a top-tier tech conference site.
- Do not use any external icon libraries. Write all SVG icons inline as JSX.
- Keep ALL existing logic, routing, Supabase calls, validation, and state management
  exactly as-is. You are only changing visual design — markup and Tailwind classes.
- Do not remove or rename any component files.

---

## Design Direction: "Obsidian Dark"
A premium dark-mode design system used by world-class products.

### Color Palette (update tailwind.config.js)
```js
colors: {
  surface: {
    DEFAULT: '#0A0A0F',   // near-black page bg
    1: '#111118',          // card bg
    2: '#18181f',          // elevated card
    3: '#1f1f2a',          // input bg
    border: '#2a2a38',     // subtle borders
  },
  primary: {
    DEFAULT: '#6366f1',    // indigo
    dim: '#4f46e5',
    glow: 'rgba(99,102,241,0.15)',
  },
  accent: {
    DEFAULT: '#8b5cf6',    // violet
    glow: 'rgba(139,92,246,0.12)',
  },
  text: {
    primary: '#f4f4f5',
    secondary: '#a1a1aa',
    muted: '#52525b',
  },
}
```

### Typography (update tailwind.config.js)
```js
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Cal Sans', 'Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

Add to index.html `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/cal-sans@1.0.1/index.min.css" rel="stylesheet">
```

---

## Design Tokens (rewrite src/index.css @layer components entirely)

```css
.btn-primary {
  @apply inline-flex items-center justify-center gap-2
         bg-primary text-white font-medium text-sm px-5 py-2.5 rounded-lg
         border border-white/10
         shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
         transition-all duration-200
         hover:bg-primary-dim hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]
         focus:outline-none focus:ring-2 focus:ring-primary/50
         disabled:opacity-40 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply inline-flex items-center justify-center gap-2
         bg-surface-2 text-text-secondary font-medium text-sm px-5 py-2.5 rounded-lg
         border border-surface-border
         transition-all duration-200
         hover:border-primary/40 hover:text-text-primary
         focus:outline-none focus:ring-2 focus:ring-primary/30;
}

.btn-danger {
  @apply inline-flex items-center justify-center gap-1.5
         bg-transparent text-red-400 font-medium text-xs px-3 py-1.5 rounded-md
         border border-red-900/60
         transition-all duration-150
         hover:bg-red-950/60 hover:border-red-700/60;
}

.card {
  @apply bg-surface-1 border border-surface-border rounded-xl;
}

.card-elevated {
  @apply bg-surface-2 border border-surface-border rounded-xl;
}

.form-input {
  @apply w-full bg-surface-3 border border-surface-border text-text-primary rounded-lg
         px-3.5 py-2.5 text-sm
         placeholder:text-text-muted
         focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30
         transition-colors duration-150;
}

.label {
  @apply block text-xs font-medium text-text-secondary mb-1.5 tracking-wide;
}

.section-container {
  @apply max-w-5xl mx-auto px-4 sm:px-6 lg:px-8;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent;
}

.section-label {
  @apply text-xs font-mono text-primary uppercase tracking-[0.15em];
}
```

Also keep the global base layer:
```css
@layer base {
  html { scroll-behavior: smooth; }
  body { @apply bg-surface text-text-primary font-sans antialiased; }
  ul, ol { list-style: none; padding: 0; margin: 0; }
}
```

Also keep the custom scrollbar:
```css
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: #0A0A0F; }
::-webkit-scrollbar-thumb { background: #2a2a38; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #6366f1; }
```

---

## Page-by-Page Redesign Instructions

### 1. Navbar.jsx
- Fixed top, full width, height 56px
- Background: bg-surface-1/80 backdrop-blur-xl, always visible border-b border-surface-border
- Left: wordmark "InnovateFest" — font-display font-semibold text-sm text-text-primary, no gradient
- Center (hidden on mobile): nav links — About, Timeline, FAQ
  Style: text-sm text-text-secondary hover:text-text-primary transition-colors, no underlines, no bg
- Right: "Register" button — btn-primary but override to px-4 py-1.5 text-xs rounded-md
- No hamburger menu needed — center links simply hidden on mobile

### 2. Hero.jsx
Replace the gradient blob approach entirely.

**Background layers (all absolute, pointer-events-none):**
- Layer 1: bg-surface (the base dark colour)
- Layer 2: CSS dot grid texture as a div with this inline style:
  ```jsx
  style={{
    backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.06) 1px, transparent 1px)',
    backgroundSize: '28px 28px'
  }}
  ```
- Layer 3: a single centered radial glow:
  ```jsx
  className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
             bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_70%)]"
  ```

**Content (relative z-10, text-center, max-w-3xl mx-auto):**

Badge (top):
```jsx
<div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20
                text-primary text-xs font-mono px-4 py-1.5 rounded-full mb-10">
  <span className="w-1 h-1 rounded-full bg-primary" />
  InnovateFest 2026 &nbsp;·&nbsp; May 25–27
</div>
```

Headline (two lines):
```jsx
<h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] mb-6">
  <span className="text-text-primary">Build Something</span>
  <br />
  <span className="gradient-text">That Matters.</span>
</h1>
```

Subheadline:
```jsx
<p className="text-text-secondary text-lg max-w-xl mx-auto mb-10 leading-relaxed">
  36 hours. 5 tracks. India's premier student hackathon — open to every builder,
  designer, and domain expert.
</p>
```

CTA row:
```jsx
<div className="flex items-center justify-center gap-4 mb-20">
  <Link to="/register" className="btn-primary px-6 py-3 text-sm">
    Register Now
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  </Link>
  <a href="#about"
     className="text-sm text-text-muted hover:text-text-primary transition-colors flex items-center gap-1">
    View Schedule
  </a>
</div>
```

Stats row (no cards — plain inline with dividers):
```jsx
<div className="flex items-center justify-center divide-x divide-surface-border">
  {STATS.map(({ label, value }) => (
    <div key={label} className="px-8 first:pl-0 last:pr-0 text-center">
      <div className="font-display text-2xl font-bold text-text-primary">{value}</div>
      <div className="text-xs text-text-muted uppercase tracking-widest mt-0.5 font-mono">{label}</div>
    </div>
  ))}
</div>
```

Remove the scroll indicator entirely.

### 3. About.jsx
Replace ALL emoji icons with inline SVG icons (20×20, stroke-based, strokeWidth=1.5).
Use these exact icons per feature:

- Win Big → trophy icon:
  ```jsx
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4"/>
    <path d="M12 17v4M8 21h8M6 9a6 6 0 0012 0V3H6v6z"/>
  </svg>
  ```
- Network → users icon:
  ```jsx
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
  ```
- Launch → zap icon:
  ```jsx
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
  ```
- Learn → book-open icon:
  ```jsx
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
  </svg>
  ```
- Innovate → lightbulb icon:
  ```jsx
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18"/>
    <line x1="10" y1="22" x2="14" y2="22"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/>
  </svg>
  ```
- Showcase → globe icon:
  ```jsx
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
  ```

Card structure per feature:
```jsx
<div className="card p-6 group hover:border-primary/30 transition-colors duration-200">
  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center
                  text-primary mb-5 group-hover:bg-primary/15 transition-colors">
    {/* SVG icon here */}
  </div>
  <h3 className="text-sm font-semibold text-text-primary mb-1.5">{title}</h3>
  <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
</div>
```

Section heading block:
```jsx
<div className="text-center mb-14">
  <p className="section-label mb-3">About the Event</p>
  <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">
    What is InnovateFest?
  </h2>
  <p className="text-text-secondary text-base max-w-2xl mx-auto leading-relaxed">
    {description}
  </p>
</div>
```

### 4. Timeline.jsx
Remove ALL emoji icons and ALL gradient color props.

Replace the icon bubble with a numbered counter:
```jsx
<div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full
                border border-surface-border bg-surface-2
                flex items-center justify-center
                font-mono text-xs text-text-muted md:mx-auto">
  {String(idx + 1).padStart(2, '0')}
</div>
```

The current active event (first upcoming) gets special treatment:
```jsx
// border-primary/60 text-primary instead
```

Card structure:
```jsx
<div className="card p-4 flex-1 hover:border-surface-border/80 transition-colors
                md:max-w-[calc(50%-3rem)]">
  <div className="flex items-center gap-2 mb-2">
    <span className="font-mono text-xs text-primary">{date}</span>
    <span className="text-surface-border text-xs">·</span>
    <span className="font-mono text-xs text-text-muted">{time}</span>
  </div>
  <h3 className="text-sm font-semibold text-text-primary mb-1">{title}</h3>
  <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
</div>
```

Vertical connecting line: `bg-surface-border` colour, no gradient.

Section heading:
```jsx
<p className="section-label mb-3">Schedule</p>
<h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
  Event Timeline
</h2>
```

### 5. FAQ.jsx
Keep all accordion logic exactly as-is.

Visual changes only:
- Replace glass-card with `.card`
- Question button text: `text-sm font-medium text-text-primary`
- Replace the rotating SVG chevron with a simple `+` / `−` toggle:
  ```jsx
  <span className={`font-mono text-lg leading-none transition-colors
                    ${isOpen ? 'text-primary' : 'text-text-muted'}`}>
    {isOpen ? '−' : '+'}
  </span>
  ```
- Answer text: `text-sm text-text-secondary leading-relaxed px-5 pb-5`
- Open item: `border-primary/30` instead of `border-brand-500/40`

Section heading:
```jsx
<p className="section-label mb-3">FAQ</p>
<h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
  Frequently Asked Questions
</h2>
```

### 6. Footer.jsx
- Remove the ❤️ emoji — change line to: `— by students, for students.`
- Brand: `font-display font-semibold text-text-primary` (not gradient)
- Links: `text-sm text-text-muted hover:text-text-primary transition-colors`
- Social icon buttons: `w-8 h-8 rounded-lg border border-surface-border bg-surface-2
  flex items-center justify-center text-text-muted hover:text-text-primary
  hover:border-primary/40 transition-all duration-150`
- Top border: `border-surface-border`
- Copyright text: `text-xs font-mono text-text-muted`

### 7. Register.jsx
- Background: `bg-surface` with two very faint orbs:
  `w-96 h-96 bg-primary/5 rounded-full blur-3xl` top-right and bottom-left
- Back link: `text-xs text-text-muted hover:text-text-primary transition-colors`
  with ← character (not SVG)
- Heading: `font-display text-3xl font-bold text-text-primary`
  "Register for InnovateFest 2026" — no gradient on the name
- Subtitle: `text-sm text-text-secondary`
- Form wrapper: `.card-elevated p-8` (remove glass-card)
- Footer note: `text-xs font-mono text-text-muted text-center mt-5`

### 8. RegistrationForm.jsx
Keep all state, validation, Supabase insert, error handling exactly as-is.

Visual changes only:
- All labels: use `.label` class
- All inputs: use `.form-input` class
- Error messages: `text-xs text-red-400 mt-1.5` (same as before)
- Skills label hint text: `text-xs font-mono text-text-muted ml-1`
- Character counter: `text-xs font-mono text-text-muted` (amber-500 under 50 chars)
- Submit button: `.btn-primary w-full py-3 text-sm`
- Loading state: no spinner SVG, just:
  ```jsx
  <span className="opacity-60">Submitting...</span>
  ```

### 9. TagInput.jsx
Keep all keyboard logic, deduplication, and onChange exactly as-is.

Visual changes only:
- Container: `.form-input cursor-text flex flex-wrap gap-1.5 min-h-[44px] items-center`
- Tag chip:
  ```jsx
  <span className="inline-flex items-center gap-1 bg-surface-3 border border-surface-border
                   text-text-secondary text-xs px-2.5 py-1 rounded-md">
    {tag}
    <button type="button" onClick={...} aria-label={...}
            className="text-text-muted hover:text-text-primary transition-colors ml-0.5">
      ×
    </button>
  </span>
  ```
- Inner input: `flex-1 min-w-[140px] bg-transparent border-none outline-none
                text-text-primary placeholder:text-text-muted text-sm py-0.5`

### 10. AdminLogin.jsx
Remove the 🔐 emoji icon div entirely.

Replace header with:
```jsx
<div className="text-center mb-8">
  <div className="font-display text-xl font-semibold text-text-primary mb-1">
    InnovateFest
  </div>
  <div className="text-xs font-mono text-text-muted">Admin Portal</div>
</div>
```

Form card: `.card-elevated p-8`
Background: `bg-surface` with a single faint center radial glow:
```jsx
<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_60%)]
                pointer-events-none" />
```
Error banner: `bg-red-950/60 border border-red-900/60 text-red-400 text-xs rounded-lg px-4 py-3`
Footer note: `text-xs font-mono text-text-muted text-center mt-4`

### 11. Admin.jsx
Replace `🔔` in the realtime toast:
```jsx
toast('New registration received', { icon: null })
```

Header section:
```jsx
<header className="card p-5 flex flex-col sm:flex-row items-start sm:items-center
                   justify-between gap-4">
  <div>
    <h1 className="font-display text-xl font-semibold text-text-primary">
      Admin Dashboard
    </h1>
    <p className="text-xs font-mono text-text-muted mt-0.5">
      InnovateFest 2026 · Registration Management
    </p>
  </div>
  <button onClick={handleLogout} className="btn-secondary text-xs px-4 py-2">
    Sign Out
  </button>
</header>
```

Content card: `.card p-5`

Loading state spinner — replace with:
```jsx
<div className="py-24 flex flex-col items-center gap-3 text-text-muted">
  <div className="w-5 h-5 border border-surface-border border-t-primary
                  rounded-full animate-spin" />
  <span className="text-xs font-mono">Loading registrations...</span>
</div>
```

### 12. AdminTable.jsx
**Delete button:** Replace 🗑 emoji with this SVG:
```jsx
<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <polyline points="3 6 5 6 21 6"/>
  <path d="M19 6l-1 14H6L5 6"/>
  <path d="M10 11v6M14 11v6"/>
  <path d="M9 6V4h6v2"/>
</svg>
```

**Status badges:** Replace rounded-full with rounded-md:
```jsx
// Approved
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs
                 font-mono bg-emerald-950/60 border border-emerald-900/60 text-emerald-400">
  <span className="w-1 h-1 rounded-sm bg-emerald-400" />Approved
</span>

// Pending
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs
                 font-mono bg-amber-950/60 border border-amber-900/60 text-amber-400">
  <span className="w-1 h-1 rounded-sm bg-amber-400" />Pending
</span>
```

**Approve/Revert buttons:**
```jsx
// Approve button
className="text-xs px-2.5 py-1 rounded-md border border-emerald-900/60
           text-emerald-400 hover:bg-emerald-950/60 transition-colors font-mono"

// Revert to Pending button
className="text-xs px-2.5 py-1 rounded-md border border-amber-900/60
           text-amber-400 hover:bg-amber-950/60 transition-colors font-mono"
```

**Table header:**
```jsx
<tr className="border-b border-surface-border bg-surface-2">
  <th className="px-4 py-3 text-left text-xs font-mono text-text-muted
                 uppercase tracking-wider cursor-pointer hover:text-text-primary
                 transition-colors select-none whitespace-nowrap">
```

**Table rows:** `hover:bg-surface-2/40 transition-colors duration-100`

**Search input:** `.form-input text-sm py-2 pl-9`

**Export button:** `.btn-secondary text-xs py-2 px-4`

**Count display:** `text-xs font-mono text-text-muted`

**Pagination:**
```jsx
<span className="text-xs font-mono text-text-muted">
  Page <span className="text-text-primary">{page}</span> of {totalPages}
</span>
```

**Sort icon:** Keep the SVG but update colours:
```jsx
className={`w-3 h-3 ml-1 inline transition-colors
            ${active ? 'text-primary' : 'text-surface-border'}`}
```

### 13. NotFound.jsx
```jsx
<main className="min-h-screen bg-surface flex items-center justify-center px-4">
  <div className="text-center">
    <div className="font-mono text-8xl font-bold text-surface-border mb-6">404</div>
    <h1 className="font-display text-2xl font-bold text-text-primary mb-3">
      Page Not Found
    </h1>
    <p className="text-sm text-text-secondary mb-8 max-w-sm mx-auto">
      The page you are looking for does not exist or has been moved.
    </p>
    <Link to="/" className="btn-primary">
      Return Home
    </Link>
  </div>
</main>
```

---

## Output Format

Rewrite these files one at a time in this exact order:
1. `tailwind.config.js`
2. `src/index.css`
3. `index.html` (head section only — update fonts, keep everything else)
4. `src/components/Navbar.jsx`
5. `src/components/Hero.jsx`
6. `src/components/About.jsx`
7. `src/components/Timeline.jsx`
8. `src/components/FAQ.jsx`
9. `src/components/Footer.jsx`
10. `src/pages/Register.jsx`
11. `src/components/RegistrationForm.jsx`
12. `src/components/TagInput.jsx`
13. `src/pages/AdminLogin.jsx`
14. `src/pages/Admin.jsx`
15. `src/components/AdminTable.jsx`
16. `src/pages/NotFound.jsx`

For each file:
- Show the full file path as a `###` header
- Output the COMPLETE file — no placeholders, no "rest stays the same"
- Preserve every import, prop, Supabase call, validation, and state exactly
- Only the visual layer changes: JSX structure, className values, inline SVGs

Do NOT touch:
- `src/App.jsx`
- `src/main.jsx`
- `src/lib/supabaseClient.js`
- `src/hooks/useAuth.js`
- `src/pages/Landing.jsx`
- Any Supabase operations
- Any validation logic
- Any routing logic
