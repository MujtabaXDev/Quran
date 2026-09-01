# Al-Qur'an Online Reader

A React + Node/Express site that lists 30 chapters (Para/Juz), and lets you
read any of them as a streamed, scroll-as-you-go PDF — plus a download button.

## How the "no full download" part works

- The backend serves PDFs with `express.static`, which supports HTTP Range
  requests automatically.
- The frontend uses `react-pdf` (built on Mozilla's `pdf.js`), which fetches
  PDFs in byte ranges rather than all at once.
- On top of that, the reader only tells `react-pdf` to render a page once
  that page's placeholder scrolls near the viewport (via an
  IntersectionObserver, ~800px lookahead). So opening a 30-page PDF only
  pulls down page 1 (plus a little metadata) at first, and further pages
  stream in as you scroll — the same feel as Google Drive's PDF preview.

## Project structure

```
quran-website/
  backend/       Express server + /pdfs folder for your PDF files
  frontend/      React (Vite) app
```

## Setup

### 1. Add your PDF files

Put 30 PDFs into `backend/pdfs/`, named:

```
quran-1.pdf
quran-2.pdf
...
quran-30.pdf
```

See `backend/pdfs/README.txt` for details (and how to switch to 114 Surahs
instead of 30 Para/Juz, if that's what you actually want).

### 2. Run the backend

```bash
cd backend
npm install
npm start
```

Runs on http://localhost:5000

### 3. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:3000 and proxies `/api` and `/pdfs` requests to the
backend (see `frontend/vite.config.js`).

Open http://localhost:3000, click a chapter, and it should open the PDF and
start showing pages immediately without waiting for the whole file.

## Deploying later

- Backend: any Node host (Render, Railway, a VPS, etc.) — just make sure
  Range requests aren't stripped by whatever reverse proxy you put in front
  of it (nginx/Express handle this fine by default).
- Frontend: build with `npm run build` inside `frontend/` and host the
  `dist/` folder anywhere static (Vercel, Netlify, S3, etc.). Point it at
  your deployed backend URL instead of the local proxy (update `src/api.js`
  and the `download` link's base URL).
- PDF storage: for a real deployment, consider moving `backend/pdfs` to
  object storage (S3, Cloudflare R2, etc.) instead of the server's local
  disk — those also support Range requests, and you won't need to worry
  about disk space.

## Where to get Quran PDF files

You'll need to source the 30 PDF files yourself. Many reputable Islamic
sites publish the Mushaf split into individual Para/Juz PDFs for free
download (e.g. Quran.com, IslamHouse, King Fahd Complex resources) — just
download and drop them into `backend/pdfs/` with the naming above.
