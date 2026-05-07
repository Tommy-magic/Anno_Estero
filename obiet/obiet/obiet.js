'use strict';

const PLACEHOLDERS = [
  'Descrivi il tuo primo obiettivo…',
  'Qual è il secondo traguardo?',
  'Terzo obiettivo da raggiungere…',
  'Ancora un passo avanti…',
  'Ultimo obiettivo, ma non meno importante…'
];

const list  = document.getElementById('list');
const items = [];

/* ── Build a single item row ── */
function buildItem(idx) {
  const item = document.createElement('div');
  item.className = 'obiettivo-item';

  const num = document.createElement('div');
  num.className   = 'num';
  num.textContent = String(idx + 1).padStart(2, '0');

  const wrap  = document.createElement('div');
  wrap.className  = 'input-wrap';

  const input = document.createElement('input');
  input.type        = 'text';
  input.className   = 'obiettivo-input';
  input.placeholder = PLACEHOLDERS[idx];
  input.maxLength   = 120;
  input.addEventListener('input', updateProgress);

  wrap.appendChild(input);

  const checkBtn = document.createElement('button');
  checkBtn.className = 'check-btn';
  checkBtn.title     = 'Segna come completato';
  checkBtn.innerHTML = '<svg viewBox="0 0 12 10"><polyline points="1,5 4.5,8.5 11,1"/></svg>';
  checkBtn.addEventListener('click', () => toggleDone(item, input, checkBtn));

  const delBtn = document.createElement('button');
  delBtn.className = 'del-btn';
  delBtn.title     = 'Cancella testo';
  delBtn.innerHTML = '<svg viewBox="0 0 12 12"><line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/></svg>';
  delBtn.addEventListener('click', () => clearItem(item, input, checkBtn));

  item.appendChild(num);
  item.appendChild(wrap);
  item.appendChild(checkBtn);
  item.appendChild(delBtn);
  list.appendChild(item);

  items.push({ item, input, checkBtn });
}

/* ── Toggle completed state ── */
function toggleDone(item, input, btn) {
  const currentlyDone = btn.classList.contains('checked');
  if (!currentlyDone && input.value.trim() === '') {
    // Don't allow marking as done if empty
    return;
  }
  const isDone = btn.classList.toggle('checked');
  item.classList.toggle('done', isDone);
  input.disabled = isDone;
  updateProgress();
}

/* ── Clear a single item ── */
function clearItem(item, input, checkBtn) {
  input.value    = '';
  input.disabled = false;
  item.classList.remove('done');
  checkBtn.classList.remove('checked');
  input.focus();
  updateProgress();
}

/* ── Update progress bar & counters ── */
function updateProgress() {
  const done = items.filter(i => i.checkBtn.classList.contains('checked')).length;
  const pct  = Math.round((done / items.length) * 100);

  document.getElementById('progress').style.width = pct + '%';
  document.getElementById('pct').textContent       = pct;
  document.getElementById('doneCount').textContent = done;

  // Aggiorna anche l'andamento se è selezionato "current"
  if (userSelect && userSelect.value === 'current') {
    updateAndamento();
  }

  // Aggiorna la lista filtrata
  updateLista();
}

/* ── Save ── */
function salva() {
  const data = items.map((o, i) => ({
    n:          i + 1,
    testo:      o.input.value.trim(),
    completato: o.checkBtn.classList.contains('checked')
  }));
  
  // Salva in localStorage
  localStorage.setItem('obiettivi', JSON.stringify(data));
  
  console.log('Obiettivi salvati:', data);
  showToast();
}

/* ── Toast notification ── */
function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ── Init ── */
for (let i = 0; i < 5; i++) buildItem(i);
document.getElementById('saveBtn').addEventListener('click', salva);

// Carica obiettivi salvati
caricaObiettivi();
const userData = {
  user1: 3, // 3 su 5 completati
  user2: 1  // 1 su 5 completati
};

// Gestione cambio utente per andamento
const userSelect = document.getElementById('user-select');
if (userSelect) {
  userSelect.addEventListener('change', updateAndamento);
}

function updateAndamento() {
  const selectedUser = userSelect.value;
  let completed = 0;
  if (selectedUser === 'current') {
    // Usa i dati attuali dell'utente corrente
    completed = items.filter(i => i.checkBtn.classList.contains('checked')).length;
  } else {
    // Usa dati simulati
    completed = userData[selectedUser] || 0;
  }
  const pct = Math.round((completed / 5) * 100);
  document.getElementById('progress-andamento').style.width = pct + '%';
  document.getElementById('pct-andamento').textContent = pct;
}

// Gestione filtro lista obiettivi
const filterSelect = document.getElementById('filter-select');
const listaObiettivi = document.getElementById('lista-obiettivi');

if (filterSelect) {
  filterSelect.addEventListener('change', updateLista);
}

function updateLista() {
  const filter = filterSelect.value;
  listaObiettivi.innerHTML = ''; // Svuota la lista

  items.forEach((itemObj, idx) => {
    const isDone = itemObj.checkBtn.classList.contains('checked');
    const testo = itemObj.input.value.trim();

    // Filtra in base al select
    if (filter === 'all' || (filter === 'done' && isDone) || (filter === 'open' && !isDone)) {
      const li = document.createElement('div');
      li.className = 'lista-item';
      li.innerHTML = `
        <span class="lista-num">${String(idx + 1).padStart(2, '0')}</span>
        <span class="lista-text ${isDone ? 'done' : ''}">${testo || 'Obiettivo vuoto'}</span>
        <span class="lista-status">${isDone ? '✓' : '○'}</span>
      `;
      listaObiettivi.appendChild(li);
    }
  });
}

/* ── Load saved objectives ── */
function caricaObiettivi() {
  const saved = localStorage.getItem('obiettivi');
  if (saved) {
    const data = JSON.parse(saved);
    data.forEach((obj, i) => {
      if (i < items.length) {
        items[i].input.value = obj.testo;
        if (obj.completato) {
          items[i].checkBtn.classList.add('checked');
          items[i].item.classList.add('done');
          items[i].input.disabled = true;
        }
      }
    });
    updateProgress(); // Aggiorna contatori e barra
  }
}
