// ============================================================
// COMPILER — compiler.js
// Uses official Rust Playground API (no backend needed)
// ============================================================

const PLAYGROUND_API   = 'https://play.rust-lang.org/execute';
const PLAYGROUND_FMT   = 'https://play.rust-lang.org/format';

const DEFAULT_CODE = `fn main() {
    // Welcome to rust-prep compiler!
    // Edit this code and press Run ▶

    let message = String::from("Hello, Rust!");
    println!("{message}");

    // Zero-cost iterator pipeline
    let sum: i32 = (1..=10)
        .filter(|x| x % 2 == 0)
        .map(|x| x * x)
        .sum();
    println!("Sum of even squares 1..10: {sum}");
}`;

const SNIPPETS = {
  'Ownership': `fn main() {
    let s1 = String::from("hello");
    let s2 = s1;        // s1 MOVED to s2
    // println!("{}", s1); // ERROR: moved
    println!("{}", s2);
}`,
  'Borrowing': `fn main() {
    let s = String::from("hello");
    let r1 = &s;
    let r2 = &s;
    println!("{} {}", r1, r2);
    // Many immutable refs — all OK
}`,
  'Closures': `fn main() {
    let nums = vec![1, 2, 3, 4, 5, 6];
    let even_squares: Vec<i32> = nums.iter()
        .filter(|&&x| x % 2 == 0)
        .map(|&x| x * x)
        .collect();
    println!("{:?}", even_squares);
}`,
  'Threads': `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    for _ in 0..5 {
        let c = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            *c.lock().unwrap() += 1;
        }));
    }
    for h in handles { h.join().unwrap(); }
    println!("Result: {}", *counter.lock().unwrap());
}`,
  'Option': `fn find(id: u32) -> Option<String> {
    if id == 1 { Some("Alice".to_string()) }
    else { None }
}
fn main() {
    match find(1) {
        Some(name) => println!("Found: {name}"),
        None       => println!("Not found"),
    }
    let result = find(2).unwrap_or("Guest".into());
    println!("{result}");
}`,
  'Result': `fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 { Err("division by zero".into()) }
    else        { Ok(a / b) }
}
fn main() {
    match divide(10.0, 2.0) {
        Ok(v)  => println!("Result: {v}"),
        Err(e) => println!("Error: {e}"),
    }
}`,
  'Iterators': `fn main() {
    let words = vec!["hello", "world", "rust"];
    let upper: Vec<String> = words.iter()
        .filter(|w| w.len() > 4)
        .map(|w| w.to_uppercase())
        .collect();
    println!("{:?}", upper);
}`,
  'Structs': `#[derive(Debug)]
struct Point { x: f64, y: f64 }

impl Point {
    fn new(x: f64, y: f64) -> Self { Self { x, y } }
    fn distance(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }
}

fn main() {
    let p1 = Point::new(0.0, 0.0);
    let p2 = Point::new(3.0, 4.0);
    println!("Distance: {}", p1.distance(&p2));
}`,
};

// ---- HELPERS ----
const el = id => document.getElementById(id);

function setStatus(msg, type) {
  const s = el('compiler-status');
  if (!s) return;
  s.textContent = msg;
  s.className = 'compiler-status' + (type ? ' ' + type : '');
}

function updateLineNumbers() {
  const editor = el('code-editor');
  const lineNums = el('line-numbers');
  if (!editor || !lineNums) return;
  const count = editor.value.split('\n').length;
  lineNums.textContent = Array.from({ length: count }, (_, i) => i + 1).join('\n');
  lineNums.scrollTop = editor.scrollTop;
}

// ---- API CALLS ----
async function runCode() {
  const editor = el('code-editor');
  const outputEl = el('output-content');
  if (!editor || !outputEl) return;

  const code = editor.value.trim();
  if (!code) return;

  const channel = el('compiler-channel')?.value || 'stable';
  const edition  = el('compiler-edition')?.value  || '2021';

  setStatus('⟳ Compiling...', 'running');
  outputEl.className = 'output-content';
  outputEl.textContent = '// Compiling...';

  try {
    const resp = await fetch(PLAYGROUND_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel, edition,
        mode: 'debug',
        crateType: 'bin',
        tests: false,
        code,
        backtrace: false,
      }),
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
    const data = await resp.json();

    if (data.success) {
      outputEl.textContent = data.stdout || '(no output)';
      outputEl.className = 'output-content success';
      setStatus('✓ Compiled & ran', 'success');
    } else {
      const err = [data.stderr, data.stdout].filter(Boolean).join('\n').trim();
      outputEl.textContent = err || 'Compilation failed (no error output)';
      outputEl.className = 'output-content error';
      setStatus('✗ Compile error', 'error');
    }
  } catch (e) {
    outputEl.textContent = `Network error: ${e.message}\n\nCheck your internet connection.\nThe Rust Playground API at play.rust-lang.org must be reachable.`;
    outputEl.className = 'output-content error';
    setStatus('✗ Network error', 'error');
  }
}

async function formatCode() {
  const editor = el('code-editor');
  if (!editor) return;
  const channel = el('compiler-channel')?.value || 'stable';
  const edition  = el('compiler-edition')?.value  || '2021';

  setStatus('⟳ Formatting...', 'running');
  try {
    const resp = await fetch(PLAYGROUND_FMT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, edition, code: editor.value }),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    if (data.success && data.code) {
      editor.value = data.code;
      updateLineNumbers();
      setStatus('✓ Formatted', 'success');
    } else {
      setStatus('✗ Format failed', 'error');
    }
  } catch (e) {
    setStatus('✗ Network error', 'error');
  }
}

// ---- EDITOR ACTIONS ----
function clearEditor() {
  const editor = el('code-editor');
  const outputEl = el('output-content');
  if (editor) { editor.value = ''; updateLineNumbers(); editor.focus(); }
  if (outputEl) { outputEl.textContent = '// Press ▶ Run to execute your code'; outputEl.className = 'output-content'; }
  setStatus('');
}

function copyCode() {
  const editor = el('code-editor');
  if (!editor) return;
  navigator.clipboard.writeText(editor.value).then(() => {
    setStatus('✓ Copied to clipboard', 'success');
    setTimeout(() => setStatus(''), 1800);
  }).catch(() => {
    setStatus('✗ Copy failed', 'error');
  });
}

function loadSnippet(name) {
  const editor = el('code-editor');
  if (!editor || !SNIPPETS[name]) return;
  editor.value = SNIPPETS[name];
  updateLineNumbers();
  editor.focus();
  el('output-content').textContent = '// Press ▶ Run to execute your code';
  el('output-content').className = 'output-content';
  setStatus('');
}

// ---- INIT ----
function initCompiler() {
  const editor = el('code-editor');
  if (!editor || editor.dataset.inited) return;
  editor.dataset.inited = '1';

  editor.value = DEFAULT_CODE;
  updateLineNumbers();

  // Tab → 4 spaces
  editor.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.slice(0, s) + '    ' + editor.value.slice(end);
      editor.selectionStart = editor.selectionEnd = s + 4;
    }
    // Ctrl+Enter → Run
    if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); runCode(); }
  });

  editor.addEventListener('input', updateLineNumbers);
  editor.addEventListener('scroll', () => {
    const ln = el('line-numbers');
    if (ln) ln.scrollTop = editor.scrollTop;
  });

  // Build snippets bar
  const list = el('snippets-list');
  if (list) {
    list.innerHTML = Object.keys(SNIPPETS).map(name =>
      `<button class="snippet-btn" onclick="loadSnippet('${name}')">${name}</button>`
    ).join('');
  }
}
