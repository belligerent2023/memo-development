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

const ICONS = {
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"></circle><path d="M16 16l4.25 4.25"></path></svg>`,
  notes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"></rect><path d="M8 9.5h8M8 13h8M8 16.5h5"></path></svg>`,
  map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l6 14"></path><path d="M4 7.5l5-2.5 6 2.5 5-2.5v11L15 19l-6-2.5L4 19v-11.5z"></path></svg>`,
  spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"></path><path d="M18.5 16l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7.7-2.1z"></path></svg>`,
  review: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M8 3v4M16 3v4M4 10h16"></path></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"></path></svg>`,
  minus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"></path></svg>`,
  reset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 1 1-2.34-5.66"></path><path d="M20 4v7h-7"></path></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l4.2-1 9.7-9.7a2.2 2.2 0 0 0-3.1-3.1L5 15.9 4 20z"></path><path d="M13.5 6.5l4 4"></path></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 7h15"></path><path d="M9.5 4.5h5"></path><path d="M7 7l1 12h8l1-12"></path><path d="M10 11v5M14 11v5"></path></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="10" height="10" rx="2"></rect><rect x="5" y="5" width="10" height="10" rx="2"></rect></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8l-2 5 3 3v1H7v-1l3-3-2-5z"></path><path d="M12 13v7"></path></svg>`,
  pinOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8l-2 5 3 3v1H7v-1l3-3-2-5z"></path><path d="M12 13v7"></path><path d="M5 5l14 14"></path></svg>`,
  insight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.2 5.3L20 10.5l-5.8 2.2L12 18l-2.2-5.3L4 10.5l5.8-2.2L12 3z"></path></svg>`,
  connection: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14l4-4"></path><path d="M7.5 16.5l-1.8 1.8a3 3 0 0 1-4.2-4.2l3.1-3.1a3 3 0 0 1 4.2 0"></path><path d="M16.5 7.5l1.8-1.8a3 3 0 1 1 4.2 4.2l-3.1 3.1a3 3 0 0 1-4.2 0"></path></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path><path d="M14 3v5h5"></path><path d="M9 13h6M9 17h4"></path></svg>`,
  empty: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7.5A2.5 2.5 0 0 1 8.5 5h7A2.5 2.5 0 0 1 18 7.5v9A2.5 2.5 0 0 1 15.5 19h-7A2.5 2.5 0 0 1 6 16.5v-9z"></path><path d="M9 10h6M9 14h3"></path></svg>`,
  brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5a3 3 0 0 0-3 3v.2A3.8 3.8 0 0 0 4 11.5 3.5 3.5 0 0 0 7.5 15H8"></path><path d="M15 5a3 3 0 0 1 3 3v.2a3.8 3.8 0 0 1 2 3.3A3.5 3.5 0 0 1 16.5 15H16"></path><path d="M12 4v16"></path><path d="M8 7.5A2.5 2.5 0 0 1 10.5 5H12"></path><path d="M16 7.5A2.5 2.5 0 0 0 13.5 5H12"></path><path d="M8 16.5A2.5 2.5 0 0 0 10.5 19H12"></path><path d="M16 16.5A2.5 2.5 0 0 1 13.5 19H12"></path></svg>`,
  tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13l-7 7-9-9V4h7l9 9z"></path><circle cx="8.5" cy="8.5" r="1.2"></circle></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3L10 14"></path><path d="M21 3l-7 18-4-7-7-4 18-7z"></path></svg>`,
  loader: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-4-6.93"></path></svg>`
};

function q(sel, root = document) { return root.querySelector(sel); }
function qa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function icon(name) {
  return ICONS[name] || "";
}

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
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
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
  return _notes.find((n) => String(n.id) === String(noteId));
}

function showOffline(v) {
  const el = document.getElementById("offline-banner");
  if (el) el.classList.toggle("hidden", !v);
}

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

  if (res.status === 401) {
    logout();
    throw new Error("Unauthorized");
  }

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    throw new Error((data && data.detail) || (typeof data === "string" && data) || "Error");
  }

  return data;
}

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

  const pinSlot = q(".pin-slot");
  if (pinSlot) pinSlot.innerHTML = icon("pin");
  const trashSlot = q(".trash-slot");
  if (trashSlot) trashSlot.innerHTML = icon("trash");
  const copySlot = q(".copy-slot");
  if (copySlot) copySlot.innerHTML = icon("copy");
  const sparkSlot = q(".spark-slot");
  if (sparkSlot) sparkSlot.innerHTML = icon("spark");
  const insightSlot = q(".insight-slot");
  if (insightSlot) insightSlot.innerHTML = icon("insight");

  const noteIcon = q(".detail-note-icon");
  if (noteIcon) noteIcon.innerHTML = icon("file");

  const toastSpinner = document.getElementById("toast-spinner");
  if (toastSpinner) toastSpinner.innerHTML = icon("loader");
}

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
    if (errEl) {
      errEl.textContent = err.message;
      errEl.classList.remove("hidden");
    }
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
    if (errEl) {
      errEl.textContent = err.message;
      errEl.classList.remove("hidden");
    }
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
  loadNotes();

  apiFetch("/users/me")
    .then((profile) => {
      if (profile?.language && profile.language !== window._lang) {
        window._lang = profile.language;
        localStorage.setItem("memo_lang", profile.language);
        applyI18n();
      }
    })
    .catch(() => {});
}

