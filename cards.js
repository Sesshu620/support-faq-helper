// cards.js
const WEIGHTS = { rewards:0.45, fees:0.35, availability:0.15, convenience:0.05 };

function score(c){
  const rewardsScore = c.rewardsRate;
  const feeScore = Math.max(0, 100 - (c.fxFee*20 + c.atmFee*10 + c.monthlyFee*15));
  const availability = Math.min(100, c.regions.length * 20);
  const convenience = 100 - (c.stakingRequired ? 30 : 0);
  return Math.round(
    rewardsScore*WEIGHTS.rewards +
    feeScore*WEIGHTS.fees +
    availability*WEIGHTS.availability +
    convenience*WEIGHTS.convenience
  );
}

const qEl       = document.getElementById("q");
const regionEl  = document.getElementById("region");
const sortEl    = document.getElementById("sort");
const tbody     = document.getElementById("tbody");
const meta      = document.getElementById("meta");
const updatedAt = document.getElementById("updatedAt");

// 重要：window.CARDS から受け取る（新しく作らない）
const CARDS = window.CARDS || [];
console.log("cards.js sees:", Array.isArray(CARDS) ? CARDS.length : CARDS);

function render(){
  if (!Array.isArray(CARDS) || CARDS.length === 0) {
    tbody.innerHTML = "";
    meta.textContent = "0 card(s) · No data loaded";
    updatedAt.textContent = "Updated: —";
    return;
  }
  const q = (qEl?.value || "").toLowerCase().trim();
  const region = regionEl?.value || "";

  let rows = CARDS.map(c => ({...c, _score: score(c)}))
    .filter(c => (!q || (c.name + " " + c.issuer + " " + c.network).toLowerCase().includes(q)) &&
                 (!region || c.regions.includes(region)));

  const [key, dir] = (sortEl?.value || "score:desc").split(":");
  rows.sort((a,b)=>{
    const va = key==="rewards" ? a.rewardsRate : (a[key] ?? a._score);
    const vb = key==="rewards" ? b.rewardsRate : (b[key] ?? b._score);
    return dir==="asc" ? (va - vb) : (vb - va);
  });

  tbody.innerHTML = "";
  rows.forEach((c, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="rank">${i+1}</td>
      <td>${c.name}<br><small>${c.issuer}</small></td>
      <td><span class="badge b-slate">${c.network}</span></td>
      <td>${c.rewardsRate}%</td>
      <td>${c.fxFee}%</td>
      <td>$${c.atmFee}</td>
      <td>$${c.monthlyFee}</td>
      <td>${c.stakingRequired ? '<span class="badge b-amber">Yes</span>' : '<span class="badge b-green">No</span>'}</td>
      <td>${c.regions.join(", ")}</td>
      <td><span class="badge b-green">${c._score}</span></td>
      <td><a href="${c.docsUrl}" target="_blank" rel="noreferrer">Official</a></td>
    `;
    tbody.appendChild(tr);
  });

  meta.textContent = `${rows.length} card(s) · Sorted by ${key} (${dir})`;
  updatedAt.textContent = "Updated: " + new Date().toISOString().slice(0,10);
}

[qEl, regionEl, sortEl].forEach(el => el && el.addEventListener("input", render));
render();



