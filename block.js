"use strict";

// grab our elements
const blockInput = document.getElementById('block');
const nonceInput = document.getElementById('nonce');
const dataInput  = document.getElementById('data');
const hashInput  = document.getElementById('hash');
const minerDiv   = document.getElementById('miner');
const mineBtn    = document.getElementById('mine');

function updateHash() {
    const block = blockInput.value;
    const nonce = nonceInput.value;
    const data  = dataInput.value;
    const hash  = sha256(block + nonce + data);
    hashInput.value = hash;

    // toggle background
    if (hash.startsWith('0000')) {
        minerDiv.classList.remove('invalid');
        minerDiv.classList.add('valid');
    } else {
        minerDiv.classList.remove('valid');
        minerDiv.classList.add('invalid');
    }
}

// recalc on any change
[blockInput, nonceInput, dataInput].forEach(el =>
    el.addEventListener('input', updateHash)
);

// mine button
mineBtn.addEventListener('click', () => {
    let nonce = parseInt(nonceInput.value, 10) || 0;
    const block = blockInput.value;
    const data  = dataInput.value;
    let hash;

    // brute-force until hash starts with '0000'
    while (true) {
        hash = sha256(block + nonce + data);
        if (hash.startsWith('0000')) break;
        nonce++;
    }

    // write back the winning nonce
    nonceInput.value = nonce;
    updateHash();
});

updateHash();
