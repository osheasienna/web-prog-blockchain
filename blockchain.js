"use strict";


window.addEventListener('DOMContentLoaded', () => {
  const coins = document.querySelectorAll('.coin');
  const connectors = document.querySelectorAll('.connector');
  const container = document.querySelector('.blockchain-container');

  coins.forEach((coin, i) => {
    setTimeout(() => {
      coin.classList.add('snap');
      if (connectors[i]) {
        connectors[i].style.opacity = '1';
      }

      // Once the last block animates in, trigger the join-together effect
      if (i === coins.length - 1) {
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

const quizData = [
  {
    question: "What is a blockchain?",
    options: [
      "A digital wallet",
      "A decentralized digital ledger",
      "An encryption tool",
      "A cryptocurrency"
    ],
    answer: 1
  },
  {
    question: "What is the purpose of a hash?",
    options: [
      "To encrypt a transaction",
      "To store data on a node",
      "To convert input to a fixed string",
      "To mine cryptocurrency"
    ],
    answer: 2
  },
  {
    question: "Which of the following statements correctly describes the difference between a private key and a public key?",
    options: [
      "A private key is shared publicly to encrypt messages, while a public key is kept secret to decrypt them",
      "A private key is kept secret and used to sign transactions, while a public key is shared openly to verify those signatures",
      "Both private and public keys are kept secret to secure a wallet",
      "A public key is used to sign transactions, and the private key is shared with others"
    ],
    answer: 1
  }
];

// Open and close modal logic
const modal = document.getElementById("quizModal");
const openBtn = document.getElementById("openQuizBtn");
const closeBtn = document.getElementById("closeQuizBtn");

openBtn.onclick = () => {
  modal.style.display = "block";
  loadQuiz();
};

closeBtn.onclick = () => {
  modal.style.display = "none";
  document.getElementById("quizResult").textContent = "";
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.getElementById("quizResult").textContent = "";
  }
};

// Load quiz
function loadQuiz() {
  const container = document.getElementById("quizContainer");
  container.innerHTML = "";
  quizData.forEach((q, idx) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("quiz-question");
    questionDiv.innerHTML = `<h4>${idx + 1}. ${q.question}</h4>`;
    q.options.forEach((opt, optIdx) => {
      const label = document.createElement("label");
      label.classList.add("quiz-option");
      label.innerHTML = `
        <input type="radio" name="q${idx}" value="${optIdx}"> ${opt}
      `;
      questionDiv.appendChild(label);
    });
    container.appendChild(questionDiv);
  });
}

// Submit quiz
document.getElementById("submitQuizBtn").addEventListener("click", () => {
  let score = 0;
  quizData.forEach((q, idx) => {
    const selected = document.querySelector(`input[name="q${idx}"]:checked`);
    if (selected && parseInt(selected.value) === q.answer) {
      score++;
    }
  });

  const result = document.getElementById("quizResult");
  result.textContent = `You got ${score} out of ${quizData.length} correct!`;
});

