const API = "";
let _token = null;
let _user = null;
let _notes = [];
let _page = 1;
let _hasMore = false;
let _currentNoteId = null;
let _filter = "all";
let _tagFilter = null;
let _dateFilter = null;
let _composerOpen = false;
let _activeEditor = null;
let _regLang = window._lang || "en";
let _chatHistory = [];
let _chatMsgCounter = 0;
let _toastTimer = null;
let _searchTimeout = null;
let _tooltipTimeout = null;
const graphTransform = { x: 0, y: 0, scale: 1 };
const _graphDrag = { active: false, startX: 0, startY: 0, originX: 0, originY: 0 };

// ── SVG ICONS ────────────────────────────────────────────────────────
const ICONS = {
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  notes: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  map: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><path d="M12 14v4M12 10V6M6 6l4 4M14 14l4 4M6 18l4-4M14 10l4-4"/></svg>`,
  spark: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  review: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  minus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/></svg>`,
  reset: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  close: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  back: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  edit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  pin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>`,
  pinOff: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="2" x2="22" y2="22"/><path d="M12 17v5"/><path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"/><path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 1.414-3.414"/><path d="M8 3h8"/></svg>`,
  insight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
  connection: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>`,
  file: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  empty: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity=".3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  brain: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-3.14z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-3.14z"/></svg>`,
  tag: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  send: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  loader: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
  // Note type icons
  book: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  idea: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>`,
  work: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`,
  travel: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2a1 1 0 0 0-.7 1.4l1.7 3.3 4.3-1L9 13l-1 4.3 3.3 1.7a1 1 0 0 0 1.4-.7z"/></svg>`,
  health: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  code: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  finance: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  music: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  design: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  ai: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12v-2a2 2 0 0 1 4 0v2"/><path d="M12 12h4"/><circle cx="19" cy="5" r="3"/></svg>`,
  science: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>`,
  food: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
};

// ── NOTE TYPE ICON MAPPING ────────────────────────────────────────────
const NOTE_TYPE_MAP = [
  { keys: ["book","reading","книга","read"],        icon: "book",    color: "#e8a045" },
  { keys: ["idea","ideas","идея","thought"],        icon: "idea",    color: "#f0c040" },
  { keys: ["work","job","работа","career","okr"],   icon: "work",    color: "#7b68ee" },
  { keys: ["travel","trip","путешествие","поездка","japan","flight"], icon: "travel", color: "#4ecdc4" },
  { keys: ["health","fitness","здоровье","sport"],  icon: "health",  color: "#ff6b8a" },
  { keys: ["code","dev","programming","код","js","python","backend","frontend","api"], icon: "code", color: "#61dafb" },
  { keys: ["finance","money","финансы","budget","invest"], icon: "finance", color: "#54d48c" },
  { keys: ["music","song","playlist"],              icon: "music",   color: "#a78bfa" },
  { keys: ["design","дизайн","ui","ux","figma"],    icon: "design",  color: "#f97316" },
  { keys: ["ai","ml","gpt","claude","нейро"],       icon: "ai",      color: "#38bdf8" },
  { keys: ["science","research","study","наука"],   icon: "science", color: "#34d399" },
  { keys: ["food","recipe","еда","кофе","coffee"],  icon: "food",    color: "#fb923c" },
];

function getNoteType(note) {
  const tags = (note.tags || []).map(t => t.toLowerCase());
  const content = (note.content || "").toLowerCase().slice(0, 200);
  for (const type of NOTE_TYPE_MAP) {
    if (type.keys.some(k => tags.some(tag => tag.includes(k)) || content.includes(k))) {
      return type;
    }
  }
  return { icon: "file", color: "#8b8fa8" };
}

// ── UTILS ────────────────────────────────────────────────────────────
function q(sel, root = document) { return root.querySelector(sel); }
function qa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function icon(name) { return ICONS[name] || ""; }

function t(key, fallback = "", vars = {}) {
  try {
    if (typeof window._t === "function") {
      const value = window._t(key, vars);
      if (value && value !== key) return value;
    }
  } catch {}
  return fallback || key;
}

function escHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return t("just_now", "just now");
  if (diff < 3600000) return `${Math.floor(diff / 60000)} ${t("ago_min", "m ago")}`;
  if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatDate(iso) {
  return new Date(iso).toLocaleString([], {
    month: "long", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function normalizeConnection(c = {}) {
  return {
    ...c,
    related_note_id: String(c.related_note_id ?? c.relatedNoteId ?? c.id ?? ""),
    related_note_content: c.related_note_content ?? c.relatedNoteContent ?? c.content ?? "",
    similarity_score: Number(c.similarity_score ?? c.similarityScore ?? 0),
    explanation: c.explanation ?? ""
  };
}

function normalizeNote(n = {}) {
  return {
    ...n,
    id: String(n.id ?? n.note_id ?? ""),
    content: n.content ?? "",
    html_content: n.html_content ?? n.htmlContent ?? null,
    tags: Array.isArray(n.tags) ? n.tags : [],
    created_at: n.created_at ?? n.createdat ?? n.createdAt ?? n.updated_at ?? new Date().toISOString(),
    connections: Array.isArray(n.connections) ? n.connections.map(normalizeConnection) : []
  };
}

function normalizeNotes(items) {
  return Array.isArray(items) ? items.map(normalizeNote) : [];
}

function noteTitle(note) {
  return (note.content || "").split("\n")[0].trim() || "Untitled";
}

function noteSnippet(note) {
  const lines = (note.content || "").split("\n").map(s => s.trim()).filter(Boolean);
  if (lines.length > 1) return lines.slice(1).join(" ").substring(0, 180);
  return (note.content || "").replace(/\n+/g, " ").trim().substring(0, 180);
}

function clampText(text, max = 120) {
  const value = String(text ?? "").replace(/\s+/g, " ").trim();
  if (value.length <= max) return value;
  return value.slice(0, max).trim() + "…";
}

function findNote(noteId) {
  return _notes.find(n => String(n.id) === String(noteId));
}

function showOffline(v) {
  const el = document.getElementById("offline-banner");
  if (el) el.classList.toggle("hidden", !v);
}

// ── API ──────────────────────────────────────────────────────────────
async function apiFetch(path, opts = {}) {
  const headers = { "Content-Type": "application/json" };
  if (_token) headers.Authorization = `Bearer ${_token}`;
  let res;
  try {
    res = await fetch(API + path, { ...opts, headers });
  } catch {
    showOffline(true);
    throw new Error("Network error");
  }
  showOffline(false);
  if (res.status === 401) { logout(); throw new Error("Unauthorized"); }
  if (res.status === 204) return null;
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) throw new Error((data && data.detail) || (typeof data === "string" && data) || "Error");
  return data;
}

// ── ICON HYDRATION ───────────────────────────────────────────────────
function hydrateIcons() {
  qa(".search-dot").forEach(el => el.innerHTML = icon("search"));
  qa(".search-icon").forEach(el => el.innerHTML = icon("search"));
  const nav = qa(".nav-item .nav-icon");
  if (nav[0]) nav[0].innerHTML = icon("notes");
  if (nav[1]) nav[1].innerHTML = icon("map");
  if (nav[2]) nav[2].innerHTML = icon("spark");
  if (nav[3]) nav[3].innerHTML = icon("review");
  const graphBtns = qa(".graph-controls .graph-ctrl-btn");
  if (graphBtns[0]) graphBtns[0].innerHTML = icon("plus");
  if (graphBtns[1]) graphBtns[1].innerHTML = icon("reset");
  if (graphBtns[2]) graphBtns[2].innerHTML = icon("minus");
  const signOut = q(".btn-signout");
  if (signOut) signOut.innerHTML = icon("close");
  const drClose = q(".dr-close-btn");
  if (drClose) drClose.innerHTML = icon("close");
  const detailHeaderBtns = qa(".detail-pane-actions .detail-action-btn");
  if (detailHeaderBtns[0]) detailHeaderBtns[0].innerHTML = icon("pin");
  if (detailHeaderBtns[1]) detailHeaderBtns[1].innerHTML = icon("spark");
  if (detailHeaderBtns[2]) detailHeaderBtns[2].innerHTML = icon("edit");
  if (detailHeaderBtns[3]) detailHeaderBtns[3].innerHTML = icon("trash");
  const detailClose = q(".detail-close-mobile");
  if (detailClose) detailClose.innerHTML = icon("close");
  const pinSlot = q(".pin-slot");   if (pinSlot) pinSlot.innerHTML = icon("pin");
  const trashSlot = q(".trash-slot"); if (trashSlot) trashSlot.innerHTML = icon("trash");
  const copySlot = q(".copy-slot");  if (copySlot) copySlot.innerHTML = icon("copy");
  const sparkSlot = q(".spark-slot"); if (sparkSlot) sparkSlot.innerHTML = icon("spark");
  const insightSlot = q(".insight-slot"); if (insightSlot) insightSlot.innerHTML = icon("insight");
  const noteIcon = q(".detail-note-icon"); if (noteIcon) noteIcon.innerHTML = icon("file");
  const toastSpinner = document.getElementById("toast-spinner");
  if (toastSpinner) toastSpinner.innerHTML = icon("loader");
}

// ── AUTH ─────────────────────────────────────────────────────────────
function switchAuthTab(tab) {
  document.getElementById("form-login")?.classList.toggle("hidden", tab !== "login");
  document.getElementById("form-register")?.classList.toggle("hidden", tab !== "register");
  qa(".tab-btn").forEach((b, i) => b.classList.toggle("active", (i === 0) === (tab === "login")));
}

async function handleLogin(e) {
  e.preventDefault();
  const errEl = document.getElementById("login-error");
  if (errEl) errEl.classList.add("hidden");
  try {
    const d = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: document.getElementById("login-username").value,
        password: document.getElementById("login-password").value
      })
    });
    if (d.language && d.language !== window._lang) {
      window._lang = d.language;
      localStorage.setItem("memo_lang", d.language);
    }
    bootApp(d.access_token, document.getElementById("login-username").value);
  } catch (err) {
    if (errEl) { errEl.textContent = err.message; errEl.classList.remove("hidden"); }
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const errEl = document.getElementById("reg-error");
  if (errEl) errEl.classList.add("hidden");
  try {
    const d = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: document.getElementById("reg-username").value,
        email: document.getElementById("reg-email").value,
        password: document.getElementById("reg-password").value,
        language: _regLang
      })
    });
    if (typeof window.setLanguage === "function") window.setLanguage(_regLang);
    bootApp(d.access_token, document.getElementById("reg-username").value);
  } catch (err) {
    if (errEl) { errEl.textContent = err.message; errEl.classList.remove("hidden"); }
  }
}

function bootApp(token, username) {
  _token = token;
  _user = { username };
  const avatar = document.getElementById("user-avatar");
  const display = document.getElementById("user-display");
  if (avatar) avatar.textContent = (username || "?").charAt(0).toUpperCase();
  if (display) display.textContent = username || "";
  document.getElementById("view-auth").style.display = "none";
  document.getElementById("view-app").classList.add("active");
  hydrateIcons();
  applyI18n();
  navigate("list");
  initAccent();
  initFontSize();
  initDensity();
  applyPrefs();
  loadNotes();
  apiFetch("/users/me")
    .then(profile => {
      if (profile?.language && profile.language !== window._lang) {
        window._lang = profile.language;
        localStorage.setItem("memo_lang", profile.language);
        applyI18n();
      }
    })
    .catch(() => {});
}

function logout() {
  _token = null; _user = null; _notes = [];
  _page = 1; _hasMore = false; _currentNoteId = null; _chatHistory = [];
  closeChat(); closeSearch(); closeNotePanel(); hideGraphTooltip();
  document.getElementById("view-app")?.classList.remove("active");
  document.getElementById("view-auth").style.display = "";
}

// ── I18N ─────────────────────────────────────────────────────────────
function applyI18n() {
  const allChip = q(".filter-chip[data-filter='all']");
  const connectedChip = q(".filter-chip[data-filter='connected']");
  const recentChip = q(".filter-chip[data-filter='recent']");
  if (allChip) allChip.textContent = t("all", "All");
  if (connectedChip) connectedChip.textContent = t("connected", "Connected");
  if (recentChip) recentChip.textContent = t("recent", "Recent");
  const dateWeek = q(".date-chip[data-df='week']");
  const dateMonth = q(".date-chip[data-df='month']");
  const dateAll = q(".date-chip[data-df='']");
  if (dateWeek) dateWeek.textContent = "This week";
  if (dateMonth) dateMonth.textContent = "This month";
  if (dateAll) dateAll.textContent = "All time";
  const newNoteMain = q("#new-note-btn .new-note-main");
  if (newNoteMain) newNoteMain.textContent = `+ ${t("new_note", "New note")}`;
  const noteInput = document.getElementById("note-input");
  if (noteInput) noteInput.placeholder = t("capture_placeholder", "Capture a thought... any language");
  const composerHint = q(".composer-hint");
  if (composerHint) composerHint.textContent = t("ctrl_enter", "Ctrl+Enter to save · Esc to close");
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.placeholder = t("search_semantic", "Search by meaning...");
  const sidebarSearchText = document.getElementById("sidebar-search-text");
  if (sidebarSearchText) sidebarSearchText.textContent = t("search_placeholder", "Search anything...");
  const topbarSearchText = document.getElementById("topbar-search-text");
  if (topbarSearchText) topbarSearchText.textContent = "Search notes, tags, or connections...";
  const navLabels = qa(".nav-label");
  if (navLabels[0]) navLabels[0].textContent = t("all_notes", "All notes");
  if (navLabels[1]) navLabels[1].textContent = t("map", "Map");
  const pinnedTitle = document.getElementById("nav-pinned-label");
  if (pinnedTitle) pinnedTitle.textContent = t("pinned", "Pinned");
  const titleEl = document.getElementById("topbar-title");
  if (titleEl?.dataset.view) {
    titleEl.textContent = titleEl.dataset.view === "canvas" ? t("map", "Map") : t("all_notes", "All notes");
  }
  const authTagline = document.getElementById("auth-tagline");
  if (authTagline) authTagline.textContent = t("tagline", "AI-powered second brain");
  const lblLang = document.getElementById("lbl-lang");
  if (lblLang) lblLang.textContent = t("interface_language", "Interface language");
  const authTabs = qa(".tab-bar .tab-btn");
  if (authTabs[0]) authTabs[0].textContent = t("sign_in", "Sign in");
  if (authTabs[1]) authTabs[1].textContent = t("register", "Register");
  const loginLabels = qa("#form-login .field label");
  if (loginLabels[0]) loginLabels[0].textContent = t("username", "Username");
  if (loginLabels[1]) loginLabels[1].textContent = t("password", "Password");
  const regLabels = qa("#form-register .field label");
  if (regLabels[0]) regLabels[0].textContent = t("username", "Username");
  if (regLabels[1]) regLabels[1].textContent = t("email", "Email");
  if (regLabels[2]) regLabels[2].textContent = t("password", "Password");
  const loginSubmit = q("#form-login .auth-submit");
  const regSubmit = q("#form-register .auth-submit");
  if (loginSubmit) loginSubmit.textContent = t("continue", "Continue");
  if (regSubmit) regSubmit.textContent = t("create_account", "Create account");
  const headCols = qa(".notes-grid-head > div");
  if (headCols[0]) headCols[0].textContent = "Title";
  if (headCols[1]) headCols[1].textContent = "Tags";
  if (headCols[2]) headCols[2].textContent = t("connections", "Connections");
  if (headCols[3]) headCols[3].textContent = t("updated", "Updated");
}

function initLangGrid() {
  const grid = document.getElementById("reg-lang-grid");
  if (!grid || typeof LANGUAGES === "undefined") return;
  grid.innerHTML = LANGUAGES.slice(0, 12)
    .map(l => `<button type="button" class="lang-option" onclick="selectRegLang('${l.code}',this)">
      <span class="lang-flag">${(l.code || "").toUpperCase().slice(0, 2)}</span>
      <span class="lang-name">${escHtml(l.name || l.code)}</span>
    </button>`)
    .join("");
}

function selectRegLang(code, el) {
  _regLang = code;
  qa("#reg-lang-grid .lang-option").forEach(b => b.classList.remove("selected"));
  if (el) el.classList.add("selected");
}

async function changeLanguage(lang) {
  if (typeof window.setLanguage === "function") window.setLanguage(lang);
  try {
    await apiFetch("/users/me/language", { method: "PATCH", body: JSON.stringify({ language: lang }) });
  } catch {}
}

// ── NAVIGATION ───────────────────────────────────────────────────────
function navigate(view = "list") {
  ["list", "canvas"].forEach(v => {
    document.getElementById(`view-${v}`)?.classList.toggle("hidden", v !== view);
    const navEl = document.getElementById(`nav-${v}`);
    if (navEl) navEl.classList.toggle("active", v === view);
  });
  const titleEl = document.getElementById("topbar-title");
  if (titleEl) { titleEl.textContent = view === "canvas" ? t("map", "Map") : t("all_notes", "All notes"); titleEl.dataset.view = view; }
  const filters = document.getElementById("topbar-filters");
  if (filters) filters.style.display = view === "list" ? "block" : "none";
  if (view === "canvas") renderGraph();
}

// ── DAILY REVIEW ─────────────────────────────────────────────────────
async function openDailyReview() {
  const modal = document.getElementById("daily-review-modal");
  const subtitle = document.getElementById("dr-subtitle");
  const body = document.getElementById("dr-body");
  if (!modal || !body) return;
  modal.classList.add("visible");
  document.body.style.overflow = "hidden";
  if (subtitle) {
    subtitle.textContent = new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  }
  body.innerHTML = `<div class="dr-loading">Loading your memories...</div>`;
  try {
    const data = await apiFetch("/daily-review");
    const rawNotes = Array.isArray(data?.notes) ? data.notes : [];
    const notes = rawNotes.map(normalizeNote);
    if (!notes.length) {
      body.innerHTML = `<div class="empty-state">${icon("empty")}<p>No notes older than a week yet.<br>Keep writing — they'll appear here.</p></div>`;
      return;
    }
    body.innerHTML = notes.map((note, index) => {
      const raw = rawNotes[index] || {};
      const preview = (note.content || "").substring(0, 220);
      const hasMore = (note.content || "").length > 220;
      const daysAgo = raw.days_ago;
      const dayLabel = daysAgo === 0 ? "today" : daysAgo === 1 ? "yesterday" : `${daysAgo ?? "—"} days ago`;
      const connCount = note.connections?.length || 0;
      const tagsHTML = (note.tags || []).map(tag => `<span class="note-tag">${escHtml(tag)}</span>`).join("");
      return `<div class="dr-note" onclick="openNote(${JSON.stringify(note.id)});closeDailyReview()">
        <div class="dr-note-meta">
          <span class="dr-day-label">${dayLabel}</span>
          ${connCount > 0 ? `<span class="dr-conn">${icon("connection")}${connCount}</span>` : ""}
          <span class="dr-date">${formatDate(note.created_at)}</span>
        </div>
        ${tagsHTML ? `<div class="dr-tags">${tagsHTML}</div>` : ""}
        <div class="dr-note-text">${escHtml(preview)}${hasMore ? ` <span class="dr-more">…</span>` : ""}</div>
      </div>`;
    }).join("");
  } catch (err) {
    body.innerHTML = `<div class="empty-state" style="color:var(--red)">Error: ${escHtml(err.message)}</div>`;
  }
}

