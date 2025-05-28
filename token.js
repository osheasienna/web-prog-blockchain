// token.js
$(function() {
    const NUM_CHAINS  = 3;                // Peers A, B, C
    const NUM_BLOCKS  = 3;               // 3 blocks per peer
    const TX_COUNTS   = [5, 7, 3];        // Transactions per block
    const NAMES = [
        'Darcy','Elizabeth','Wickham','Lady Catherine','Charlotte',
        'Bingley','Jane','Collins','Anne','Lydia',
        'Ripley','Kane','Parker','Hicks','Bishop',
        'Hudson','Vasquez','Lambert','Ash','Dallas',
        'Newt','Burke','Gorman','Apone'
    ];

    // Build each peer column
    for (let chain = 1; chain <= NUM_CHAINS; chain++) {
        const peerDiv = $('<div>', { class: 'peer', id: `peer${chain}` });
        peerDiv.append(`<h2>Peer ${String.fromCharCode(64 + chain)}</h2>`);
        for (let block = 1; block <= NUM_BLOCKS; block++) {
            peerDiv.append(makeTokenBlock(block, chain));
        }
        $('#peers').append(peerDiv);
    }

    // Wire up inputs, mining buttons, etc.
    for (let chain = 1; chain <= NUM_CHAINS; chain++) {
        for (let block = 1; block <= NUM_BLOCKS; block++) {
            setupBlock(block, chain);
        }
    }

    // Helpers
    function randomName(exclude) {
        const pool = NAMES.filter(n => n !== exclude);
        return pool[Math.floor(Math.random() * pool.length)];
    }
    function randomTx() {
        const val  = (Math.random() * 100).toFixed(2);
        const from = randomName(null);
        const to   = randomName(from);
        return { value: val, from, to };
    }

    function makeTokenBlock(block, chain) {
        const id = `block${block}chain${chain}`;
        const div = $(`<div class="token-block" id="${id}">`)
            .append(`<div class="block-header">Block ${block}</div>`)
            .append(`<label>Number: <input id="${id}number" value="${block}"></label>`)
            .append(`<label>Nonce:  <input id="${id}nonce"  value="0"></label>`);

        // Transactions
        const txCount = TX_COUNTS[block - 1];
        const txWrap = $(`<div class="tx-wrap"><label>Tx:</label></div>`);
        const tbl    = $(`
<table class="tx-table">
  <thead>
    <tr><th>$</th><th>From</th><th></th><th>To</th></tr>
  </thead>
  <tbody></tbody>
</table>`);
        for (let tx = 0; tx < txCount; tx++) {
            const d = randomTx();
            const row = $(
                `<tr>
  <td><input id="${id}tx${tx}value" value="${d.value}"></td>
  <td><input id="${id}tx${tx}from"  value="${d.from}"></td>
  <td class="arrow">→</td>
  <td><input id="${id}tx${tx}to"    value="${d.to}"></td>
</tr>`);
            tbl.find('tbody').append(row);
        }
        txWrap.append(tbl);
        div.append(txWrap)
            .append(`<label>Previous Hash: <input id="${id}previous" value="${block === 1 ? '0'.repeat(64) : ''}"></label>`)
            .append(`<button class="ladda-button" data-style="expand-right" id="${id}mineButton">Mine</button>`)
            .append(`<div class="hash" id="${id}hash"></div>`);
        return div;
    }

    function getText(block, chain) {
        const p = s => $(`#block${block}chain${chain}${s}`).val();
        let txt = p('number') + p('nonce');
        let tx = 0;
        while ($(`#block${block}chain${chain}tx${tx}value`).length) {
            txt += p(`tx${tx}value`) + p(`tx${tx}from`) + p(`tx${tx}to`);
            tx++;
        }
        return txt + p('previous');
    }

    function updateHash(block, chain) {
        const raw = getText(block, chain);
        const h   = CryptoJS.SHA256(raw).toString();
        const $el = $(`#block${block}chain${chain}hash`);
        $el.text(h)
            .toggleClass('green', h.startsWith('0000'))
            .toggleClass('red',   !h.startsWith('0000'));
    }

    function updateChain(block, chain) {
        updateHash(block, chain);
        if (block < NUM_BLOCKS) {
            const next = $(`#block${block}chain${chain}hash`).text();
            $(`#block${block+1}chain${chain}previous`).val(next);
            updateChain(block+1, chain);
        }
    }

    function setupBlock(block, chain) {
        const base = `#block${block}chain${chain}`;
        // Initial render
        updateChain(block, chain);
        updateStatus();
        // On input
        $(`${base}number, ${base}nonce, ${base}previous`).on('input', () => {
            updateChain(block, chain);
            updateStatus();
        });
        // On tx change
        let tx = 0;
        while ($(`${base}tx${tx}value`).length) {
            $(`${base}tx${tx}value, ${base}tx${tx}from, ${base}tx${tx}to`).on('input', () => {
                updateChain(block, chain);
                updateStatus();
            });
            tx++;
        }
        // On mine
        $(`${base}mineButton`).on('click', function(e) {
            e.preventDefault();
            const spinner = Ladda.create(this);
            spinner.start();
            setTimeout(() => {
                mine(block, chain);
                updateStatus();
                spinner.stop();
            }, 20);
        });
    }

    function mine(block, chain) {
        let nonce = 0, h;
        do {
            nonce++;
            $(`#block${block}chain${chain}nonce`).val(nonce);
            h = CryptoJS.SHA256(getText(block, chain)).toString();
        } while (!h.startsWith('0000'));
        updateChain(block, chain);
    }

    // Peer-level coloring
    function updatePeerStatus() {
        document.querySelectorAll('.peer').forEach(peer => {
            const hashEls = peer.querySelectorAll('.hash');
            const hashes  = Array.from(hashEls).map(e => e.textContent);
            const allValid= Array.from(hashEls).every(e => e.classList.contains('green'));
            const allMatch= (new Set(hashes).size === 1);
            peer.classList.toggle('match', allValid && allMatch);
            peer.classList.toggle('mismatch', !(allValid && allMatch));
        });
    }

    // Block-level coloring (cross-peer consensus)
    function updateBlockStatus() {
        for (let block = 1; block <= NUM_BLOCKS; block++) {
            const els   = Array.from(document.querySelectorAll(`.hash[id^=\"block${block}chain\"]`));
            const vals  = els.map(e => e.textContent);
            const freq  = {};
            vals.forEach(v => freq[v] = (freq[v]||0) + 1);
            let consensus = vals[0]; let max = freq[consensus];
            for (const v in freq) if (freq[v] > max) { consensus = v; max = freq[v]; }
            els.forEach(e => {
                const valid  = e.classList.contains('green');
                const parent = e.closest('.token-block');
                const ok     = valid && (e.textContent === consensus);
                parent.classList.toggle('match', ok);
                parent.classList.toggle('mismatch', !ok);
            });
        }
    }

    // Combined status update
    function updateStatus() {
        updatePeerStatus();
        updateBlockStatus();
    }

    // Initial state
    updateStatus();
});