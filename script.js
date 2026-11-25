(function () {
  var COUNTER = 110628956;
  function goal(name) {
    if (typeof window.ym === 'function') window.ym(COUNTER, 'reachGoal', name);
  }

  var toast = document.querySelector('.toast');
  var toastTimer;
  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  var cases = Array.prototype.slice.call(document.querySelectorAll('.case'));

  function setOpen(caseEl, open) {
    var btn = caseEl.querySelector('.more');
    caseEl.classList.toggle('open', open);
    if (btn) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.firstChild.nodeValue = open ? 'Свернуть ' : 'Подробнее ';
    }
  }

  cases.forEach(function (caseEl) {
    var btn = caseEl.querySelector('.more');
    if (btn) {
      btn.addEventListener('click', function () {
        var open = !caseEl.classList.contains('open');
        setOpen(caseEl, open);
        if (open) goal('case_open_' + caseEl.dataset.case);
      });
    }
    var copy = caseEl.querySelector('.copylink');
    if (copy) {
      copy.addEventListener('click', function () {
        var url = location.origin + location.pathname + '#' + caseEl.id;
        var done = function () { showToast('Ссылка на кейс скопирована'); };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(url).then(done, function () { location.hash = caseEl.id; });
        } else {
          location.hash = caseEl.id;
          done();
        }
        goal('case_link_' + caseEl.dataset.case);
      });
    }
  });

  // Прямая ссылка на кейс: открыть его и подсветить
  function openFromHash() {
    var m = location.hash.match(/^#case-(\d+)$/);
    if (!m) return;
    var el = document.getElementById('case-' + m[1]);
    if (!el) return;
    setOpen(el, true);
    el.classList.add('flash');
    setTimeout(function () { el.classList.remove('flash'); }, 2500);
    setTimeout(function () { el.scrollIntoView({ block: 'start' }); }, 30);
    goal('case_direct_' + m[1]);
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();

  // Просмотр кейса: карточка видна на экране не меньше чем наполовину
  if ('IntersectionObserver' in window) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !seen[e.target.id]) {
          seen[e.target.id] = true;
          goal('case_view_' + e.target.dataset.case);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    cases.forEach(function (c) { io.observe(c); });
  }

  // Цели на кнопках и контактах
  document.querySelectorAll('[data-goal]').forEach(function (el) {
    el.addEventListener('click', function () { goal(el.dataset.goal); });
  });
})();
