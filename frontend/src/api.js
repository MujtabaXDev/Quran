const BASE = '/api';

export async function getChapters() {
  const res = await fetch(`${BASE}/chapters`);
  if (!res.ok) throw new Error('Failed to load chapters');
  return res.json();
}

export async function getChapter(id) {
  const res = await fetch(`${BASE}/chapters/${id}`);
  if (!res.ok) throw new Error('Failed to load chapter');
  return res.json();
}
