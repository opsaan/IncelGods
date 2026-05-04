# TrucelGods

A compact, high-performance, dark glassmorphism imageboard built for static hosting on GitHub Pages with a Supabase serverless backend.

## Live Site

- **Working link:** https://opsaan.github.io/TrucelGods/

## Features

- Fast static front-end with Vite + React.
- Real-time post updates via Supabase Realtime.
- Information-dense interface optimized for desktop and mobile.
- Anonymous or authenticated posting support through Supabase policies.
- Admin/moderator queue at `/admin` for flagged content workflows.
- Input validation with Zod and client-side sanitization with DOMPurify.
- Tailwind-based neon + glassmorphism minimal UI.
- Production GitHub Actions workflow for automated GitHub Pages deployment.

## Tech Stack

- **Frontend:** Vite + React + React Router
- **Styling:** Tailwind CSS
- **Validation & Sanitization:** Zod + DOMPurify
- **BaaS:** Supabase (Database, Auth, Realtime, optional Storage)
- **CI/CD:** GitHub Actions + GitHub Pages

## Project Structure

```
.
├── .env.example
├── .github/workflows/deploy.yml
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── supabase/schema.sql
└── src
    ├── App.jsx
    ├── main.jsx
    ├── components
    │   ├── NavBar.jsx
    │   └── PostCard.jsx
    ├── lib
    │   ├── supabase.js
    │   └── validation.js
    └── styles/index.css
```

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In **Authentication > Users**, create moderator/admin users.
4. Add role metadata to each mod/admin account, e.g.:
   - `{"role":"moderator"}` or `{"role":"admin"}`.
5. Copy:
   - Project URL -> `VITE_SUPABASE_URL`
   - Anon public key -> `VITE_SUPABASE_ANON_KEY`

## Environment Variables

Copy and fill:

```bash
cp .env.example .env
```

Required values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_REPO_BASE` (for GitHub Pages repo path, default `/TrucelGods/`)

## Local Development

```bash
npm install
npm run dev
```

Build/preview:

```bash
npm run build
npm run preview
```

## GitHub Deployment Guide

### 1) Initialize and push repository

```bash
git init
git add .
git commit -m "Initial TrucelGods release"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/TrucelGods.git
git push -u origin main
```

### 2) Configure GitHub Pages

- In GitHub repo, open **Settings > Pages**.
- Under **Build and deployment**, select **GitHub Actions**.

### 3) Configure repository secrets

In **Settings > Secrets and variables > Actions**, add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 4) Trigger deployment

- Push to `main`, or run **Actions > Deploy TrucelGods to GitHub Pages > Run workflow**.
- Wait for `build` and `deploy` jobs to finish.
- Live URL will be shown in workflow output and Pages settings.

## Security Best Practices

- Never commit `.env` files or service-role keys.
- Use only Supabase anon key in frontend builds.
- Keep moderation actions locked with RLS policies + role metadata.
- Regularly review flagged queue and retain audit logs in a separate table for production scaling.
- Add rate-limiting and bot protections (Cloudflare Turnstile/hCaptcha) for high-traffic deployments.
- Consider stricter insert policy for authenticated users only if abuse rises.

## Notes

- This app is static-hosted; all dynamic behavior is delegated to Supabase.
- If your GitHub repo name differs from `TrucelGods`, update both:
  - `vite.config.js` `base`
  - `VITE_REPO_BASE` in environment/workflow
