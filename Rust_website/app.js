// ============================================================
// APP LOGIC
// ============================================================

// ---- STATE ----
let state = {
  progDone: new Set(JSON.parse(localStorage.getItem('prog') || '[]')),
  dsaSolved: new Set(JSON.parse(localStorage.getItem('dsa') || '[]')),
  streakDays: JSON.parse(localStorage.getItem('streak') || 'Array(30).fill(0)').length === 30
    ? JSON.parse(localStorage.getItem('streak') || 'Array(30).fill(0)')
    : Array(30).fill(0),
  quizIdx: 0,
  quizScore: 0,
  quizAttempt: 0,
  conceptIdx: 0,
  osIdx: 0,
  dbIdx: 0,
  currentSection: 'home',
  compilerInited: false,
};

function save() {
  localStorage.setItem('prog', JSON.stringify([...state.progDone]));
  localStorage.setItem('dsa', JSON.stringify([...state.dsaSolved]));
  localStorage.setItem('streak', JSON.stringify(state.streakDays));
}

// ---- NAVIGATION ----
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const sec = document.getElementById('section-' + id);
  if (sec) sec.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.getAttribute('onclick') && n.getAttribute('onclick').includes("'" + id + "'")) {
      n.classList.add('active');
    }
  });
  state.currentSection = id;
  window.scrollTo(0, 0);
  // close sidebar on mobile
  document.getElementById('sidebar').classList.remove('open');
  // lazy render
  if (id === 'concepts' && !document.getElementById('concept-detail').innerHTML) renderConcepts();
  if (id === 'programs' && !document.getElementById('prog-list').innerHTML) renderPrograms();
  if (id === 'which-to-use' && !document.getElementById('decision-list').innerHTML) renderDecisions();
  if (id === 'dsa-tracker' && !document.getElementById('dsa-patterns-list').innerHTML) renderDSATracker();
  if (id === 'os-concepts' && !document.getElementById('os-detail').innerHTML) renderOSConcepts();
  if (id === 'database' && !document.getElementById('db-detail').innerHTML) renderDB();
  if (id === 'rust-qa' && !document.getElementById('rust-qa-list').innerHTML) renderRustQA();
  if (id === 'os-qa' && !document.getElementById('osdb-qa-list').innerHTML) renderOSQA();
  if (id === 'quiz') renderQuiz();
  if (id === 'streak') renderStreak();
  if (id === 'compiler' && !state.compilerInited) { initCompiler(); state.compilerInited = true; }
  updateXP();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ---- TABS ----
function switchTab(btn, group, id) {
  const container = btn.closest('.section') || document.body;
  container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  container.querySelectorAll('[id^="' + group + '-"]').forEach(p => p.classList.remove('active'));
  const pane = document.getElementById(group + '-' + id);
  if (pane) pane.classList.add('active');
}

// ---- ACCORDION ----
function toggleAcc(header) {
  const isOpen = header.classList.contains('open');
  document.querySelectorAll('.acc-header.open').forEach(h => h.classList.remove('open'));
  if (!isOpen) header.classList.add('open');
}

// ---- XP / PROGRESS ----
function updateXP() {
  const total = PROGRAMS.length + DSA_PATTERNS.reduce((a, p) => a + p.probs.length, 0);
  const done = state.progDone.size + state.dsaSolved.size;
  const pct = Math.round(done / total * 100);
  const el = document.getElementById('xp-bar');
  const num = document.getElementById('xp-num');
  if (el) el.style.width = pct + '%';
  if (num) num.textContent = done + ' xp';
}

// ---- CONCEPTS ----
function renderConcepts() {
  const nav = document.getElementById('concept-nav');
  nav.innerHTML = CONCEPTS.map((c, i) =>
    `<button class="cnav-btn${i===0?' active':''}" onclick="selConcept(${i},this)">${c.name}</button>`
  ).join('');
  showConceptDetail(0);
}