function closeDailyReview() {
  const modal = document.getElementById("daily-review-modal");
  if (modal) modal.classList.remove("visible");
  document.body.style.overflow = "";
}

// ── FILTERS ──────────────────────────────────────────────────────────
function syncDateFilterChips() {
  qa(".date-chip").forEach(chip => {
    const chipValue = chip.dataset.df || null;
    chip.classList.toggle("active", chipValue === (_dateFilter || null));
  });
}

function setDateFilter(f) {
  _dateFilter = f || null;
  _page = 1; _notes = [];
  syncDateFilterChips();
  loadNotesWithFilter(true);
}

async function loadNotesWithFilter(reset = true) {
  if (reset) { _page = 1; _notes = []; }
  let url = `/notes?page=${_page}&per_page=40`;
  if (_dateFilter) url += `&date_filter=${encodeURIComponent(_dateFilter)}`;
  try {
    const data = await apiFetch(url);
    const incoming = normalizeNotes(data?.items || []);
    _notes = reset ? incoming : [..._notes, ...incoming];
    _hasMore = !!data?.has_more;
    renderTable();
    renderPinned();
    document.getElementById("load-more-btn")?.classList.toggle("hidden", !_hasMore);
  } catch (err) { console.error(err); }
}

// ── COMPOSER ─────────────────────────────────────────────────────────
function toggleComposer(forceOpen) {
  _composerOpen = forceOpen !== undefined ? forceOpen : !_composerOpen;
  document.getElementById("composer-bar")?.classList.toggle("open", _composerOpen);
  if (_composerOpen) setTimeout(() => document.getElementById("note-input")?.focus(), 100);
}