function logout() {
  _token = null;
  _user = null;
  _notes = [];
  _page = 1;
  _hasMore = false;
  _currentNoteId = null;
  _chatHistory = [];
  closeChat();
  closeSearch();
  closeNotePanel();
  hideGraphTooltip();
  document.getElementById("view-app")?.classList.remove("active");
  document.getElementById("view-auth").style.display = "";
}

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
    .map((l) => `
      <button type="button" class="lang-option ${l.code === _regLang ? "selected" : ""}" onclick="selectRegLang(${JSON.stringify(l.code)}, this)">
        <span class="lang-flag">${(l.code || "").toUpperCase().slice(0, 2)}</span>
        <span>${escHtml(l.name || l.code)}</span>
      </button>
    `)
    .join("");
}

function selectRegLang(code, el) {
  _regLang = code;
  qa("#reg-lang-grid .lang-option").forEach((b) => b.classList.remove("selected"));
  if (el) el.classList.add("selected");
}

async function changeLanguage(lang) {
  if (typeof window.setLanguage === "function") window.setLanguage(lang);
  try {
    await apiFetch("/users/me/language", {
      method: "PATCH",
      body: JSON.stringify({ language: lang })
    });
  } catch {}
}

function navigate(view = "list") {
  ["list", "canvas"].forEach((v) => {
    document.getElementById(`view-${v}`)?.classList.toggle("hidden", v !== view);
    const navEl = document.getElementById(`nav-${v}`);
    if (navEl) navEl.classList.toggle("active", v === view);
  });

  const titleEl = document.getElementById("topbar-title");
  if (titleEl) {
    titleEl.textContent = view === "canvas" ? t("map", "Map") : t("all_notes", "All notes");
    titleEl.dataset.view = view;
  }

  const filters = document.getElementById("topbar-filters");
  if (filters) filters.style.display = view === "list" ? "block" : "none";

  if (view === "canvas") renderGraph();
}

async function openDailyReview() {
  const modal = document.getElementById("daily-review-modal");
  const subtitle = document.getElementById("dr-subtitle");
  const body = document.getElementById("dr-body");
  if (!modal || !body) return;

  modal.classList.add("visible");
  document.body.style.overflow = "hidden";

  if (subtitle) {
    subtitle.textContent = new Date().toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  }

  body.innerHTML = `<div class="dr-loading">Loading your memories...</div>`;

  try {
    const data = await apiFetch("/daily-review");
    const rawNotes = Array.isArray(data?.notes) ? data.notes : [];
    const notes = rawNotes.map(normalizeNote);

    if (!notes.length) {
      body.innerHTML = `
        <div class="dr-empty">
          <div class="empty-state" style="min-height:220px">
            <div class="ei">${icon("empty")}</div>
            <p>No notes older than a week yet.<br>Keep writing — they’ll appear here.</p>
          </div>
        </div>
      `;
      return;
    }

    body.innerHTML = notes.map((note, index) => {
      const raw = rawNotes[index] || {};
      const preview = (note.content || "").substring(0, 220);
      const hasMore = (note.content || "").length > 220;
      const daysAgo = raw.days_ago;
      const dayLabel = daysAgo === 0 ? "today" : daysAgo === 1 ? "yesterday" : `${daysAgo ?? "—"} days ago`;
      const connCount = note.connections?.length || 0;
      const tagsHTML = (note.tags || []).map((tag) => `<span class="note-tag">${escHtml(tag)}</span>`).join("");

      return `
        <div class="dr-note" onclick='closeDailyReview();openNote(${JSON.stringify(note.id)})'>
          <div class="dr-note-meta">
            <span class="dr-days">${dayLabel}</span>
            ${connCount > 0 ? `<span class="dr-conns">${icon("connection")}${connCount}</span>` : ""}
            <span class="dr-date">${formatDate(note.created_at)}</span>
          </div>
          ${tagsHTML ? `<div style="margin-bottom:.4rem">${tagsHTML}</div>` : ""}
          <div class="dr-note-content">${escHtml(preview)}${hasMore ? `<span style="color:var(--text-4)">…</span>` : ""}</div>
        </div>
      `;
    }).join("");
  } catch (err) {
    body.innerHTML = `<div class="dr-empty">Error: ${escHtml(err.message)}</div>`;
  }
}

function closeDailyReview() {
  const modal = document.getElementById("daily-review-modal");
  if (modal) modal.classList.remove("visible");
  document.body.style.overflow = "";
}

function syncDateFilterChips() {
  qa(".date-chip").forEach((chip) => {
    const chipValue = chip.dataset.df || null;
    const currentValue = _dateFilter || null;
    chip.classList.toggle("active", chipValue === currentValue);
  });
}

function setDateFilter(f) {
  _dateFilter = f || null;
  _page = 1;
  _notes = [];
  syncDateFilterChips();
  loadNotesWithFilter(true);
}

async function loadNotesWithFilter(reset = true) {
  if (reset) {
    _page = 1;
    _notes = [];
  }

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
  } catch (err) {
    console.error(err);
  }
}

function toggleComposer(forceOpen) {
  _composerOpen = forceOpen !== undefined ? forceOpen : !_composerOpen;
  document.getElementById("composer-bar")?.classList.toggle("open", _composerOpen);
  if (_composerOpen) {
    setTimeout(() => document.getElementById("note-input")?.focus(), 100);
  }
}

function handleNoteKeydown(e) {
  if (e.ctrlKey && e.key === "Enter") createNote();
  if (e.key === "Escape") toggleComposer(false);
}

