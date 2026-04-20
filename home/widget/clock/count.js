/* ===== COUNTDOWN WIDGET — RITORNO | script.js ===== */

"use strict";

// ─── CONFIGURAZIONE (modifica qui la data target) ────────────────────────────
const CONFIG = {
  targetDate: "2027-06-15",   // formato YYYY-MM-DD
  targetTime: "00:00:00",     // ora di mezzanotte
  defaultTz:  "Europe/Rome",  // fuso orario di default
  fusuOrari: [
    { tz: "Europe/Rome",        flag: "🇮🇹", label: "Italia"  },
    { tz: "America/Mexico_City", flag: "🇲🇽", label: "Messico" },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

let currentTz = CONFIG.defaultTz;
let intervalId = null;

// ── Utility: zero-pad ─────────────────────────────────────────────────────────
function pad(n) {
  return String(n).padStart(2, "0");
}

// ── Calcola i ms rimasti rispetto al fuso orario selezionato ─────────────────
function getRemainingMs(tz) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year:   "numeric", month:  "2-digit", day:    "2-digit",
    hour:   "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const get   = (type) => parseInt(parts.find((p) => p.type === type).value, 10);

  // "ora corrente" espressa come UTC equivalente del momento nel fuso scelto
  const nowInTz = new Date(
    Date.UTC(get("year"), get("month") - 1, get("day"),
             get("hour"), get("minute"), get("second"))
  );

  const [Y, M, D] = CONFIG.targetDate.split("-").map(Number);
  const [h, m, s] = CONFIG.targetTime.split(":").map(Number);
  const target = new Date(Date.UTC(Y, M - 1, D, h, m, s));

  return target - nowInTz;
}

// ── Aggiorna i valori nel DOM ─────────────────────────────────────────────────
function updateCountdown() {
  const diff = getRemainingMs(currentTz);

  if (diff <= 0) {
    setDisplay("000", "00", "00", "00");
    clearInterval(intervalId);
    return;
  }

  const totalSec = Math.floor(diff / 1000);
  const giorni   = Math.floor(totalSec / 86400);
  const ore      = Math.floor((totalSec % 86400) / 3600);
  const minuti   = Math.floor((totalSec % 3600) / 60);
  const secondi  = totalSec % 60;

  setDisplay(String(giorni), pad(ore), pad(minuti), pad(secondi));
}

function setDisplay(g, o, m, s) {
  document.getElementById("cd-giorni").textContent = g;
  document.getElementById("cd-ore").textContent    = o;
  document.getElementById("cd-min").textContent    = m;
  document.getElementById("cd-sec").textContent    = s;
}

// ── Aggiorna il subtitle nel footer ─────────────────────────────────────────
function updateSubtitle() {
  const entry    = CONFIG.fusuOrari.find((f) => f.tz === currentTz);
  const [Y, M, D] = CONFIG.targetDate.split("-").map(Number);
  const dateStr  = new Intl.DateTimeFormat("it-IT", {
    day: "numeric", month: "long", year: "numeric",
  }).format(new Date(Y, M - 1, D));

  document.getElementById("cd-subtitle").textContent =
    `${dateStr}, ${CONFIG.targetTime.slice(0, 5)} – ora ${entry?.label ?? ""}`;
}

// ── Costruisce le opzioni del menu tz ────────────────────────────────────────
function buildTzMenu() {
  const menu = document.getElementById("cd-tz-menu");
  menu.innerHTML = "";

  CONFIG.fusuOrari.forEach(({ tz, flag, label }) => {
    const btn = document.createElement("button");
    btn.className       = "cd-tz-opt" + (tz === currentTz ? " active" : "");
    btn.dataset.tz      = tz;
    btn.dataset.flag    = flag;
    btn.dataset.label   = label;
    btn.textContent     = `${flag}  ${label}`;
    btn.addEventListener("click", onTzSelect);
    menu.appendChild(btn);
  });
}

// ── Handler selezione fuso orario ─────────────────────────────────────────────
function onTzSelect(e) {
  const btn  = e.currentTarget;
  currentTz  = btn.dataset.tz;

  // aggiorna bottone principale
  document.getElementById("cd-tz-flag").textContent = btn.dataset.flag;
  document.getElementById("cd-tz-name").textContent = btn.dataset.label;

  // aggiorna stato active nel menu
  document.querySelectorAll(".cd-tz-opt").forEach((o) => {
    o.classList.toggle("active", o.dataset.tz === currentTz);
  });

  closeMenu();
  updateSubtitle();
  updateCountdown();
}

// ── Apertura / chiusura menu ─────────────────────────────────────────────────
function toggleMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById("cd-tz-menu");
  const btn  = document.getElementById("cd-tz-btn");
  const open = menu.classList.toggle("open");
  btn.classList.toggle("open", open);
}

function closeMenu() {
  document.getElementById("cd-tz-menu").classList.remove("open");
  document.getElementById("cd-tz-btn").classList.remove("open");
}

// ── Init ──────────────────────────────────────────────────────────────────────
function init() {
  const defaultEntry = CONFIG.fusuOrari.find((f) => f.tz === CONFIG.defaultTz);
  if (defaultEntry) {
    document.getElementById("cd-tz-flag").textContent = defaultEntry.flag;
    document.getElementById("cd-tz-name").textContent = defaultEntry.label;
  }

  buildTzMenu();
  updateSubtitle();
  updateCountdown();

  intervalId = setInterval(updateCountdown, 1000);

  document.getElementById("cd-tz-btn").addEventListener("click", toggleMenu);
  document.addEventListener("click", closeMenu);
}

if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
