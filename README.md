# CineAnime Vault 🎬 🌸

> A modern, sleek personal **Movie & Anime Watchlist Manager** built with React, Vite, TypeScript, and Tailwind CSS.
> **100% Frontend-Only & Zero-Backend** — all user data is safely persisted in browser `localStorage`.

Deployable seamlessly to **GitHub Pages** without any server setup, API keys, or database dependencies.

---

## ✨ Features

### 🎞️ Dual Media Management (Movies & Anime)
- **Separate Formats**: Specialized data tracking for both feature films and episodic anime series.
- **Anime Episode Tracker**:
  - Live progress stepper (`+1`, `-1`, and direct input).
  - Clickable visual episode matrix (jump to any episode).
  - Dynamic progress percentage calculation (e.g., `Episode 18 / 28` ➔ `64%`).
  - Automatic status transition to **Completed** with celebration confetti when the final episode is reached!
- **Movie Progress**: Simple watched/unwatched toggle with completion tracking.
- **Ratings & Reviews**: Score media from `0.0` to `10.0` stars with numerical display, synopses, personal notes, and timestamps.

### 🧭 Navigation & Views
- **Dashboard**: High-level overview with quick metric cards, "Continue Watching", "Recently Added", "Recently Completed", "Favorites", and "Plan to Watch" carousels.
- **My Library**: Full unified catalog with live debounced search across title, synopsis, genres, and tags.
- **Movies**: Dedicated film catalog with watch time estimates.
- **Anime**: Dedicated anime tracker with total episodes watched metrics.
- **Currently Watching**: Active viewing dashboard with quick `+1 Ep` and watched buttons right on the cards.
- **Completed**: Hall of fame for finished films and series with high-score indicators.
- **Watchlist (Plan to Watch)**: Quick-triage queue to move items into *Watching*, *Completed*, or *Dropped* with one click.
- **Favorites**: Starred collection for your all-time favorites.
- **Statistics**: Rich analytics dashboard with SVG client charts.
- **Settings**: Theme switcher, data import/export, and storage usage monitor.

### 📊 Dynamic Client-Side Statistics (No Hardcoded Numbers)
- **Status Distribution**: Interactive SVG Donut Chart for Completed, Watching, Plan to Watch, On Hold, and Dropped.
- **Movies vs Anime Ratio**: Visual proportion donut.
- **Rating Histogram**: Frequency distribution from 1★ to 10★.
- **Genre Breakdown**: Horizontal gradient bar chart of top genres.
- **Monthly Timeline**: History of additions over time.
- **Calculated Insights**: Estimated total watch hours (based on anime episode lengths and feature runtime) and overall completion rate.

### 🏷️ Custom Tags & Multi-Faceted Filters
- Pre-populated and custom tags (*Must Watch*, *Masterpiece*, *Childhood*, *Rewatch*, *Comfort Watch*, etc.).
- Multi-filter panel: Type (Movie/Anime), Status, Genre, Minimum Rating slider, Favorites only, and sorting (Title, Rating, Year, Date Added, Last Watched).
- Switch between **Grid View** and **List View** with persisted user preference.

### 💾 Resilient Offline Storage & Portability
- Centralized storage layer (`watchlist_media` and `watchlist_settings`).
- Crash-proof JSON parsing with schema validation and automatic fallback.
- **Backup Export (JSON)**: Full database export including version metadata and settings.
- **Spreadsheet Export (CSV)**: Export catalog for Excel, Google Sheets, or Notion.
- **Backup Import**: JSON parser with schema validation, preview modal, and options to either merge or replace your library.
- Initial curated library (12 iconic movies and anime) so first-time users can immediately test all features.
- Quick **Reset to Sample Data** or **Wipe Library** options with safe confirmation modals.

### 🎨 Themes & Design
- **Dark Mode (Default)**, **Light Mode**, and **System Preference**.
- **Resilient Poster Fallback**: Procedural SVG poster generator with deterministic color gradients, media type badges, and monogram initials if an image URL is missing or fails to load. The app will never crash or display broken images.
- Fully responsive across desktop, tablet, and mobile (bottom navigation bar + touch-friendly controls).

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite 8
- **Language**: TypeScript (Strict type safety, verbatim module syntax)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing**: `HashRouter` from `react-router-dom` (guarantees zero 404 errors on GitHub Pages refreshes)
- **Icons**: `lucide-react`
- **Effects**: `canvas-confetti`
- **Persistence**: `localStorage` (No backend, no database, no server required)

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 2. Installation
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
Generates optimized static assets in the `dist/` directory with relative asset paths (`./assets/...`).

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🌐 GitHub Pages Deployment Guide

The project is pre-configured with relative base paths (`base: './'`) and `HashRouter`, making it 100% compatible with GitHub Pages sub-directories.