async function loadNotes(reset = true) {
  if (_dateFilter) return loadNotesWithFilter(reset);

  if (reset) {
    _page = 1;
    _notes = [];
  }

  try {
    const data = await apiFetch(`/notes?page=${_page}&per_page=40`);
    const incoming = normalizeNotes(data?.items || []);
    _notes = reset ? incoming : [..._notes, ...incoming];
    _hasMore = !!data?.has_more;
    renderTable();
    renderPinned();
    document.getElementById("load-more-btn")?.classList.toggle("hidden", !_hasMore);
  } catch (err) {
    console.error(err);
  }
}

async function loadMoreNotes() {
  _page += 1;
  if (_dateFilter) await loadNotesWithFilter(false);
  else await loadNotes(false);
}

function setFilter(f, el) {
  _filter = f;
  qa(".filter-chip").forEach((c) => c.classList.remove("active"));
  if (el) el.classList.add("active");
  renderTable();
}

function getFilteredNotes() {
  let notes = [..._notes];

  if (_filter === "connected") {
    notes = notes.filter((n) => (n.connections?.length || 0) > 0);
  } else if (_filter === "recent") {
    notes = notes.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 20);
  }

  if (_tagFilter) {
    notes = notes.filter((n) => (n.tags || []).includes(_tagFilter));
  }

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
    const raw = await apiFetch("/notes", {
      method: "POST",
      body: JSON.stringify({ content })
    });

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
  const confirmMsg = t("confirm_delete", "Delete this note?");
  if (!_currentNoteId || !confirm(confirmMsg)) return;

  try {
    await apiFetch(`/notes/${_currentNoteId}`, { method: "DELETE" });
    _notes = _notes.filter((n) => String(n.id) !== String(_currentNoteId));
    closeNotePanel();
    renderTable();
    renderPinned();
    showToast("Note deleted", true, 1800);
  } catch (err) {
    showToast(`Error: ${err.message}`, true, 3000);
  }
}

