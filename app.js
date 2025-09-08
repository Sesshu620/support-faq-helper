"use strict";
const searchInput = document.getElementById('search');
const resultsList = document.getElementById('results');
const categorySel = document.getElementById('category');
const resultMeta = document.getElementById('result-meta');
let faqs = [];
// ===== Theme toggle =====
const root = document.documentElement; // <html>
const themeBtn = document.getElementById('themeToggle');
const themeStatus = document.getElementById('themeStatus');
// 既存のテーマ切替コードの近くに追加
const updatedAt = document.getElementById('updatedAt');
// faq.json の Last-Modified を使って更新日を表示
fetch('./faq.json?ts=' + Date.now())
    .then(res => {
    const lastModified = res.headers.get('Last-Modified');
    if (lastModified && updatedAt) {
        const formatted = new Date(lastModified).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
        updatedAt.textContent = `Updated: ${formatted}`;
    }
    return res.json();
})
    .then((data) => {
    faqs = data;
    initCategoryOptions(faqs);
    resultMeta.textContent = `${faqs.length} FAQs loaded`;
    renderList(faqs);
})
    .catch(console.error);
// 初期テーマ決定：localStorage > OS設定 > light
function getInitialTheme() {
    var _a;
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark')
        return saved;
    const prefersDark = (_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, '(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
}
function applyTheme(mode) {
    if (mode === 'dark') {
        root.setAttribute('data-theme', 'dark');
        themeBtn === null || themeBtn === void 0 ? void 0 : themeBtn.setAttribute('aria-pressed', 'true');
        themeBtn.textContent = '🌙';
        if (themeStatus)
            themeStatus.textContent = "Theme: Dark";
    }
    else {
        root.removeAttribute('data-theme'); // lightがデフォルト
        themeBtn === null || themeBtn === void 0 ? void 0 : themeBtn.setAttribute('aria-pressed', 'false');
        themeBtn.textContent = '🌞';
        if (themeStatus)
            themeStatus.textContent = "Theme: Light";
    }
}
let currentTheme = getInitialTheme();
applyTheme(currentTheme);
themeBtn === null || themeBtn === void 0 ? void 0 : themeBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
});
fetch('faq.json?ts=' + Date.now())
    .then(res => {
    if (!res.ok)
        throw new Error('Failed to load faq.json: ' + res.status);
    return res.json();
})
    .then((data) => {
    faqs = data;
    initCategoryOptions(faqs);
    resultMeta.textContent = `${faqs.length} FAQs loaded`;
    renderList(faqs);
})
    .catch(err => {
    console.error(err);
    resultMeta.textContent = 'Failed to load FAQs';
});
function initCategoryOptions(data) {
    const cats = Array.from(new Set(data.map(f => f.category || '').filter(Boolean))).sort();
    for (const c of cats) {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        categorySel.appendChild(opt);
    }
}
function applyFilters() {
    const term = searchInput.value.toLowerCase().trim();
    const cat = categorySel.value;
    const filtered = faqs.filter(f => {
        const matchesText = f.question.toLowerCase().includes(term) ||
            f.answer.toLowerCase().includes(term);
        const matchesCat = !cat || f.category === cat;
        return matchesText && matchesCat;
    });
    renderList(filtered);
    resultMeta.textContent = `${filtered.length} result${filtered.length === 1 ? '' : 's'}`;
}
searchInput.addEventListener('input', applyFilters);
categorySel.addEventListener('change', applyFilters);
window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
    }
});
function renderList(items) {
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
        const a = document.createElement('div');
        a.className = 'faq-a';
        a.innerHTML = highlight(f.answer, term);
        details.appendChild(summary);
        details.appendChild(a);
        if (f.category) {
            const cat = document.createElement('div');
            cat.className = 'faq-cat';
            cat.textContent = `#${f.category}`;
            a.appendChild(cat);
        }
        li.appendChild(details);
        resultsList.appendChild(li);
    }
}
function highlight(text, term) {
    if (!term)
        return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, `<mark>$1</mark>`);
}
// フッターの日付表示
const footer = document.querySelector('.app-footer small');
if (footer) {
    const today = new Date();
    const formatted = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    /* footer.textContent = `Updated: ${formatted} • Keyboard: / focus search`; */
}
