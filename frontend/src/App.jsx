import { Routes, Route } from 'react-router-dom';
import ChapterList from './components/ChapterList.jsx';
import Reader from './components/Reader.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChapterList />} />
      <Route path="/read/:id" element={<Reader />} />
    </Routes>
  );
}
