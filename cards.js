// cards.js - 完全にクリーンなバージョン
(function () {
  'use strict';
  
  console.log('[cards.js] Starting initialization...');
  
  // 多重初期化ガード
  if (window.__CARDS_JS_LOADED) {
    console.warn('[cards.js] Already loaded, skipping...');
    return;
  }
  window.__CARDS_JS_LOADED = true;

  // render関数を定義
  function render() {
    console.log('[render] Called');
    console.log('[render] window.CARDS:', window.CARDS);
    console.log('[render] typeof window.CARDS:', typeof window.CARDS);
    console.log('[render] Array.isArray(window.CARDS):', Array.isArray(window.CARDS));
    
    // データを安全に取得
    const data = (Array.isArray(window.CARDS) && window.CARDS.length > 0) ? window.CARDS : [];
    
    console.log('[render] Processing data, length:', data.length);
    
    if (data.length === 0) {
      console.warn('[render] No data available');
      return;
    }

    // テーブルの tbody を取得
    const tbody = document.getElementById('tbody');
    if (!tbody) {
      console.error('[render] tbody element not found');
      return;
    }

    console.log('[render] Rendering to tbody...');
    
    // テーブル行を生成
    const rows = data.map((card, index) => {
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${card.name || ''}</td>
          <td>${card.network || ''}</td>
          <td>${card.rewardsRate || 0}%</td>
          <td>${card.fxFee || 0}%</td>
          <td>$${card.atmFee || 0}</td>
          <td>$${card.monthlyFee || 0}</td>
          <td>${card.stakingRequired ? 'Yes' : 'No'}</td>
          <td>${Array.isArray(card.regions) ? card.regions.join(', ') : (card.regions || '')}</td>
          <td>${card.rewardsRate || 0}</td>
          <td>${card.docsUrl ? `<a href="${card.docsUrl}" target="_blank" rel="noopener">View</a>` : ''}</td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rows;
    console.log('[render] Successfully rendered', data.length, 'cards');
  }

  // グローバルに公開
  window.render = render;
  
  console.log('[cards.js] Initialization complete. render function available.');
})(); 




