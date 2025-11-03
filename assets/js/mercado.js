// assets/js/mercado.js

// ————————————————————————————————————————————
// dataset “mock” com imagens dos edifícios
// (podes trocar os URLs pelas tuas imagens)
// ————————————————————————————————————————————
const holdings = [
  {
    token: "LSB1",
    nome: "Residencial Parque, Lisboa",
    qty: 120,
    last: 10.8,
    img: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=600&q=80"
  },
  {
    token: "PRT2",
    nome: "Praça Armando Pimentel, Porto (II)",
    qty: 40,
    last: 12.2,
    img: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=600&q=80"
  },
  {
    token: "BRG7",
    nome: "Rua da Portela, Nogueira (VII)",
    qty: 0,
    last: 8.9,
    img: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80"
  }
];

const mySellOrders = [
  { token: "LSB1", price: 11.2, qty: 20, createdAt: "2025-10-27 14:22" },
  { token: "PRT2", price: 12.9, qty: 10, createdAt: "2025-10-30 09:11" }
];

const myBuyOrders = [
  { token: "LSB1", price: 10.4, qty: 25, createdAt: "2025-10-29 18:02" },
  { token: "BRG7", price: 8.2, qty: 50, createdAt: "2025-11-02 12:40" }
];

const markets = [
  {
    token: "LSB1",
    nome: "Residencial Parque, Lisboa",
    last: 10.8,
    high24: 11.4,
    vol24: 4320,
    img: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=600&q=80"
  },
  {
    token: "PRT2",
    nome: "Praça Armando Pimentel, Porto (II)",
    last: 12.2,
    high24: 12.9,
    vol24: 1990,
    img: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=600&q=80"
  },
  {
    token: "BRG7",
    nome: "Rua da Portela, Nogueira (VII)",
    last: 8.9,
    high24: 9.3,
    vol24: 2760,
    img: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80"
  },
  {
    token: "BRG4",
    nome: "Residência Académica, Braga",
    last: 7.8,
    high24: 8.1,
    vol24: 1430,
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80"
  }
];

// ————————————————————————————————————————————
// utils
// ————————————————————————————————————————————
const eur = n => n.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
const short = id => (id ? id.slice(0, 6) + "…" + id.slice(-4) : "—");

// devolve a imagem associada a um token
function getImg(token) {
  const fromMarkets = markets.find(m => m.token === token)?.img;
  if (fromMarkets) return fromMarkets;
  const fromHoldings = holdings.find(h => h.token === token)?.img;
  return fromHoldings || "";
}

// criar (ou obter) um walletId simples
function ensureWalletId() {
  let id = localStorage.getItem("walletId");
  if (!id) {
    id = "0x" + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10);
    localStorage.setItem("walletId", id);
  }
  return id;
}

// ————————————————————————————————————————————
// render: carteira
// ————————————————————————————————————————————
function renderWallet() {
  const id = ensureWalletId();
  const el = document.getElementById("walletId");
  if (el) el.textContent = short(id);

  const copy = document.getElementById("btnCopy");
  if (copy) {
    copy.onclick = () => {
      navigator.clipboard.writeText(id).then(() => {
        copy.textContent = "Copiado ✅";
        setTimeout(() => (copy.textContent = "Copiar"), 1000);
      });
    };
  }
}

// ————————————————————————————————————————————
// render: holdings (tokens do utilizador)
// ————————————————————————————————————————————
function renderHoldings() {
  const root = document.getElementById("holdingsTable");
  if (!root) return;

  if (!holdings.length) {
    root.innerHTML = `<div class="empty">Não tens tokens. Vai a <a href="projetos.html">Projetos</a> e investe num edifício.</div>`;
    return;
  }

  const rows = holdings
    .map(h => {
      const thumb = h.img || getImg(h.token);
      return `
      <div class="row">
        <div class="cell grow">
          <div class="cell-thumb">
            <img src="${thumb}" alt="${h.nome}" class="thumb" loading="lazy" />
            <div>
              <strong>${h.token}</strong><br>
              <span class="muted">${h.nome}</span>
            </div>
          </div>
        </div>
        <div class="cell">Qtd: <strong>${h.qty}</strong></div>
        <div class="cell">Último: <strong>${eur(h.last)}</strong></div>
        <div class="cell actions">
          <a class="btn-ghost" href="mercado-token.html?token=${encodeURIComponent(h.token)}">Abrir mercado</a>
          <a class="btn-solid ${h.qty <= 0 ? "is-disabled":""}" href="mercado-token.html?token=${encodeURIComponent(h.token)}&tab=sell">Vender</a>
        </div>
      </div>
    `;
    })
    .join("");

  root.innerHTML = `
    <div class="table">
      <!-- sem header pesado, layout tipo cartões -->
      ${rows}
    </div>
  `;
}

