# TaskDock

Dock Your Tasks. Drive Your Progress.

### Live Application
* **Deployment URL**: [https://task-dock-lyart.vercel.app](https://task-dock-lyart.vercel.app)
* Hosted on **Vercel** with client-side SPA routing rewrites configuration.

---

## Technical Stack
* **Frontend Core**: React 19, TypeScript, Vite
* **Styling**: Tailwind CSS v4 variables with dynamic theme HSL mapping
* **State Management**: Zustand stores with optimistic updates
* **Form & Schema Validation**: React Hook Form with Zod schemas
* **Database & Auth Support**: Supabase Client SDK

---

## Infrastructure Architecture

### 1. Supabase Backend Integration
* **User Authentication**: Handles secure user registration, email verification checks, and session management.
* **Row-Level Security (RLS)**: Enforces boundaries at the database level. Each user is restricted to querying, inserting, updating, or deleting only their own tasks via the SQL policy:
  ```sql
  auth.uid() = user_id
  ```

### 2. Vercel Single-Page Application (SPA) Routing
* Enforced redirects inside `vercel.json` to handle client-side routing correctly. Direct page requests or refreshing on routes like `/dashboard` or `/board` rewrite back to `index.html` seamlessly.

### 3. Centralized UI Constants Config
* All user-facing strings, headers, errors, dialog text, and validation labels are stored in `src/constants/ui.constants.ts`. There are zero hardcoded string literals inside markup.

### 4. Input Security Validation
* Input forms validate types, boundaries, and lengths via Zod schema refinements.
* Employs regular expression scanners to block SQL Injection patterns (e.g. `' OR '1'='1`), HTML/XSS/XML Script tags (e.g. `<script>`, `javascript:`), and Path Traversal attempts (`../`).
* Suspicious actions trigger both an inline error under the field and a floating error toast alert.

---

## Project Structure
```text
TaskDock/
├── src/
│   ├── components/       # Shared UI (Button, Card, Input, Toast, Skeleton, Dialog)
│   ├── constants/        # Centralized UI labels & App route paths
│   ├── features/         # Feature components (Auth, Dashboard, Kanban-Board, Tasks)
│   ├── hooks/            # Reusable React hooks
│   ├── pages/            # View pages (Login, Dashboard, Board, Profile, Settings)
│   ├── services/         # Supabase Client and Database services
│   ├── store/            # Zustand global stores (auth, task, ui)
│   ├── types/            # TypeScript schemas & global types
│   └── utils/            # General utilities & security sanitizers
├── public/               # Static assets
├── vercel.json           # Vercel deployment rewrite rules
└── package.json          # Dependency packages
```

---

## Setup & Local Development

### 1. Requirements
Ensure you have Node.js installed on your system.

### 2. Environment Variables Setup
Create a `.env.local` file in the project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Installation
Install all dependency packages:
```bash
npm install
```

### 4. Run Development Server
Start the local server:
```bash
npm run dev
```
The server will start at `http://localhost:5173/`.