function filterByTag(tag, event) {
  if (event) event.stopPropagation();
  _tagFilter = _tagFilter === tag ? null : tag;
  renderTable();

  const indicator = document.getElementById("tag-filter-indicator");
  if (!indicator) return;

  if (_tagFilter) {
    indicator.innerHTML = `${icon("tag")} <span>${escHtml(_tagFilter)}</span> <span style="opacity:.7">×</span>`;
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

function renderTable() {
  const tbody = document.getElementById("notes-tbody");
  if (!tbody) return;

  const visibleNotes = getFilteredNotes();

  if (!visibleNotes.length) {
    const msg = _tagFilter
      ? `No notes tagged "${escHtml(_tagFilter)}"`
      : t("nonotesyet", "No notes yet — click New note to start");

    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="empty-state">
            <div class="ei">${icon("empty")}</div>
            <p>${msg}</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = visibleNotes.map((note) => {
    const rawTitle = noteTitle(note);
    const rawSnippet = noteSnippet(note);
    const title = clampText(rawTitle, 58);
    const snippet = clampText(rawSnippet, 110);
    const connCount = note.connections?.length || 0;
    const tags = Array.isArray(note.tags) ? note.tags : [];

    const tagsHTML = tags.slice(0, 3).map((tag) => `
      <span class="note-tag ${_tagFilter === tag ? "active" : ""}"
            onclick='filterByTag(${JSON.stringify(tag)}, event)'>
        ${escHtml(tag)}
      </span>
    `).join("");

    return `
      <tr class="${String(_currentNoteId) === String(note.id) ? "active" : ""}"
          onclick='openNote(${JSON.stringify(note.id)})'>
        <td class="td-title-cell">
          <div class="note-row-main">
            <div class="note-row-icon">${icon("file")}</div>
            <div class="note-row-content">
              <div class="note-row-title">${escHtml(title)}</div>
              <div class="note-row-snippet">${escHtml(snippet)}</div>
            </div>
          </div>
        </td>
        <td class="td-tags">
          ${tagsHTML || `<span style="color:var(--text-4);font-size:.8rem;">—</span>`}
        </td>
        <td class="td-connections">
          <span class="conn-tag">
            ${icon("connection")}
            <span>${connCount}</span>
          </span>
        </td>
        <td class="td-date">${formatTime(note.created_at)}</td>
      </tr>
    `;
  }).join("");
}

function renderPinned() {
  const el = document.getElementById("pinned-list");
  if (!el) return;

  const items = _notes.slice(0, 5);

  el.innerHTML = items.map((note) => {
    const title = clampText(noteTitle(note), 32);
    return `
      <button class="pinned-note" onclick='openNote(${JSON.stringify(note.id)})'>
        ${escHtml(title)}
      </button>
    `;
  }).join("");
  renderSidebarTags();
}

function setPinState(pinned) {
  const label = document.getElementById("pin-label");
  const headerBtn = q(".detail-pane-actions .detail-action-btn");
  const pinSlot = q(".pin-slot");

  if (label) label.textContent = pinned ? "Un-pin this note" : "Pin this note";
  if (pinSlot) pinSlot.innerHTML = pinned ? icon("pinOff") : icon("pin");
  if (headerBtn) headerBtn.innerHTML = pinned ? icon("pinOff") : icon("pin");
}

async function openNote(noteId) {
  hideGraphTooltip();

  const note = findNote(noteId);
  if (!note) return;

  _currentNoteId = String(noteId);
  renderTable();

  if (_activeEditor) {
    _activeEditor.destroy();
    _activeEditor = null;
  }

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
    tagsEl.innerHTML = (note.tags || []).length
      ? note.tags.map(tag => `
          <span class="note-tag" onclick='filterByTag(${JSON.stringify(tag)}, event)'>
            ${escHtml(tag)}
          </span>`).join("")
      : "";
  }

  if (body) {
    body.innerHTML = note.html_content
      ? `<div class="panel-content-view">${note.html_content}</div>`
      : `<div class="panel-content-view">${escHtml(note.content).replace(/\n/g, "<br>")}</div>`;
  }

  if (insightSlot) insightSlot.innerHTML = "";

  // Сбрасываем AI Summary
  const aiBlock = document.getElementById("ai-summary-block");
  const aiText  = document.getElementById("ai-summary-text");
  if (aiBlock) aiBlock.style.display = "none";
  if (aiText)  aiText.innerHTML = "";
  window._lastSummary = "";

  setPinState(false);

  // Загружаем connections
  let connections = [];
  try {
    const rawConnections = await apiFetch(`/notes/${noteId}/connections`);
    connections = Array.isArray(rawConnections)
      ? rawConnections.map(normalizeConnection)
      : [];
  } catch {
    connections = note.connections || [];
  }

  // Connections panel
  const connEl = document.getElementById("panel-connections");
  if (connEl) {
    if (connections.length) {
      connEl.innerHTML = connections.map(c => `
        <div class="panel-conn-item" onclick='openNote(${JSON.stringify(c.related_note_id)})'>
          <div class="panel-conn-left">
            <div class="panel-conn-badge">${icon("file")}</div>
            <div>
              <div class="panel-conn-title">${escHtml(clampText(c.related_note_content || "Related note", 40))}</div>
              <div class="panel-conn-sub">${escHtml(clampText(c.explanation || "Related note", 52))}</div>
            </div>
          </div>
          <div class="panel-conn-score">${Math.round((c.similarity_score || 0) * 100)}%</div>
        </div>`).join("");
    } else {
      connEl.innerHTML = `
        <div style="padding:0 0 10px;color:var(--text-3);font-size:.8rem;">
          ${t("no_connections", "No connections yet — add more notes on related topics")}
        </div>`;
    }
  }

  // Similar notes
  const connectedIds = new Set(connections.map(c => String(c.related_note_id)));
  const similar = _notes
    .filter(n => String(n.id) !== String(noteId) && !connectedIds.has(String(n.id)))
    .slice(0, 5);

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

  // AI Summary — запускаем если есть connections
  if (connections.length >= 1) {
    loadAISummary(noteId);
  }

  // Insight trigger кнопка в шапке панели
  const insightTrigger = document.getElementById("panel-insight-trigger");
  if (insightTrigger) {
    if (connections.length >= 2) {
      insightTrigger.style.display = "";
      insightTrigger.onclick = () => generateInsightPanel(noteId, connections.map(c => c.related_note_id));
    } else {
      insightTrigger.style.display = "none";
    }
  }

  // Старая секция insight (fallback, если есть в HTML)
  const insightSection = document.getElementById("insight-action-section");
  const insightBtn     = document.getElementById("panel-insight-btn");
  if (insightSection && insightBtn) {
    if (connections.length >= 2) {
      insightSection.style.display = "";
      insightBtn.innerHTML = `
        <span class="action-icon">${icon("insight")}</span>
        <span>${t("generate_insight", "Generate insight")}</span>`;
      insightBtn.onclick = () => generateInsightPanel(noteId, connections.map(c => c.related_note_id));
    } else {
      insightSection.style.display = "none";
    }
  }
}

function closeNotePanel() {
  if (_activeEditor) {
    _activeEditor.destroy();
    _activeEditor = null;
  }

  document.getElementById("note-detail-panel")?.classList.add("hidden");
  _currentNoteId = null;
  renderTable();
}

function startEditingPanel() {
  if (_currentNoteId) startEditing(_currentNoteId);
}

function togglePin() {
  const current = document.getElementById("pin-label")?.textContent.includes("Un-pin");
  setPinState(!current);
}

function moveToTrash() {
  deleteCurrentNote();
}

function copyNoteLink() {
  navigator.clipboard
    .writeText(`${location.origin}/?note=${encodeURIComponent(_currentNoteId || "")}`)
    .then(() => showToast("Link copied", true, 1500))
    .catch(() => showToast("Copy failed", true, 1500));
}

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

    const html = String(data?.summary || "")
      .replace(/^---+$/gm, "<hr>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
      .replace(/\n{2,}/g, "</p><p>")
      .replace(/^(?!<[huol]|<li|<hr)(.+)$/gm, "<p>$1</p>");

    slot.innerHTML = `<div class="insight-block">${html}</div>`;
    slot.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    showToast(`Error: ${err.message}`, true, 3000);
  }
}

function startEditing(noteId) {
  const note = findNote(noteId);
  if (!note) return;

  const body = document.getElementById("panel-body");
  const insightSlot = document.getElementById("panel-insight-slot");
  if (insightSlot) insightSlot.innerHTML = "";

  const labels = {
    en: { cancel: "Cancel", save: "Save", hint: "Type / for commands" },
    ru: { cancel: "Отмена", save: "Сохранить", hint: "Введите / для команд" },
    de: { cancel: "Abbrechen", save: "Speichern", hint: "/ für Befehle" }
  };
  const L = window._lang || "en";
  const lb = labels[L] || labels.en;

  body.innerHTML = `
    <div class="edit-toolbar">
      <button onmousedown="event.preventDefault()" onclick="_activeEditor&&_activeEditor.format('bold')"><b>B</b></button>
      <button onmousedown="event.preventDefault()" onclick="_activeEditor&&_activeEditor.format('italic')"><i>I</i></button>
      <button onmousedown="event.preventDefault()" onclick="_activeEditor&&_activeEditor.format('underline')"><u>U</u></button>
      <button onmousedown="event.preventDefault()" onclick="_activeEditor&&_activeEditor.format('strikeThrough')"><s>S</s></button>
      <div class="sep"></div>
      <button onmousedown="event.preventDefault()" onclick="_activeEditor&&_activeEditor.format('formatBlock','h1')">H1</button>
      <button onmousedown="event.preventDefault()" onclick="_activeEditor&&_activeEditor.format('formatBlock','h2')">H2</button>
      <button onmousedown="event.preventDefault()" onclick="_activeEditor&&_activeEditor.format('formatBlock','h3')">H3</button>
      <button onmousedown="event.preventDefault()" onclick="_activeEditor&&_activeEditor.format('insertUnorderedList')">UL</button>
      <button onmousedown="event.preventDefault()" onclick="_activeEditor&&_activeEditor.format('insertOrderedList')">OL</button>
      <div class="sep"></div>
      <span style="font-size:.72rem;color:var(--text-3)">${lb.hint}</span>
      <div style="flex:1"></div>
      <button class="btn btn-ghost" style="font-size:.78rem" onclick='cancelEdit(${JSON.stringify(noteId)})'>${lb.cancel}</button>
      <button class="btn btn-primary" style="font-size:.78rem;padding:.4rem .9rem;margin-left:.4rem" onclick='saveEdit(${JSON.stringify(noteId)})'>${lb.save}</button>
    </div>
    <div id="editor-mount" style="min-height:300px;padding-top:.5rem"></div>
  `;

  if (_activeEditor) {
    _activeEditor.destroy();
    _activeEditor = null;
  }

  const mount = document.getElementById("editor-mount");
  if (typeof MemoEditor !== "undefined" && mount) {
    _activeEditor = new MemoEditor(mount, {
      initialHtml: note.html_content || `<p>${escHtml(note.content)}</p>`,
      onChange: () => {}
    });
    window._memoEditor = _activeEditor;
    window.editor = _activeEditor;
    _activeEditor.focus();
  } else if (mount) {
    mount.innerHTML = `
      <textarea id="edit-textarea"
        style="width:100%;min-height:300px;background:transparent;border:none;color:var(--text);padding:0;font-size:.95rem;font-family:var(--font);resize:none;outline:none;line-height:1.75"
      >${escHtml(note.content)}</textarea>
    `;
    document.getElementById("edit-textarea")?.focus();
  }
}

async function saveEdit(noteId) {
  let plainText = "";
  let htmlContent = null;

  if (_activeEditor) {
    plainText = (_activeEditor.getPlainText() || "").trim();
    htmlContent = _activeEditor.getHTML();
  } else {
    const ta = document.getElementById("edit-textarea");
    if (!ta) return;
    plainText = ta.value.trim();
  }

  if (!plainText) return;
  showToast(t("saving", "Saving..."), false);

  try {
    const updated = await apiFetch(`/notes/${noteId}`, {
      method: "PATCH",
      body: JSON.stringify({
        content: plainText,
        html_content: htmlContent
      })
    });

    const idx = _notes.findIndex((n) => String(n.id) === String(noteId));
    if (idx !== -1) {
      _notes[idx] = normalizeNote({
        ..._notes[idx],
        ...updated,
        id: noteId,
        content: plainText,
        html_content: htmlContent ?? _notes[idx].html_content
      });
    }

    if (_activeEditor) {
      _activeEditor.destroy();
      _activeEditor = null;
    }

    hideToast();
    showToast(t("note_saved", "Note saved"), true, 2000);
    renderTable();
    renderPinned();
    openNote(noteId);
  } catch (err) {
    showToast(`Error: ${err.message}`, true, 3000);
  }
}

function cancelEdit(noteId) {
  if (_activeEditor) {
    _activeEditor.destroy();
    _activeEditor = null;
  }
  openNote(noteId);
}

function renderGraph() {
  const svg = document.getElementById("graph-svg");
  const container = document.getElementById("canvas-container");
  if (!svg || !container) return;

  const W = container.offsetWidth || 900;
  const H = container.offsetHeight || 600;

  svg.setAttribute("width", W);
  svg.setAttribute("height", H);

  if (!_notes.length) {
    svg.innerHTML = `
      <g>
        <text x="${W / 2}" y="${H / 2 - 10}" text-anchor="middle" fill="var(--text-2)" font-family="Inter" font-size="14">No notes yet</text>
        <text x="${W / 2}" y="${H / 2 + 16}" text-anchor="middle" fill="var(--text-4)" font-family="Inter" font-size="12">Create notes to see the map</text>
      </g>
    `;
    return;
  }

  graphTransform.x = 0;
  graphTransform.y = 0;
  graphTransform.scale = 1;

  const positions = {};
  const cx = W / 2;
  const cy = H / 2;
  const radius = Math.min(W, H) * 0.38;

  _notes.forEach((note, i) => {
    const angle = (i / _notes.length) * Math.PI * 2 - Math.PI / 2;
    positions[note.id] = {
      x: cx + radius * Math.cos(angle) * (0.62 + Math.random() * 0.3),
      y: cy + radius * Math.sin(angle) * (0.62 + Math.random() * 0.3)
    };
  });

  const COLORS = ["#7c5cff", "#2ed3c6", "#8b5cf6", "#0ea5e9", "#9e8bff", "#06b6d4", "#a855f7"];
  const edges = [];
  const edgeSeen = new Set();

  _notes.forEach((note) => {
    (note.connections || []).forEach((conn) => {
      const toId = String(conn.related_note_id);
      const key = [String(note.id), toId].sort().join("--");
      if (!edgeSeen.has(key) && positions[note.id] && positions[toId]) {
        edgeSeen.add(key);
        edges.push({
          from: String(note.id),
          to: toId,
          score: Number(conn.similarity_score || 0)
        });
      }
    });
  });

  const edgesSVG = edges.map((e) => {
    const f = positions[e.from];
    const t2 = positions[e.to];
    return `<line class="graph-link ${e.score > 0.4 ? "strong" : ""}" x1="${f.x}" y1="${f.y}" x2="${t2.x}" y2="${t2.y}" />`;
  }).join("");

  const nodesSVG = _notes.map((note, i) => {
    const p = positions[note.id];
    const r = 7 + (note.connections?.length || 0) * 2.8;
    const label = noteTitle(note).substring(0, 24) + (noteTitle(note).length > 24 ? "…" : "");
    const color = COLORS[i % COLORS.length];

    return `
      <g class="graph-node-group" data-note-id="${escHtml(note.id)}" onclick='openNote(${JSON.stringify(note.id)})'>
        <circle cx="${p.x}" cy="${p.y}" r="${r + 10}" fill="${color}" fill-opacity="0.06"></circle>
        <circle class="graph-node" cx="${p.x}" cy="${p.y}" r="${r}" fill="${color}" fill-opacity="0.92"
          onmouseenter='showGraphTooltip(event, ${JSON.stringify(note.id)})'
          onmouseleave="hideGraphTooltip()"></circle>
        <text class="graph-node-label" x="${p.x}" y="${p.y + r + 16}">${escHtml(label)}</text>
      </g>
    `;
  }).join("");

  svg.innerHTML = `<g id="graph-root">${edgesSVG}${nodesSVG}</g>`;
  applyGraphTransform();
  initGraphInteraction();
}

function resetGraph() {
  graphTransform.x = 0;
  graphTransform.y = 0;
  graphTransform.scale = 1;
  applyGraphTransform();
}

function applyGraphTransform() {
  const root = document.getElementById("graph-root");
  if (!root) return;
  root.setAttribute("transform", `translate(${graphTransform.x},${graphTransform.y}) scale(${graphTransform.scale})`);
}

function initGraphInteraction() {
  const svg = document.getElementById("graph-svg");
  if (!svg || svg._interactionBound) return;
  svg._interactionBound = true;

  svg.addEventListener("wheel", (e) => {
    e.preventDefault();
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(4, Math.max(0.2, graphTransform.scale * delta));

    graphTransform.x = mouseX - (mouseX - graphTransform.x) * (newScale / graphTransform.scale);
    graphTransform.y = mouseY - (mouseY - graphTransform.y) * (newScale / graphTransform.scale);
    graphTransform.scale = newScale;
    applyGraphTransform();
  }, { passive: false });

  svg.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    if (e.target.closest(".graph-node-group")) return;
    _graphDrag.active = true;
    _graphDrag.startX = e.clientX;
    _graphDrag.startY = e.clientY;
    _graphDrag.originX = graphTransform.x;
    _graphDrag.originY = graphTransform.y;
    svg.style.cursor = "grabbing";
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!_graphDrag.active) return;
    graphTransform.x = _graphDrag.originX + (e.clientX - _graphDrag.startX);
    graphTransform.y = _graphDrag.originY + (e.clientY - _graphDrag.startY);
    applyGraphTransform();
  });

  window.addEventListener("mouseup", () => {
    if (!_graphDrag.active) return;
    _graphDrag.active = false;
    svg.style.cursor = "grab";
  });

  let lastTouches = null;

  svg.addEventListener("touchstart", (e) => {
    e.preventDefault();
    lastTouches = e.touches;
  }, { passive: false });

  svg.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touches = e.touches;

    if (touches.length === 1 && lastTouches?.length === 1) {
      const dx = touches[0].clientX - lastTouches[0].clientX;
      const dy = touches[0].clientY - lastTouches[0].clientY;
      graphTransform.x += dx;
      graphTransform.y += dy;
      applyGraphTransform();
    } else if (touches.length === 2 && lastTouches?.length === 2) {
      const prevDist = Math.hypot(
        lastTouches[0].clientX - lastTouches[1].clientX,
        lastTouches[0].clientY - lastTouches[1].clientY
      );
      const newDist = Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );
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
    const preview = (note.content || "").substring(0, 200).trim();
    const hasMore = (note.content || "").length > 200;
    const tagsHTML = (note.tags || []).map((tag) => `<span class="note-tag" style="font-size:.65rem">${escHtml(tag)}</span>`).join("");

    tooltip.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px">
        <span style="font-size:.72rem;color:var(--text-3)">${formatTime(note.created_at)}</span>
        ${connCount > 0 ? `<span class="conn-tag">${icon("connection")}<span>${connCount}</span></span>` : ""}
      </div>
      ${tagsHTML ? `<div style="margin-bottom:.35rem">${tagsHTML}</div>` : ""}
      <div style="font-size:.8rem;line-height:1.65;color:var(--text-2)">${escHtml(preview)}${hasMore ? `<span style="color:var(--text-4)">…</span>` : ""}</div>
    `;

    tooltip.style.opacity = "1";
    tooltip.style.transform = "translateY(0)";

    const x = event.clientX;
    const y = event.clientY;
    const tw = 260;
    const th = tooltip.offsetHeight || 150;
    const left = x + 20 + tw > window.innerWidth ? x - tw - 12 : x + 16;
    const top = y + 16 + th > window.innerHeight ? y - th - 8 : y + 16;
    tooltip.style.left = `${Math.max(4, left)}px`;
    tooltip.style.top = `${Math.max(4, top)}px`;
  }, 100);
}

function hideGraphTooltip() {
  clearTimeout(_tooltipTimeout);
  const tooltip = document.getElementById("graph-tooltip");
  if (tooltip) {
    tooltip.style.opacity = "0";
    tooltip.style.transform = "translateY(4px)";
  }
}

function openSearch() {
  document.getElementById("search-overlay")?.classList.remove("hidden");
  setTimeout(() => document.getElementById("search-input")?.focus(), 50);
}

function closeSearch() {
  const overlay = document.getElementById("search-overlay");
  const input = document.getElementById("search-input");
  const list = document.getElementById("search-results-list");

  if (overlay) overlay.classList.add("hidden");
  if (input) input.value = "";
  if (list) list.innerHTML = `<div class="search-empty">${t("search_semantic", "Start typing to search semantically")}</div>`;
}

function handleSearchOverlayClick(e) {
  if (e.target.id === "search-overlay") closeSearch();
}

function handleSearchKey(e) {
  if (e.key === "Escape") closeSearch();
}

function debouncedSearch() {
  clearTimeout(_searchTimeout);
  _searchTimeout = setTimeout(doSearch, 300);
}

async function doSearch() {
  const input = document.getElementById("search-input");
  const list = document.getElementById("search-results-list");
  const qv = input?.value.trim();

  if (!list) return;

  if (!qv) {
    list.innerHTML = `<div class="search-empty">${t("search_semantic", "Start typing...")}</div>`;
    return;
  }

  list.innerHTML = `<div class="search-empty">Searching...</div>`;

  try {
    const results = await apiFetch(`/search?q=${encodeURIComponent(qv)}&limit=8`);

    if (!results?.length) {
      list.innerHTML = `<div class="search-empty">No results for "${escHtml(qv)}"</div>`;
      return;
    }

    list.innerHTML = results.map((r) => {
      const note = normalizeNote(r.note);
      const title = clampText(noteTitle(note), 48);
      const snippet = clampText(noteSnippet(note), 72);
      const tagsHTML = note.tags.slice(0, 3).map((tag) => `
        <span class="note-tag" style="font-size:.65rem;">${escHtml(tag)}</span>
      `).join("");

      return `
        <div class="search-result-row" onclick='closeSearch();openNote(${JSON.stringify(note.id)})'>
          <span class="sr-icon">${icon("file")}</span>
          <div class="sr-text">
            <div class="sr-title">${escHtml(title)}</div>
            ${snippet ? `<div class="sr-snippet">${escHtml(snippet)}</div>` : ""}
            ${tagsHTML ? `<div style="margin-top:.2rem">${tagsHTML}</div>` : ""}
          </div>
          <span class="sr-score">${Math.round((r.similarity_score || 0) * 100)}%</span>
        </div>
      `;
    }).join("");
  } catch (err) {
    list.innerHTML = `<div class="search-empty">Error: ${escHtml(err.message)}</div>`;
  }
}

function openChat() {
  let panel = document.getElementById("chat-panel");

  if (!panel) {
    panel = document.createElement("div");
    panel.id = "chat-panel";
    panel.className = "chat-panel";
    panel.innerHTML = `
      <div class="chat-header">
        <div class="chat-title" style="display:flex;align-items:center;gap:8px">${icon("spark")}<span>Ask your notes</span></div>
        <button class="btn-icon" onclick="closeChat()">${icon("close")}</button>
      </div>
      <div class="chat-messages" id="chat-messages">
        <div class="chat-welcome">
          <div style="display:flex;justify-content:center;margin-bottom:.6rem">${icon("brain")}</div>
          <p>Ask a question about your notes.</p>
          <p style="color:var(--text-3);font-size:.78rem;margin-top:.25rem">Semantic search will answer from what you already wrote.</p>
        </div>
      </div>
      <div class="chat-input-row">
        <input id="chat-input" class="chat-input" type="text"
          placeholder="What do I know about... Explain... Find the link between..."
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChatMessage();}"
          autocomplete="off" />
        <button class="btn btn-primary chat-send" onclick="sendChatMessage()">${icon("send")}</button>
      </div>
    `;
    document.body.appendChild(panel);
  }

  panel.classList.add("visible");
  setTimeout(() => document.getElementById("chat-input")?.focus(), 100);
}

function closeChat() {
  const panel = document.getElementById("chat-panel");
  if (panel) panel.classList.remove("visible");
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
      body: JSON.stringify({
        message: msg,
        history: _chatHistory.slice(-6)
      })
    });

    removeChatMessage(thinkingId);

    let sourceHTML = "";
    if (data.context_count > 0) {
      const chips = (data.source_note_ids || []).slice(0, 3).map((id) => {
        const note = findNote(id);
        const title = note ? noteTitle(note).substring(0, 32) : `Note #${id}`;
        return `<span class="chat-source-chip" onclick='event.stopPropagation();openNote(${JSON.stringify(String(id))})'>${title}</span>`;
      }).join("");

      sourceHTML = `<div class="chat-sources">Based on ${data.context_count} ${data.context_count === 1 ? "note" : "notes"}: ${chips}</div>`;
    } else {
      sourceHTML = `<div class="chat-sources" style="color:var(--text-3);font-style:italic">No matching notes found</div>`;
    }

    const msgId = appendChatMessage("assistant", "", sourceHTML);
    await typewriterEffect(msgId, data.answer || "");

    _chatHistory.push({ role: "user", content: msg });
    _chatHistory.push({ role: "assistant", content: data.answer || "" });
    if (_chatHistory.length > 20) _chatHistory = _chatHistory.slice(-20);
  } catch (err) {
    removeChatMessage(thinkingId);
    appendChatMessage("assistant", `Error: ${err.message}`);
  } finally {
    input.disabled = false;
    input.focus();
  }
}

