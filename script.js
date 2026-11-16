'use strict';

// Mobile navigation: all links stay visible if JavaScript is unavailable.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const mobileQuery = window.matchMedia('(max-width: 760px)');
function closeMenu() {
  navigation.hidden = mobileQuery.matches;
  menuButton.setAttribute('aria-expanded', 'false');
}
closeMenu();
mobileQuery.addEventListener('change', closeMenu);
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.hidden = isOpen;
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

// Project filters use real buttons and announce the result to screen readers.
const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-category]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  cards.forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) count++;
  });
  document.querySelector('.filter-status').textContent = `${count} projects shown.`;
}));

// No backend: export a brief instead of displaying a misleading "sent" message.
document.querySelectorAll('.brief-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const content = [
      'MORROW & GRAIN — PROJECT BRIEF', '',
      `Name: ${data.get('name').trim()}`,
      `Email: ${data.get('email').trim()}`, '',
      'My ideas:', data.get('message').trim(), '',
      'Created with Morrow & Grain. Saved to your device.'
    ].join('\n');
    const url = URL.createObjectURL(new Blob([content], {type: 'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'morrow-and-grain-project-brief.txt';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    form.querySelector('.form-status').textContent = 'Your project brief is ready to save.';
  });
});

// Scroll reveals inspired by the original template. Elements stay visible if
// animation or IntersectionObserver is unavailable; nothing is hidden in CSS.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const targets = new Map();
  const running = new Map();
  const seen = new WeakSet();
  const mobileMotion = window.matchMedia('(max-width: 760px)');
  const transforms = {
    left: 'translate3d(calc(-1 * var(--reveal-distance)), 0, 0)',
    right: 'translate3d(var(--reveal-distance), 0, 0)',
    up: 'translate3d(0, var(--reveal-distance), 0)',
    down: 'translate3d(0, calc(-1 * var(--reveal-distance)), 0)',
    zoom: 'scale(.78)'
  };

  function add(selector, direction, stagger = 0) {
    document.querySelectorAll(selector).forEach((element, index) => {
      // Do not animate both a container and its descendants.
      if (element.closest('[data-reveal]')) return;
      const effect = Array.isArray(direction) ? direction[index % direction.length] : direction;
      element.dataset.reveal = effect;
      const delay = (index % 3) * stagger;
      element.dataset.revealDelay = String(delay);
      targets.set(element, { effect, delay });
    });
  }

  // Above the fold: headline slides in first, then copy and the call to action.
  add('.hero-content > .eyebrow, .projects-hero > .container > .eyebrow', 'down');
  add('.hero-content > h1, .projects-hero h1', 'right');
  add('.hero-content > p:not(.eyebrow), .projects-hero > .container > p:not(.eyebrow)', 'left');
  add('.hero-content > .button, .projects-hero > .container > .button', 'up');
  document.querySelectorAll('.hero-content > *, .projects-hero > .container > *').forEach((element, index) => {
    const config = targets.get(element);
    if (config) {
      config.delay = index * 140;
      element.dataset.revealDelay = String(config.delay);
    }
  });

  add('.split > div', ['left', 'right']);
  add('.split > img', ['right', 'left']);
  add('.intro-grid > .eyebrow', 'down');
  add('.intro-grid > div', 'right');
  add('.section-heading > div:not(.filters), .section-heading > h2', 'left');
  add('.section-heading > p, .section-heading > .text-link, .section-heading > .filters', 'right');
  add('.project-card', ['left', 'zoom', 'right'], 140);
  add('.service-grid > article', ['up', 'down', 'up'], 140);
  add('.statement .narrow > *', ['down', 'zoom', 'up', 'up'], 100);
  add('.contact-grid > div', 'left');
  add('.brief-form', 'right');
  add('.faq-wrap > div:first-child', 'left');
  add('.faq details', 'up', 100);
  add('main > .section > .container > .eyebrow', 'down');
  add('main > .section > .container > h2', 'zoom');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || reducedMotion.matches) return;
      const element = entry.target;
      const config = targets.get(element);
      if (seen.has(element) || element.hidden) return;
      seen.add(element);
      observer.unobserve(element);
      // Keyboard focus should never be delayed or moved by a reveal.
      if (element.contains(document.activeElement)) return;
      const animation = element.animate([
        { opacity: 0, transform: transforms[config.effect] },
        { opacity: 1, transform: 'none' }
      ], {
        duration: mobileMotion.matches ? 900 : 1450,
        delay: mobileMotion.matches ? Math.min(config.delay, 180) : config.delay,
        easing: 'cubic-bezier(.2,.7,.2,1)',
        fill: 'backwards'
      });
      running.set(element, animation);
      animation.onfinish = animation.oncancel = () => running.delete(element);
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  function syncMotionPreference() {
    observer.disconnect();
    running.forEach(animation => animation.cancel());
    running.clear();
    if (!reducedMotion.matches) {
      targets.forEach((config, element) => {
        if (!seen.has(element)) observer.observe(element);
      });
    }
  }
  syncMotionPreference();
  reducedMotion.addEventListener('change', syncMotionPreference);
  document.addEventListener('focusin', event => {
    const element = event.target.closest('[data-reveal]');
    if (!element) return;
    seen.add(element);
    observer.unobserve(element);
    running.get(element)?.cancel();
  });
})();
