// mini dataset (idealmente vem do mesmo backend do mercado.js)
const marketMap = {
  LSB1: { nome: "Residencial Parque, Lisboa", last: 10.8, high24: 11.4, vol24: 4320 },
  PRT2: { nome: "Praça Armando Pimentel, Porto (II)", last: 12.2, high24: 12.9, vol24: 1990 },
  BRG7: { nome: "Rua da Portela, Nogueira (VII)", last: 8.9, high24: 9.3, vol24: 2760 },
  BRG4: { nome: "Residência Académica, Braga", last: 7.8, high24: 8.1, vol24: 1430 }
};

// livro de ordens gerado na hora (só para demo)
function genOrderBook(last) {
  // nao é realista, mas serve para ver estrutura
  const asks = Array.from({length: 6}, (_,i)=>({ price: +(last + 0.05*(i+1)).toFixed(2), qty: (Math.floor(Math.random()*40)+10)}));
  const bids = Array.from({length: 6}, (_,i)=>({ price: +(last - 0.05*(i+1)).toFixed(2), qty: (Math.floor(Math.random()*40)+10)}));
  bids.sort((a,b)=> b.price - a.price);
  return { asks, bids };
}

// gráfico fake (sparkline)
function drawChart(ctx, last) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  // limpa
  ctx.clearRect(0,0,W,H);
  // gera pontos
  const points = Array.from({length: 48}, ()=> last + (Math.random()-0.5)*0.8);
  const min = Math.min(...points), max = Math.max(...points);
  const pad = 20;

  // eixos minimalistas
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(pad, H - pad);
  ctx.lineTo(W - pad, H - pad);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((v,i)=>{
    const x = pad + (i/(points.length-1))*(W-2*pad);
    const y = pad + (1-(v-min)/(max-min||1))*(H-2*pad);
    if (i===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  });
  ctx.stroke();

  // último ponto
  const lastX = pad + ((points.length-1)/(points.length-1))*(W-2*pad);
  const lastY = pad + (1-(points.at(-1)-min)/(max-min||1))*(H-2*pad);
  ctx.fillRect(lastX-2,lastY-2,4,4);
}

const eur = n => n.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });

// render helpers
function renderHeader(token) {
  const m = marketMap[token];
  if (!m) return;
  document.getElementById("tNome").textContent = m.nome;
  document.getElementById("tTicker").textContent = token;
  document.getElementById("tLast").textContent = eur(m.last);
  document.getElementById("tHigh").textContent = eur(m.high24);
  document.getElementById("tVol").textContent  = m.vol24.toLocaleString("pt-PT");

  const ctx = document.getElementById("chart").getContext("2d");
  drawChart(ctx, m.last);
}

function renderOrderBook(token) {
  const m = marketMap[token];
  if (!m) return;
  const {asks, bids} = genOrderBook(m.last);

  const toTable = (rows, side) => `
    <div class="table small">
      <div class="row header">
        <div class="cell">Preço</div>
        <div class="cell">Qtd</div>
        <div class="cell">Total</div>
      </div>
      ${rows.map(r=>`
        <div class="row">
          <div class="cell ${side==='sell'?'sell':''}"><strong>${eur(r.price)}</strong></div>
          <div class="cell">${r.qty}</div>
          <div class="cell">${eur(r.price*r.qty)}</div>
        </div>
      `).join("")}
    </div>
  `;

  document.getElementById("asks").innerHTML = toTable(asks, "sell");
  document.getElementById("bids").innerHTML = toTable(bids, "buy");
}

function wireTradeBox(token) {
  const sideInput = document.getElementById("side");
  const price = document.getElementById("price");
  const qty = document.getElementById("qty");
  const total = document.getElementById("total");
  const tabs = document.querySelectorAll(".tab");

  // muda aba buy/sell
  tabs.forEach(t=>{
    t.addEventListener("click", ()=>{
      tabs.forEach(x=>x.classList.remove("active"));
      t.classList.add("active");
      sideInput.value = t.dataset.side;
    });
  });

  // preencher rápido pelo query param &tab=sell
  const params = new URLSearchParams(location.search);
  if (params.get("tab")==="sell") {
    tabs.forEach(t=>{
      t.classList.toggle("active", t.dataset.side==="sell");
    });
    sideInput.value = "sell";
  }

  // atualizar total
  function updateTotal(){
    const p = parseFloat(price.value||"0"), q = parseFloat(qty.value||"0");
    total.textContent = eur((p*q)||0);
  }
  price.addEventListener("input", updateTotal);
  qty.addEventListener("input", updateTotal);

  // submeter (fake)
  const form = document.getElementById("orderForm");
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    form.querySelector("button[type=submit]").textContent = "Adicionado ✅";
    setTimeout(()=> form.querySelector("button[type=submit]").textContent = "Adicionar ordem", 1000);
    // aqui fariamos POST para a tua API
  });

  // as minhas ordens neste mercado (mock)
  const my = [
    { side: "sell", price: 11.2, qty: 10 },
    { side: "buy",  price: 10.5, qty: 15 }
  ];
  document.getElementById("myOrdersThis").innerHTML = `
    <div class="table small">
      <div class="row header">
        <div class="cell">Lado</div>
        <div class="cell">Preço</div>
        <div class="cell">Qtd</div>
        <div class="cell">Total</div>
      </div>
      ${my.map(o=>`
        <div class="row">
          <div class="cell ${o.side==='sell'?'sell':'buy'}">${o.side.toUpperCase()}</div>
          <div class="cell">${eur(o.price)}</div>
          <div class="cell">${o.qty}</div>
          <div class="cell">${eur(o.price*o.qty)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", ()=>{
  const params = new URLSearchParams(location.search);
  const token = params.get("token") || "LSB1";
  renderHeader(token);
  renderOrderBook(token);
  wireTradeBox(token);
  setYear();
});
