import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getChapter } from "../api.js";
import "./Reader.css";

export default function Reader() {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);
  const [error, setError] = useState(null);
  const [visiblePages, setVisiblePages] = useState(new Set([1]));
  const observerRef = useRef(null);

  useEffect(() => {
    setChapter(null);
    setError(null);
    setVisiblePages(new Set([1]));
    getChapter(id)
      .then(setChapter)
      .catch(() => setError("Could not load this chapter."));
  }, [id]);

  useEffect(() => {
    if (!chapter || !chapter.pageCount) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = Number(entry.target.dataset.page);
            setVisiblePages((prev) => new Set(prev).add(pageNum));
          }
        });
      },
      { rootMargin: "800px" },
    );

    document.querySelectorAll(".page-slot").forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current.disconnect();
  }, [chapter]);

  if (error) return <div className="reader-message">{error}</div>;
  if (!chapter) return <div className="reader-message">Loading…</div>;
  if (!chapter.available)
    return (
      <div className="reader-message">
        This chapter hasn't been uploaded yet.
      </div>
    );
  if (!chapter.pageCount)
    return (
      <div className="reader-message">
        Pages not converted yet for this chapter.
      </div>
    );

  return (
    <div className="reader-page">
      <div className="reader-header">
        <Link to="/" className="back-link">
          ← All chapters
        </Link>
        <h2 className="serif">{chapter.title}</h2>
        <a href={chapter.url} download className="download-link">
          Download PDF
        </a>
      </div>

      <div className="reader">
        {Array.from({ length: chapter.pageCount }, (_, i) => i + 1).map(
          (pageNum) => (
            <div key={pageNum} className="page-slot" data-page={pageNum}>
              {visiblePages.has(pageNum) ? (
                <img
                  src={`/api/pages/${id}/${pageNum}`}
                  alt={`Page ${pageNum}`}
                  className="page-image"
                  loading="lazy"
                />
              ) : (
                <div className="page-placeholder">Page {pageNum}</div>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