function handleNoteKeydown(e) {
  if (e.ctrlKey && e.key === "Enter") createNote();
  if (e.key === "Escape") toggleComposer(false);
}

// ── NOTES CRUD ───────────────────────────────────────────────────────
async function loadNotes(reset = true) {
  if (_dateFilter) return loadNotesWithFilter(reset);
  if (reset) { _page = 1; _notes = []; }
  try {
    const data = await apiFetch(`/notes?page=${_page}&per_page=40`);
    const incoming = normalizeNotes(data?.items || []);
    _notes = reset ? incoming : [..._notes, ...incoming];
    _hasMore = !!data?.has_more;
    renderTable();
    renderPinned();
    document.getElementById("load-more-btn")?.classList.toggle("hidden", !_hasMore);
  } catch (err) { console.error(err); }
}

async function loadMoreNotes() {
  _page += 1;
  if (_dateFilter) await loadNotesWithFilter(false);
  else await loadNotes(false);
}

function setFilter(f, el) {
  _filter = f;
  qa(".filter-chip").forEach(c => c.classList.remove("active"));
  if (el) el.classList.add("active");
  renderTable();
}

function getFilteredNotes() {
  let notes = [..._notes];
  if (_filter === "connected") notes = notes.filter(n => (n.connections?.length || 0) > 0);
  else if (_filter === "recent") notes = notes.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 20);
  if (_tagFilter) notes = notes.filter(n => (n.tags || []).includes(_tagFilter));
  return notes;
}

