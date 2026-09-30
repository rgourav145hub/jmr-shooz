# DevCraft Web & Software Development Workspace

Welcome to your full-stack web and software development environment! Everything you need to design, develop, test, and ship modern web applications, APIs, and software has been configured.

---

## 🛠️ What's Set Up & Ready

| Tool / Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `v24.13.0` | High-performance JavaScript runtime for web development |
| **npm** | `11.6.2` | Package manager (PowerShell execution policy configured to `RemoteSigned`) |
| **pnpm** | `12.3.4` | Ultra-fast, disk-space-efficient modern package manager |
| **Git for Windows** | `2.55.0` | Distributed version control with default branch set to `main` |
| **Python** | `3.14.6` | Modern Python runtime with `pip 26.1` and `Scripts` in PATH |
| **VS Code** | `1.136.1` | Code editor with CLI integration (`code .`) |
| **React 19 + TypeScript** | `19.2.8` | Modern component-based UI framework |
| **Vite** | `8.2.2` | Next-generation instant development server & bundler |
| **Tailwind CSS** | `v4` | Modern utility-first CSS design system |
| **Lucide React** | `0.575.0` | Comprehensive modern icon library |
| **FastAPI + Uvicorn** | `0.141.1` | High-performance Python backend API framework |

---

## 🚀 Quick Start Guide

### 1. Launch the Web Application (Frontend)

From the root directory:
```powershell
npm run dev
```
Or directly from the `frontend/` folder:
```powershell
cd frontend
npm run dev
```
Then open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Launch the Backend API (FastAPI)

In a new terminal window:
```powershell
npm run dev:backend
```
Or:
```powershell
python backend/main.py
```
- **Live API**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative ReDoc Docs**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📂 Workspace Architecture

```text
antigravity project/
├── frontend/                     # Modern React 19 + Vite + TypeScript application
│   ├── src/
│   │   ├── App.tsx               # Main cockpit and application dashboard
│   │   ├── index.css             # Tailwind CSS v4 styling entry point
│   │   └── main.tsx              # React entry root
│   ├── package.json              # Frontend scripts and dependencies
│   ├── vite.config.ts            # Vite bundler & Tailwind configuration
│   └── tsconfig.json             # TypeScript compiler settings
│
├── backend/                      # Python FastAPI backend service
│   ├── main.py                   # REST API routes (Health, Info, Items) with CORS
│   └── requirements.txt          # Python dependencies (fastapi, uvicorn, pydantic)
│
├── .vscode/
│   └── extensions.json           # Recommended VS Code extensions
│
├── .gitignore                    # Version control ignore rules
├── package.json                  # Root runner scripts (dev, build, lint)
└── README.md                     # This documentation guide
```

---

## 💡 How to Build Different Software Types

### Building Web Applications (SaaS / Portals)
- Add new React components in `frontend/src/components/`.
- Use **Tailwind CSS** utility classes directly in your JSX for rapid UI styling.
- Make HTTP requests from React to `http://localhost:8000/api/...` using standard `fetch()` or `axios`.

### Building Backend APIs & Databases
- Open `backend/main.py` to add new REST endpoints using standard FastAPI decorators (`@app.get()`, `@app.post()`).
- To add a database:
  - **SQLite** (built-in with Python, zero configuration needed)
  - **SQLAlchemy** or **SQLModel** (`pip install sqlmodel`) for type-safe ORM

### Building Desktop Software
- You can turn this React application into a native desktop `.exe` installer at any time using:
  - **Tauri** (`npm create tauri-app`) — extremely lightweight, blazing fast
  - **Electron** (`npm install --save-dev electron`) — cross-platform desktop wrapper

### Version Control (Git & GitHub)
Initialize git in your workspace whenever you are ready:
```powershell
git init
git add .
git commit -m "feat: initial fullstack environment setup"
```
To push to GitHub:
```powershell
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```
