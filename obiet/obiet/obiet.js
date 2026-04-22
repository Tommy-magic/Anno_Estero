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
}

/* ── Save ── */
function salva() {
  const data = items.map((o, i) => ({
    n:          i + 1,
    testo:      o.input.value.trim(),
    completato: o.checkBtn.classList.contains('checked')
  }));
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