async function createNote() {
  const input = document.getElementById("note-input");
  const btn = document.getElementById("btn-save");
  const content = input?.value.trim();
  if (!content) return;
  if (btn) btn.disabled = true;
  showToast(t("saving", "Saving..."), false);
  try {
    const raw = await apiFetch("/notes", { method: "POST", body: JSON.stringify({ content }) });
    const note = normalizeNote(raw);
    if (input) input.value = "";
    toggleComposer(false);
    _notes.unshift(note);
    renderTable();
    renderPinned();
    const c = note.connections?.length || 0;
    const tagsStr = (note.tags || []).length ? ` · ${note.tags.join(", ")}` : "";
    const msg = c > 0
      ? t("found_connections", "Found {n} connection{s}", { n: c, s: c === 1 ? "" : "s" }) + tagsStr
      : `${t("note_saved", "Note saved")}${tagsStr}`;
    showToast(msg, true, 2400);
  } catch (err) {
    showToast(`Error: ${err.message}`, true, 3000);
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function deleteCurrentNote() {
  if (!_currentNoteId || !confirm(t("confirm_delete", "Delete this note?"))) return;
  try {
    await apiFetch(`/notes/${_currentNoteId}`, { method: "DELETE" });
    _notes = _notes.filter(n => String(n.id) !== String(_currentNoteId));
    closeNotePanel();
    renderTable();
    renderPinned();
    showToast("Note deleted", true, 1800);
  } catch (err) {
    showToast(`Error: ${err.message}`, true, 3000);
  }
}

// ── TAG FILTER ───────────────────────────────────────────────────────
function filterByTag(tag, event) {
  if (event) event.stopPropagation();
  _tagFilter = _tagFilter === tag ? null : tag;
  renderTable();
  const indicator = document.getElementById("tag-filter-indicator");
  if (!indicator) return;
  if (_tagFilter) {
    indicator.innerHTML = `${icon("tag")} &nbsp;${escHtml(_tagFilter)}&nbsp; <span onclick="filterByTag(_tagFilter)" style="opacity:.6;margin-left:4px">×</span>`;
    indicator.classList.remove("hidden");
    indicator.classList.add("active");
    indicator.onclick = () => filterByTag(_tagFilter);
  } else {
    indicator.classList.add("hidden");
    indicator.classList.remove("active");
    indicator.innerHTML = "";
    indicator.onclick = null;
  }
}

// ── RENDER TABLE ─────────────────────────────────────────────────────
function renderTable() {
  const tbody = document.getElementById("notes-tbody");
  if (!tbody) return;
  const visibleNotes = getFilteredNotes();

  if (!visibleNotes.length) {
    const msg = _tagFilter
      ? `No notes tagged "${escHtml(_tagFilter)}"`
      : t("no_notes_yet", "No notes yet — click New note to start");
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">${icon("empty")}<p>${msg}</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = visibleNotes.map(note => {
    const title = clampText(noteTitle(note), 60);
    const snippet = clampText(noteSnippet(note), 110);
    const connCount = note.connections?.length || 0;
    const tags = Array.isArray(note.tags) ? note.tags : [];
    const isActive = String(note.id) === String(_currentNoteId);
    const type = getNoteType(note);

    const tagsHTML = tags.slice(0, 3).map(tag =>
      `<span class="note-tag${_tagFilter === tag ? " active" : ""}" onclick="filterByTag(${JSON.stringify(tag)},event)">${escHtml(tag)}</span>`
    ).join("");

    const connHTML = connCount
      ? `<span class="conn-badge">${icon("connection")}<span>${connCount}</span></span>`
      : `<span style="color:var(--text-4);font-size:.78rem;padding-left:4px">—</span>`;

    return `<tr class="${isActive ? 'active' : ''}" onclick="openNote('${String(note.id).replace(/'/g,"\\'")}')">
      <td class="td-title-cell">
        <div class="note-row-inner">
          <div class="note-type-icon" style="--icon-color:${type.color}">${icon(type.icon)}</div>
          <div class="note-row-copy">
            <div class="note-row-title">${escHtml(title)}</div>
            ${snippet ? `<div class="note-row-snippet">${escHtml(snippet)}</div>` : ""}
          </div>
        </div>
      </td>
      <td class="td-tags">${tagsHTML || `<span style="color:var(--text-4);font-size:.78rem">—</span>`}</td>
      <td class="td-connections">${connHTML}</td>
      <td class="td-date">${formatTime(note.created_at)}</td>
    </tr>`;
  }).join("");
}

// ── RENDER PINNED & SIDEBAR TAGS ─────────────────────────────────────
function renderPinned() {
  const el = document.getElementById("pinned-list");
  if (!el) return;
  const pinned = _notes.filter(n => n.is_pinned);
  const items  = pinned.length ? pinned : _notes.slice(0, 5);
  el.innerHTML = items.map(note => {
    const type = getNoteType(note);
    return `<div class="pinned-note${note.is_pinned ? " pinned" : ""}" onclick="openNote('${note.id}')">
      <span class="pinned-note-icon">${icon(type.icon)}</span>
      <span class="pinned-note-title">${escHtml(clampText(noteTitle(note), 30))}</span>
    </div>`;
  }).join("");
  renderSidebarTags();
}

function renderSidebarTags() {
  const el = document.getElementById("sidebar-tags");
  if (!el) return;
  const allTags = [...new Set(_notes.flatMap(n => n.tags || []))].slice(0, 10);
  el.innerHTML = allTags.length
    ? allTags.map(tag => `
        <button class="sidebar-tag${_tagFilter === tag ? " active" : ""}" onclick="filterByTag('${escHtml(tag)}', event)">
          <span class="sidebar-tag-icon">${icon("tag")}</span>
          <span>${escHtml(tag)}</span>
        </button>`).join("")
    : `<span style="font-size:.74rem;color:var(--text-4);padding:0 8px">No tags yet</span>`;
}

// ── PIN ──────────────────────────────────────────────────────────────
function setPinState(pinned) {
  const label = document.getElementById("pin-label");
  const pinSlot = q(".pin-slot");
  const headerBtn = qa(".detail-pane-actions .detail-action-btn")[0];
  if (label) label.textContent = pinned ? "Un-pin this note" : "Pin this note";
  if (pinSlot) pinSlot.innerHTML = pinned ? icon("pinOff") : icon("pin");
  if (headerBtn) headerBtn.innerHTML = pinned ? icon("pinOff") : icon("pin");
}

async function togglePin() {
  if (!_currentNoteId) return;
  const note = findNote(_currentNoteId);
  if (!note) return;

  const newPinned = !note.is_pinned;
  try {
    await apiFetch(`/notes/${_currentNoteId}`, {
      method: "PATCH",
      body: JSON.stringify({ is_pinned: newPinned })
    });
    note.is_pinned = newPinned;
    setPinState(newPinned);
    renderPinned();
    showToast(newPinned ? "Note pinned" : "Note unpinned", true, 1500);
  } catch (err) {
    showToast(`Error: ${err.message}`, true, 2500);
  }
}

// ── NOTE DETAIL PANEL ────────────────────────────────────────────────
async function openNote(noteId) {
  hideGraphTooltip();
  const note = findNote(noteId);
  if (!note) return;

  _currentNoteId = String(noteId);
  renderTable();
  renderPinned();

  if (_activeEditor) { _activeEditor.destroy(); _activeEditor = null; }

  const panel = document.getElementById("note-detail-panel");
  if (panel) panel.classList.remove("hidden");

  const titleEl    = document.getElementById("panel-title");
  const dateEl     = document.getElementById("panel-date");
  const tagsEl     = document.getElementById("panel-tags");
  const body       = document.getElementById("panel-body");
  const insightSlot = document.getElementById("panel-insight-slot");

  if (titleEl) titleEl.textContent = clampText(noteTitle(note), 72);
  if (dateEl)  dateEl.textContent  = formatDate(note.created_at);

  if (tagsEl) {
    tagsEl.innerHTML = (note.tags || []).map(tag =>
      `<span class="note-tag" onclick='filterByTag(${JSON.stringify(tag)}, event)'>${escHtml(tag)}</span>`
    ).join("");
  }

  if (body) {
    body.innerHTML = note.html_content
      ? `<div class="panel-content-view">${note.html_content}</div>`
      : `<div class="panel-content-view">${escHtml(note.content).replace(/\n/g, "<br>")}</div>`;
  }

  if (insightSlot) insightSlot.innerHTML = "";

  // Reset AI Summary
  const aiBlock = document.getElementById("ai-summary-block");
  const aiText  = document.getElementById("ai-summary-text");
  if (aiBlock) aiBlock.style.display = "none";
  if (aiText)  aiText.innerHTML = "";
  window._lastSummary = "";

  setPinState(!!note.is_pinned);

  // Load connections
  let connections = [];
  try {
    const raw = await apiFetch(`/notes/${noteId}/connections`);
    connections = Array.isArray(raw) ? raw.map(normalizeConnection) : [];
  } catch {
    connections = note.connections || [];
  }

  // Connections list
  const connEl = document.getElementById("panel-connections");
  if (connEl) {
    if (connections.length) {
      connEl.innerHTML = connections.map(c => `
        <div class="panel-conn-item" onclick='openNote(${JSON.stringify(c.related_note_id)})'>
          <div class="panel-conn-left">
            <div class="panel-conn-badge">${icon("file")}</div>
            <div>
              <div class="panel-conn-title">${escHtml(clampText(c.related_note_content || "Related note", 40))}</div>
              <div class="panel-conn-sub">${escHtml(clampText(c.explanation || "", 52))}</div>
            </div>
          </div>
          <div class="panel-conn-score">${Math.round((c.similarity_score || 0) * 100)}%</div>
        </div>`).join("");
    } else {
      connEl.innerHTML = `<div style="padding:0 0 10px;color:var(--text-3);font-size:.8rem;">${t("no_connections", "No connections yet — add more notes on related topics")}</div>`;
    }
  }

  // Similar notes
  const connectedIds = new Set(connections.map(c => String(c.related_note_id)));
  const similar = _notes.filter(n => String(n.id) !== String(noteId) && !connectedIds.has(String(n.id))).slice(0, 5);
  const similarEl = document.getElementById("panel-similar");
  if (similarEl) {
    similarEl.innerHTML = similar.length
      ? similar.map(n => `
          <div class="panel-conn-item" onclick='openNote(${JSON.stringify(n.id)})'>
            <div class="panel-conn-left">
              <div class="panel-conn-badge">${icon("file")}</div>
              <div>
                <div class="panel-conn-title">${escHtml(clampText(noteTitle(n), 34))}</div>
                <div class="panel-conn-sub">${escHtml(clampText(noteSnippet(n), 42))}</div>
              </div>
            </div>
            <div class="panel-conn-score">${n.connections?.length || 0}</div>
          </div>`).join("")
      : `<div style="padding:0 0 10px;color:var(--text-3);font-size:.8rem;">No other notes</div>`;
  }

  // AI Summary
  if (connections.length >= 1) loadAISummary(noteId);

  // Insight button
  const insightTrigger = document.getElementById("panel-insight-trigger");
  if (insightTrigger) {
    if (connections.length >= 2) {
      insightTrigger.style.display = "";
      insightTrigger.onclick = () => generateInsightPanel(noteId, connections.map(c => c.related_note_id));
    } else {
      insightTrigger.style.display = "none";
    }
  }

  const insightSection = document.getElementById("insight-action-section");
  const insightBtn     = document.getElementById("panel-insight-btn");
  if (insightSection && insightBtn) {
    if (connections.length >= 2) {
      insightSection.style.display = "";
      insightBtn.innerHTML = `<span>${icon("insight")}</span><span>${t("generate_insight", "Generate insight")}</span>`;
      insightBtn.onclick = () => generateInsightPanel(noteId, connections.map(c => c.related_note_id));
    } else {
      insightSection.style.display = "none";
    }
  }
}

function closeNotePanel() {
  if (_activeEditor) { _activeEditor.destroy(); _activeEditor = null; }
  document.getElementById("note-detail-panel")?.classList.add("hidden");
  _currentNoteId = null;
  renderTable();
  renderPinned();
}

function startEditingPanel() {
  if (!_currentNoteId) return;
  startEditing(_currentNoteId);
}
function moveToTrash() { deleteCurrentNote(); }

function copyNoteLink() {
  navigator.clipboard
    .writeText(`${location.origin}/?note=${encodeURIComponent(_currentNoteId || "")}`)
    .then(() => showToast("Link copied", true, 1500))
    .catch(() => showToast("Copy failed", true, 1500));
}

// ── AI SUMMARY ───────────────────────────────────────────────────────
async function loadAISummary(noteId) {
  const block = document.getElementById("ai-summary-block");
  const text  = document.getElementById("ai-summary-text");
  if (!block || !text) return;
  block.style.display = "";
  text.innerHTML = `<span style="color:var(--text-3);font-size:.82rem">Generating summary…</span>`;
  try {
    const data = await apiFetch("/notes/cluster-summary", {
      method: "POST",
      body: JSON.stringify({ note_ids: [noteId] })
    });
    text.textContent = data.summary || "No summary available.";
    window._lastSummary = data.summary || "";
  } catch {
    block.style.display = "none";
  }
}

function copySummary() {
  navigator.clipboard.writeText(window._lastSummary || "")
    .then(() => showToast("Summary copied", true, 1500))
    .catch(() => showToast("Copy failed", true, 1500));
}

// ── INSIGHT ──────────────────────────────────────────────────────────
async function generateInsightPanel(sourceId, relatedIds) {
  showToast(t("ai_working", "AI is thinking..."), false);
  try {
    const data = await apiFetch("/notes/cluster-summary", {
      method: "POST",
      body: JSON.stringify({ note_ids: [sourceId, ...relatedIds].slice(0, 10) })
    });
    hideToast();
    const slot = document.getElementById("panel-insight-slot");
    if (!slot) return;
    const raw = String(data?.summary || "");
    const html = raw
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>");
    slot.innerHTML = `<div class="insight-result"><div class="detail-card-head">${icon("insight")} Insight</div><div style="padding:0 14px 14px;color:var(--text-2);font-size:.88rem;line-height:1.7">${html}</div></div>`;
    slot.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    showToast(`Error: ${err.message}`, true, 3000);
  }
}

// ── EDITING ──────────────────────────────────────────────────────────
function startEditing(noteId) {
  const note = findNote(noteId);
  if (!note) return;

  const body = document.getElementById("panel-body");
  if (!body) return;

  // Сохраняем оригинал для Cancel
  body.dataset.originalHtml    = body.innerHTML;
  body.dataset.editingNoteId   = String(noteId);

  // Уничтожаем старый редактор если был
  if (_activeEditor) { _activeEditor.destroy(); _activeEditor = null; }

  // Монтируем MemoEditor
  body.innerHTML = `
    <div id="editor-mount" class="editor-mount"></div>
    <div class="editor-footer">
      <span class="composer-hint">Ctrl+Enter to save · Esc to cancel</span>
      <div class="composer-actions">
        <button class="btn btn-ghost" id="cancel-edit-btn">Cancel</button>
        <button class="btn btn-primary" id="save-edit-btn">Save</button>
      </div>
    </div>
  `;

  const mount = document.getElementById("editor-mount");
  _activeEditor = new MemoEditor(mount, {
    initialHtml: note.html_content || `<p>${escHtml(note.content || "")}</p>`,
    onChange: () => {}
  });
  window._memoEditor = _activeEditor;
  _activeEditor.focus();

  // Обработчики кнопок
  document.getElementById("cancel-edit-btn")
    .addEventListener("click", () => cancelEdit(noteId));
  document.getElementById("save-edit-btn")
    .addEventListener("click", () => saveEdit(noteId));

  // Ctrl+Enter / Esc
  mount.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === "Enter") { e.preventDefault(); saveEdit(noteId); }
    if (e.key === "Escape") { e.preventDefault(); cancelEdit(noteId); }
  }, true);
}

