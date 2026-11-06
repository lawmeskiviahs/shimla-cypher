'use strict';

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];
const config = window.CYPHER_CONFIG;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const slides = qsa('.scene');
const dialog = qs('#info-dialog');
let index = 0;
let paused = reduce.matches;
let timer;
let lastTrigger;

function setTimer() {
  clearInterval(timer);
  if (!paused && !document.hidden && !dialog.open) {
    timer = setInterval(() => go(index + 1, false), 6500);
  }
}

function go(next, announce = true) {
  index = (next + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  qsa('.slide-dot').forEach((button, i) => button.setAttribute('aria-current', String(i === index)));
  qs('#slide-number').textContent = String(index + 1).padStart(2, '0');
  qs('#slide-title').textContent = slides[index].dataset.title;
  if (announce) qs('#slide-announcement').textContent = `Slide ${index + 1} of ${slides.length}: ${slides[index].dataset.title}`;
  setTimer();
}

function pauseUI() {
  qs('#pause').textContent = paused ? '▶' : 'Ⅱ';
  qs('#pause').setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
  qs('#pause').setAttribute('aria-pressed', String(paused));
  setTimer();
}

slides.forEach((_, i) => {
  const button = document.createElement('button');
  button.className = 'slide-dot';
  button.setAttribute('aria-label', `Show slide ${i + 1}`);
  button.addEventListener('click', () => go(i));
  qs('#slide-dots').append(button);
});
qs('#next').addEventListener('click', () => go(index + 1));
qs('#previous').addEventListener('click', () => go(index - 1));
qs('#pause').addEventListener('click', () => { paused = !paused; pauseUI(); });
document.addEventListener('visibilitychange', setTimer);
reduce.addEventListener('change', (event) => { paused = event.matches; pauseUI(); });
qs('.hero').addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    go(index + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
let touch;
qs('.hero').addEventListener('touchstart', (event) => { touch = event.changedTouches[0]; }, { passive: true });
qs('.hero').addEventListener('touchend', (event) => {
  if (!touch) return;
  const dx = event.changedTouches[0].clientX - touch.clientX;
  const dy = event.changedTouches[0].clientY - touch.clientY;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
  touch = null;
}, { passive: true });

const menu = qs('.menu-toggle');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  menu.textContent = 'Menu +';
  qs('.nav').classList.remove('open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Close ×' : 'Menu +';
  qs('.nav').classList.toggle('open', open);
});
qsa('.nav a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

function openDialog(title, html, trigger) {
  lastTrigger = trigger || document.activeElement;
  qs('#dialog-title').textContent = title;
  qs('#dialog-body').innerHTML = html;
  dialog.showModal();
  setTimer();
}
qs('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  setTimer();
  if (lastTrigger?.isConnected) lastTrigger.focus();
});

const catalogue = '<p>New music is on the way. Releases, artwork, credits and official listening links will appear here.</p><div class="placeholder-row"><span>The catalogue</span><span>Coming soon</span></div>';
qsa('[data-artist]').forEach((button) => button.addEventListener('click', () => {
  openDialog(`Artist profile / ${button.dataset.artist}`, '<p>Artist announcements are coming soon. Explore biographies, music and official listening links here as the roster takes shape.</p>' + catalogue, button);
}));
qsa('[data-platform]').forEach((button) => button.addEventListener('click', () => {
  const url = config.platforms[button.dataset.platform];
  if (url && /^https:\/\//.test(url)) window.open(url, '_blank', 'noopener,noreferrer');
  else openDialog(button.dataset.platform, '<p>Our official destination will be shared here soon. For enquiries, reach us at <a href="mailto:shimlacxpher@gmail.com">shimlacxpher@gmail.com</a>.</p>', button);
}));

function openContact(trigger) {
  openDialog('Start a conversation', `
    <p>Bookings, collaborations, press or something else—tell us what you have in mind.</p>
    <form id="contact-form" class="contact-form">
      <label for="contact-name">Your name</label>
      <input id="contact-name" name="name" autocomplete="name" maxlength="100" required>
      <label for="contact-email">Your email</label>
      <input id="contact-email" name="email" type="email" autocomplete="email" maxlength="254" required>
      <label for="contact-topic">What’s it about?</label>
      <select id="contact-topic" name="topic"><option>General enquiry</option><option>Bookings</option><option>Collaborations</option><option>Press</option></select>
      <label for="contact-message">Your message</label>
      <textarea id="contact-message" name="message" rows="4" maxlength="5000" required></textarea>
      <p class="contact-hint">Opens your email app with a draft addressed to <a href="mailto:shimlacxpher@gmail.com">shimlacxpher@gmail.com</a>. Send it from there.</p>
      <button class="btn" type="submit">Continue to email <span class="arrow">↗</span></button>
      <p id="contact-status" role="status"></p>
    </form>`, trigger);
  qs('#contact-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Shimla Cypher / ${data.get('topic')}`;
    const body = `${data.get('message')}\n\nFrom: ${data.get('name')}\nReply to: ${data.get('email')}`;
    const mailto = `mailto:${config.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    qs('#contact-status').textContent = 'Your email draft is ready. If your email app did not open, use the address above to contact us directly.';
  });
}
qsa('[data-dialog]').forEach((button) => button.addEventListener('click', () => {
  if (button.dataset.dialog === 'catalogue') openDialog('The catalogue', catalogue, button);
  if (button.dataset.dialog === 'contact') openContact(button);
}));
qs('#year').textContent = new Date().getFullYear();
go(0, false);
pauseUI();
