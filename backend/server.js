const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;
const PDFS_DIR = path.join(__dirname, "pdfs");
const PDFS_IMAGES_DIR = path.join(__dirname, "pdfs_images");

app.use(cors());

app.use(
  "/pdfs",
  express.static(PDFS_DIR, {
    setHeaders: (res) => {
      res.setHeader("Accept-Ranges", "bytes");
    },
  }),
);

const chapters = Array.from({ length: 30 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    title: `Para ${id}`,
    file: `quran-${id}.pdf`,
    url: `/pdfs/quran-${id}.pdf`,
  };
});

function getPageCount(chapterId) {
  const dir = path.join(PDFS_IMAGES_DIR, `quran-${chapterId}`);
  if (!fs.existsSync(dir)) return 0;
  return fs
    .readdirSync(dir)
    .filter((f) => f.startsWith("page-") && f.endsWith(".jpg")).length;
}

function resolveImagePath(chapterId, pageNum) {
  const dir = path.join(PDFS_IMAGES_DIR, `quran-${chapterId}`);
  if (!fs.existsSync(dir)) return null;

  const candidates = [
    `page-${pageNum}.jpg`,
    `page-${String(pageNum).padStart(2, "0")}.jpg`,
    `page-${String(pageNum).padStart(3, "0")}.jpg`,
  ];

  for (const candidate of candidates) {
    const fullPath = path.join(dir, candidate);
    if (fs.existsSync(fullPath)) return fullPath;
  }

  return null;
}

app.get("/api/chapters", (req, res) => {
  const withStatus = chapters.map((c) => ({
    ...c,
    available: fs.existsSync(path.join(PDFS_DIR, c.file)),
    pageCount: getPageCount(c.id),
  }));
  res.json(withStatus);
});

app.get("/api/chapters/:id", (req, res) => {
  const chapter = chapters.find((c) => c.id === parseInt(req.params.id, 10));
  if (!chapter) return res.status(404).json({ error: "Chapter not found" });
  const available = fs.existsSync(path.join(PDFS_DIR, chapter.file));
  res.json({ ...chapter, available, pageCount: getPageCount(chapter.id) });
});

app.get("/api/pages/:chapter/:page", (req, res) => {
  const { chapter, page } = req.params;
  const imagePath = resolveImagePath(chapter, Number(page));

  if (!imagePath) {
    return res.status(404).send("Page not found");
  }

  res.sendFile(imagePath, (err) => {
    if (err) res.status(404).send("Page not found");
  });
});

app.listen(PORT, () => {
  console.log(`Quran backend running on http://localhost:${PORT}`);
  console.log(`Drop PDF files into: ${PDFS_DIR}`);
});
