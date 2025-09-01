"use strict";
const searchInput = document.getElementById('search');
const resultsList = document.getElementById('results');
const categorySel = document.getElementById('category');
let faqs = [];
fetch('faq.json?ts=' + Date.now())
    .then(res => res.json())
    .then((data) => {
    faqs = data;
    initCategoryOptions(data);
    renderList(data);
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
        const matchesCat = !cat || (f.category === cat);
        return matchesText && matchesCat;
    });
    renderList(filtered);
}
searchInput.addEventListener('input', applyFilters);
categorySel.addEventListener('change', applyFilters);
function renderList(items) {
    if (!items.length) {
        resultsList.innerHTML = '<li>No results</li>';
        return;
    }
    resultsList.innerHTML = items.map(f => `
    <li class="faq-item">
      <div class="faq-q">${f.question}</div>
      <div class="faq-a">${f.answer}</div>
      ${f.category ? `<div class="faq-cat">#${f.category}</div>` : ''}
    </li>
  `).join('');
}
