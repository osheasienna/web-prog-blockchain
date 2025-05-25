"use strict;"

const coin = document.querySelector('.coin.bitcoin');
for (let i = 0; i < 20; i++) {
  const fig = document.createElement('figure');
  fig.className = 'side';
  fig.style.transform = `
        translate3d(-50%,-50%,0)
        rotateY(90deg)
        rotateX(${i * (360/20)}deg)
        translateZ(calc(var(--r) - 0.1em))
      `;
  coin.appendChild(fig);
}