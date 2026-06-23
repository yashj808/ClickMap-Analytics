# ClickMap — User Analytics Application

A lightweight, full-stack user analytics application that tracks user interactions on a webpage in real-time and displays them in a sleek, glassmorphic analytics dashboard. The application models core behaviors of product-level session tracking, journey mapping, and visual heatmaps.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Browser (Demo Page)                   │
│                                                         │
│   tracker.js  ──────► POST /api/events                  │
│   (session_id, event type, url, timestamp, x/y)        │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                  Node.js / Express API                   │
│                                                         │
│   POST   /api/events          ← ingest events           │
│   GET    /api/sessions        ← list sessions           │
│   GET    /api/sessions/:id    ← events for a session    │
│   GET    /api/heatmap         ← click coords for a URL  │
│   GET    /api/heatmap/urls    ← helper for unique URLs  │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                        MongoDB                          │
│                                                         │
│   Collection: events                                    │
│   { session_id, event_type, page_url, timestamp,        │
│     x, y (nullable), created_at }                       │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│               React Dashboard (Vite)                    │
│                                                         │
│   /sessions  → Sessions list + user journey drawer     │
│   /heatmap   → URL picker + click dot overlay          │
└─────────────────────────────────────────────────────────┘
```

---

## Features

1. **Client-Side Tracking (`tracker.js`)**: 
   - Non-blocking script that generates/persists a persistent session identifier.
   - Captures `page_view` events on initial load.
   - Capture `click` events with pixel viewport coordinates `(x, y)`.
   - Uses `fetch` with `keepalive: true` ensuring click dispatches are delivered even during link transitions or page unloads.

2. **Express Backend API**:
   - Clean MVC structure with database helpers.
   - Exposes robust REST endpoints for ingestion, aggregation, query filters, and helpers.
   - Uses MongoDB indices to keep query lookups fast at scale.

3. **React Vite Dashboard**:
   - Built with modern **Tailwind CSS** and **Lucide Icons** following sleek, glassmorphic dark-theme guidelines.
   - **Sessions View**: Auto-polling dashboard updating every 10s. Displays duration, event volume, and interactive row selections showing full scrollable step-by-step user journey timelines.
   - **Heatmap View**: Visual canvas with responsive scaling (retains coordinate fidelity across monitor widths). Overlays coordinates as glowing red dots. Stacked clicks build intensity visually.

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| **Tracking Script** | Vanilla JavaScript (ES6) |
| **Demo Page** | HTML5 / CSS3 Layout |
| **Backend API** | Node.js / Express |
| **Database** | MongoDB / Mongoose |
| **Dashboard** | React / Vite / Tailwind CSS v3 |

---

## Setup Instructions

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Running on default port `27017`)

---

### Step 1: Start MongoDB
Ensure MongoDB is running locally. If starting the service is blocked, you can run a standalone instance from this project's database folder:
```powershell
# Create DB folder
mkdir mongodb-data
# Start mongod on port 27017
mongod --dbpath ./mongodb-data --port 27017
```

---

### Step 2: Configure & Start Backend
1. Open a new terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Copy environment template and install packages:
   ```bash
   cp .env.example .env
   npm install
   ```
3. Run Express API in development mode:
   ```bash
   npm run dev
   ```
   *Express server will run on `http://localhost:4000`. The playground demo site will be available at `http://localhost:4000/demo`.*

---

### Step 3: Configure & Start Frontend
1. Open a new terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Run Vite server:
   ```bash
   npm run dev
   ```
   *Vite dashboard will run on `http://localhost:5173` (or `http://localhost:5174` if port 5173 is occupied).*

---

## API Reference

### 1. Ingest Event
- **Endpoint**: `POST /api/events`
- **Payload**:
  ```json
  {
    "session_id": "uuid-string",
    "event_type": "page_view | click",
    "page_url": "http://localhost:4000/demo",
    "timestamp": "2026-06-22T10:00:00.000Z",
    "x": 420,
    "y": 315
  }
  ```
- **Response**: `201 { "success": true }`

### 2. List Aggregated Sessions
- **Endpoint**: `GET /api/sessions`
- **Response**:
  ```json
  [
    {
      "session_id": "uuid-string",
      "event_count": 14,
      "first_seen": "2026-06-22T09:00:00.000Z",
      "last_seen": "2026-06-22T09:12:00.000Z"
    }
  ]
  ```

### 3. Get Session Events Journey
- **Endpoint**: `GET /api/sessions/:session_id`
- **Response**: List of all events for this session ordered chronologically.

### 4. Fetch Heatmap Click Coordinates
- **Endpoint**: `GET /api/heatmap?page_url=<encoded-url>`
- **Response**:
  ```json
  [
    { "x": 420, "y": 315, "timestamp": "...", "session_id": "..." }
  ]
  ```

### 5. Fetch Tracked Pages (Helper)
- **Endpoint**: `GET /api/heatmap/urls`
- **Response**: Array of distinct `page_url` values stored in the database.

---

## Assumptions & Trade-offs

- **Session Expiry**: Sessions are mapped directly to a client UUID stored in `localStorage`. In a production app, sessions would have idle timeout configurations (e.g., 30 minutes of inactivity) or cookie boundaries.
- **Client Coordinates**: clientX/clientY are reported relative to the browser viewport. To align clicked coordinates with page layout components across varying monitor sizes, the Heatmap canvas renders a dedicated 1280x720 schematic wireframe of the demo page layout. It implements scaling filters to match target sizes responsively without skewing coordinate pixel layouts.
- **Polling over WebSockets**: The dashboard retrieves updates by querying `GET /api/sessions` every 10 seconds. This avoids setting up WebSockets or server-sent events, drastically reducing backend architecture overhead while offering solid updates.

---

## Deployment

This monorepo project is ready to be deployed across platforms like **Vercel** (for the frontend) and **Render** or **Railway** (for the backend).

### 1. Frontend Dashboard (Vercel)
- Create a new project on [Vercel](https://vercel.com) and import this repository.
- In the project settings, set the **Root Directory** to `frontend`.
- Vercel will automatically detect Vite and configure the build command (`npm run build`) and output directory (`dist`).
- Add the following Environment Variable in the Vercel dashboard:
  - `VITE_API_URL`: The URL of your deployed backend Express API (e.g., `https://clickmap-api.onrender.com`).
- A `vercel.json` file is configured inside `frontend/` to manage URL rewrites, ensuring browser refreshes on routes like `/sessions` do not throw 404 errors.

### 2. Backend API & Database (Render / Railway)
- Create a new web service on [Render](https://render.com) or [Railway](https://railway.app) and import this repository.
- Set the **Root Directory** to `backend`.
- Configure the start command as `npm start`.
- Set the following Environment Variables:
  - `MONGODB_URI`: Your MongoDB connection string (use a free MongoDB Atlas cluster for hosting).
  - `PORT`: `4000` (or let it bind dynamically).

