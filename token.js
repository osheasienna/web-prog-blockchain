// app.js
$(function() {
    const NUM_CHAINS  = 3;                // Peers A, B, C
    const NUM_BLOCKS  = 5;                // 5 blocks per peer
    // number of txs per block (matches the original demo)
    const TX_COUNTS   = [5, 7, 3, 5, 3];
    // some Austen-y names for our random txs
    const NAMES = [
        'Darcy','Elizabeth','Wickham','Lady Catherir','Charlotte',
        'Bingley','Jane','Collins','Anne','Lydia',
        'Ripley','Kane','Parker','Hicks','Bishop',
        'Hudson','Vasquez','Lambert','Ash','Dallas',
        'Newt','Burke','Gorman','Apone'
    ];

    // Build each peer’s column
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

    // ——— Helpers for random transactions ———
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

    // ——— Build one block’s HTML, with the proper # of txs ———
    // —— everything up through makeTokenBlock is unchanged —— //

    function makeTokenBlock(block, chain) {
        const idPrefix = `block${block}chain${chain}`;
        const div = $(`<div class="token-block" id="${idPrefix}">`)
            .append(`<div class="block-header">Block ${block}</div>`)
            .append(`<label>Number: <input id="${idPrefix}number" value="${block}"></label>`)
            .append(`<label>Nonce:  <input id="${idPrefix}nonce"  value="0"></label>`);

        // —— here’s the new tabulated Tx section ——
        const txCount = TX_COUNTS[block - 1];
        const txWrap = $(`<div class="tx-wrap"><label>Tx:</label></div>`);
        const tbl    = $(`
    <table class="tx-table">
      <thead>
        <tr>
          <th>$</th>
          <th>From</th>
          <th></th>
          <th>To</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `);
        for (let tx = 0; tx < txCount; tx++) {
            const data = randomTx();
            const row = $(`
      <tr>
        <td><input id="${idPrefix}tx${tx}value" value="${data.value}"></td>
        <td><input id="${idPrefix}tx${tx}from"  value="${data.from}"></td>
        <td class="arrow">→</td>
        <td><input id="${idPrefix}tx${tx}to"    value="${data.to}"></td>
      </tr>
    `);
            tbl.find('tbody').append(row);
        }
        txWrap.append(tbl);
        div.append(txWrap);
        // —— end of new Tx section ——

        const prev = block === 1 ? '0'.repeat(64) : '';
        div
            .append(`<label>Previous Hash: <input id="${idPrefix}previous" value="${prev}"></label>`)
            .append(`<button class="ladda-button" data-style="expand-right" id="${idPrefix}mineButton">Mine</button>`)
            .append(`<div class="hash" id="${idPrefix}hash"></div>`);

        return div;
    }

// —— the rest of your JS (getText, updateHash, updateChain, setupBlock, mine) stays the same —— //

    // ——— Read all the inputs to build the block’s “message” ———
    function getText(block, chain) {
        const p = (s) => $(`#block${block}chain${chain}${s}`).val();
        let txt = p('number') + p('nonce');
        // concat each tx
        let tx = 0;
        while ($(`#block${block}chain${chain}tx${tx}value`).length) {
            txt += p(`tx${tx}value`) + p(`tx${tx}from`) + p(`tx${tx}to`);
            tx++;
        }
        return txt + p('previous');
    }

    // ——— Compute + color the hash field ———
    function updateHash(block, chain) {
        const raw  = getText(block, chain);
        const h    = CryptoJS.SHA256(raw).toString();
        const $out = $(`#block${block}chain${chain}hash`);
        $out.text(h)
            .toggleClass('green', h.startsWith('0000'))
            .toggleClass('red',   !h.startsWith('0000'));
    }

    // ——— Re-compute this block and all that come after it ———
    function updateChain(block, chain) {
        updateHash(block, chain);
        if (block < NUM_BLOCKS) {
            const nextPrev = $(`#block${block}chain${chain}hash`).text();
            $(`#block${block+1}chain${chain}previous`).val(nextPrev);
            updateChain(block+1, chain);
        }
    }

    // ——— Hook up inputs + mine button on a block ———
    function setupBlock(block, chain) {
        const base = `#block${block}chain${chain}`;
        updateChain(block, chain);

        // any change in number, nonce, prev or any tx → re-mine forward
        $(`${base}number, ${base}nonce, ${base}previous`).on('input', () => updateChain(block, chain));
        let tx = 0;
        while ($(`${base}tx${tx}value`).length) {
            $(`${base}tx${tx}value, ${base}tx${tx}from, ${base}tx${tx}to`)
                .on('input', () => updateChain(block, chain));
            tx++;
        }

        // mine button brute-forces a nonce
        $(`${base}mineButton`).on('click', function(e) {
            e.preventDefault();
            const spinner = Ladda.create(this);
            spinner.start();
            setTimeout(() => {
                mine(block, chain);
                spinner.stop();
            }, 20);
        });
    }

    // ——— Proof-of-work: bump the nonce until hash starts with “0000” ———
    function mine(block, chain) {
        let nonce = 0, h;
        do {
            nonce++;
            $(`#block${block}chain${chain}nonce`).val(nonce);
            h = CryptoJS.SHA256(getText(block, chain)).toString();
        } while (!h.startsWith('0000'));
        updateChain(block, chain);
    }
});
