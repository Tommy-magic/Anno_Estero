// Video Page — pronto per il collegamento al DB
// Tutte le funzioni che recuperano dati sono marcate con // TODO: sostituire con chiamata DB

// ─── Mock data (verrà rimpiazzato dal DB) ─────────────────────────────────
// TODO: sostituire con fetch('/api/videos') o simile
const MOCK_VIDEOS = [
    { id: 1,  title: 'Tramonto sul lungofiume',   user: 'Giulia', date: '2025-04-18', src: null },
    { id: 2,  title: 'Gita al mercato locale',    user: 'Marco',  date: '2025-04-17', src: null },
    { id: 3,  title: 'La mia stanza qui',         user: 'Giulia', date: '2025-04-15', src: null },
    { id: 4,  title: 'Weekend in campagna',       user: 'Marco',  date: '2025-04-13', src: null },
    { id: 5,  title: 'Colazione con vista',       user: 'Giulia', date: '2025-04-10', src: null },
    { id: 6,  title: 'Il quartiere di sera',      user: 'Marco',  date: '2025-04-08', src: null },
    { id: 7,  title: 'Musica in piazza',          user: 'Giulia', date: '2025-04-05', src: null },
    { id: 8,  title: 'Escursione sul lago',       user: 'Marco',  date: '2025-04-03', src: null },
    { id: 9,  title: 'Cena con i coinquilini',    user: 'Giulia', date: '2025-03-30', src: null },
    { id: 10, title: 'Prima settimana qui',       user: 'Marco',  date: '2025-03-25', src: null },
    { id: 11, title: 'Nevicata inaspettata',      user: 'Giulia', date: '2025-03-20', src: null },
    { id: 12, title: 'Visita al museo',           user: 'Marco',  date: '2025-03-18', src: null },
];

// ─── State ────────────────────────────────────────────────────────────────
let localVideos     = [];   // video aggiunti dall'utente (blob URL in memoria)
let currentFilter   = 'tutti';
let visibleCount    = 10;   // quanti video mostrare nella griglia
let slideshowIndex  = 0;
let slideshowVideos = [];   // i 4 video per lo slideshow
let weeklyVideo     = null;

// ─── Helpers ──────────────────────────────────────────────────────────────
function userClass(user) {
    const map = { 'Giulia': 'u1', 'Marco': 'u2' };
    return map[user] || 'local';
}

// ─── Merge data (mock + local) ────────────────────────────────────────────
function getAllVideos() {
    // TODO: sostituire MOCK_VIDEOS con dati reali dal DB
    return [...MOCK_VIDEOS, ...localVideos];
}

// ─── Weekly video (stabile per settimana) ─────────────────────────────────
function computeWeeklyVideo() {
    const all = getAllVideos();
    if (all.length === 0) { weeklyVideo = null; return; }
    const key  = getWeekKey(new Date());
    // seed deterministico basato sulla settimana
    let seed = 0;
    for (let i = 0; i < key.length; i++) seed += key.charCodeAt(i);
    weeklyVideo = all[seed % all.length];
}

// ─── Slideshow ────────────────────────────────────────────────────────────
function buildSlideshowVideos() {
    // TODO: sostituire con i 4 video "in evidenza" presi dal DB
    slideshowVideos = getAllVideos().slice(0, 4);
}

function renderSlideshow() {
    buildSlideshowVideos();
    const wrap = document.getElementById('vd-slideshow-wrap');
    if (!wrap) return;

    if (slideshowVideos.length === 0) {
        wrap.innerHTML = `
            <div class="vd-slide-placeholder">
                <div class="vd-slide-play-icon">🎬</div>
                <span class="vd-slide-ph-title">Nessun video ancora</span>
            </div>`;
        renderDots(0);
        return;
    }

    const v = slideshowVideos[slideshowIndex] || slideshowVideos[0];
    slideshowIndex = Math.min(slideshowIndex, slideshowVideos.length - 1);

    if (v.src) {
        wrap.innerHTML = `
            <video class="vd-slide-video" src="${v.src}" preload="metadata" muted playsinline
                   onclick="openVideoPlayer(${v.id})"></video>
            <div class="vd-slide-overlay">
                <div class="vd-slide-info">
                    <div class="vd-slide-title">${v.title}</div>
                    <div class="vd-slide-user">${v.user} · ${formatDate(v.date)}</div>
                </div>
            </div>`;
    } else {
        wrap.innerHTML = `
            <div class="vd-slide-placeholder" onclick="openVideoPlayer(${v.id})">
                <div class="vd-slide-play-icon">▶</div>
                <span class="vd-slide-ph-title">${v.title}</span>
            </div>
            <div class="vd-slide-overlay">
                <div class="vd-slide-info">
                    <div class="vd-slide-title">${v.title}</div>
                    <div class="vd-slide-user">${v.user} · ${formatDate(v.date)}</div>
                </div>
            </div>`;
    }

    renderDots(slideshowVideos.length);
}