// ————————————————————————————————————————————
// render: ordens do utilizador (vendas/compras)
// ————————————————————————————————————————————
function renderOrders() {
  const sellRoot = document.getElementById("mySells");
  const buyRoot  = document.getElementById("myBuys");

  const draw = (root, list, emptyText) => {
    if (!root) return;
    if (!list.length) {
      root.innerHTML = `<div class="empty">${emptyText}</div>`;
      return;
    }
    root.innerHTML = `
      <div class="table">
        ${list
          .map(o => {
            const thumb = getImg(o.token);
            return `
            <div class="row">
              <div class="cell grow">
                <div class="cell-thumb">
                  <img src="${thumb}" alt="${o.token}" class="thumb" loading="lazy" />
                  <div><strong>${o.token}</strong><br><span class="muted">${o.createdAt}</span></div>
                </div>
              </div>
              <div class="cell"><strong>${eur(o.price)}</strong></div>
              <div class="cell">${o.qty}</div>
              <div class="cell actions">
                <a class="btn-ghost" href="mercado-token.html?token=${encodeURIComponent(o.token)}">Ver mercado</a>
                <button class="btn-ghost danger" data-cancel="${o.token}|${o.price}|${o.qty}">Cancelar</button>
              </div>
            </div>`;
          })
          .join("")}
      </div>
    `;

    // handler de cancelar (fake)
    root.querySelectorAll("[data-cancel]").forEach(btn => {
      btn.addEventListener("click", () => {
        btn.textContent = "Cancelado";
        btn.disabled = true;
      });
    });
  };

  draw(sellRoot, mySellOrders, "Não tens anúncios de venda ativos.");
  draw(buyRoot,  myBuyOrders,  "Não tens pedidos de compra ativos.");
}

// ————————————————————————————————————————————
// render: lista de mercados por edifício/token
// ————————————————————————————————————————————
function renderMarkets() {
  const root = document.getElementById("marketsList");
  const filtro = document.getElementById("filtroToken");
  const ordenar = document.getElementById("ordenarPor");
  if (!root) return;

  let data = [...markets];

  // filtro por token/nome
  const f = (filtro?.value || "").trim().toUpperCase();
  if (f) data = data.filter(m => m.token.toUpperCase().includes(f) || m.nome.toUpperCase().includes(f));

  // ordenação
  const ord = ordenar?.value || "vol";
  const key = ord === "last" ? "last" : ord === "high" ? "high24" : "vol24";
  data.sort((a,b)=> b[key] - a[key]);

  root.innerHTML = `
    <div class="table">
      <div class="row header">
        <div class="cell">Edifício / Token</div>
        <div class="cell">Último</div>
        <div class="cell">Máx 24h</div>
        <div class="cell">Vol 24h</div>
        <div class="cell">Abrir</div>
      </div>
      ${data.map(m => `
        <div class="row">
          <div class="cell grow">
            <div class="cell-thumb">
              <img src="${m.img}" alt="${m.nome}" class="thumb" loading="lazy" />
              <div>
                <strong>${m.nome}</strong><br>
                <span class="muted">${m.token}</span>
              </div>
            </div>
          </div>
          <div class="cell"><strong>${eur(m.last)}</strong></div>
          <div class="cell">${eur(m.high24)}</div>
          <div class="cell">${m.vol24.toLocaleString("pt-PT")}</div>
          <div class="cell">
            <a class="btn-solid" href="mercado-token.html?token=${encodeURIComponent(m.token)}">Abrir</a>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// ————————————————————————————————————————————
// filtros (input + select)
// ————————————————————————————————————————————
function wireFilters() {
  const filtro = document.getElementById("filtroToken");
  const ordenar = document.getElementById("ordenarPor");
  if (filtro) filtro.addEventListener("input", renderMarkets);
  if (ordenar) ordenar.addEventListener("change", renderMarkets);
}

// ————————————————————————————————————————————
// util: ano no footer
// ————————————————————————————————————————————
function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

// ————————————————————————————————————————————
// init
// ————————————————————————————————————————————
document.addEventListener("DOMContentLoaded", ()=>{
  renderWallet();
  renderHoldings();
  renderOrders();
  renderMarkets();
  wireFilters();
  setYear();
});
