'use strict';

const artistCarousel = document.querySelector('#artist-carousel');
const artistPrevious = document.querySelector('#artist-previous');
const artistNext = document.querySelector('#artist-next');

function updateArtistControls() {
  const maximum = artistCarousel.scrollWidth - artistCarousel.clientWidth;
  artistPrevious.disabled = artistCarousel.scrollLeft <= 1;
  artistNext.disabled = maximum <= 1;
  artistNext.setAttribute('aria-label', artistCarousel.scrollLeft >= maximum - 1 ? 'Back to first artist' : 'Next artist');
}

function moveArtists(direction) {
  const card = artistCarousel.querySelector('.artist-card');
  if (!card) return;
  const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  const maximum = artistCarousel.scrollWidth - artistCarousel.clientWidth;
  if (direction > 0 && artistCarousel.scrollLeft >= maximum - 1) {
    artistCarousel.scrollTo({ left: 0, behavior });
    return;
  }
  const gap = parseFloat(getComputedStyle(artistCarousel).columnGap) || 0;
  artistCarousel.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior });
}

artistPrevious.addEventListener('click', () => moveArtists(-1));
artistNext.addEventListener('click', () => moveArtists(1));
artistCarousel.addEventListener('scroll', updateArtistControls, { passive: true });
window.addEventListener('resize', updateArtistControls);
updateArtistControls();