### Option A: Automatic Deployment via GitHub Actions (Recommended)

1. Push this repository to GitHub.
2. In your repository on GitHub, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Create a file at `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. Push the workflow file. GitHub Actions will build and deploy your app automatically!

---

### Option B: Deploy using `gh-pages` CLI

1. Install `gh-pages`:
   ```bash
   npm install -D gh-pages
   ```

2. Add deploy scripts to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Run:
   ```bash
   npm run deploy
   ```

---

## 📁 Project Architecture

```
movie&anime_watchlist/
├── dist/                     # Production build output
├── src/
│   ├── types/
│   │   ├── media.ts          # MediaItem, WatchStatus, MediaType, FilterOptions
│   │   └── settings.ts       # ThemeMode, ViewMode, StorageExportSchema
│   ├── services/
│   │   ├── storage.ts        # Crash-resilient localStorage API, validation & schema
│   │   └── sampleData.ts     # Curated initial movies and anime library
│   ├── context/
│   │   ├── WatchlistContext.tsx # Central state for CRUD, filters, and modals
│   │   └── ThemeContext.tsx     # Theme switcher (dark / light / system)
│   ├── hooks/
│   │   ├── useWatchlist.ts   # Custom hook for watchlist context
│   │   ├── useTheme.ts       # Custom hook for theme context
│   │   └── useStats.ts       # Real-time analytics, distribution, and calculations
│   ├── utils/
│   │   ├── formatters.ts     # Episode progress %, status badges, dates
│   │   ├── placeholder.ts    # Procedural SVG poster generator
│   │   └── exportImport.ts   # Backup JSON & CSV download utilities
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx # Responsive shell (desktop sidebar + mobile drawer)
│   │   │   ├── Sidebar.tsx   # Desktop navigation with live badge counts
│   │   │   ├── MobileNav.tsx # Mobile bottom navigation bar
│   │   │   └── Header.tsx    # Header with theme switcher and add button
│   │   ├── common/
│   │   │   ├── Modal.tsx         # Accessible dialog modal (Escape key, backdrop blur)
│   │   │   ├── ConfirmDialog.tsx # Safe destructive action confirmations
│   │   │   ├── Rating.tsx        # Star & numerical rating badge
│   │   │   ├── ProgressBar.tsx   # Smooth progress indicator
│   │   │   ├── StatusBadge.tsx   # Color-coded status badge with pulse dot
│   │   │   ├── EmptyState.tsx    # Branded empty state with call-to-action
│   │   │   └── SearchBar.tsx     # Search input with clear button
│   │   ├── media/
│   │   │   ├── MediaCard.tsx     # Grid and list cards with quick +1 ep & actions
│   │   │   ├── MediaGrid.tsx     # Responsive grid / list container
│   │   │   ├── EpisodeTracker.tsx# Stepper, manual input, and visual episode matrix
│   │   │   ├── FilterPanel.tsx   # Search, multi-tag, genre, and sort controls
│   │   │   ├── MediaFormModal.tsx# Add/edit form with dynamic fields & validation
│   │   │   └── MediaDetailModal.tsx # Full metadata view, notes, and tags
│   │   └── stats/
│   │       ├── StatCard.tsx      # Metric card with icons
│   │       └── Charts.tsx        # Responsive SVG charts (Donut, Histogram, Bar, Timeline)
│   ├── pages/
│   │   ├── DashboardPage.tsx     # Main hub with key metrics and carousels
│   │   ├── LibraryPage.tsx       # Searchable and filterable master catalog
│   │   ├── MoviesPage.tsx        # Movies-only catalog
│   │   ├── AnimePage.tsx         # Anime-only catalog with episode milestones
│   │   ├── CurrentlyWatchingPage.tsx # Active titles with quick incrementing
│   │   ├── CompletedPage.tsx     # Completed hall of fame
│   │   ├── WatchlistPage.tsx     # Plan to Watch queue with triage actions
│   │   ├── FavoritesPage.tsx     # Starred titles
│   │   ├── StatisticsPage.tsx    # Charts, analytics, and library insights
│   │   └── SettingsPage.tsx      # Theme toggle, JSON/CSV export, backup restore
│   ├── App.tsx                   # HashRouter configuration and routes
│   └── main.tsx                  # React entry point
├── vite.config.ts                # Base './' for universal static hosting
├── index.html                    # Dark theme default, Google Fonts, and favicon
└── package.json
```

---

## 🔒 Privacy & Data Ownership

- **100% Client-Side**: No user data ever leaves your device.
- **No Analytics or Trackers**: CineAnime Vault does not send network requests to any third-party tracking services.
- **Portability**: You can export your entire collection at any time in standard JSON or CSV format.

---

## 📄 License

MIT License — Feel free to use, modify, and deploy for your personal portfolio!
