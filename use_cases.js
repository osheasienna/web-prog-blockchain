"use strict";

let useCases = [
  {
    name: "Decentralised Finance",
    desc: "Peer-to-peer financial services...",
    file: "transfer.png",
    orbitIdx: 1,
  },
  {
    name: "Digital Identity",
    desc: "Self-sovereign identity...",
    file: "identity.png",
    orbitIdx: 2,
  },
  {
    name: "Energy & Sustainability",
    desc: "Transparent energy trading...",
    file: "energy.png",
    orbitIdx: 3,
  },
  {
    name: "Healthcare",
    desc: "Secure patient records...",
    file: "health.png",
    orbitIdx: 4,
  },
  {
    name: "Cryptocurrencies & NFTs",
    desc: "Digital assets on-chain...",
    file: "bitcoin.png",
    orbitIdx: 5,
  },
];

const radii = [275, 225, 175, 225, 175];
const center = 300; // orbit-container is 600x600

const orbit = document.getElementById("orbitContainer");
const nameEl = document.getElementById("usecaseName");
const descEl = document.getElementById("usecaseDesc");
const mainImg = document.querySelector("#mainImg img");
const dots = useCases.map((_, i) => document.getElementById("dot" + i));

function positionDots() {
    const total = useCases.length;
    const offset = Math.PI / 10; // ~18 degrees offset for symmetry
  
    // Manually assign orbit radii for each dot here, ignoring useCases.orbitIdx:
    // Dot order: 0, 1, 2, 3, 4
    // Assign radii as per your request:
    const customRadii = [175, 225, 275, 175, 225]; // dot2 moved to biggest orbit (275), dot3 smallest orbit (100)
  
    dots.forEach((dot, i) => {
      const angle = (i * 2 * Math.PI / total) + offset;
      const r = customRadii[i];
      dot.style.left = `${300 + r * Math.cos(angle) - 24}px`;
      dot.style.top  = `${300 + r * Math.sin(angle) - 24}px`;
      dot.style.backgroundImage = `url('./assets/${useCases[i].file}')`;
    });
  }
  
  

dots.forEach((dot, i) => dot.addEventListener("click", () => selectUseCase(i)));

function selectUseCase(idx) {
  orbit.classList.add("spin");
  setTimeout(() => orbit.classList.remove("spin"), 1000);

  // Fade out current content
  nameEl.style.opacity = descEl.style.opacity = mainImg.style.opacity = 0;

  setTimeout(() => {
    const u = useCases[idx];
    nameEl.textContent = u.name;
    descEl.textContent = u.desc;
    mainImg.src = `./assets/${u.file}`;
    mainImg.alt = u.name;

    // Fade in new content
    nameEl.style.opacity = descEl.style.opacity = mainImg.style.opacity = 1;

    // Move selected useCase to front (start of array)
    useCases.unshift(useCases.splice(idx, 1)[0]);

    // Update orbitIdx cycling inward 1-5 again
    useCases = useCases.map((uc, i) => ({ ...uc, orbitIdx: (i % 5) + 1 }));

    positionDots();
  }, 400);
}

// Initial layout
positionDots();
