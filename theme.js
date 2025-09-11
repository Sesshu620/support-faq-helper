// theme.js (final, resilient)
(function () {
  const THEME_KEY = 'theme';

  // Run after DOM is ready even if this script is in <head>
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  function init() {
    const root = document.documentElement;
    const btn  = document.getElementById('themeToggle');
    if (!btn) { console.warn('[theme] #themeToggle not found'); return; }

    // Initial theme: saved > system > light
    const media   = window.matchMedia('(prefers-color-scheme: dark)');
    const saved   = safeGet(THEME_KEY);
    const initial = saved || (media.matches ? 'dark' : 'light');
    applyTheme(initial, false);

    // Bind exactly once (avoid duplicate listeners)
    if (!btn.dataset.bound) {
      btn.addEventListener('click', () => {
        const cur  = root.getAttribute('data-theme') || 'light';
        const next = (cur === 'dark') ? 'light' : 'dark';
        applyTheme(next, true);
      }, { passive: true });
      btn.dataset.bound = '1';
    }

    // Follow system changes only if user hasn't chosen explicitly
    let userSet = !!saved;
    media.addEventListener('change', e => {
      if (!userSet) applyTheme(e.matches ? 'dark' : 'light', false);
    });

    function applyTheme(theme, persist) {
      root.setAttribute('data-theme', theme);                 // switch theme
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false'); // a11y

      // Fallback: if CSS pseudo isn't loaded, ensure an emoji is visible
      const icon = btn.querySelector('.theme-emoji');
      if (icon && !getComputedStyle(icon, '::before').getPropertyValue('content')) {
        icon.textContent = (theme === 'dark') ? '🌙' : '🌞';
      }

      if (persist) { safeSet(THEME_KEY, theme); userSet = true; }
    }
  }

  function safeGet(k){ try { return localStorage.getItem(k); } catch { return null; } }
  function safeSet(k,v){ try { localStorage.setItem(k,v); } catch {} }
})();



