// dados de exemplo; troca por fetch se quiseres vir do backend
const offers = [
  {
    nome: "Residencial Parque, Lisboa",
    taxaAnual: 11.2,
    investidores: 143,
    montante: 39900,
    progresso: 82,
    estado: "A financiar", // "Financiado" fica a vermelho
    imagem: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80",
    token: "LSB1",
    linkProjeto: "projeto-residencial-parque.html"
  },
  {
    nome: "Praça Armando Pimentel, Porto (II)",
    taxaAnual: 12.0,
    investidores: 104,
    montante: 26600,
    progresso: 100,
    estado: "Financiado",
    imagem: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800&q=80",
    token: "PRT2",
    linkProjeto: "projeto-praca-armando.html"
  },
  {
    nome: "Rua da Portela, Nogueira (VII)",
    taxaAnual: 11.5,
    investidores: 206,
    montante: 51300,
    progresso: 100,
    estado: "Financiado",
    imagem: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80",
    token: "BRG7",
    linkProjeto: "projeto-portela-nogueira.html"
  },
  {
    nome: "Residência Académica, Braga",
    taxaAnual: 10.4,
    investidores: 187,
    montante: 46800,
    progresso: 64,
    estado: "A financiar",
    imagem: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80",
    token: "BRG4",
    linkProjeto: "projeto-residencia-academica.html"
  }
];

// util: formatar euros pt-PT
function eur(n) {
  return n.toLocaleString("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

// renderiza um card
function offerCard(o) {
  const isDone = o.progresso >= 100 || o.estado.toLowerCase() === "financiado";
  const badgeClass = isDone ? "red" : "blue";
  const progressStyle = isDone ? "width:100%" : `width:${o.progresso}%`;

  return `
    <article class="offer-card">
      <div class="offer-thumb-wrap">
        <img src="${o.imagem}" alt="${o.nome}" class="offer-thumb" />
        <span class="offer-badge ${badgeClass}">${isDone ? "Financiado" : "A financiar"}</span>
      </div>

      <div class="offer-body">
        <a class="offer-title" href="${o.linkProjeto}">${o.nome}</a>
        <p class="offer-sub muted">Token <strong>${o.token}</strong> • ${o.investidores} investidores</p>

        <div class="offer-metrics">
          <div class="metric">
            <span class="metric-label">Taxa anual</span>
            <span class="metric-value">${o.taxaAnual}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Montante</span>
            <span class="metric-value">${eur(o.montante)}</span>
          </div>
        </div>

        <div class="progress">
          <div class="progress-bar ${isDone ? "done" : ""}" style="${progressStyle}"></div>
        </div>
        <p class="progress-text">${isDone ? "100% financiado" : `${o.progresso}% financiado`}</p>

        <div class="offer-actions">
          <a href="${o.linkProjeto}" class="btn-solid">Ver projeto</a>
          <a href="mercado.html?token=${encodeURIComponent(o.token)}" class="btn-ghost">Mercado secundário</a>
        </div>
      </div>
    </article>
  `;
}

// monta a grelha
function renderOffers() {
  const grid = document.getElementById("offersGrid");
  if (!grid) return;

  // ordena primeiro os "A financiar"
  const sorted = [...offers].sort((a, b) => {
    const doneA = a.estado.toLowerCase() === "financiado";
    const doneB = b.estado.toLowerCase() === "financiado";
    if (doneA !== doneB) return doneA ? 1 : -1;
    return b.progresso - a.progresso;
  });

  grid.innerHTML = sorted.map(offerCard).join("");
}

// atualiza ano no footer
function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

// liga com o app.js (tema + carteira)
function wireBaseEvents() {
  const btnTheme = document.getElementById("btnTheme");
  if (btnTheme) {
    btnTheme.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
    });
  }

  const btnWallet = document.getElementById("btnWallet");
  if (btnWallet) {
    btnWallet.addEventListener("click", () => {
      // so um fake connect para demo
      btnWallet.disabled = true;
      btnWallet.textContent = "✅ Carteira ligada";
      setTimeout(() => (btnWallet.disabled = false), 1200);
    });
  }
}

// init
document.addEventListener("DOMContentLoaded", () => {
  renderOffers();
  setYear();
  wireBaseEvents();
});
