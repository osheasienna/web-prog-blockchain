"use strict;"

window.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('.block');
    const connectors = document.querySelectorAll('.connector');
  
    blocks.forEach((block, i) => {
      setTimeout(() => {
        block.style.transform = 'translateX(0)';
        block.style.opacity = '1';
        if (connectors[i]) {
          connectors[i].style.opacity = '1';
        }
      }, i * 600); // animate each block with delay
    });
  });
  
