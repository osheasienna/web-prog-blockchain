// 1) Use a proper strict-mode directive
"use strict";

const difficulty   = 4;
const targetPrefix = '0'.repeat(difficulty);

// only 4 blocks now
const initial = [
    { block: 1, nonce: 11316, previous: '0'.repeat(64) },
    { block: 2, nonce: 35230, previous: '000015783b764259d382017d91a36d206d0600e2cbb3567748f46a33fe9297cf' },
    { block: 3, nonce: 12937, previous: '000012fa9b916eb9078f8d98a7864e697ae83ed54f5146bd84452cdafd043c19' },
    { block: 4, nonce: 35990, previous: '0000b9015ce2a08b61216ba5a0778545bf4ddd7ceb7bbd85dd8062b29a9140bf' }
];
const peers = ['A','B','C'];

// build the three peer rows
const sim = document.getElementById('simulator');
peers.forEach(peerId => {
    const peerDiv = document.createElement('div');
    peerDiv.className = 'peer';
    peerDiv.innerHTML = `<h3>Peer ${peerId}</h3><div class="blocks"></div>`;
    const row = peerDiv.querySelector('.blocks');
    initial.forEach(cfg => {
        const el = document.createElement('div');
        el.className = 'block';
        el.dataset.block = cfg.block;
        el.innerHTML = `
      <label># <input type="number" class="number" value="${cfg.block}" readonly></label>
      <label>Nonce <input type="text" class="nonce" value="${cfg.nonce}"></label>
      <label>Data <textarea class="data"></textarea></label>
      <label>Prev <input type="text" class="previous" value="${cfg.previous}"></label>
      <label>Hash <input type="text" class="hash" readonly></label>
      <button class="mine">Mine</button>
    `;
        row.appendChild(el);
    });
    sim.appendChild(peerDiv);
});

// SHA-256 helper
function computeHash(text) {
    return CryptoJS.SHA256(text).toString();
}

// recompute hash & colour based on difficulty
function updateBlockHash(el) {
    const num   = el.querySelector('.number').value;
    const nonce = el.querySelector('.nonce').value;
    const data  = el.querySelector('.data').value;
    const prev  = el.querySelector('.previous').value;
    const hash  = computeHash(num + nonce + data + prev);

    el.querySelector('.hash').value = hash;
    if (hash.startsWith(targetPrefix)) {
        el.classList.add('valid');
        el.classList.remove('invalid');
    } else {
        el.classList.add('invalid');
        el.classList.remove('valid');
    }
}

// mirror a block's nonce/data/prev+hash to all peers
function propagate(el) {
    const idx      = el.dataset.block;
    const nonce    = el.querySelector('.nonce').value;
    const data     = el.querySelector('.data').value;
    const previous = el.querySelector('.previous').value;

    document.querySelectorAll(`.block[data-block="${idx}"]`)
        .forEach(other => {
            if (other !== el) {
                other.querySelector('.nonce').value    = nonce;
                other.querySelector('.data').value     = data;
                other.querySelector('.previous').value = previous;
                updateBlockHash(other);
            }
        });
}

// set each block's prev to the hash of the one before it
function updateChain() {
    const max = initial.length;
    const firstPeer = document.querySelector('.peer');
    for (let i = 2; i <= max; i++) {
        const prevBlock = firstPeer.querySelector(`.block[data-block="${i-1}"]`);
        const currBlock = firstPeer.querySelector(`.block[data-block="${i}"]`);
        const newPrev = prevBlock.querySelector('.hash').value;
        currBlock.querySelector('.previous').value = newPrev;
        updateBlockHash(currBlock);
        propagate(currBlock);
    }
}

// wire up events on every block
document.querySelectorAll('.block').forEach(blockEl => {
    ['nonce','data','previous'].forEach(cls => {
        blockEl.querySelector(`.${cls}`)
            .addEventListener('input', () => {
                updateBlockHash(blockEl);
                propagate(blockEl);
                updateChain();
            });
    });

    blockEl.querySelector('.mine').addEventListener('click', () => {
        const num   = blockEl.querySelector('.number').value;
        const data  = blockEl.querySelector('.data').value;
        const prev  = blockEl.querySelector('.previous').value;
        let nonce   = 0, hash;

        //  find a nonce that produces the right prefix
        do {
            nonce++;
            hash = computeHash(num + nonce + data + prev);
        } while (!hash.startsWith(targetPrefix));

        blockEl.querySelector('.nonce').value = nonce;
        updateBlockHash(blockEl);
        propagate(blockEl);
        updateChain();
    });
});

// initial hashes + chain fix
document.querySelectorAll('.block').forEach(updateBlockHash);
updateChain();
