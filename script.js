// Utility: convert ArrayBuffer to hex string
function bufferToHex(buffer) {
    const hexCodes = [];
    const view = new DataView(buffer);
    for (let i = 0; i < view.byteLength; i += 4) {
        const value = view.getUint32(i);
        const stringValue = value.toString(16).padStart(8, '0');
        hexCodes.push(stringValue);
    }
    return hexCodes.join('');
}

// Compute SHA-256 hash of text
async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return bufferToHex(hashBuffer);
}

const chain = [];

// Add a new block and re-render
async function addBlock(data) {
    const index = chain.length;
    const prevHash = index === 0 ? '0'.repeat(64) : chain[index - 1].hash;
    const timestamp = new Date().toISOString();
    const blockString = index + data + prevHash + timestamp;
    const hash = await sha256(blockString);

    chain.push({ index, data, prevHash, timestamp, hash });
    renderChain();
    drawConnectors();
}

// Render blocks with data-index attribute
function renderChain() {
    const container = document.querySelector('.chain-container');
    container.innerHTML = '';
    chain.forEach(block => {
        const div = document.createElement('div');
        div.className = 'block';
        div.dataset.index = block.index;
        div.innerHTML = `
      <p><strong>#${block.index}</strong></p>
      <p>Hash:<br>${block.hash.slice(0, 16)}...${block.hash.slice(-16)}</p>
      <p>Prev:<br>${block.prevHash.slice(0, 16)}...${block.prevHash.slice(-16)}</p>
    `;
        container.appendChild(div);
    });
}

// Draw connectors between each block and its immediate predecessor
function drawConnectors() {
    const container = document.querySelector('.chain-container');
    // remove old connectors
    container.querySelectorAll('.connector').forEach(el => el.remove());

    const cRect = container.getBoundingClientRect();

    chain.forEach(({ index }) => {
        if (index === 0) return;
        const currEl = container.querySelector(`.block[data-index="${index}"]`);
        const prevEl = container.querySelector(`.block[data-index="${index - 1}"]`);
        const r1 = prevEl.getBoundingClientRect();
        const r2 = currEl.getBoundingClientRect();

        const startX = r1.right - cRect.left;
        const startY = r1.top + r1.height / 2 - cRect.top;
        const endX = r2.left - cRect.left;
        const endY = r2.top + r2.height / 2 - cRect.top;

        const line = document.createElement('div');
        line.className = 'connector';

        if (Math.abs(startY - endY) < 2) {
            // horizontal
            line.classList.add('horizontal');
            line.style.left = `${startX}px`;
            line.style.top = `${startY}px`;
            line.style.width = `${endX - startX}px`;
        } else {
            // vertical
            line.classList.add('vertical');
// drop from the bottom‐center of the *previous* block
            line.style.left   = `${r1.left + r1.width/2  - cRect.left}px`;
            line.style.top    = `${r1.bottom            - cRect.top }px`;
// extend down to the top of the *current* block
            line.style.height = `${r2.top   - r1.bottom           }px`;
        }
        container.appendChild(line);
    });
}

// Event listener for adding blocks
const addBtn = document.getElementById('add-block');
addBtn.addEventListener('click', () => {
    const input = document.getElementById('data-input');
    const data = input.value.trim();
    if (!data) {
        alert('Please enter some data for the block.');
        return;
    }
    addBlock(data);
    input.value = '';
});