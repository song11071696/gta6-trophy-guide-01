// Leonida Trophy Guide — tracker logic. Loads app/data/trophies.json (the only
// fetch the app makes, and it is one of its own files), renders the checklist,
// and keeps earned ticks in localStorage. No network requests besides that
// same-origin data file; source links are plain anchors the reader follows.
const STORAGE_KEY = 'gta6-trophy-guide-earned-v1';
const DEMO_IDS = [2, 3, 8, 15, 16, 17, 19, 21, 28, 32, 35, 42];

const params = new URLSearchParams(location.search);
const cardsEl = document.getElementById('cards');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const spoilersEl = document.getElementById('spoilers');
const earnedOnlyEl = document.getElementById('earnedOnly');
const resultCountEl = document.getElementById('resultCount');
const importNoteEl = document.getElementById('importNote');
const emptyEl = document.getElementById('emptyState');

let trophies = [];
let earned = new Set(loadStored());
let kindFilter = 'all';
const openGuides = new Set();

function loadStored() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((n) => typeof n === 'string') : [];
  } catch {
    return [];
  }
}

function saveEarned() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
}

function trophyById(id) {
  return trophies.find((t) => t.id === id);
}

function isSpoilerHidden(t) {
  return spoilersEl.checked && t.hidden && !earned.has(t.name);
}

function kindLabel(t) {
  return t.kind === 'story' ? 'Story' : t.kind === 'collectibles' ? 'Collectibles' : 'Activities';
}

function gradeCount(grade) {
  return trophies.filter((t) => t.grade === grade && earned.has(t.name)).length;
}

function renderProgress() {
  const total = trophies.length;
  const done = trophies.filter((t) => earned.has(t.name)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById('progressText').textContent = `${done} of ${total} earned`;
  document.getElementById('progressPct').textContent = `${pct}%`;
  document.getElementById('progressFill').style.width = `${pct}%`;
  document.getElementById('progressBreakdown').textContent =
    `Platinum ${gradeCount('platinum')}/1 · Gold ${gradeCount('gold')}/2 · Silver ${gradeCount('silver')}/6 · Bronze ${gradeCount('bronze')}/46`;
}

function makeBadge(text, cls) {
  const s = document.createElement('span');
  s.className = `badge ${cls}`;
  s.textContent = text;
  return s;
}

function renderCard(t) {
  const card = document.createElement('article');
  card.className = 'card' + (earned.has(t.name) ? ' earned' : '');
  card.id = `trophy-${t.id}`;

  const top = document.createElement('div');
  top.className = 'card-top';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.name);
  box.setAttribute('aria-label', `Earned: ${t.name}`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.name);
    else earned.delete(t.name);
    saveEarned();
    renderAll();
  });
  top.append(box);

  const head = document.createElement('div');
  const name = document.createElement('h3');
  name.className = 'trophy-name';
  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  if (isSpoilerHidden(t)) {
    name.textContent = 'Hidden story trophy';
    desc.textContent = 'Hidden story trophy — earn it to reveal its name and description.';
    desc.classList.add('spoiler-hidden');
  } else {
    name.textContent = t.name;
    desc.textContent = t.description;
  }
  head.append(name, desc);
  top.append(head);
  card.append(top);

  const badges = document.createElement('div');
  badges.className = 'badges';
  badges.append(makeBadge(t.grade, t.grade));
  badges.append(makeBadge(kindLabel(t), 'kind'));
  if (t.count !== null && t.count !== undefined) badges.append(makeBadge(`× ${t.count}`, 'kind'));
  if (t.missable) badges.append(makeBadge('⚠ Missable', 'missable'));
  if (t.hidden) badges.append(makeBadge('Hidden on PSN', 'hidden-badge'));
  card.append(badges);

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'guide-toggle';
  const open = openGuides.has(t.id);
  toggle.textContent = open ? 'Hide guide ▲' : 'Show guide ▼';
  toggle.addEventListener('click', () => {
    if (openGuides.has(t.id)) openGuides.delete(t.id);
    else openGuides.add(t.id);
    renderAll();
  });
  card.append(toggle);

  if (open) {
    const guide = document.createElement('div');
    guide.className = 'guide';
    if (isSpoilerHidden(t)) {
      const p = document.createElement('p');
      p.className = 'spoiler-hidden';
      p.textContent = 'Guide hidden until this trophy is earned — it would spoil the story.';
      guide.append(p);
    } else {
      const p = document.createElement('p');
      p.textContent = t.guide;
      guide.append(p);
      const src = document.createElement('p');
      src.className = 'sources';
      src.textContent = 'Sources: ';
      (t.sources || []).forEach((s) => {
        const a = document.createElement('a');
        a.href = s.url;
        a.textContent = s.name;
        a.target = '_blank';
        a.rel = 'noopener';
        src.append(a);
      });
      guide.append(src);
    }
    card.append(guide);
  }
  return card;
}