async function saveEdit(noteId) {
  if (!_activeEditor) return;

  const htmlContent = _activeEditor.getHTML().trim();
  const plainText   = _activeEditor.getPlainText().trim();
  if (!plainText) { showToast("Note is empty", true, 1500); return; }

  showToast("Saving...", false);
  try {
    const updated = await apiFetch(`/notes/${noteId}`, {
      method: "PATCH",
      body: JSON.stringify({ content: plainText, html_content: htmlContent })
    });

    const idx = _notes.findIndex(n => String(n.id) === String(noteId));
    if (idx !== -1) {
      _notes[idx] = {
        ..._notes[idx],
        ...updated,
        id: noteId,
        content: plainText,
        html_content: htmlContent
      };
    }

    if (_activeEditor) { _activeEditor.destroy(); _activeEditor = null; }
    window._memoEditor = null;
    hideToast();
    showToast("Saved ✓", true, 1800);
    renderTable();
    renderPinned();
    openNote(noteId);
  } catch (err) {
    showToast(`Error: ${err.message}`, true, 3000);
  }
}

function cancelEdit(noteId) {
  const body = document.getElementById("panel-body");
  if (_activeEditor) { _activeEditor.destroy(); _activeEditor = null; }
  window._memoEditor = null;
  if (body?.dataset.originalHtml !== undefined) {
    body.innerHTML = body.dataset.originalHtml;
    delete body.dataset.originalHtml;
    delete body.dataset.editingNoteId;
  } else {
    openNote(noteId);
  }
}

// ── GRAPH ────────────────────────────────────────────────────────────
function renderGraph() {
  const svg = document.getElementById("graph-svg");
  const container = document.getElementById("canvas-container");
  if (!svg || !container) return;
  const W = container.offsetWidth || 900;
  const H = container.offsetHeight || 600;
  svg.setAttribute("width", W);
  svg.setAttribute("height", H);
  if (!_notes.length) {
    svg.innerHTML = `<text x="${W/2}" y="${H/2}" text-anchor="middle" fill="rgba(255,255,255,.2)" font-size="14" font-family="Inter,sans-serif">No notes yet — create notes to see the map</text>`;
    return;
  }
  graphTransform.x = 0; graphTransform.y = 0; graphTransform.scale = 1;
  const positions = {};
  const cx = W / 2, cy = H / 2;
  const radius = Math.min(W, H) * 0.38;
  _notes.forEach((note, i) => {
    const angle = (i / _notes.length) * Math.PI * 2 - Math.PI / 2;
    positions[note.id] = {
      x: cx + radius * Math.cos(angle) * (0.62 + Math.random() * 0.3),
      y: cy + radius * Math.sin(angle) * (0.62 + Math.random() * 0.3)
    };
  });
  const COLORS = ["#7c5cff","#2ed3c6","#8b5cf6","#0ea5e9","#9e8bff","#06b6d4","#a855f7"];
  const edges = []; const edgeSeen = new Set();
  _notes.forEach(note => {
    (note.connections || []).forEach(conn => {
      const toId = String(conn.related_note_id);
      const key = [String(note.id), toId].sort().join("--");
      if (!edgeSeen.has(key) && positions[note.id] && positions[toId]) {
        edgeSeen.add(key);
        edges.push({ from: String(note.id), to: toId, score: Number(conn.similarity_score || 0) });
      }
    });
  });
  const edgesSVG = edges.map(e => {
    const f = positions[e.from], t2 = positions[e.to];
    return `<line x1="${f.x}" y1="${f.y}" x2="${t2.x}" y2="${t2.y}" stroke="rgba(124,92,255,${0.15 + e.score * 0.3})" stroke-width="${0.8 + e.score * 1.5}"/>`;
  }).join("");
  const nodesSVG = _notes.map((note, i) => {
    const p = positions[note.id];
    const r = 7 + (note.connections?.length || 0) * 2.8;
    const label = noteTitle(note).substring(0, 24) + (noteTitle(note).length > 24 ? "…" : "");
    const color = COLORS[i % COLORS.length];
    return `<g class="graph-node-group" onclick="openNote(${JSON.stringify(note.id)})" onmouseenter="showGraphTooltip(event,${JSON.stringify(note.id)})" onmouseleave="hideGraphTooltip()" style="cursor:pointer">
      <circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${color}" fill-opacity=".18" stroke="${color}" stroke-width="1.5"/>
      <text x="${p.x}" y="${p.y + r + 13}" text-anchor="middle" fill="rgba(255,255,255,.55)" font-size="10" font-family="Inter,sans-serif">${escHtml(label)}</text>
    </g>`;
  }).join("");
  svg.innerHTML = `<g id="graph-root">${edgesSVG}${nodesSVG}</g>`;
  applyGraphTransform();
  initGraphInteraction();
}

function resetGraph() { graphTransform.x = 0; graphTransform.y = 0; graphTransform.scale = 1; applyGraphTransform(); }

function applyGraphTransform() {
  const root = document.getElementById("graph-root");
  if (!root) return;
  root.setAttribute("transform", `translate(${graphTransform.x},${graphTransform.y}) scale(${graphTransform.scale})`);
}

function initGraphInteraction() {
  const svg = document.getElementById("graph-svg");
  if (!svg || svg._interactionBound) return;
  svg._interactionBound = true;
  svg.addEventListener("wheel", e => {
    e.preventDefault();
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left, mouseY = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(4, Math.max(0.2, graphTransform.scale * delta));
    graphTransform.x = mouseX - (mouseX - graphTransform.x) * (newScale / graphTransform.scale);
    graphTransform.y = mouseY - (mouseY - graphTransform.y) * (newScale / graphTransform.scale);
    graphTransform.scale = newScale;
    applyGraphTransform();
  }, { passive: false });
  svg.addEventListener("mousedown", e => {
    if (e.button !== 0 || e.target.closest(".graph-node-group")) return;
    _graphDrag.active = true;
    _graphDrag.startX = e.clientX; _graphDrag.startY = e.clientY;
    _graphDrag.originX = graphTransform.x; _graphDrag.originY = graphTransform.y;
    svg.style.cursor = "grabbing"; e.preventDefault();
  });
  window.addEventListener("mousemove", e => {
    if (!_graphDrag.active) return;
    graphTransform.x = _graphDrag.originX + (e.clientX - _graphDrag.startX);
    graphTransform.y = _graphDrag.originY + (e.clientY - _graphDrag.startY);
    applyGraphTransform();
  });
  window.addEventListener("mouseup", () => { if (!_graphDrag.active) return; _graphDrag.active = false; svg.style.cursor = "grab"; });
  let lastTouches = null;
  svg.addEventListener("touchstart", e => { e.preventDefault(); lastTouches = e.touches; }, { passive: false });
  svg.addEventListener("touchmove", e => {
    e.preventDefault();
    const touches = e.touches;
    if (touches.length === 1 && lastTouches?.length === 1) {
      graphTransform.x += touches[0].clientX - lastTouches[0].clientX;
      graphTransform.y += touches[0].clientY - lastTouches[0].clientY;
      applyGraphTransform();
    } else if (touches.length === 2 && lastTouches?.length === 2) {
      const prevDist = Math.hypot(lastTouches[0].clientX - lastTouches[1].clientX, lastTouches[0].clientY - lastTouches[1].clientY);
      const newDist  = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
      const delta = newDist / prevDist;
      const newScale = Math.min(4, Math.max(0.2, graphTransform.scale * delta));
      const rect = svg.getBoundingClientRect();
      const midX = (touches[0].clientX + touches[1].clientX) / 2 - rect.left;
      const midY = (touches[0].clientY + touches[1].clientY) / 2 - rect.top;
      graphTransform.x = midX - (midX - graphTransform.x) * (newScale / graphTransform.scale);
      graphTransform.y = midY - (midY - graphTransform.y) * (newScale / graphTransform.scale);
      graphTransform.scale = newScale;
      applyGraphTransform();
    }
    lastTouches = touches;
  }, { passive: false });
  svg.addEventListener("touchend", () => { lastTouches = null; });
  svg.style.cursor = "grab";
}