function appendChatMessage(role, content, extraHTML = "") {
  const id = `cmsg-${++_chatMsgCounter}`;
  const el = document.getElementById("chat-messages");
  if (!el) return id;

  const welcome = el.querySelector(".chat-welcome");
  if (welcome) welcome.remove();

  const formatted = escHtml(content).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>");

  el.insertAdjacentHTML("beforeend", `
    <div class="chat-msg chat-msg-${role}" id="${id}">
      <div class="chat-msg-content">${content ? `<p>${formatted}</p>` : ""}</div>
      ${extraHTML}
    </div>
  `);

  el.scrollTop = el.scrollHeight;
  return id;
}

function appendChatThinking() {
  const id = `cmsg-${++_chatMsgCounter}`;
  const el = document.getElementById("chat-messages");
  if (!el) return id;

  const welcome = el.querySelector(".chat-welcome");
  if (welcome) welcome.remove();

  el.insertAdjacentHTML("beforeend", `
    <div class="chat-msg chat-msg-assistant" id="${id}">
      <div class="chat-msg-content">
        <span style="display:inline-flex;gap:4px">
          <span style="width:6px;height:6px;border-radius:999px;background:currentColor;opacity:.35;animation:spin 1s linear infinite"></span>
          <span style="width:6px;height:6px;border-radius:999px;background:currentColor;opacity:.5;animation:spin 1s linear infinite"></span>
          <span style="width:6px;height:6px;border-radius:999px;background:currentColor;opacity:.65;animation:spin 1s linear infinite"></span>
        </span>
      </div>
    </div>
  `);

  el.scrollTop = el.scrollHeight;
  return id;
}

