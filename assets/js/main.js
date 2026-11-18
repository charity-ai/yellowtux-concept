/* Find Your Yellow Tux — concept site interactions */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sticky header state */
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile menu */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mobile-menu');
  var closeBtn = document.querySelector('.mobile-menu__close');

  function setMenu(open) {
    if (!menu || !burger) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = menu.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    } else {
      burger.focus({ preventScroll: true });
    }
  }

  if (burger) burger.addEventListener('click', function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('is-open')) setMenu(false);
  });

  /* Scroll reveal */
  var revealItems = document.querySelectorAll('[data-reveal]');
  if (revealItems.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealItems.forEach(function (el) { io.observe(el); });
    }
  }

  /* Booking form (demo only) */
  var form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var required = form.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e23b22';
          field.addEventListener('input', function () { field.style.borderColor = ''; }, { once: true });
        }
      });
      if (!valid) return;

      var success = document.getElementById('form-success');
      if (success) {
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }
      form.querySelector('button[type="submit"]').textContent = 'Request sent';
    });
  }

  /* Concept badge */
  var badge = document.getElementById('concept-badge');
  if (badge) {
    var key = 'yt-concept-dismissed';
    try {
      if (window.localStorage.getItem(key) === '1') badge.hidden = true;
    } catch (err) { /* storage blocked */ }
    var close = badge.querySelector('button');
    if (close) {
      close.addEventListener('click', function () {
        badge.hidden = true;
        try { window.localStorage.setItem(key, '1'); } catch (err) { /* ignore */ }
      });
    }
  }

  /* Subtle parallax on hero visual */
  if (!reduceMotion && window.matchMedia('(min-width: 901px)').matches) {
    var visual = document.querySelector('.hero__frame img');
    var hero = document.querySelector('.hero');
    if (visual && hero) {
      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        visual.style.transform = 'scale(1.06) translate(' + (x * -10) + 'px,' + (y * -10) + 'px)';
      });
      hero.addEventListener('mouseleave', function () {
        visual.style.transform = '';
      });
    }
  }
})();
