// Missioni Widget

const MISSIONS_POOL = [
    { id: 1,  title: 'Film in sincronia',            desc: 'Scegliete lo stesso film, avviate in contemporanea e commentatelo in chat mentre lo guardate.' },
    { id: 2,  title: 'Cena in coppia a distanza',    desc: 'Cucinate la stessa ricetta ciascuno a casa propria e mangiate "insieme" in videochiamata.' },
    { id: 3,  title: 'Lettera a mano',               desc: 'Scriviti una lettera a mano, fotografala e mandala. Niente messaggi di testo, solo parole scritte.' },
    { id: 4,  title: 'Passeggiata condivisa',        desc: 'Fate una passeggiata in videochiamata, ciascuno nel proprio quartiere: mostratevi i posti che amate.' },
    { id: 5,  title: '5 foto che ti fanno pensare a me', desc: 'Manda 5 foto scattate durante la settimana che ti hanno fatto pensare all\'altro.' },
    { id: 6,  title: 'Playlist del momento',         desc: 'Crea una playlist di 10 canzoni che descrivono come ti senti in questo periodo lontano/a.' },
    { id: 7,  title: 'Messaggio a sorpresa',         desc: 'Manda un messaggio inaspettato a un orario insolito: una poesia, un ricordo, un pensiero.' },
    { id: 8,  title: 'Club del libro (mini)',         desc: 'Leggete lo stesso capitolo di un libro e discutetelo in call: cosa vi ha colpito di più?' },
    { id: 9,  title: 'Ritratto imperfetto',          desc: 'Disegna un ritratto di lui/lei (anche bruttissimo!) e mandaglielo senza preavviso.' },
    { id: 10, title: '10 cose che amo di te',        desc: 'Scrivi 10 cose che ami dell\'altro e leggile ad alta voce durante una call.' },
    { id: 11, title: 'Cucina in diretta',            desc: 'Cucinate insieme in videochiamata, ognuno con quello che ha in casa: creatività al massimo.' },
    { id: 12, title: 'Gaming insieme',               desc: 'Giocate online insieme per almeno un\'ora — anche un gioco semplice come scacchi o carte conta.' },
    { id: 13, title: 'Pacco a sorpresa',             desc: 'Mandatevi qualcosa di fisico: anche solo un bigliettino, un disegnino o una caramella.' },
    { id: 14, title: 'Pianifichiamo il ritorno',     desc: 'Scegliete una meta per quando vi rivedrete e pianificate anche solo i dettagli di base.' },
    { id: 15, title: 'Quiz su di noi',              desc: 'Preparate ciascuno 5 domande su di voi come coppia e sfidate l\'altro: chi ricorda di più?' },
];

let currentMission   = null;
let missionHistory   = [];
let msState          = 'A';
let generatedChoices = [];