// ── GRAPH TOOLTIP ────────────────────────────────────────────────────
function showGraphTooltip(event, noteId) {
  const note = findNote(noteId);
  if (!note) return;
  clearTimeout(_tooltipTimeout);
  _tooltipTimeout = setTimeout(() => {
    let tooltip = document.getElementById("graph-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "graph-tooltip";
      tooltip.style.cssText = "position:fixed;z-index:1200;width:260px;padding:12px;border-radius:16px;background:rgba(19,23,34,.96);border:1px solid rgba(255,255,255,.09);box-shadow:0 20px 50px rgba(0,0,0,.45);opacity:0;pointer-events:none;transform:translateY(4px);transition:opacity .14s ease,transform .14s ease;";
      document.body.appendChild(tooltip);
    }
    const connCount = note.connections?.length || 0;
    const preview = (note.content || "").substring(0, 200);
    const hasMore = (note.content || "").length > 200;
    const tagsHTML = (note.tags || []).map(tag => `<span class="note-tag">${escHtml(tag)}</span>`).join("");
    tooltip.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span style="font-size:.72rem;color:var(--text-3)">${formatTime(note.created_at)}</span>
        ${connCount > 0 ? `<span style="font-size:.72rem;color:var(--accent);display:flex;align-items:center;gap:3px">${icon("connection")} ${connCount}</span>` : ""}
      </div>
      ${tagsHTML ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${tagsHTML}</div>` : ""}
      <div style="font-size:.8rem;color:var(--text-2);line-height:1.6">${escHtml(preview)}${hasMore ? " …" : ""}</div>`;
    tooltip.style.opacity = "1";
    tooltip.style.transform = "translateY(0)";
    const tw = 260, th = tooltip.offsetHeight || 150;
    const left = event.clientX + 20 + tw > window.innerWidth ? event.clientX - tw - 12 : event.clientX + 16;
    const top  = event.clientY + 16 + th > window.innerHeight ? event.clientY - th - 8  : event.clientY + 16;
    tooltip.style.left = `${Math.max(4, left)}px`;
    tooltip.style.top  = `${Math.max(4, top)}px`;
  }, 100);
}

function hideGraphTooltip() {
  clearTimeout(_tooltipTimeout);
  const tooltip = document.getElementById("graph-tooltip");
  if (tooltip) { tooltip.style.opacity = "0"; tooltip.style.transform = "translateY(4px)"; }
}

// ── SEARCH ───────────────────────────────────────────────────────────
function openSearch() {
  document.getElementById("search-overlay")?.classList.remove("hidden");
  setTimeout(() => document.getElementById("search-input")?.focus(), 50);
}

function closeSearch() {
  const overlay = document.getElementById("search-overlay");
  const input = document.getElementById("search-input");
  const list  = document.getElementById("search-results-list");
  if (overlay) overlay.classList.add("hidden");
  if (input) input.value = "";
  if (list) list.innerHTML = `<div class="search-empty">${t("search_semantic", "Start typing to search semantically")}</div>`;
}

function handleSearchOverlayClick(e) { if (e.target.id === "search-overlay") closeSearch(); }
function handleSearchKey(e) { if (e.key === "Escape") closeSearch(); }
function debouncedSearch() { clearTimeout(_searchTimeout); _searchTimeout = setTimeout(doSearch, 300); }

async function doSearch() {
  const input = document.getElementById("search-input");
  const list  = document.getElementById("search-results-list");
  const qv = input?.value.trim();
  if (!list) return;
  if (!qv) { list.innerHTML = `<div class="search-empty">${t("search_semantic", "Start typing...")}</div>`; return; }
  list.innerHTML = `<div class="search-empty">Searching…</div>`;
  try {
    const results = await apiFetch(`/search?q=${encodeURIComponent(qv)}&limit=8`);
    if (!results?.length) { list.innerHTML = `<div class="search-empty">No results for "${escHtml(qv)}"</div>`; return; }
    list.innerHTML = results.map(r => {
      const note = normalizeNote(r.note);
      const title   = clampText(noteTitle(note), 48);
      const snippet = clampText(noteSnippet(note), 72);
      const tagsHTML = note.tags.slice(0, 3).map(tag => `<span class="note-tag">${escHtml(tag)}</span>`).join("");
      const type = getNoteType(note);
      return `<div class="search-result-item" onclick="openNote(${JSON.stringify(note.id)});closeSearch()">
        <div class="search-result-icon" style="color:${type.color}">${icon(type.icon)}</div>
        <div class="search-result-copy">
          <div class="search-result-title">${escHtml(title)}</div>
          ${snippet ? `<div class="search-result-snippet">${escHtml(snippet)}</div>` : ""}
          ${tagsHTML ? `<div style="display:flex;gap:4px;margin-top:4px;flex-wrap:wrap">${tagsHTML}</div>` : ""}
        </div>
        <div class="search-result-score">${Math.round((r.similarity_score || 0) * 100)}%</div>
      </div>`;
    }).join("");
  } catch (err) {
    list.innerHTML = `<div class="search-empty" style="color:var(--red)">Error: ${escHtml(err.message)}</div>`;
  }
}

// ── CHAT ─────────────────────────────────────────────────────────────
function openChat() {
  let panel = document.getElementById("chat-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "chat-panel";
    panel.className = "chat-panel";
    panel.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-left">${icon("spark")} <span>Ask your notes</span></div>
        <button class="btn-icon" onclick="closeChat()">${icon("close")}</button>
      </div>
      <div class="chat-messages" id="chat-messages">
        <div class="chat-msg chat-msg-ai">
          <div class="chat-msg-avatar">${icon("brain")}</div>
          <div class="chat-msg-content">
            Ask a question about your notes.<br>
            <span style="color:var(--text-3);font-size:.8rem">Semantic search will answer from what you already wrote.</span>
          </div>
        </div>
      </div>
      <div class="chat-input-row">
        <input id="chat-input" class="chat-input" type="text"
          placeholder="What do I know about... Explain... Find the link between..."
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChatMessage();}"
          autocomplete="off">
        <button class="chat-send-btn" onclick="sendChatMessage()">${icon("send")}</button>
      </div>`;
    document.body.appendChild(panel);
  }
  panel.classList.add("visible");
  setTimeout(() => document.getElementById("chat-input")?.focus(), 100);
}

function closeChat() {
  const panel = document.getElementById("chat-panel");
  if (panel) panel.classList.remove("visible");
}

function appendChatMessage(role, content) {
  const id = `chat-msg-${++_chatMsgCounter}`;
  const messages = document.getElementById("chat-messages");
  if (!messages) return id;
  const div = document.createElement("div");
  div.id = id;
  div.className = `chat-msg chat-msg-${role}`;
  div.innerHTML = role === "ai"
    ? `<div class="chat-msg-avatar">${icon("spark")}</div><div class="chat-msg-content">${escHtml(content)}</div>`
    : `<div class="chat-msg-content">${escHtml(content)}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return id;
}

function appendChatThinking() {
  const id = `chat-msg-${++_chatMsgCounter}`;
  const messages = document.getElementById("chat-messages");
  if (!messages) return id;
  const div = document.createElement("div");
  div.id = id;
  div.className = "chat-msg chat-msg-ai";
  div.innerHTML = `<div class="chat-msg-avatar">${icon("spark")}</div><div class="chat-msg-content"><div class="chat-thinking"><span class="chat-dot"></span><span class="chat-dot"></span><span class="chat-dot"></span></div></div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return id;
}

function removeChatMessage(id) { document.getElementById(id)?.remove(); }

function openNoteFromChat(noteId) {
  const panel = document.getElementById("note-detail-panel");
  if (!panel?.classList.contains("hidden")) closeNotePanel();
  openNote(noteId);
}

async function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const msg = input?.value.trim();
  if (!msg || !_token || !input) return;
  input.value = "";
  input.disabled = true;
  appendChatMessage("user", msg);
  const thinkingId = appendChatThinking();
  try {
    const data = await apiFetch("/chat", {
      method: "POST",
      body: JSON.stringify({ message: msg, history: _chatHistory.slice(-10) })
    });
    removeChatMessage(thinkingId);
    const aiMsgId = `chat-msg-${++_chatMsgCounter}`;
    const messages = document.getElementById("chat-messages");
    if (messages) {
      const div = document.createElement("div");
      div.id = aiMsgId;
      div.className = "chat-msg chat-msg-ai";
      div.innerHTML = `<div class="chat-msg-avatar">${icon("spark")}</div><div class="chat-msg-content"></div>`;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }
    const answer = data?.answer || data?.response || String(data || "");
    await typewriterEffect(aiMsgId, answer);
    _chatHistory.push({ role: "user", content: msg });
    _chatHistory.push({ role: "assistant", content: answer });
    if (data?.sources?.length) {
      const msgEl = document.getElementById(aiMsgId);
      if (msgEl) {
        const sourcesDiv = document.createElement("div");
        sourcesDiv.className = "chat-sources";
        sourcesDiv.innerHTML = data.sources.map(s =>
          `<button class="chat-source-btn" onclick="openNoteFromChat(${JSON.stringify(String(s.id || s.note_id || ""))})">${icon("file")} ${escHtml(clampText(s.content || "Note", 32))}</button>`
        ).join("");
        msgEl.appendChild(sourcesDiv);
      }
    }
  } catch (err) {
    removeChatMessage(thinkingId);
    appendChatMessage("ai", `Error: ${err.message}`);
  } finally {
    if (input) input.disabled = false;
    input?.focus();
  }
}

async function typewriterEffect(msgId, text, speedMs = 18) {
  const el = document.querySelector(`#${msgId} .chat-msg-content`);
  if (!el) return;
  const html = text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>");
  const tokens = [];
  const tagRegex = /<[^>]+>/g;
  let lastIndex = 0, match;
  while ((match = tagRegex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      for (const ch of html.slice(lastIndex, match.index)) tokens.push({ type: "char", val: ch });
    }
    tokens.push({ type: "tag", val: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < html.length) {
    for (const ch of html.slice(lastIndex)) tokens.push({ type: "char", val: ch });
  }
  el.innerHTML = "";
  let rendered = "";
  const msgEl = document.getElementById("chat-messages");
  for (const token of tokens) {
    rendered += token.val;
    el.innerHTML = rendered + '<span class="cursor-blink">▋</span>';
    if (token.type === "char" && token.val.trim() !== "") {
      const pause = ".!?".includes(token.val) ? speedMs * 6 : ",;:".includes(token.val) ? speedMs * 3 : speedMs;
      await new Promise(r => setTimeout(r, pause));
    }
    if (msgEl) msgEl.scrollTop = msgEl.scrollHeight;
  }
  el.innerHTML = rendered;
}

// ── TOAST ────────────────────────────────────────────────────────────
function showToast(msg, autoHide = true, delay = 2200) {
  const toast = document.getElementById("toast");
  const text  = document.getElementById("toast-text");
  const spinner = document.getElementById("toast-spinner");
  if (!toast) return;
  if (text) text.textContent = msg;
  if (spinner) spinner.style.display = autoHide ? "none" : "inline-flex";
  toast.classList.remove("hidden");
  toast.classList.add("visible");
  clearTimeout(_toastTimer);
  if (autoHide) _toastTimer = setTimeout(hideToast, delay);
}

function hideToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.classList.remove("visible");
  setTimeout(() => toast.classList.add("hidden"), 300);
}

// ── KEYBOARD SHORTCUTS ───────────────────────────────────────────────
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); openSearch(); }
  if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === "n") { e.preventDefault(); toggleComposer(true); }
  if (e.key === "Escape") {
    const chatPanel = document.getElementById("chat-panel");
    if (chatPanel?.classList.contains("visible")) { closeChat(); return; }
    if (!document.getElementById("search-overlay")?.classList.contains("hidden")) { closeSearch(); return; }
    if (_composerOpen) { toggleComposer(false); return; }
    const panel = document.getElementById("note-detail-panel");
    if (!panel?.classList.contains("hidden")) { closeNotePanel(); return; }
  }
});

