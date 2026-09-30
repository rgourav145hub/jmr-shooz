# JMR SHOOZ — Website Hosting & Deployment Guide

This website is built with **React 19 + TypeScript + Vite + Tailwind CSS 4**. It is fully compiled, production-ready, and can be hosted for **free** on Vercel, Netlify, GitHub Pages, or Render.

---

## Option 1: Deploy on Vercel (Recommended — 2 Minutes)

Vercel provides the fastest deployment with global edge CDN and automatic HTTPS:

1. Push your repository to **GitHub** (or GitLab/Bitbucket):
   ```bash
   git add .
   git commit -m "Complete JMR Shooz website"
   git push origin main
   ```
2. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub.
3. Click **"Add New Project"** and select your repository.
4. Set the **Root Directory** to `frontend`.
5. Vercel will automatically detect Vite:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Your website will be live at `https://jmr-shooz.vercel.app` (or your custom domain)!

*(The included `frontend/vercel.json` already handles all SPA client-side routes).*

---

## Option 2: Deploy on Netlify

1. Go to **[netlify.com](https://netlify.com)** and sign in.
2. Select **"Import from Git"**.
3. Choose your repository and configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy**.

*(The included `frontend/public/_redirects` file ensures all sub-routes resolve correctly on Netlify).*

---

## Option 3: Run Locally (Preview & Development)

To run the website on your local machine:

```bash
# In the project root:
npm --prefix frontend run dev
```

Or navigate to `frontend`:
```bash
cd frontend
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## Option 4: Local Production Preview

To test the compiled production build locally before hosting:

```bash
cd frontend
npm run build
npm run preview
```

Open the preview URL printed in your terminal (usually `http://localhost:4173`).
