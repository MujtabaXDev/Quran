import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChapters } from "../api.js";
import "./ChapterList.css";

export default function ChapterList() {
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getChapters()
      .then(setChapters)
      .catch(() => setError("Could not load chapters."));
  }, []);

  if (error) return <div className="reader-message">{error}</div>;

  return (
    <div className="chapter-list-page">
      <h1 className="serif">Al-Qur'an Online</h1>
      <div className="chapter-grid">
        {chapters.map((c) => (
          <div key={c.id} className="chapter-tile">
            {c.available ? (
              <Link to={`/read/${c.id}`} className="chapter-link">
                <span className="chapter-title serif">{c.title}</span>
                <span className="chapter-status">
                  {c.pageCount ? `${c.pageCount} pages` : "Not converted yet"}
                </span>
              </Link>
            ) : (
              <div className="chapter-link disabled">
                <span className="chapter-title serif">{c.title}</span>
                <span className="chapter-status">Not uploaded yet</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
