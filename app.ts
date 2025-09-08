// ===== Theme toggle =====
const root = document.documentElement; // <html>
const themeBtn = document.getElementById('themeToggle') as HTMLButtonElement;
const themeStatus = document.getElementById('themeStatus') as HTMLSpanElement;

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved as 'light' | 'dark';
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function applyTheme(mode: 'light' | 'dark') {
  if (mode === 'dark') {
    root.setAttribute('data-theme', 'dark');
    themeBtn?.setAttribute('aria-pressed', 'true');
    if (themeBtn) themeBtn.textContent = '🌙';
    if (themeStatus) themeStatus.textContent = 'Theme: Dark';
  } else {
    root.removeAttribute('data-theme'); // light as default
    themeBtn?.setAttribute('aria-pressed', 'false');
    if (themeBtn) themeBtn.textContent = '🌞';
    if (themeStatus) themeStatus.textContent = 'Theme: Light';
  }
}

let currentTheme: 'light' | 'dark' = getInitialTheme();
applyTheme(currentTheme);

themeBtn?.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
  localStorage.setItem('theme', currentTheme);
});

// ===== App main =====
interface FAQItem { question: string; answer: string; category?: string; }

const searchInput  = document.getElementById('search')  as HTMLInputElement;
const resultsList  = document.getElementById('results') as HTMLUListElement;
const categorySel  = document.getElementById('category') as HTMLSelectElement;
const resultMeta   = document.getElementById('result-meta') as HTMLDivElement;
const updatedAt    = document.getElementById('updatedAt') as HTMLSpanElement;

let faqs: FAQItem[] = [];

// fetch faq.json and set Updated date from Last-Modified header
fetch('./faq.json?ts=' + Date.now())
  .then(res => {
    const lm = res.headers.get('Last-Modified');
    if (lm && updatedAt) {
      const formatted = new Date(lm).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
      updatedAt.textContent = `Updated: ${formatted}`;
    }
    return res.json();
  })
  .then((data: FAQItem[]) => {
    faqs = data;
    initCategoryOptions(faqs);
    resultMeta.textContent = `${faqs.length} FAQs loaded`;
    renderList(faqs);
  })
  .catch(err => {
    console.error(err);
    resultMeta.textContent = 'Failed to load FAQs';
  });

function initCategoryOptions(data: FAQItem[]) {
  const cats = Array.from(new Set(
    data.map(f => f.category || '').filter(Boolean)
  )).sort();
  for (const c of cats) {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    categorySel.appendChild(opt);
  }
}

function applyFilters() {
  const term = searchInput.value.toLowerCase().trim();
  const cat  = categorySel.value;

  const filtered = faqs.filter(f => {
    const tQ = f.question.toLowerCase();
    const tA = f.answer.toLowerCase();
    const matchesText = !term || tQ.includes(term) || tA.includes(term);
    const matchesCat  = !cat || f.category === cat;
    return matchesText && matchesCat;
  });

  renderList(filtered);
  resultMeta.textContent = `${filtered.length} result${filtered.length === 1 ? '' : 's'}`;
}

searchInput.addEventListener('input', applyFilters);
categorySel.addEventListener('change', applyFilters);
window.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault(); searchInput.focus();
  }
});

function highlight(text: string, term: string): string {
  if (!term) return text;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function renderList(items: FAQItem[]) {
  resultsList.innerHTML = '';
  if (!items.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'No results. Try a different keyword or switch category.';
    resultsList.appendChild(li);
    return;
  }

  const term = searchInput.value.toLowerCase().trim();

  for (const f of items) {
    const li = document.createElement('li');
    li.className = 'faq-item';

    const details = document.createElement('details');

    const summary = document.createElement('summary');
    summary.className = 'faq-q';
    summary.innerHTML = highlight(f.question, term);

    // Category badge on the question line (always visible)
    if (f.category) {
      const badge = document.createElement('span');
      badge.className = 'faq-cat';
      (badge as any).dataset.cat = f.category; // for CSS color mapping
      badge.textContent = ` #${f.category}`;
      summary.appendChild(badge);
    }

    const a = document.createElement('div');
    a.className = 'faq-a';
    a.innerHTML = highlight(f.answer, term);

    details.appendChild(summary);
    details.appendChild(a);
    li.appendChild(details);
    resultsList.appendChild(li);
  }
}
