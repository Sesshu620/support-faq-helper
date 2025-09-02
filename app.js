"use strict";
const searchInput = document.getElementById('search');
const resultsList = document.getElementById('results');
const categorySel = document.getElementById('category');
const resultMeta = document.getElementById('result-meta');
let faqs = [];
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
    for (const f of items) {
        const li = document.createElement('li');
        li.className = 'faq-item';
        // <details> で開閉UIを作る（デフォルトは閉じる）
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.className = 'faq-q';
        summary.textContent = f.question;
        const a = document.createElement('div');
        a.className = 'faq-a';
        a.textContent = f.answer;
        details.appendChild(summary);
        details.appendChild(a);
        if (f.category) {
            const cat = document.createElement('div');
            cat.className = 'faq-cat';
            cat.textContent = `#${f.category}`;
            a.appendChild(cat); // 回答の下にバッジ
        }
        li.appendChild(details);
        resultsList.appendChild(li);
    }
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
    footer.textContent = `Updated: ${formatted} • Keyboard: / focus search`;
}