function visibleTrophies() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (kindFilter === 'story' && t.kind !== 'story') return false;
    if (kindFilter === 'missable' && !t.missable) return false;
    if (kindFilter === 'collectibles' && t.kind !== 'collectibles') return false;
    if (kindFilter === 'activities' && t.kind !== 'activities') return false;
    if (kindFilter === 'online') return false;
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (earnedOnlyEl.checked && !earned.has(t.name)) return false;
    if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderAll() {
  renderProgress();
  const shown = visibleTrophies();
  cardsEl.replaceChildren(...shown.map(renderCard));
  emptyEl.hidden = shown.length !== 0;
  const earnedShown = shown.filter((t) => earned.has(t.name)).length;
  resultCountEl.textContent = kindFilter === 'online'
    ? 'Online: 0 trophies — GTA VI has no online trophies; all 55 unlock in single-player.'
    : `Showing ${shown.length} of ${trophies.length} trophies (${earnedShown} earned in this view).`;
}

function showImportNote(text) {
  importNoteEl.textContent = text;
  importNoteEl.hidden = false;
}

document.getElementById('kindChips').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-kind]');
  if (!btn) return;
  kindFilter = btn.dataset.kind;
  document.querySelectorAll('#kindChips .chip').forEach((c) => c.classList.toggle('active', c === btn));
  renderAll();
});
searchEl.addEventListener('input', renderAll);
gradeEl.addEventListener('change', renderAll);
spoilersEl.addEventListener('change', renderAll);
earnedOnlyEl.addEventListener('change', renderAll);

document.getElementById('exportBtn').addEventListener('click', () => {
  const payload = {
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort(),
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
  showImportNote(`Exported ${earned.size} earned trophies to gta6-trophy-progress.json.`);
});

document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('expected a list of trophy names');
    const known = new Set(trophies.map((t) => t.name));
    const good = names.filter((n) => known.has(n));
    const unknown = names.length - good.length;
    earned = new Set(good);
    saveEarned();
    renderAll();
    showImportNote(`Imported ${good.length} earned trophies${unknown ? ` (${unknown} unknown names skipped)` : ''}.`);
  } catch (err) {
    showImportNote(`Import failed: ${err.message}. The file must be a JSON list of trophy names or an export from this guide.`);
  }
  e.target.value = '';
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all earned ticks? This cannot be undone (export first if you want a backup).')) return;
  earned = new Set();
  saveEarned();
  renderAll();
  showImportNote('Progress reset — 0 of 55 earned.');
});

// URL helpers used by the screenshots and by readers sharing a view:
// ?demo=1 ticks 12 trophies through the same earned-set path, so the cover
// shows real progress; ?spoilers=1 hides story trophies; ?q=<text> pre-fills
// the search; ?trophy=<id> opens that trophy's guide; ?view=roadmap shows
// just the roadmap and ?view=guide shows just the checklist (both hide the
// rest of the page, so the focused part sits at the top). No scrolling is
// done here: this build's headless screenshots come out blank on any scrolled
// page, and the checklist sits right under the toolbar, so every view above
// already shows at scroll position 0.
async function init() {
  const doc = await (await fetch('data/trophies.json')).json();
  trophies = doc.trophies;
  if (params.get('spoilers') === '1') spoilersEl.checked = true;
  const q = params.get('q');
  if (q) searchEl.value = q;
  if (params.get('view') === 'roadmap') document.body.classList.add('focus-roadmap');
  if (params.get('view') === 'guide') document.body.classList.add('focus-guide');
  if (params.get('demo') === '1' && earned.size === 0) {
    for (const id of DEMO_IDS) {
      const t = trophyById(id);
      if (t) earned.add(t.name);
    }
    saveEarned();
  }
  const openId = Number(params.get('trophy'));
  if (openId) openGuides.add(openId);
  renderAll();
}

init();
