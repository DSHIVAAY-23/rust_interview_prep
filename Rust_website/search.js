// ============================================================
// GLOBAL SEARCH — search.js
// Searches across all content: concepts, programs, DSA, Q&A, OS, DB
// Keyboard: Ctrl+K or / to focus, Escape to close
// ============================================================

let searchIndex = [];
let searchTimeout = null;

function buildSearchIndex() {
  const index = [];

  if (typeof CONCEPTS !== 'undefined') {
    CONCEPTS.forEach((c, i) => {
      index.push({
        type: 'CONCEPTS',
        label: c.name,
        sub: c.tip.slice(0, 80),
        searchText: [c.name, c.when, c.avoid, c.tip, c.interview].join(' ').toLowerCase(),
        action: () => {
          showSection('concepts');
          setTimeout(() => {
            const btn = document.querySelectorAll('#concept-nav .cnav-btn')[i];
            selConcept(i, btn || null);
            if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 90);
        },
      });
    });
  }

  if (typeof PROGRAMS !== 'undefined') {
    PROGRAMS.forEach((p, i) => {
      index.push({
        type: 'PROGRAMS',
        label: p.title,
        sub: p.cats.join(' · '),
        searchText: [p.title, ...p.cats].join(' ').toLowerCase(),
        action: () => {
          showSection('programs');
          setTimeout(() => {
            const items = document.querySelectorAll('#prog-list .check-item');
            if (items[i]) items[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 110);
        },
      });
    });
  }

  if (typeof DSA_PATTERNS !== 'undefined') {
    DSA_PATTERNS.forEach(pat => {
      pat.probs.forEach(prob => {
        index.push({
          type: 'DSA PROBLEMS',
          label: prob.n,
          sub: pat.name,
          url: prob.u,
          searchText: [prob.n, pat.name].join(' ').toLowerCase(),
          action: () => {
            showSection('dsa-tracker');
            setTimeout(() => {
              const chip = Array.from(document.querySelectorAll('.prob-chip'))
                .find(c => c.textContent.trim().includes(prob.n));
              if (chip) chip.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 110);
          },
        });
      });
    });
  }

  if (typeof RUST_QA !== 'undefined') {
    RUST_QA.forEach((q, i) => {
      index.push({
        type: 'RUST Q&A',
        label: q.q,
        sub: q.cat,
        searchText: [q.q, q.a, q.cat].join(' ').toLowerCase(),
        action: () => {
          showSection('rust-qa');
          setTimeout(() => {
            rustQAFilter = 'All'; renderRustQA();
            setTimeout(() => {
              const headers = document.querySelectorAll('#rust-qa-list .acc-header');
              if (headers[i]) {
                if (!headers[i].classList.contains('open')) toggleAcc(headers[i]);
                headers[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 60);
          }, 90);
        },
      });
    });
  }

  if (typeof OS_QA !== 'undefined') {
    OS_QA.forEach((q, i) => {
      index.push({
        type: 'OS / DB Q&A',
        label: q.q,
        sub: q.cat,
        searchText: [q.q, q.a, q.cat].join(' ').toLowerCase(),
        action: () => {
          showSection('os-qa');
          setTimeout(() => {
            osQAFilter = 'All'; renderOSQA();
            setTimeout(() => {
              const headers = document.querySelectorAll('#osdb-qa-list .acc-header');
              if (headers[i]) {
                if (!headers[i].classList.contains('open')) toggleAcc(headers[i]);
                headers[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 60);
          }, 90);
        },
      });
    });
  }

  if (typeof OS_CONCEPTS !== 'undefined') {
    OS_CONCEPTS.forEach((c, i) => {
      index.push({
        type: 'OS CONCEPTS',
        label: c.name,
        sub: c.def.slice(0, 80),
        searchText: [c.name, c.def, c.when, c.avoid, c.tip].join(' ').toLowerCase(),
        action: () => {
          showSection('os-concepts');
          setTimeout(() => {
            const btn = document.querySelectorAll('#os-nav .cnav-btn')[i];
            selOS(i, btn || null);
            if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 90);
        },
      });
    });
  }

  if (typeof DB_CONCEPTS !== 'undefined') {
    DB_CONCEPTS.forEach((c, i) => {
      index.push({
        type: 'DB CONCEPTS',
        label: c.name,
        sub: c.def.slice(0, 80),
        searchText: [c.name, c.def, c.when, c.avoid, c.tip].join(' ').toLowerCase(),
        action: () => {
          showSection('database');
          setTimeout(() => {
            const btn = document.querySelectorAll('#db-nav .cnav-btn')[i];
            selDB(i, btn || null);
            if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 90);
        },
      });
    });
  }

  return index;
}

function runSearch(query) {
  if (!query || query.trim().length < 2) { closeSearch(); return; }
  const q = query.toLowerCase().trim();
  const grouped = {};
  searchIndex.forEach(item => {
    if (item.searchText.includes(q)) {
      if (!grouped[item.type]) grouped[item.type] = [];
      grouped[item.type].push(item);
    }
  });
  renderSearchResults(grouped, q);
}

function renderSearchResults(grouped, query) {
  const container = document.getElementById('search-results');
  if (!container) return;
  container.innerHTML = '';

  const entries = Object.entries(grouped);
  if (entries.length === 0) {
    container.innerHTML = `<div class="sr-empty">No results for "<strong>${escHtml(query)}</strong>"</div>`;
    container.classList.add('open');
    return;
  }

  entries.forEach(([type, items]) => {
    const group = document.createElement('div');
    group.className = 'sr-group';
    group.innerHTML = `<div class="sr-group-label">${type} <span class="sr-count">${items.length}</span></div>`;

    items.slice(0, 6).forEach(item => {
      const el = document.createElement('div');
      el.className = 'sr-item';
      el.innerHTML = `
        <span class="sr-dot">•</span>
        <div class="sr-content">
          <div class="sr-label">${highlightMatch(item.label, query)}</div>
          ${item.sub ? `<div class="sr-sub">${escHtml(item.sub)}</div>` : ''}
        </div>
        ${item.url ? `<a href="${item.url}" target="_blank" class="sr-ext" onclick="event.stopPropagation()" title="Open on LeetCode/GFG">↗</a>` : ''}`;
      el.addEventListener('click', () => {
        closeSearch();
        document.getElementById('global-search-input').value = '';
        item.action();
      });
      group.appendChild(el);
    });

    container.appendChild(group);
  });

  container.classList.add('open');
}

function highlightMatch(text, query) {
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return escHtml(text);
  return escHtml(text.slice(0, idx)) +
    '<mark class="sr-highlight">' + escHtml(text.slice(idx, idx + query.length)) + '</mark>' +
    escHtml(text.slice(idx + query.length));
}

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function closeSearch() {
  const c = document.getElementById('search-results');
  if (c) c.classList.remove('open');
}

function initSearch() {
  searchIndex = buildSearchIndex();

  const input = document.getElementById('global-search-input');
  if (!input) return;

  input.addEventListener('input', e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => runSearch(e.target.value), 150);
  });

  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) runSearch(input.value);
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#global-search-wrap')) closeSearch();
  });

  document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA';

    if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !typing)) {
      e.preventDefault();
      input.focus();
      input.select();
    }
    if (e.key === 'Escape') {
      closeSearch();
      input.blur();
    }
  });
}

document.addEventListener('DOMContentLoaded', initSearch);
