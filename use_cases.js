"use strict";

// Fully updated useCases array with correct file names
// Consulted AI for the structure of the useCases
let useCases = [
  {
    name: "DECENTRALIZED FINANCE",
    desc: `
      <ul>
        <li><strong>Peer-to-Peer Lending &amp; Borrowing:</strong> Connect borrowers and lenders directly through smart contracts that automate collateral management, interest accrual, and repayment schedules.</li>
        <li><strong>Decentralized Exchanges (DEXs):</strong> Facilitate trustless token swaps from user wallets, removing custodial risk and enabling continuous liquidity pools.</li>
        <li><strong>Stablecoins &amp; Algorithmic Assets:</strong> Provide on-chain assets pegged to fiat currencies or commodities, ensuring stable value for remittances, savings, and commerce.</li>
        <li><strong>Yield Farming &amp; Liquidity Mining:</strong> Allow users to stake digital assets in liquidity pools and earn transparent, code-driven rewards.</li>      </ul>
    `,
    file: "transfer.png" ,     // DeFi → transfer.png
    gradient: "linear-gradient(135deg, #6b1bb8 0%, #39007f 100%)"
  },
  {
    name: "HEALTHCARE",
    desc: `
      <ul>
        <li><strong>Secure Medical Records:</strong> Store hashes of patient data on-chain to detect tampering, while keeping sensitive information off-chain for privacy.</li>
        <li><strong>Interoperable Health Exchanges:</strong> Enable hospitals, clinics, and labs to share patient records securely—patients remain in control of access permissions.</li>
        <li><strong>Pharmaceutical Supply Chain:</strong> Log every step from manufacturing to delivery, reducing counterfeit risk and ensuring drug authenticity.</li>
        <li><strong>Clinical Trial Transparency:</strong> Timestamp informed consent and trial data entries on a public ledger, enhancing auditability and regulatory compliance.</li>
        <li><strong>IoT &amp; Device Security:</strong> Record firmware updates and usage logs for connected medical devices, strengthening patient safety and operational integrity.</li>
      </ul>
    `,
    file: "health.png",
    gradient: "linear-gradient(135deg, #b02628 0%, #af3f3f 100%)"
  },
  {
    name: "ENERGY & SUSTAINABILITY",
    desc: `
      <ul>
        <li><strong>Peer-to-Peer Energy Trading:</strong> Allow prosumers (solar panel owners) to sell surplus power directly to neighbors via automated smart contracts.</li>
        <li><strong>Renewable Energy Certificates (RECs):</strong> Tokenize one megawatt-hour of green energy on-chain, preventing double-spending and streamlining certificate management.</li>
        <li><strong>Carbon Credit Tracking:</strong> Issue, trade, and retire carbon credits on a shared ledger, ensuring each offset is unique and auditable.</li>
        <li><strong>Demand Response Programs:</strong> Use smart meters and automated incentives to balance grid load by rewarding consumers who reduce usage during peaks.</li>
        <li><strong>Sustainable Supply Chains:</strong> Verify the provenance of raw materials (e.g., conflict-free minerals) through immutable, end-to-end tracking.</li>
      </ul>
    `,
    file: "energy.png",
    gradient: "linear-gradient(135deg, #3e7622 0%, #6ca148 100%)"
  },
  {
    name: "CRYPTOCURRENCIES & NFTS",
    desc: `
      <ul>
        <li><strong>Cryptocurrencies:</strong> Enable borderless, censorship-resistant value transfers and programmable money via smart contracts.</li>
        <li><strong>Asset Tokenization:</strong> Represent physical or financial assets (real estate, stocks) as fractional on-chain tokens, unlocking 24/7 trading and liquidity.</li>
        <li><strong>Non-Fungible Tokens (NFTs):</strong> Create provably unique digital collectibles, art, in-game items, event tickets, and more with embedded ownership metadata.</li>
        <li><strong>Decentralized Gaming &amp; Metaverses:</strong> Let players truly own and trade in-game assets across platforms, with economies governed by transparent code.</li>
        <li><strong>Automated Royalties:</strong> Enforce creator compensation on every secondary sale, ensuring artists and developers earn ongoing revenue.</li>
      </ul>
    `,
    file: "bitcoin.png",       // NFTs → bitcoin.png
    gradient: "linear-gradient(135deg, #d49b15 0%, #bc200f 100%)"
  },
  {
    name: "DIGITAL IDENTITY",
    desc: `
      <ul>
        <li><strong>Self-Sovereign Identity (SSI):</strong> Users manage cryptographic keys to selectively share identity attributes (e.g., age, credentials) without intermediaries.</li>
        <li><strong>Verifiable Credentials:</strong> Institutions (universities, governments) issue signed digital credentials on-chain, instantly verifiable by employers and service providers.</li>
        <li><strong>Streamlined KYC/AML:</strong> Shared on-chain attestations reduce repetitive identity checks—once verified, users can onboard to new services swiftly.</li>
      </ul>
      <p>By leveraging blockchain’s foundational properties—decentralization, immutability, and programmability—businesses across these sectors can increase transparency, reduce costs, and empower users with greater control over their assets and data.</p>
    `,
    file: "identity.png",
    gradient: "linear-gradient(135deg, #011528 0%, #007288 100%)"
  }
];

// center of your 600×600 container
const CENTER = 300;

// custom radii per dot
const radii = [175, 225, 275, 175, 225];

// grab elements
// consulted AI for mainImg
const orbit     = document.getElementById("orbitContainer");
const nameEl    = document.getElementById("usecaseName");
const descEl    = document.getElementById("usecaseDesc");
const mainImg   = document.querySelector("#mainImg img");
const dots      = useCases.map((_, i) => {
  const d = document.getElementById("dot" + i);
  d.style.backgroundImage = `url('./assets/${useCases[i].file}')`;
  return d;
});

const N = useCases.length;

// 1) Generate a random start-angle and a random speed for each dot
let angles = Array.from({length: N}, () => Math.random() * Math.PI * 2);
let speeds = Array.from({length: N}, () => 0.0002 + Math.random() * 0.0003);

// 2) The animation loop
let lastTime = null;
function animate(time) {
  if (lastTime !== null) {
    const dt = time - lastTime;
    dots.forEach((dot, i) => {
      angles[i] += speeds[i] * dt;
      const x = CENTER + radii[i] * Math.cos(angles[i]) - 24;
      const y = CENTER + radii[i] * Math.sin(angles[i]) - 24;
      dot.style.left = `${x}px`;
      dot.style.top  = `${y}px`;
    });
  }
  lastTime = time;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// 3) Click handlers
dots.forEach((dot, i) => dot.addEventListener("click", () => selectUseCase(i)));

function selectUseCase(idx) {
  orbit.classList.add("spin");
  setTimeout(() => orbit.classList.remove("spin"), 1000);

  // fade out
  nameEl.style.opacity = descEl.style.opacity = mainImg.style.opacity = 0;

  setTimeout(() => {
    const u = useCases[idx];
    nameEl.textContent = u.name;
    descEl.innerHTML   = u.desc;
    mainImg.src        = `./assets/${u.file}`;
    mainImg.alt        = u.name;
    document.querySelector('body').style.background = u.gradient;
    nameEl.style.opacity = descEl.style.opacity = mainImg.style.opacity = 1;

    // rotate array so next click stays in sync
   // useCases.unshift(useCases.splice(idx, 1)[0]);
  }, 400);
}
