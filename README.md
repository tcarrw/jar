# 🌕 Jar — Illumina Cycles

The **Jar** is a self-contained web notebook for running Illumina cycles.  
It lives as a static HTML site (no dependencies, no build tools) and is designed to be portable, printable, and hackable.

---

## 📂 Structure

/
├── index.html # Jar Cover (cycle intro, orbit glyph, buttons)
├── day/
│ └── index.html # Daily spreads (42-day navigator with auto-dates)
├── pantheon/
│ ├── index.html # Pantheon hub (interlude list)
│ ├── sabrina.html # 🍯 Honey / Taste Spark
│ ├── janet-planet.html # 🌙 Cosmic Teacher
│ ├── eminem.html # ⚡ Confrontation / Victory Song archetype
│ ├── emma-stone.html# ☀️ Identity / Masks / Spotlight
│ ├── doechii.html # 🔥 Trickster / Chaos
│ └── hot-to-go.html # 🐝 Collective Joy / Swarm
├── victory.html # ☀️ Victory Song spread (flare page)
└── archive.html # 🌙 End-of-Cycle Archive (review + setup next)


---

## 🚀 How it works

- **Self-contained HTML**  
  Each file includes its own styles, SVGs, and scripts. No external assets required.

- **LocalStorage persistence**  
  All text fields auto-save per day/page in the browser. Refresh → notes remain.  
  Use the “Clear” button on each page to reset.

- **Print-ready**  
  All spreads are styled for printing to PDF or paper (no nav/buttons).  

- **Breadcrumbs**  
  Every interlude + special spread links back to its Pantheon/Hub or Jar Home.  

---

## 🌓 Cycle Flow

1. **Cover (`/index.html`)**  
   Shows the orbit glyph, cycle dates, theme, and navigation into Day 1 or Pantheon interludes.

2. **Daily spreads (`/day/index.html`)**  
   Navigator for 42 days. Each day has:  
   - Triad orbit glyph (Sun / Bee / Moon)  
   - Left page = mantras, glyph  
   - Right page = intention, offline win, one win, archive notes  
   - Auto-dates mapped to cycle (Nov 5 – Dec 17, 2025 for Illumina 1)  

3. **Pantheon interludes (`/pantheon/*.html`)**  
   Archetypal pages to puncture rhythm: Sabrina, Janet, Eminem, Emma, Doechii, Hot To Go.  
   Each has its own glyph, brief, and prompt fields.

4. **☀️ Victory Song (`/victory.html`)**  
   Flare page. Used sparingly to declare boundaries and light identity moments.

5. **🌙 Archive (`/archive.html`)**  
   End-of-cycle review. Summarize outcomes, capture lessons, seed the next Illumina.

---

## 🔮 Extending for Illumina 2

- Duplicate `/day/index.html` → `/day2/index.html` and update **start date** in script (e.g., Jan 3 – Feb 14, 2026).
- Update `/index.html` cover with **cycle theme** and new button linking to `/day2/index.html`.
- Optionally duplicate Pantheon pages if you want to vary archetypes per cycle.
- Keep `victory.html` and `archive.html` as **shared templates** or make cycle-specific versions (`victory2.html`, `archive2.html`).

---

## ✨ Notes

- Everything is **client-side only**. No database, no backend.  
- Safe to deploy on GitHub Pages, Vercel, or any static host.  
- Each browser stores its own notes (localStorage). To back up → **print to PDF** or copy/paste content out.  

---

🪞 *Jar is meant to feel like a hybrid of notebook and ritual space. Simple code, maximum continuity.*