function removeChatMessage(id) {
  document.getElementById(id)?.remove();
}

async function typewriterEffect(msgId, text, speedMs = 12) {
  const el = document.querySelector(`#${msgId} .chat-msg-content`);
  const msgEl = document.getElementById("chat-messages");
  if (!el) return;

  const html = String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>");

  const tokens = [];
  const tagRegex = /<[^>]+>/g;
  let lastIndex = 0;
  let match;

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

  for (const token of tokens) {
    rendered += token.val;
    el.innerHTML = rendered;
    if (token.type === "char" && token.val.trim() !== "") {
      const pause =
        ".!?".includes(token.val) ? speedMs * 6 :
        ",;:".includes(token.val) ? speedMs * 3 :
        speedMs;
      await new Promise((r) => setTimeout(r, pause));
    }
    if (msgEl) msgEl.scrollTop = msgEl.scrollHeight;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (_token) openSearch();
  }

  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "n") {
    e.preventDefault();
    if (_token) toggleComposer(true);
  }

  if (e.ctrlKey && e.key === "/") {
    e.preventDefault();
    if (_token) openChat();
  }

  if (e.key === "Escape") {
    const search = document.getElementById("search-overlay");
    const chat = document.getElementById("chat-panel");
    const dr = document.getElementById("daily-review-modal");
    const panel = document.getElementById("note-detail-panel");

    if (chat?.classList.contains("visible")) return closeChat();
    if (dr?.classList.contains("visible")) return closeDailyReview();
    if (search && !search.classList.contains("hidden")) return closeSearch();
    if (panel && !panel.classList.contains("hidden") && window.innerWidth <= 980) return closeNotePanel();
    toggleComposer(false);
  }
});

