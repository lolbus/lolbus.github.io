/* Site behaviour: tabs, show-all toggles, image lightbox, video search/play, anchor highlight.
   Everything degrades to plain stacked content when JavaScript is off. */
(function () {
  'use strict';

  /* ---------- Tabs (WAI-ARIA tabs pattern) ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t, false); });
      t.addEventListener('keydown', function (e) {
        var j = null;
        if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = tabs.length - 1;
        if (j !== null) { e.preventDefault(); select(tabs[j], true); }
      });
    });
    select(tabs[0], false);
  });

  /* ---------- Show all / show fewer ---------- */
  document.querySelectorAll('[data-collapse-toggle]').forEach(function (btn) {
    var list = document.getElementById(btn.getAttribute('aria-controls'));
    if (!list) return;
    btn.addEventListener('click', function () {
      var collapsed = list.classList.toggle('is-collapsed');
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      btn.textContent = collapsed ? btn.dataset.more : btn.dataset.less;
    });
  });

  /* ---------- Lightbox ---------- */
  var dlg = document.getElementById('lightbox');
  if (dlg && typeof dlg.showModal === 'function') {
    var img = dlg.querySelector('.lightbox__img');
    var cap = dlg.querySelector('.lightbox__caption');
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-lightbox]');
      if (!a) return;
      e.preventDefault();
      img.src = a.getAttribute('href');
      img.alt = a.dataset.caption || '';
      cap.textContent = a.dataset.caption || '';
      dlg.showModal();
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target === img) dlg.close(); });
    dlg.addEventListener('close', function () { img.removeAttribute('src'); });
  }

  /* ---------- Video: play inline ---------- */
  document.querySelectorAll('.vthumb[data-yt]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.querySelector('iframe')) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(btn.dataset.yt) + '?autoplay=1&rel=0';
      f.title = btn.getAttribute('aria-label') || 'Video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      btn.innerHTML = '';
      btn.appendChild(f);
      btn.removeAttribute('aria-label');
      btn.style.cursor = 'default';
    });
  });

  /* ---------- Video: search + tag filter ---------- */
  var box = document.querySelector('[data-video-search]');
  if (box) {
    var input = box.querySelector('input[type="search"]');
    var chips = Array.prototype.slice.call(box.querySelectorAll('[data-tag]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.vcard'));
    var count = box.querySelector('[data-count]');
    var empty = document.querySelector('.vempty');
    function apply() {
      var terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      var active = chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; })
                        .map(function (c) { return c.dataset.tag; });
      var shown = 0;
      cards.forEach(function (card) {
        var hay = card.dataset.search || '';
        var tags = (card.dataset.tags || '').split('|');
        var ok = terms.every(function (t) { return hay.indexOf(t) !== -1; }) &&
                 active.every(function (t) { return tags.indexOf(t) !== -1; });
        card.hidden = !ok;
        if (ok) shown++;
      });
      if (count) count.textContent = shown;
      if (empty) empty.hidden = shown !== 0;
    }
    input.addEventListener('input', apply);
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        apply();
      });
    });
    var q = new URLSearchParams(location.search).get('q');
    if (q) { input.value = q; apply(); }
  }

  /* ---------- Anchor highlight (/videos/#id, /experience/#id, /projects/#id) ---------- */
  function highlight() {
    if (!location.hash) return;
    var el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!el) return;
    if (el.classList.contains('vcard')) {
      el.hidden = false;
      el.classList.add('is-target');
    }
  }
  window.addEventListener('hashchange', highlight);
  highlight();
})();