function selConcept(i, btn) {
  document.querySelectorAll('#concept-nav .cnav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  showConceptDetail(i);
}

function showConceptDetail(i) {
  const c = CONCEPTS[i];
  const catColors = {foundation:'badge-green', abstraction:'badge-blue', 'smart-ptrs':'badge-purple', error:'badge-orange', functional:'badge-yellow', async:'badge-red', advanced:'badge-red'};
  document.getElementById('concept-detail').innerHTML = `
    <div class="card fade-up">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <div style="font-family:var(--sans);font-size:1.1rem;font-weight:700">${c.name}</div>
        <span class="badge ${catColors[c.cat]||'badge-green'}">${c.cat}</span>
      </div>
      <div class="concept-row"><div class="concept-label">✓ use when</div><div class="concept-val">${c.when}</div></div>
      <div class="concept-row"><div class="concept-label">✗ avoid when</div><div class="concept-val">${c.avoid}</div></div>
      <div class="concept-row"><div class="concept-label">💡 pro tip</div><div class="concept-val">${c.tip}</div></div>
      <div class="concept-row"><div class="concept-label">🎤 interview line</div><div class="concept-val" style="color:var(--green);font-style:italic">${c.interview}</div></div>
      <div class="accordion" style="margin-top:10px">
        <div class="acc-header" onclick="toggleAcc(this)">
          <span class="acc-title">basic example</span><span class="acc-arrow">▶</span>
        </div>
        <div class="acc-body"><pre class="code-block">${esc(c.basic)}</pre></div>
      </div>
      <div class="accordion">
        <div class="acc-header" onclick="toggleAcc(this)">
          <span class="acc-title">advanced example</span><span class="acc-arrow">▶</span>
        </div>
        <div class="acc-body"><pre class="code-block">${esc(c.advanced)}</pre></div>
      </div>
    </div>`;
}

// ---- PROGRAMS ----
function renderPrograms() {
  const done = state.progDone.size;
  const rem = PROGRAMS.length - done;
  const pct = Math.round(done / PROGRAMS.length * 100);
  document.getElementById('p-done').textContent = done;
  document.getElementById('p-rem').textContent = rem;
  document.getElementById('p-pct').textContent = pct + '%';

  document.getElementById('prog-list').innerHTML = PROGRAMS.map((p, i) => `
    <div class="check-item">
      <div class="chk${state.progDone.has(i)?' done':''}" onclick="togProg(${i})" role="checkbox" aria-label="${p.title}">${state.progDone.has(i)?'✓':''}</div>
      <div class="check-content">
        <div class="check-title">${i+1}. ${p.title}</div>
        <div class="check-tags">${p.cats.map(c=>`<span class="badge badge-green">${c}</span>`).join('')}</div>
        <div class="accordion" style="margin-top:6px">
          <div class="acc-header" onclick="toggleAcc(this)" style="padding:6px 8px">
            <span class="acc-title" style="font-size:11px">view code</span><span class="acc-arrow">▶</span>
          </div>
          <div class="acc-body"><pre class="code-block">${esc(p.code)}</pre></div>
        </div>
      </div>
    </div>`).join('');
}

function togProg(i) {
  if (state.progDone.has(i)) state.progDone.delete(i);
  else state.progDone.add(i);
  save();
  renderPrograms();
  updateXP();
}

// ---- DECISIONS ----
const DECISIONS = [
  {q:'Value might be absent (null)?', a:'Option<T>', rule:'read'},
  {q:'Operation might fail?', a:'Result<T, E>', rule:'own'},
  {q:'Heap, one owner?', a:'Box<T>', rule:'own'},
  {q:'Recursive type (tree, list)?', a:'Box<T>', rule:'own'},
  {q:'Many owners, read, single thread?', a:'Rc<T>', rule:'read'},
  {q:'Many owners + mutate, single thread?', a:'Rc<RefCell<T>>', rule:'mut'},
  {q:'Prevent cycle in Rc graph?', a:'Weak<T>', rule:'read'},
  {q:'Many owners, multi-thread, read?', a:'Arc<T>', rule:'read'},
  {q:'Many owners, multi-thread, mutate?', a:'Arc<Mutex<T>>', rule:'mut'},
  {q:'Many readers, few writers?', a:'Arc<RwLock<T>>', rule:'mut'},
  {q:'Same logic for multiple types?', a:'Generics <T>', rule:'read'},
  {q:'Shared behaviour across types?', a:'Traits', rule:'read'},
  {q:'Runtime type selection (hetero)?', a:'Box<dyn Trait>', rule:'own'},
  {q:'Process or transform collection?', a:'Iterators', rule:'read'},
  {q:'Closure only reads env?', a:'Fn (borrows &T)', rule:'read'},
  {q:'Closure mutates env?', a:'FnMut (borrows &mut T)', rule:'mut'},
  {q:'Closure consumes env?', a:'FnOnce (moves T)', rule:'own'},
  {q:'IO-bound async work?', a:'async/await + Tokio', rule:'read'},
  {q:'CPU-bound parallel?', a:'thread::spawn + rayon', rule:'own'},
  {q:'Pass data between threads?', a:'mpsc channel (moves T)', rule:'own'},
  {q:'Mutate through shared ref (runtime)?', a:'RefCell<T>', rule:'mut'},
  {q:'Initialize once, read many times?', a:'OnceLock / OnceCell', rule:'read'},
];

function renderDecisions() {
  const colors = {read:'#4da6ff', mut:'#00ff88', own:'#ff9966'};
  const bg = {read:'rgba(77,166,255,0.1)', mut:'rgba(0,255,136,0.1)', own:'rgba(255,153,102,0.1)'};
  document.getElementById('decision-list').innerHTML = DECISIONS.map(d => `
    <div style="display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:12px;color:var(--text2)">${d.q}</span>
      <span style="font-size:10px;padding:2px 7px;border-radius:3px;background:${bg[d.rule]};color:${colors[d.rule]};white-space:nowrap">${d.rule}</span>
      <span class="badge badge-green" style="white-space:nowrap">${d.a}</span>
    </div>`).join('');
}

// ---- DSA TRACKER ----
function renderDSATracker() {
  const total = DSA_PATTERNS.reduce((a, p) => a + p.probs.length, 0);
  const solved = state.dsaSolved.size;
  document.getElementById('dsa-metrics').innerHTML = `
    <div class="metric"><span class="metric-val">${solved}</span><span class="metric-label">solved</span></div>
    <div class="metric"><span class="metric-val">${total - solved}</span><span class="metric-label">remaining</span></div>
    <div class="metric"><span class="metric-val">${Math.round(solved/total*100)}%</span><span class="metric-label">complete</span></div>`;

  document.getElementById('dsa-patterns-list').innerHTML = DSA_PATTERNS.map(p => {
    const pdone = p.probs.filter(pr => state.dsaSolved.has(pr.u)).length;
    const pct = Math.round(pdone / p.probs.length * 100);
    return `<div class="card" style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="font-weight:600;font-size:13px">${p.name}</span>
        <span class="badge badge-green">${pdone}/${p.probs.length}</span>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${pct}%"></div></div>
      <div style="margin-top:8px">${p.probs.map(pr => `
        <span class="prob-chip${state.dsaSolved.has(pr.u)?' solved':''}" onclick="togDSA('${pr.u}',this)">
          ${state.dsaSolved.has(pr.u)?'✓ ':''}
          <a href="${pr.u}" target="_blank" onclick="event.stopPropagation()" style="color:inherit;text-decoration:none">${pr.n}</a>
        </span>`).join('')}
      </div>
    </div>`;
  }).join('');
}

function togDSA(url, chip) {
  if (state.dsaSolved.has(url)) state.dsaSolved.delete(url);
  else state.dsaSolved.add(url);
  save();
  renderDSATracker();
  updateXP();
}

// ---- OS CONCEPTS ----
function renderOSConcepts() {
  const nav = document.getElementById('os-nav');
  nav.innerHTML = OS_CONCEPTS.map((c, i) =>
    `<button class="cnav-btn${i===0?' active':''}" onclick="selOS(${i},this)">${c.name}</button>`
  ).join('');
  showOSDetail(0);
}

function selOS(i, btn) {
  document.querySelectorAll('#os-nav .cnav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  showOSDetail(i);
}

function showOSDetail(i) {
  const c = OS_CONCEPTS[i];
  document.getElementById('os-detail').innerHTML = `
    <div class="card fade-up">
      <div style="font-family:var(--sans);font-size:1.1rem;font-weight:700;margin-bottom:12px">${c.name}</div>
      <div class="concept-row"><div class="concept-label">definition</div><div class="concept-val">${c.def}</div></div>
      <div class="concept-row"><div class="concept-label">✓ use when</div><div class="concept-val">${c.when}</div></div>
      <div class="concept-row"><div class="concept-label">✗ avoid when</div><div class="concept-val">${c.avoid}</div></div>
      <div class="concept-row"><div class="concept-label">💡 pro tip</div><div class="concept-val">${c.tip}</div></div>
      <div class="concept-row"><div class="concept-label">🎤 interview line</div><div class="concept-val" style="color:var(--green);font-style:italic">${c.interview}</div></div>
      <pre class="code-block" style="margin-top:10px">${esc(c.code)}</pre>
    </div>`;
}

// ---- DATABASE ----
function renderDB() {
  const nav = document.getElementById('db-nav');
  nav.innerHTML = DB_CONCEPTS.map((c, i) =>
    `<button class="cnav-btn${i===0?' active':''}" onclick="selDB(${i},this)">${c.name}</button>`
  ).join('');
  showDBDetail(0);
}

function selDB(i, btn) {
  document.querySelectorAll('#db-nav .cnav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  showDBDetail(i);
}

function showDBDetail(i) {
  const c = DB_CONCEPTS[i];
  document.getElementById('db-detail').innerHTML = `
    <div class="card fade-up">
      <div style="font-family:var(--sans);font-size:1.1rem;font-weight:700;margin-bottom:12px">${c.name}</div>
      <div class="concept-row"><div class="concept-label">definition</div><div class="concept-val">${c.def}</div></div>
      <div class="concept-row"><div class="concept-label">✓ use when</div><div class="concept-val">${c.when}</div></div>
      <div class="concept-row"><div class="concept-label">✗ avoid when</div><div class="concept-val">${c.avoid}</div></div>
      <div class="concept-row"><div class="concept-label">💡 pro tip</div><div class="concept-val">${c.tip}</div></div>
      <div class="concept-row"><div class="concept-label">🎤 interview line</div><div class="concept-val" style="color:var(--green);font-style:italic">${c.interview}</div></div>
      <pre class="code-block" style="margin-top:10px">${esc(c.code)}</pre>
    </div>`;
}

// ---- BOOKMARKS ----
let bookmarks = new Set(JSON.parse(localStorage.getItem('rp_bookmarks') || '[]'));
function saveBookmarks() { localStorage.setItem('rp_bookmarks', JSON.stringify([...bookmarks])); }
function bmId(section, idx) { return section + '-' + idx; }

function toggleBookmark(e, idx, section) {
  e.stopPropagation();
  const id = bmId(section, idx);
  if (bookmarks.has(id)) bookmarks.delete(id); else bookmarks.add(id);
  saveBookmarks();
  if (section === 'rust') renderRustQA(); else renderOSQA();
}

// ---- Q&A CARD BUILDER ----
const QA_FILTERS = ['All', 'Basic', 'Intermediate', 'Advanced', 'Bookmarks'];

function buildQAFilters(current, setFn) {
  return QA_FILTERS.map(f =>
    `<button class="qa-filter${current === f ? ' active' : ''}" onclick="${setFn}('${f}')">${f === 'Bookmarks' ? '🔖 ' : ''}${f}</button>`
  ).join('');
}

function buildQACard(q, origIdx, section) {
  const numStr = 'Q' + String(origIdx + 1).padStart(3, '0');
  const isBookmarked = bookmarks.has(bmId(section, origIdx));
  const diff = q.difficulty || 'Basic';
  const diffClass = 'qa-diff-' + diff.toLowerCase();
  return `
  <div class="qa-card">
    <div class="qa-header" onclick="toggleQACard(this)">
      <span class="qa-num">${numStr}</span>
      <span class="qa-question">${q.q}</span>
      <span class="qa-badge ${diffClass}">${diff}</span>
      <button class="qa-bookmark${isBookmarked ? ' bookmarked' : ''}"
              onclick="toggleBookmark(event,${origIdx},'${section}')"
              title="${isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}">🔖</button>
      <span class="qa-arrow">▼</span>
    </div>
    <div class="qa-body">
      <div class="qa-answer-label">answer</div>
      <div class="qa-answer-text">${q.a}</div>
      <pre class="code-block">${esc(q.code)}</pre>
    </div>
  </div>`;
}

function qaEmpty() {
  return '<div class="card" style="text-align:center;padding:2rem;color:var(--text3)">No questions match this filter.</div>';
}

function toggleQACard(header) {
  const card = header.closest('.qa-card');
  const wasOpen = card.classList.contains('open');
  document.querySelectorAll('.qa-card.open').forEach(c => c.classList.remove('open'));
  if (!wasOpen) card.classList.add('open');
}

// ---- RUST Q&A ----
let rustQAFilter = 'All';

function renderRustQA() {
  document.getElementById('rust-qa-cats').innerHTML = buildQAFilters(rustQAFilter, 'setRustFilter');

  let list = RUST_QA;
  if (rustQAFilter === 'Bookmarks') {
    list = RUST_QA.filter((_, i) => bookmarks.has(bmId('rust', i)));
  } else if (rustQAFilter !== 'All') {
    list = RUST_QA.filter(q => q.difficulty === rustQAFilter);
  }

  const titleTag = document.querySelector('#section-rust-qa .section-title .tag');
  if (titleTag) titleTag.textContent = list.length + ' questions';

  document.getElementById('rust-qa-list').innerHTML =
    list.length ? list.map(q => buildQACard(q, RUST_QA.indexOf(q), 'rust')).join('') : qaEmpty();
}

function setRustFilter(f) { rustQAFilter = f; renderRustQA(); }
// backward-compat alias used by search.js
function setRustCat(c) { setRustFilter(c); }

// ---- OS/DB Q&A ----
let osQAFilter = 'All';

function renderOSQA() {
  document.getElementById('osdb-qa-cats').innerHTML = buildQAFilters(osQAFilter, 'setOSFilter');

  let list = OS_QA;
  if (osQAFilter === 'Bookmarks') {
    list = OS_QA.filter((_, i) => bookmarks.has(bmId('os', i)));
  } else if (osQAFilter !== 'All') {
    list = OS_QA.filter(q => q.difficulty === osQAFilter);
  }

  const titleTag = document.querySelector('#section-os-qa .section-title .tag');
  if (titleTag) titleTag.textContent = list.length + ' questions';

  document.getElementById('osdb-qa-list').innerHTML =
    list.length ? list.map(q => buildQACard(q, OS_QA.indexOf(q), 'os')).join('') : qaEmpty();
}

function setOSFilter(f) { osQAFilter = f; renderOSQA(); }
function setOSCat(c) { setOSFilter(c); }

// ---- QUIZ ----
function renderQuiz() {
  const q = ALL_QUIZ[state.quizIdx % ALL_QUIZ.length];
  document.getElementById('quiz-card').innerHTML = `
    <div class="quiz-card">
      <div style="font-size:11px;color:var(--text3);margin-bottom:8px">
        <span class="badge badge-blue">${q.cat}</span>
        question ${state.quizIdx + 1} of ${ALL_QUIZ.length}
      </div>
      <div class="quiz-q">${q.q}</div>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        <button class="btn btn-green" onclick="revealQuiz()">reveal answer</button>
        <button class="btn" onclick="nextQuiz()">skip →</button>
      </div>
      <div class="quiz-reveal" id="quiz-reveal">
        <div style="font-size:12px;color:var(--text2);margin-bottom:8px;line-height:1.7">${q.a}</div>
        <pre class="code-block">${esc(q.code)}</pre>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-green" onclick="markQuiz(true)">✓ got it</button>
          <button class="btn" onclick="markQuiz(false)">✗ review again</button>
        </div>
      </div>
    </div>`;
}

function revealQuiz() {
  const r = document.getElementById('quiz-reveal');
  if (r) r.style.display = 'block';
  state.quizAttempt++;
  document.getElementById('quiz-attempt').textContent = state.quizAttempt;
}

function markQuiz(correct) {
  if (correct) {
    state.quizScore++;
    document.getElementById('quiz-score').textContent = state.quizScore;
  }
  const pct = Math.round(state.quizScore / Math.max(state.quizAttempt, 1) * 100);
  document.getElementById('quiz-pct').textContent = pct + '%';
  nextQuiz();
}

function nextQuiz() {
  state.quizIdx = (state.quizIdx + 1) % ALL_QUIZ.length;
  renderQuiz();
}

function shuffleQuiz() {
  for (let i = ALL_QUIZ.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ALL_QUIZ[i], ALL_QUIZ[j]] = [ALL_QUIZ[j], ALL_QUIZ[i]];
  }
  state.quizIdx = 0;
  renderQuiz();
}

// ---- STREAK ----
function renderStreak() {
  const grid = document.getElementById('streak-grid');
  grid.innerHTML = Array(30).fill(0).map((_, i) => {
    const s = state.streakDays[i];
    const cls = s === 2 ? 'done' : s === 1 ? 'partial' : '';
    return `<div class="streak-day ${cls}${i===0?' today':''}" onclick="cycleStreak(${i})" title="Day ${i+1}">${i+1}</div>`;
  }).join('');
}

function cycleStreak(i) {
  state.streakDays[i] = (state.streakDays[i] + 1) % 3;
  save();
  renderStreak();
}

// ---- SEARCH ----
function filterNav(val) {
  const v = val.toLowerCase();
  document.querySelectorAll('.nav-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = (!v || text.includes(v)) ? '' : 'none';
  });
}

// ---- UTILITY ----
function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ---- FONT SIZE ----
let fontSize = parseInt(localStorage.getItem('rp_fontSize') || '13');

function applyFontSize() {
  document.documentElement.style.setProperty('--font-size-base', fontSize + 'px');
  const display = document.getElementById('font-size-display');
  if (display) display.textContent = fontSize + 'px';
}

function adjustFontSize(delta) {
  fontSize = Math.min(18, Math.max(11, fontSize + delta));
  localStorage.setItem('rp_fontSize', fontSize);
  applyFontSize();
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  applyFontSize();
  updateXP();
});
