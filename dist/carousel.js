'use strict';

const artistCarousel = document.querySelector('#artist-carousel');
const artistPrevious = document.querySelector('#artist-previous');
const artistNext = document.querySelector('#artist-next');

function updateArtistControls() {
  const maximum = artistCarousel.scrollWidth - artistCarousel.clientWidth;
  artistPrevious.disabled = artistCarousel.scrollLeft <= 1;
  artistNext.disabled = artistCarousel.scrollLeft >= maximum - 1;
}

function moveArtists(direction) {
  const card = artistCarousel.querySelector('.artist-card');
  if (!card) return;
  const gap = parseFloat(getComputedStyle(artistCarousel).columnGap) || 0;
  artistCarousel.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

artistPrevious.addEventListener('click', () => moveArtists(-1));
artistNext.addEventListener('click', () => moveArtists(1));
artistCarousel.addEventListener('scroll', updateArtistControls, { passive: true });
window.addEventListener('resize', updateArtistControls);
updateArtistControls();