function showToast(text, hideSpinner = true, autoMs = null) {
  const el = document.getElementById("toast");
  const textEl = document.getElementById("toast-text");
  const spinner = document.getElementById("toast-spinner");
  if (!el || !textEl || !spinner) return;

  textEl.textContent = text;
  spinner.style.display = hideSpinner ? "none" : "inline-flex";
  spinner.innerHTML = hideSpinner ? "" : icon("loader");
  el.classList.remove("hidden");

  if (_toastTimer) clearTimeout(_toastTimer);
  if (autoMs) _toastTimer = setTimeout(hideToast, autoMs);
}

function hideToast() {
  document.getElementById("toast")?.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  hydrateIcons();
  initLangGrid();
  applyI18n();
  syncDateFilterChips();
});

window.graphTransform = graphTransform;
window.applyGraphTransform = applyGraphTransform;
window.resetGraph = resetGraph;

// ── AI SUMMARY (detail pane) ──────────────────────────────────────────
async function loadAISummary(noteId) {
  const block = document.getElementById("ai-summary-block");
  const text  = document.getElementById("ai-summary-text");
  if (!block || !text) return;
  block.style.display = "";
  text.innerHTML = `<span style="color:var(--text-3)">Generating summary...</span>`;
  try {
    const data = await apiFetch("/notes/cluster-summary", {
      method: "POST",
      body: JSON.stringify({ note_ids: [noteId] }),
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

// ── SIDEBAR TAGS ──────────────────────────────────────────────────────
function renderSidebarTags() {
  const el = document.getElementById("sidebar-tags");
  if (!el) return;
  const allTags = [...new Set(_notes.flatMap(n => n.tags || []))].slice(0, 12);
  el.innerHTML = allTags.length
    ? allTags.map(tag => `
        <button class="sidebar-tag" onclick="filterByTag('${escHtml(tag)}', event)">
          <span style="font-size:.7rem;opacity:.6">#</span> ${escHtml(tag)}
        </button>`).join("")
    : `<span style="font-size:.74rem;color:var(--text-4);padding:0 8px">No tags yet</span>`;
}
