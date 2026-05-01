# Brief Place

Brief Place is a standalone Vite + React code library with a manga-inspired interface. It runs as a normal static web app with Supabase email/password auth, Postgres metadata, and private Storage-backed file sync.

## Features

- Sign in with email and password
- Upload code files from the browser
- Store file records in Supabase Postgres
- Store original files in a private Supabase Storage bucket
- Preview text/code content with line numbers
- Copy code, download the original file, edit descriptions, star files, and delete files
- Browse by language and view local usage stats
- Switch between light and dark themes

## Supabase Setup

1. Create a Supabase project.
2. Open `SQL Editor` and run `supabase/schema.sql`.
3. In Supabase Auth, enable email/password signups.
4. Add these environment variables in Vercel:

```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_or_publishable_key
```

Only use the anon/publishable key in the frontend. Do not expose the Supabase `service_role` key.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

The generated `dist` folder can be deployed to Vercel, Netlify, GitHub Pages, or any static host. The included `vercel.json` rewrites all routes to `index.html` so React Router pages work on refresh.

## Data Storage

Uploaded file metadata is scoped to the signed-in user with Supabase Row Level Security. Original files are stored in the private `code-files` bucket under each user's auth ID.
