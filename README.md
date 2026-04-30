# Brief Place

Brief Place is a standalone Vite + React code library with a manga-inspired interface. It runs as a normal static web app and does not depend on external builder services, plugins, or runtime authentication.

## Features

- Upload local code files from the browser
- Store file records locally with IndexedDB
- Preview text/code content with line numbers
- Copy code, download the original file, edit descriptions, star files, and delete files
- Browse by language and view local usage stats
- Switch between light and dark themes

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

Uploaded files are saved in the visitor's browser using IndexedDB. This keeps the project fully self-controlled and serverless. Data is local to each browser profile and will not sync across devices unless you later add your own backend or storage provider.