// ── INIT ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initLangGrid();
  syncDateFilterChips();
  if (typeof LANGUAGES !== "undefined") initLangGrid();
});
// ── SETTINGS POPUP ───────────────────────────────────────────────────
function toggleSettings(e) {
  e.stopPropagation();
  const popup = document.getElementById("settings-popup");
  if (!popup) return;
  const isOpen = !popup.classList.contains("hidden");
  if (isOpen) { closeSettings(); return; }

  // Заполняем данные
  const username = _user?.username || "—";
  const sp_avatar   = document.getElementById("sp-avatar");
  const sp_username = document.getElementById("sp-username");
  const sp_email    = document.getElementById("sp-email");
  if (sp_avatar)   sp_avatar.textContent   = username.charAt(0).toUpperCase();
  if (sp_username) sp_username.textContent = username;
  if (sp_email)    sp_email.textContent    = _user?.email || "—";

  // Статистика
  const totalNotes = _notes.length;
  const totalTags  = new Set(_notes.flatMap(n => n.tags || [])).size;
  const totalConns = _notes.reduce((sum, n) => sum + (n.connections?.length || 0), 0);
  const elN = document.getElementById("sp-stat-notes");
  const elT = document.getElementById("sp-stat-tags");
  const elC = document.getElementById("sp-stat-conn");
  if (elN) elN.textContent = totalNotes;
  if (elT) elT.textContent = totalTags;
  if (elC) elC.textContent = totalConns;

  // Текущий язык
  const currentLang = window._lang || "en";
  document.querySelectorAll(".sp-lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });

  // Текущая тема
  const currentTheme = document.documentElement.dataset.theme || "dark";
  document.querySelectorAll(".sp-theme-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === currentTheme);
  });

  // Позиционируем попап над workspace-pill
  const pill = document.getElementById("workspace-pill");
  const rect = pill?.getBoundingClientRect();
  if (rect) {
    popup.style.bottom = `${window.innerHeight - rect.top + 8}px`;
    popup.style.left   = `${rect.left}px`;
  }

  syncPrefToggles();
  popup.classList.remove("hidden");
  document.addEventListener("click", closeSettingsOutside, { once: true });
}

function closeSettings() {
  document.getElementById("settings-popup")?.classList.add("hidden");
}

function closeSettingsOutside(e) {
  const popup = document.getElementById("settings-popup");
  if (popup && !popup.contains(e.target)) closeSettings();
  else if (popup && !popup.classList.contains("hidden")) {
    document.addEventListener("click", closeSettingsOutside, { once: true });
  }
}

function setSettingsLang(lang, el) {
  document.querySelectorAll(".sp-lang-btn").forEach(b => b.classList.remove("active"));
  if (el) el.classList.add("active");
  changeLanguage(lang);
  showToast(`Language: ${lang.toUpperCase()}`, true, 1400);
}

function setTheme(theme, el) {
  document.querySelectorAll(".sp-theme-btn").forEach(b => b.classList.remove("active"));
  if (el) el.classList.add("active");
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("memo_theme", theme);
  applyTheme(theme);
  showToast(`Theme: ${theme}`, true, 1200);
}

function applyTheme(theme) {
  const root = document.documentElement.style;
  if (theme === "oled") {
    root.setProperty("--bg",      "#000000");
    root.setProperty("--bg-2",    "#080808");
    root.setProperty("--bg-3",    "#0d0d0d");
    root.setProperty("--surface", "#111111");
  } else if (theme === "darker") {
    root.setProperty("--bg",      "#060810");
    root.setProperty("--bg-2",    "#090c16");
    root.setProperty("--bg-3",    "#0d1120");
    root.setProperty("--surface", "#0f1422");
  } else {
    root.setProperty("--bg",      "#0a0d14");
    root.setProperty("--bg-2",    "#0f131c");
    root.setProperty("--bg-3",    "#121826");
    root.setProperty("--surface", "#111723");
  }
}

