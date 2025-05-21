// Utility to convert between ArrayBuffer and Base64
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let b of bytes) binary += String.fromCharCode(b);
    return window.btoa(binary);
}

function base64ToArrayBuffer(b64) {
    const binary = window.atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

let publicKey, privateKey;

document.getElementById('generate-keys').addEventListener('click', async () => {
    const keyPair = await window.crypto.subtle.generateKey(
        { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1,0,1]), hash: 'SHA-256' },
        true,
        ['encrypt','decrypt']
    );
    publicKey = keyPair.publicKey;
    privateKey = keyPair.privateKey;

    const spki = await crypto.subtle.exportKey('spki', publicKey);
    document.getElementById('public-key').value = arrayBufferToBase64(spki);

    const pkcs8 = await crypto.subtle.exportKey('pkcs8', privateKey);
    document.getElementById('private-key').value = arrayBufferToBase64(pkcs8);
});

document.getElementById('encrypt-btn').addEventListener('click', async () => {
    const text = document.getElementById('plaintext').value;
    const encoded = new TextEncoder().encode(text);
    const ciphertext = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, encoded);
    document.getElementById('ciphertext').value = arrayBufferToBase64(ciphertext);
});

document.getElementById('decrypt-btn').addEventListener('click', async () => {
    const b64 = document.getElementById('ciphertext').value;
    const buffer = base64ToArrayBuffer(b64);
    const decrypted = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, buffer);
    document.getElementById('decrypted').value = new TextDecoder().decode(decrypted);
});