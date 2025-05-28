'use strict';

const difficulty = "0000";
const blocks = Array.from(document.querySelectorAll('.block'));

// initialize
blocks.forEach(block => {
  block.querySelector('.data').addEventListener('input', updateChain);
  block.querySelector('.nonce').addEventListener('input', updateChain);
  block.querySelector('.mine').addEventListener('click', () => mineBlock(block));
});
updateChain();

function updateChain() {
  blocks.reduce((prevHash, block) => {
    block.querySelector('.prev').value = prevHash;
    updateBlock(block);
    return block.querySelector('.hash').value;
  }, '0'.repeat(64));
}

function updateBlock(block) {
  const prev   = block.querySelector('.prev').value;
  const data   = block.querySelector('.data').value;
  const nonce  = block.querySelector('.nonce').value;
  const h      = sha256(prev + data + nonce);
  const isValid = h.startsWith(difficulty);

  block.querySelector('.hash').value = h;

  // always keep classes in sync
  if (isValid) {
    block.classList.add('valid');
    block.classList.remove('invalid');
  } else {
    block.classList.add('invalid');
    block.classList.remove('valid');
  }
}

function mineBlock(block) {
  const prev = block.querySelector('.prev').value;
  const data = block.querySelector('.data').value;
  let nonce = 0, h;
  do {
    h = sha256(prev + data + nonce);
    nonce++;
  } while (!h.startsWith(difficulty));
  nonce--; // back off last increment

  block.querySelector('.nonce').value = nonce;
  block.querySelector('.hash').value  = h;

  // now re-validate entire chain (and recolor)
  updateChain();
}
