'use strict;'
    src="https://cdn.jsdelivr.net/npm/js-sha256@0.9.0/src/sha256.min.js"
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
      const prevInput = block.querySelector('.prev');
      prevInput.value = prevHash;
      updateBlock(block);
      return block.querySelector('.hash').value;
    }, '0'.repeat(64));
  }

  function updateBlock(block) {
    const prev = block.querySelector('.prev').value;
    const data = block.querySelector('.data').value;
    const nonce = block.querySelector('.nonce').value;
    const hashInput = block.querySelector('.hash');
    const h = sha256(prev + data + nonce);
    hashInput.value = h;
    block.classList.toggle('invalid', !h.startsWith(difficulty));
  }

  function mineBlock(block) {
    const prev = block.querySelector('.prev').value;
    const data = block.querySelector('.data').value;
    let nonce = 0, h;
    do {
      h = sha256(prev + data + nonce);
      nonce++;
    } while (!h.startsWith(difficulty));
    // last increment overshoots by one
    nonce--;
    block.querySelector('.nonce').value = nonce;
    block.querySelector('.hash').value = h;
    block.classList.remove('invalid');
    block.classList.add('valid');

    // re-propagate to update subsequent blocks
    updateChain();
  }