async function exportNotes() {
  showToast("Preparing export…", false);
  try {
    const data = await apiFetch("/notes?page=1&per_page=1000");
    const notes = data?.items || [];
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `memo-export-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    hideToast();
    showToast(`Exported ${notes.length} notes`, true, 2000);
  } catch (err) {
    showToast(`Export failed: ${err.message}`, true, 3000);
  }
}

// Восстанавливаем тему при старте
(function initTheme() {
  const saved = localStorage.getItem("memo_theme") || "dark";
  document.documentElement.dataset.theme = saved;
  applyTheme(saved);
})();
// ── PREFERENCES ──────────────────────────────────────────────────────
const _prefs = {
  snippets:   true,
  icons:      true,
  typewriter: true,
  clickOpen:  true,
  ...JSON.parse(localStorage.getItem("memo_prefs") || "{}")
};

function savePref() {
  localStorage.setItem("memo_prefs", JSON.stringify(_prefs));
}

function togglePref(key, el) {
  el.classList.toggle("on");
  _prefs[key] = el.classList.contains("on");
  savePref();
  applyPrefs();
}

function applyPrefs() {
  document.querySelectorAll(".note-row-snippet").forEach(el => {
    el.style.display = _prefs.snippets ? "" : "none";
  });
  document.querySelectorAll(".note-type-icon").forEach(el => {
    el.style.display = _prefs.icons ? "" : "none";
  });
  document.documentElement.dataset.prefBlur = _prefs.blur ? "1" : "0";
  document.documentElement.dataset.prefReduceMotion = _prefs.reduceMotion ? "1" : "0";
}

function syncPrefToggles() {
  const keys = ["snippets", "icons", "typewriter", "clickOpen"];
  keys.forEach(key => {
    const el = document.getElementById(`toggle-${key === "clickOpen" ? "click-open" : key}`);
    if (el) el.classList.toggle("on", _prefs[key]);
  });
}

// Export .md
async function exportNotesMd() {
  showToast("Preparing markdown…", false);
  try {
    const data = await apiFetch("/notes?page=1&per_page=1000");
    const notes = data?.items || [];
    const md = notes.map(n => {
      const tags = (n.tags || []).map(t => `#${t}`).join(" ");
      const date = new Date(n.created_at).toLocaleDateString();
      return `# ${noteTitle(n)}\n_${date}_ ${tags}\n\n${n.content}\n\n---\n`;
    }).join("\n");
    const blob = new Blob([md], { type: "text/markdown" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `memo-export-${new Date().toISOString().slice(0,10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    hideToast();
    showToast(`Exported ${notes.length} notes as Markdown`, true, 2000);
  } catch (err) {
    showToast(`Export failed: ${err.message}`, true, 3000);
  }
}
// ── ACCENT COLOR ────────────────────────────────────────────────────
const ACCENTS = {
  violet: { accent: "#7b68ee", accent2: "#8e7cf2" },
  blue:   { accent: "#4f9cf9", accent2: "#6aadfb" },
  teal:   { accent: "#2dd4c4", accent2: "#3de0cf" },
  green:  { accent: "#44d19a", accent2: "#5adba8" },
  rose:   { accent: "#f472b6", accent2: "#f687c0" },
  orange: { accent: "#fb923c", accent2: "#fca454" },
};

function setAccent(name, el) {
  const a = ACCENTS[name]; if (!a) return;
  document.documentElement.style.setProperty("--accent",   a.accent);
  document.documentElement.style.setProperty("--accent-2", a.accent2);
  document.querySelectorAll(".sp-accent-btn").forEach(b => b.classList.remove("active"));
  if (el) el.classList.add("active");
  localStorage.setItem("memo_accent", name);
  showToast(`Accent: ${name}`, true, 1200);
}

function initAccent() {
  const saved = localStorage.getItem("memo_accent") || "violet";
  const a = ACCENTS[saved]; if (!a) return;
  document.documentElement.style.setProperty("--accent",   a.accent);
  document.documentElement.style.setProperty("--accent-2", a.accent2);
}

// ── FONT SIZE ───────────────────────────────────────────────────────
function setFontSize(size, el) {
  document.documentElement.style.fontSize = `${size}px`;
  document.querySelectorAll(".sp-size-btn").forEach(b => b.classList.remove("active"));
  if (el) el.classList.add("active");
  localStorage.setItem("memo_fontsize", size);
}

function initFontSize() {
  const saved = localStorage.getItem("memo_fontsize");
  if (saved) document.documentElement.style.fontSize = `${saved}px`;
}

// ── DENSITY ─────────────────────────────────────────────────────────
function setDensity(d, el) {
  document.documentElement.dataset.density = d;
  document.querySelectorAll(".sp-density-btn").forEach(b => b.classList.remove("active"));
  if (el) el.classList.add("active");
  localStorage.setItem("memo_density", d);
}

function initDensity() {
  const saved = localStorage.getItem("memo_density") || "normal";
  document.documentElement.dataset.density = saved;
}

// ── SYNC SETTINGS STATE ─────────────────────────────────────────────
function syncPrefToggles() {
  const map = { snippets: "toggle-snippets", icons: "toggle-icons", typewriter: "toggle-typewriter", clickOpen: "toggle-click-open", blur: "toggle-blur", reduceMotion: "toggle-reduce-motion" };
  Object.entries(map).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("on", !!_prefs[key]);
  });
  // Accent
  const savedAccent = localStorage.getItem("memo_accent") || "violet";
  document.querySelectorAll(".sp-accent-btn").forEach(b => b.classList.toggle("active", b.dataset.accent === savedAccent));
  // Font size
  const savedSize = localStorage.getItem("memo_fontsize") || "14";
  document.querySelectorAll(".sp-size-btn").forEach(b => b.classList.toggle("active", b.dataset.size === savedSize));
  // Density
  const savedDensity = localStorage.getItem("memo_density") || "normal";
  document.querySelectorAll(".sp-density-btn").forEach(b => b.classList.toggle("active", b.dataset.density === savedDensity));
}
// ── EDIT PROFILE ─────────────────────────────────────────────────────
const AVC_COLORS = {
  violet: ["#7b68ee","#8e7cf2"],
  blue:   ["#4f9cf9","#6aadfb"],
  teal:   ["#2dd4c4","#3de0cf"],
  green:  ["#44d19a","#5adba8"],
  rose:   ["#f472b6","#f687c0"],
  orange: ["#fb923c","#fca454"],
};

function openEditProfile() {
  closeSettings();
  const overlay = document.getElementById("edit-profile-overlay");
  if (!overlay) return;

  // Заполняем текущими данными
  const username = _user?.username || "";
  document.getElementById("ep-username-input").value = username;
  document.getElementById("ep-email-input").value    = _user?.email || "";
  document.getElementById("ep-avatar-big").textContent  = username.charAt(0).toUpperCase() || "?";
  document.getElementById("ep-avatar-name").textContent = username;
  document.getElementById("ep-old-password").value  = "";
  document.getElementById("ep-new-password").value  = "";
  document.getElementById("ep-confirm-password").value = "";
  document.getElementById("ep-error").classList.add("hidden");
  document.getElementById("ep-success").classList.add("hidden");

  // Цвет аватара
  const savedAvc = localStorage.getItem("memo_avatar_color") || "violet";
  document.querySelectorAll("#ep-avatar-color-row .sp-accent-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.avc === savedAvc);
  });
  applyAvatarColor(savedAvc);

  overlay.classList.remove("hidden");
  setTimeout(() => overlay.querySelector(".ep-modal")?.classList.add("open"), 10);
}

function closeEditProfile(e) {
  if (e && e.target !== document.getElementById("edit-profile-overlay")) return;
  const overlay = document.getElementById("edit-profile-overlay");
  overlay?.querySelector(".ep-modal")?.classList.remove("open");
  setTimeout(() => overlay?.classList.add("hidden"), 180);
}

function setAvatarColor(name, el) {
  document.querySelectorAll("#ep-avatar-color-row .sp-accent-btn").forEach(b => b.classList.remove("active"));
  if (el) el.classList.add("active");
  localStorage.setItem("memo_avatar_color", name);
  applyAvatarColor(name);
}

function applyAvatarColor(name) {
  const colors = AVC_COLORS[name] || AVC_COLORS.violet;
  const avatars = document.querySelectorAll(".user-dot, .sp-avatar, #ep-avatar-big");
  avatars.forEach(a => {
    a.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
  });
}

async function saveProfile() {
  const errEl     = document.getElementById("ep-error");
  const successEl = document.getElementById("ep-success");
  errEl.classList.add("hidden");
  successEl.classList.add("hidden");

  const newUsername = document.getElementById("ep-username-input").value.trim();
  const newEmail    = document.getElementById("ep-email-input").value.trim();
  const oldPass     = document.getElementById("ep-old-password").value;
  const newPass     = document.getElementById("ep-new-password").value;
  const confirmPass = document.getElementById("ep-confirm-password").value;

  if (!newUsername) {
    errEl.textContent = "Username cannot be empty"; errEl.classList.remove("hidden"); return;
  }
  if (newPass && newPass !== confirmPass) {
    errEl.textContent = "Passwords do not match"; errEl.classList.remove("hidden"); return;
  }
  if (newPass && !oldPass) {
    errEl.textContent = "Enter current password to change it"; errEl.classList.remove("hidden"); return;
  }

  try {
    const payload = { username: newUsername, email: newEmail };
    if (newPass) { payload.old_password = oldPass; payload.new_password = newPass; }

    await apiFetch("/users/me", { method: "PATCH", body: JSON.stringify(payload) });

    // Обновляем UI
    if (_user) { _user.username = newUsername; _user.email = newEmail; }
    document.getElementById("user-display").textContent = newUsername;
    document.getElementById("user-avatar").textContent  = newUsername.charAt(0).toUpperCase();
    document.getElementById("sp-avatar").textContent    = newUsername.charAt(0).toUpperCase();
    document.getElementById("ep-avatar-big").textContent  = newUsername.charAt(0).toUpperCase();
    document.getElementById("ep-avatar-name").textContent = newUsername;

    successEl.classList.remove("hidden");
    setTimeout(() => closeEditProfile(), 1200);
  } catch (err) {
    errEl.textContent = err.message || "Failed to save changes";
    errEl.classList.remove("hidden");
  }
}

// Применяем цвет аватара при старте
(function initAvatarColor() {
  const saved = localStorage.getItem("memo_avatar_color") || "violet";
  applyAvatarColor(saved);
})();