function renderDots(count) {
    const dotsEl = document.getElementById('vd-dots');
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.className = `vd-dot${i === slideshowIndex ? ' active' : ''}`;
        dot.onclick = () => { slideshowIndex = i; renderSlideshow(); };
        dotsEl.appendChild(dot);
    }
}

function slidePrev() {
    if (slideshowVideos.length === 0) return;
    slideshowIndex = (slideshowIndex - 1 + slideshowVideos.length) % slideshowVideos.length;
    renderSlideshow();
}

function slideNext() {
    if (slideshowVideos.length === 0) return;
    slideshowIndex = (slideshowIndex + 1) % slideshowVideos.length;
    renderSlideshow();
}

// Auto-advance slideshow every 5 s
let slideshowTimer = null;
function startSlideshowTimer() {
    clearInterval(slideshowTimer);
    if (slideshowVideos.length > 1) {
        slideshowTimer = setInterval(slideNext, 5000);
    }
}

// ─── Video Grid ────────────────────────────────────────────────────────────
function renderGrid() {
    const grid  = document.getElementById('vd-grid');
    const more  = document.getElementById('vd-load-more');
    if (!grid) return;

    const all = getAllVideos();
    const filtered = currentFilter === 'tutti'
        ? all
        : all.filter(v => v.user === currentFilter);

    const slice = filtered.slice(0, visibleCount);

    grid.innerHTML = '';

    if (slice.length === 0) {
        grid.innerHTML = '<div class="vd-grid-empty">Nessun video trovato.</div>';
        if (more) more.style.display = 'none';
        return;
    }

    slice.forEach(v => {
        const card = document.createElement('div');
        card.className = 'vd-card';
        card.onclick = () => openVideoPlayer(v.id);

        card.innerHTML = `
            <div class="vd-card-thumb${v.src ? '' : ' ph'}">
                ${v.src
                    ? `<video src="${v.src}" preload="none" muted></video>`
                    : `<div class="vd-ph-icon">🎬</div>`
                }
                <div class="vd-card-play">▶</div>
            </div>
            <div class="vd-card-info">
                <div class="vd-card-title">${v.title}</div>
                <div class="vd-card-meta">
                    <span class="vd-card-user ${userClass(v.user)}">${v.user}</span>
                    <span class="vd-card-date">${formatDate(v.date)}</span>
                </div>
            </div>`;

        grid.appendChild(card);
    });

    if (more) {
        if (filtered.length > visibleCount) {
            more.style.display = 'block';
            more.disabled = false;
            more.textContent = `Carica altri (${filtered.length - visibleCount} rimanenti)`;
        } else {
            more.style.display = filtered.length > 10 ? 'block' : 'none';
            more.disabled = true;
            more.textContent = 'Tutti i video caricati';
        }
    }
}

function setGridFilter(user) {
    currentFilter = user;
    visibleCount  = 10;

    document.querySelectorAll('.vd-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === user);
    });

    renderGrid();
}

function loadMoreVideos() {
    visibleCount += 10;
    renderGrid();
}

// ─── Build filter buttons dynamically ─────────────────────────────────────
function buildFilterButtons() {
    const row = document.getElementById('vd-filter-row');
    if (!row) return;

    const all   = getAllVideos();
    const users = [...new Set(all.map(v => v.user))];

    row.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className  = 'vd-filter-btn active';
    allBtn.dataset.filter = 'tutti';
    allBtn.textContent    = 'Tutti';
    allBtn.onclick = () => setGridFilter('tutti');
    row.appendChild(allBtn);

    users.forEach(u => {
        const btn = document.createElement('button');
        btn.className     = 'vd-filter-btn';
        btn.dataset.filter = u;
        btn.textContent    = u;
        btn.onclick = () => setGridFilter(u);
        row.appendChild(btn);
    });
}

