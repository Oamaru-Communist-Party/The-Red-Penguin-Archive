// script.js - search + load latest entries
let ARCHIVE = [];

// load index.json and store in ARCHIVE
async function loadArchive() {
  try {
    const res = await fetch('index.json', {cache: "no-store"});
    if (!res.ok) {
      console.error("Could not fetch index.json:", res.status);
      return [];
    }
    const data = await res.json();
    // ensure it's an array
    if (!Array.isArray(data)) return [];
    // store newest-first by default if entries have no dates
    ARCHIVE = data.slice().reverse();
    return ARCHIVE;
  } catch (err) {
    console.error("Error loading archive:", err);
    return [];
  }
}

// display a list of entries (used by search + on-load)
function renderEntries(list) {
  const results = document.getElementById('results');
  results.innerHTML = '';
  if (!list || list.length === 0) {
    results.innerHTML = '<div class="card"><p style="margin:0;color:#666">No results found.</p></div>';
    return;
  }

  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    const title = item.title || 'Untitled';
    const desc = item.description || '';
    const tags = (item.tags || []).join(', ');
    const link = item.link || '#';

    card.innerHTML = `
      <h3 class="entry-title">${escapeHtml(title)}</h3>
      <p class="entry-desc">${escapeHtml(desc)}</p>
      <p class="entry-meta">Tags: ${escapeHtml(tags)}</p>
      <a class="open-link" href="${escapeAttr(link)}" target="_blank" rel="noopener">Open</a>
    `;
    results.appendChild(card);
  });
}

// show recent list in sidebar
function showRecent(list, limit = 6) {
  const box = document.getElementById('recent-list');
  box.innerHTML = '';
  (list || []).slice(0, limit).forEach(item => {
    const a = document.createElement('a');
    a.href = item.link || '#';
    a.target = '_blank';
    a.rel = 'noopener';
    a.style.textDecoration = 'none';
    a.style.color = 'var(--accent)';
    a.style.fontSize = '14px';
    a.textContent = item.title || 'Untitled';
    box.appendChild(a);
  });
}

// public function used by index.html to auto-load
async function loadAndShowAll() {
  const all = await loadArchive();
  renderEntries(all);
  showRecent(all);
}

// search by title/description/tags (case-insensitive)
function performSearch() {
  const q = document.getElementById('searchBar').value.trim().toLowerCase();
  if (!q) {
    // empty query => show all (or recent)
    renderEntries(ARCHIVE);
    showRecent(ARCHIVE);
    return;
  }

  const results = ARCHIVE.filter(item => {
    const title = (item.title || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const tags = ((item.tags || []) .join(' ')).toLowerCase();
    return title.includes(q) || desc.includes(q) || tags.includes(q);
  });

  renderEntries(results);
  showRecent(results);
}

// small helpers to avoid injection issues when inserting into innerHTML
function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'","&#39;");
}
function escapeAttr(s) {
  if (!s) return '#';
  return String(s).replaceAll('"','%22');
}

// Immediately attempt to load (for users with no JS call)
loadAndShowAll();
