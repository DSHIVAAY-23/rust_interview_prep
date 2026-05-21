# rust-prep v2

> Production-quality Rust interview prep system — themes, live compiler, global search, Q&A bookmarks.  
> Built by Divyank Rai — [DSHIVAAY-23](https://github.com/DSHIVAAY-23)

## Live site
`https://DSHIVAAY-23.github.io/rust-prep`

---

## What's inside

| Section | Content |
| --- | --- |
| Memory Model | The 3 rules — read/mutate/own mapped across all Rust concepts |
| 12 Concepts | Ownership, Borrowing, Lifetimes, Traits, Generics, Box, Option, Result, Iterators, Concurrency, Async, Unsafe |
| 15 Programs | Struct+impl, Generics, Box LinkedList, Binary Tree, Iterators, `Arc<Mutex<T>>`, channels, lifetimes, closures |
| DSA Tracker | 115+ problems across 10 patterns — with progress tracking |
| OS Concepts | Process/Thread/Task, parallelism, scheduling, cache locality, sync primitives |
| Databases | ACID, indexes, N+1, connection pooling, CAP theorem |
| Rust Q&A | 10 questions · Basic / Intermediate / Advanced · bookmarks |
| OS/DB Q&A | 6 systems questions · bookmarks |
| Quiz Mode | 16 shuffled questions with score tracking |
| 30-Day Streak | Daily progress calendar |
| **Compiler** | Live Rust Playground — run, format, 8 snippets, Ctrl+Enter |

## v2 Features

| Feature | Detail |
| --- | --- |
| 8 Themes | Dark · Light · Tokyo Storm · Catppuccin · One Dark · Monokai · Dracula · Solarized — saved to localStorage |
| Global Search | Searches all content — Ctrl+K or / to focus, grouped results dropdown |
| Live Compiler | Rust Playground API · channel (stable/beta/nightly) · edition (2021/2018/2015) |
| Q&A Upgrade | Numbered cards · difficulty badges · bookmark system · filter tabs |
| Font Controls | A− / A+ in topbar · 11px–18px · saved to localStorage |

---

## Deploy to GitHub Pages

### Option A — Automated (recommended)

```bash
cd Rust_website
chmod +x deploy.sh
./deploy.sh
```

Then: GitHub repo → **Settings → Pages → Branch: main → / (root) → Save**

### Option B — GitHub Actions (auto-deploys on every push)

The `.github/workflows/pages.yml` file is already included. After you push:

1. Go to your repo → **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Every `git push` to `main` will auto-deploy

### Option C — Manual upload

1. Create a new **public** repo named `rust-prep` on GitHub
2. Upload all files from `Rust_website/`
3. Settings → Pages → Branch: main → / (root) → Save
4. Wait ~2 minutes → visit `https://DSHIVAAY-23.github.io/rust-prep`

---

## Local development

```bash
# No build step — just open in browser
open index.html

# Or serve locally (needed for fetch API / compiler)
python3 -m http.server 8080
# then visit http://localhost:8080
```

> **Note:** The Rust compiler uses `fetch()` to call `play.rust-lang.org`. Open via a local server (not `file://`) to avoid CORS issues.

---

## File structure

```
Rust_website/
├── index.html          # Layout, CSS, all section HTML
├── data.js             # All content: CONCEPTS, PROGRAMS, DSA_PATTERNS, OS/DB concepts, Q&A
├── app.js              # Navigation, state, renderers, quiz, streak, font size
├── themes.js           # 8 theme definitions + switcher logic
├── search.js           # Global search index + dropdown
├── compiler.js         # Rust Playground API wrapper + snippets
├── deploy.sh           # One-command deploy to GitHub Pages
├── .github/
│   └── workflows/
│       └── pages.yml   # Auto-deploy on push to main
└── README.md
```

## localStorage keys (all prefixed `rp_`)

| Key | Purpose |
| --- | --- |
| `rp_theme` | Selected theme name |
| `rp_fontSize` | Font size (11–18px) |
| `rp_bookmarks` | Bookmarked Q&A question IDs |
| `prog` | Completed programs (Set) |
| `dsa` | Solved DSA problems (Set) |
| `streak` | 30-day streak array |

## Customizing content

All content lives in `data.js`. To add:

- **New concept**: append to `CONCEPTS` array
- **New program**: append to `PROGRAMS` array
- **New DSA problem**: append to relevant pattern in `DSA_PATTERNS`
- **New Q&A**: append to `RUST_QA` or `OS_QA` — add `difficulty: 'Basic'|'Intermediate'|'Advanced'`

Progress and preferences survive page refresh via localStorage.
