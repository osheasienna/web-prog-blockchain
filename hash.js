'use strict;'
  const dataEl = document.getElementById('data');
  const hashEl = document.getElementById('hash');

  // Convert ArrayBuffer to hex string
  function buf2hex(buffer) {
    return Array.prototype.map.call(
            new Uint8Array(buffer),
            x => x.toString(16).padStart(2, '0')
    ).join('');
  }

  // Compute SHA-256 and update the hash field
  async function updateHash() {
    const text = dataEl.value;
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    hashEl.value = buf2hex(hashBuffer);
  }

  // Recompute on every input
  dataEl.addEventListener('input', updateHash);

  // Initialize with empty-string hash
  updateHash();

