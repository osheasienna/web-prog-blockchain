"use strict";

window.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.block');
  const connectors = document.querySelectorAll('.connector');
  const container = document.querySelector('.blockchain-container');

  blocks.forEach((block, i) => {
    setTimeout(() => {
      block.classList.add('snap');
      if (connectors[i]) {
        connectors[i].style.opacity = '1';
      }

      // Once the last block animates in, trigger the join-together effect
      if (i === blocks.length - 1) {
        setTimeout(() => {
          container.classList.add('snap-together');
        }, 600); // small delay after last block snaps in
      }
    }, i * 600);
  });
});

const carousel = document.getElementById('carousel');
const cards = carousel.querySelectorAll('.card');

let isDragging = false;
let startX;
let scrollLeft;

carousel.addEventListener('mousedown', (e) => {
  isDragging = true;
  carousel.classList.add('dragging');
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('mouseleave', () => {
  isDragging = false;
  carousel.classList.remove('dragging');
});

carousel.addEventListener('mouseup', () => {
  isDragging = false;
  carousel.classList.remove('dragging');
});

carousel.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (startX - x) * 2; //scroll-fast
  carousel.scrollLeft = scrollLeft + walk;
});

// Card expand/collapse logic
cards.forEach(card => {
  card.addEventListener('click', () => {
    // If this card is already expanded, collapse it
    if (card.classList.contains('expanded')) {
      card.classList.remove('expanded');
      card.querySelector('.definition').textContent = '';
      return;
    }

    // Collapse any expanded card
    cards.forEach(c => {
      c.classList.remove('expanded');
      c.querySelector('.definition').textContent = '';
    });

    // Expand clicked card
    card.classList.add('expanded');
    const defText = card.getAttribute('data-definition');
    card.querySelector('.definition').textContent = defText;

    // Optionally, scroll the card into view centered
    card.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  });
});