// ─── Video della settimana ─────────────────────────────────────────────────
function renderWeekly() {
    const container = document.getElementById('vd-weekly-container');
    if (!container) return;

    if (!weeklyVideo) {
        container.innerHTML = '<div class="vd-weekly-empty">Nessun video disponibile questa settimana.</div>';
        return;
    }

    const v = weeklyVideo;
    container.innerHTML = `
        <div class="vd-weekly-thumb" onclick="openVideoPlayer(${v.id})">
            ${v.src
                ? `<video src="${v.src}" preload="none" muted style="width:100%;height:100%;object-fit:cover;"></video>`
                : `<div class="vd-weekly-play">▶</div>`
            }
        </div>
        <div class="vd-weekly-title">${v.title}</div>
        <div class="vd-weekly-meta">${v.user} · ${formatDate(v.date)}</div>
    `;
}

// ─── Aggiungi video ────────────────────────────────────────────────────────
function openAddVideo() {
    document.getElementById('vd-file-input').click();
}

function handleVideoUpload(event) {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    files.forEach(file => {
        const blobUrl = URL.createObjectURL(file);
        const newVideo = {
            id:    Date.now() + Math.random(),
            title: file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
            user:  'Tu',
            date:  new Date().toISOString().split('T')[0],
            src:   blobUrl,
        };
        localVideos.push(newVideo);
    });

    event.target.value = '';

    renderLocalPreviews();
    buildFilterButtons();
    renderSlideshow();
    renderGrid();
    computeWeeklyVideo();
    renderWeekly();
}

function removeLocalVideo(id) {
    const v = localVideos.find(lv => lv.id === id);
    if (v && v.src) URL.revokeObjectURL(v.src);
    localVideos = localVideos.filter(lv => lv.id !== id);

    renderLocalPreviews();
    buildFilterButtons();
    renderSlideshow();
    renderGrid();
    computeWeeklyVideo();
    renderWeekly();
}

function renderLocalPreviews() {
    const list = document.getElementById('vd-local-list');
    if (!list) return;

    if (localVideos.length === 0) {
        list.innerHTML = '';
        return;
    }

    list.innerHTML = localVideos.map(v => `
        <div class="vd-local-item">
            <span class="vd-local-icon">🎬</span>
            <span class="vd-local-name" title="${v.title}">${v.title}</span>
            <button class="vd-local-remove" onclick="removeLocalVideo(${v.id})" title="Rimuovi">×</button>
        </div>
    `).join('');
}

// ─── Modal player ──────────────────────────────────────────────────────────
function openVideoPlayer(id) {
    const all = getAllVideos();
    const v   = all.find(video => video.id === id);
    if (!v) return;

    const overlay = document.getElementById('vd-player-overlay');
    const content = document.getElementById('vd-player-content');

    content.innerHTML = `
        ${v.src
            ? `<video class="vd-player-video" src="${v.src}" controls autoplay playsinline></video>`
            : `<div class="vd-player-ph">
                   <div class="vd-player-ph-icon">🎬</div>
                   <div class="vd-player-ph-text">Video disponibile dopo il collegamento al database</div>
               </div>`
        }
        <div class="vd-player-info">
            <div class="vd-player-title">${v.title}</div>
            <div class="vd-player-meta">${v.user} · ${formatDate(v.date)}</div>
        </div>
    `;

    overlay.classList.add('active');
}

function closeVideoPlayer() {
    const overlay = document.getElementById('vd-player-overlay');
    overlay.classList.remove('active');

    const video = overlay.querySelector('video');
    if (video) video.pause();
}

// ─── Init ──────────────────────────────────────────────────────────────────
function initializeVideo() {
    computeWeeklyVideo();
    buildFilterButtons();
    renderSlideshow();
    startSlideshowTimer();
    renderGrid();
    renderWeekly();
    renderLocalPreviews();

    // Arrows
    const prev = document.getElementById('vd-arrow-prev');
    const next = document.getElementById('vd-arrow-next');
    if (prev) prev.addEventListener('click', slidePrev);
    if (next) next.addEventListener('click', slideNext);

    // Load more
    const more = document.getElementById('vd-load-more');
    if (more) more.addEventListener('click', loadMoreVideos);

    // Add video area
    const addArea = document.getElementById('vd-add-area');
    if (addArea) addArea.addEventListener('click', openAddVideo);

    // File input (hidden)
    const fileInput = document.getElementById('vd-file-input');
    if (fileInput) fileInput.addEventListener('change', handleVideoUpload);

    // Close player
    const closeBtn = document.getElementById('vd-player-close');
    if (closeBtn) closeBtn.addEventListener('click', closeVideoPlayer);

    const overlay = document.getElementById('vd-player-overlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) closeVideoPlayer();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeVideoPlayer();
        if (e.key === 'ArrowLeft')  slidePrev();
        if (e.key === 'ArrowRight') slideNext();
    });
}

document.addEventListener('DOMContentLoaded', initializeVideo);
