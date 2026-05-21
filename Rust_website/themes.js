// ============================================================
// THEMES — 8 themes for rust-prep
// localStorage key: rp_theme
// ============================================================

const THEMES = {
  'Dark': {
    '--bg': '#0a0a0a', '--bg2': '#111111', '--bg3': '#1a1a1a', '--bg4': '#222222',
    '--text': '#e8e8e8', '--text2': '#999999', '--text3': '#666666',
    '--accent': '#00ff88', '--green': '#00ff88', '--green2': '#00cc6a',
    '--green-dim': 'rgba(0,255,136,0.08)', '--green-dim2': 'rgba(0,255,136,0.15)',
    '--border': '#2a2a2a', '--border2': '#333333', '--code-bg': '#000000',
  },
  'Light': {
    '--bg': '#f8f8f2', '--bg2': '#ffffff', '--bg3': '#f0f0f0', '--bg4': '#e8e8e8',
    '--text': '#282a36', '--text2': '#44475a', '--text3': '#888888',
    '--accent': '#6272a4', '--green': '#6272a4', '--green2': '#4e5a8a',
    '--green-dim': 'rgba(98,114,164,0.08)', '--green-dim2': 'rgba(98,114,164,0.15)',
    '--border': '#e0e0e0', '--border2': '#cccccc', '--code-bg': '#f5f5f5',
  },
  'Tokyo Storm': {
    '--bg': '#1a1b26', '--bg2': '#16161e', '--bg3': '#1f2335', '--bg4': '#24283b',
    '--text': '#c0caf5', '--text2': '#a9b1d6', '--text3': '#565f89',
    '--accent': '#7aa2f7', '--green': '#7aa2f7', '--green2': '#5a82d7',
    '--green-dim': 'rgba(122,162,247,0.08)', '--green-dim2': 'rgba(122,162,247,0.15)',
    '--border': '#292e42', '--border2': '#3b4261', '--code-bg': '#13141f',
  },
  'Catppuccin': {
    '--bg': '#1e1e2e', '--bg2': '#181825', '--bg3': '#313244', '--bg4': '#45475a',
    '--text': '#cdd6f4', '--text2': '#bac2de', '--text3': '#6c7086',
    '--accent': '#cba6f7', '--green': '#cba6f7', '--green2': '#ab86d7',
    '--green-dim': 'rgba(203,166,247,0.08)', '--green-dim2': 'rgba(203,166,247,0.15)',
    '--border': '#45475a', '--border2': '#585b70', '--code-bg': '#11111b',
  },
  'One Dark': {
    '--bg': '#282c34', '--bg2': '#21252b', '--bg3': '#2c313a', '--bg4': '#333842',
    '--text': '#abb2bf', '--text2': '#9099a8', '--text3': '#5c6370',
    '--accent': '#61afef', '--green': '#61afef', '--green2': '#4191cf',
    '--green-dim': 'rgba(97,175,239,0.08)', '--green-dim2': 'rgba(97,175,239,0.15)',
    '--border': '#3e4451', '--border2': '#4b5263', '--code-bg': '#1d1f23',
  },
  'Monokai': {
    '--bg': '#272822', '--bg2': '#1e1f1c', '--bg3': '#3e3d32', '--bg4': '#49483e',
    '--text': '#f8f8f2', '--text2': '#cfcfc2', '--text3': '#75715e',
    '--accent': '#a6e22e', '--green': '#a6e22e', '--green2': '#86c20e',
    '--green-dim': 'rgba(166,226,46,0.08)', '--green-dim2': 'rgba(166,226,46,0.15)',
    '--border': '#49483e', '--border2': '#75715e', '--code-bg': '#1a1a17',
  },
  'Dracula': {
    '--bg': '#282a36', '--bg2': '#1e1f29', '--bg3': '#44475a', '--bg4': '#4f5266',
    '--text': '#f8f8f2', '--text2': '#e0e0f0', '--text3': '#6272a4',
    '--accent': '#bd93f9', '--green': '#bd93f9', '--green2': '#9d73d9',
    '--green-dim': 'rgba(189,147,249,0.08)', '--green-dim2': 'rgba(189,147,249,0.15)',
    '--border': '#44475a', '--border2': '#6272a4', '--code-bg': '#1a1b24',
  },
  'Solarized': {
    '--bg': '#002b36', '--bg2': '#073642', '--bg3': '#094555', '--bg4': '#0a4a5c',
    '--text': '#839496', '--text2': '#657b83', '--text3': '#4a6270',
    '--accent': '#2aa198', '--green': '#2aa198', '--green2': '#0a8178',
    '--green-dim': 'rgba(42,161,152,0.08)', '--green-dim2': 'rgba(42,161,152,0.15)',
    '--border': '#073642', '--border2': '#094555', '--code-bg': '#001f27',
  },
};

const THEME_NAMES = Object.keys(THEMES);
let currentTheme = localStorage.getItem('rp_theme') || 'Dark';

function applyTheme(name) {
  if (!THEMES[name]) name = 'Dark';
  currentTheme = name;
  const root = document.documentElement;
  Object.entries(THEMES[name]).forEach(([k, v]) => root.style.setProperty(k, v));
  localStorage.setItem('rp_theme', name);

  const nameEl = document.getElementById('theme-name');
  if (nameEl) nameEl.textContent = name;

  document.querySelectorAll('.theme-option').forEach(el => {
    el.classList.toggle('active', el.dataset.theme === name);
  });
}

function toggleThemeMenu() {
  const menu = document.getElementById('theme-menu');
  if (menu) menu.classList.toggle('open');
}

function closeThemeMenu() {
  const menu = document.getElementById('theme-menu');
  if (menu) menu.classList.remove('open');
}

function initThemes() {
  const menu = document.getElementById('theme-menu');
  if (menu) {
    menu.innerHTML = THEME_NAMES.map(name => {
      const accent = THEMES[name]['--accent'];
      return `<div class="theme-option" data-theme="${name}"
                   onclick="applyTheme('${name}');closeThemeMenu()">
        <span class="theme-dot" style="background:${accent}"></span>
        <span>${name}</span>
      </div>`;
    }).join('');
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('#theme-switcher')) closeThemeMenu();
  });

  applyTheme(currentTheme);
}

document.addEventListener('DOMContentLoaded', initThemes);