function getWeekKey(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function getWeekLabel(weekKey) {
    const [year, w] = weekKey.split('-W');
    return `Settimana ${parseInt(w)} · ${year}`;
}

function getCurrentWeekKey() {
    return getWeekKey(new Date());
}

function loadMissioni() {
    const saved = localStorage.getItem('annoEsteroCurrentMission');
    if (saved) currentMission = JSON.parse(saved);

    const hist = localStorage.getItem('annoEsteroMissionHistory');
    if (hist) missionHistory = JSON.parse(hist);
}

function saveMissioni() {
    localStorage.setItem('annoEsteroCurrentMission', JSON.stringify(currentMission));
    localStorage.setItem('annoEsteroMissionHistory', JSON.stringify(missionHistory));
}

function determineState() {
    if (!currentMission) {
        msState = 'A';
        return;
    }
    const thisWeek = getCurrentWeekKey();
    if (currentMission.weekKey !== thisWeek) {
        archiveCurrentIfNeeded();
        msState = 'A';
        return;
    }
    msState = 'C';
}

function archiveCurrentIfNeeded() {
    if (!currentMission) return;
    const alreadyArchived = missionHistory.some(h => h.weekKey === currentMission.weekKey);
    if (!alreadyArchived) {
        missionHistory.unshift({ ...currentMission, weekLabel: getWeekLabel(currentMission.weekKey) });
        saveMissioni();
    }
    currentMission = null;
}

function generateMissions() {
    const usedIds = [
        currentMission ? currentMission.id : null,
        ...missionHistory.slice(0, 4).map(h => h.id),
    ].filter(Boolean);

    const pool = MISSIONS_POOL.filter(m => !usedIds.includes(m.id));
    const shuffled = pool.sort(() => Math.random() - 0.5);
    generatedChoices = shuffled.slice(0, 3);

    msState = 'B';
    renderMissioni();
}

function chooseMission(idx) {
    const chosen = generatedChoices[idx];
    if (!chosen) return;

    currentMission = {
        id:        chosen.id,
        title:     chosen.title,
        desc:      chosen.desc,
        weekKey:   getCurrentWeekKey(),
        completed: false,
        chosenAt:  new Date().toISOString(),
    };

    saveMissioni();
    msState = 'C';
    renderMissioni();
    renderMsHomeWidget();
}

function toggleMissionComplete() {
    if (!currentMission) return;
    currentMission.completed = !currentMission.completed;
    
    if (currentMission.completed) {
        // Archiva immediatamente la missione quando completata
        const alreadyArchived = missionHistory.some(h => h.id === currentMission.id && h.weekKey === currentMission.weekKey);
        if (!alreadyArchived) {
            missionHistory.unshift({ ...currentMission, weekLabel: getWeekLabel(currentMission.weekKey) });
        }
        currentMission = null;
        msState = 'A';
    }
    
    saveMissioni();
    renderMissioni();
    renderMsHomeWidget();
}

function resetToGenerate() {
    msState = 'A';
    generatedChoices = [];
    renderMissioni();
}

function renderMissioni() {
    const genArea   = document.getElementById('ms-generate-area');
    const choices   = document.getElementById('ms-choices');
    const activeDiv = document.getElementById('ms-active');

    if (!genArea) return;

    genArea.style.display   = 'none';
    choices.style.display   = 'none';
    activeDiv.style.display = 'none';

    if (msState === 'A') {
        genArea.style.display = 'flex';
    } else if (msState === 'B') {
        choices.style.display = 'block';
        const grid = document.getElementById('ms-choices-grid');
        grid.innerHTML = '';
        generatedChoices.forEach((m, i) => {
            const card = document.createElement('div');
            card.className = 'ms-choice-card';
            card.onclick = () => chooseMission(i);
            card.innerHTML = `
                <div class="ms-choice-num">${i + 1}</div>
                <div class="ms-choice-body">
                    <div class="ms-choice-title">${m.title}</div>
                    <div class="ms-choice-desc">${m.desc}</div>
                </div>
            `;
            grid.appendChild(card);
        });
    } else if (msState === 'C' && currentMission) {
        activeDiv.style.display = 'block';
        const card = document.getElementById('ms-active-card');
        card.className = `ms-active-card${currentMission.completed ? ' done-card' : ''}`;
        card.innerHTML = `
            <div class="ms-active-badge">Missione della settimana</div>
            <div class="ms-active-title">${currentMission.title}</div>
            <div class="ms-active-desc">${currentMission.desc}</div>
            <div class="ms-done-row">
                <div class="ms-done-checkbox${currentMission.completed ? ' done' : ''}" id="ms-done-checkbox" onclick="toggleMissionComplete()">
                    ${currentMission.completed ? '✓' : ''}
                </div>
                <span class="ms-done-label" onclick="toggleMissionComplete()">
                    ${currentMission.completed ? 'Missione svolta! 🎉' : 'Segna come svolta'}
                </span>
            </div>
        `;
    }

    renderHistory();
}

function renderHistory() {
    const list  = document.getElementById('ms-history-list');
    const empty = document.getElementById('ms-history-empty');
    if (!list) return;

    list.innerHTML = '';

    if (missionHistory.length === 0) {
        if (empty) empty.style.display = 'block';
        list.style.display = 'none';
        return;
    }
    if (empty) empty.style.display = 'none';
    list.style.display = 'flex';

    missionHistory.forEach(h => {
        const item = document.createElement('div');
        item.className = 'ms-history-item';
        item.innerHTML = `
            <div class="ms-history-icon ${h.completed ? 'done' : 'miss'}">${h.completed ? '✓' : '○'}</div>
            <div class="ms-history-body">
                <div class="ms-history-item-title">${h.title}</div>
                <div class="ms-history-item-week">${h.weekLabel || getWeekLabel(h.weekKey)}</div>
            </div>
            <span class="ms-history-badge ${h.completed ? 'done' : 'miss'}">${h.completed ? 'Svolta' : 'Non svolta'}</span>
        `;
        list.appendChild(item);
    });
}

function renderMsHomeWidget() {
    const widget = document.getElementById('missione-widget');
    if (!widget) return;

    if (!currentMission || currentMission.weekKey !== getCurrentWeekKey()) {
        widget.innerHTML = `
            <div class="ms-widget-header">
                <span class="ms-widget-title">Missione</span>
                <a class="ms-widget-link" onclick="navigateToSlide('missioni')">Vai →</a>
            </div>
            <div class="ms-widget-empty">Nessuna missione questa settimana. Generane una!</div>
        `;
        return;
    }

    widget.innerHTML = `
        <div class="ms-widget-header">
            <span class="ms-widget-title">Missione</span>
            <a class="ms-widget-link" onclick="navigateToSlide('missioni')">Vai →</a>
        </div>
        <div class="ms-widget-mission-title">${currentMission.title}</div>
        <div class="ms-widget-mission-desc">${currentMission.desc}</div>
        <span class="ms-widget-status ${currentMission.completed ? 'done' : 'active'}">
            ${currentMission.completed ? '✓ Svolta' : '⚡ In corso'}
        </span>
    `;
}

function initializeMissioni() {
    loadMissioni();
    determineState();

    const weekLbl = document.getElementById('ms-week-label');
    if (weekLbl) weekLbl.textContent = getWeekLabel(getCurrentWeekKey());

    renderMissioni();
    renderMsHomeWidget();

    const genBtn = document.getElementById('ms-generate-btn');
    if (genBtn) genBtn.addEventListener('click', generateMissions);

    const backBtn = document.getElementById('ms-back-btn');
    if (backBtn) backBtn.addEventListener('click', resetToGenerate);

    const changeBtn = document.getElementById('ms-change-btn');
    if (changeBtn) changeBtn.addEventListener('click', resetToGenerate);
}

document.addEventListener('DOMContentLoaded', initializeMissioni);
