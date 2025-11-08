// ——— dados dos teus 4 projetos ———
const projetos = [
  {
    nome: "Bairro do ISEP, Paranhos, Porto",
    taxaAnual: 11.2,
    investidores: 143,
    montante: 639900,
    progresso: 82,
    estado: "A financiar",
    imagem: "img/Bairro.jpg",
    token: "BIP1",
    linkProjeto: "casa1.html",
    investido: 12500   // tua cota neste projeto
  },
  {
    nome: "Cabana Compartilhada, Paranhos, Porto",
    taxaAnual: 12.0,
    investidores: 104,
    montante: 266700,
    progresso: 100,
    estado: "Financiado",
    imagem: "img/Cabana.jpeg",
    token: "CCP1",
    linkProjeto: "projeto-praca-armando.html",
    investido: 3500
  },
  {
    nome: "Mansão do André Coelho Ribeiro, Maia, Porto",
    taxaAnual: 11.5,
    investidores: 206,
    montante: 1051300,
    progresso: 100,
    estado: "Financiado",
    imagem: "img/mansao.webp",
    token: "MAR3",
    linkProjeto: "projeto-portela-nogueira.html",
    investido: 8700
  },
  {
    nome: "Residência de Projeto ISEP, Porto",
    taxaAnual: 10.4,
    investidores: 187,
    montante: 800600,
    progresso: 64,
    estado: "A financiar",
    imagem: "img/reidencia.jpg",
    token: "LAP1",
    linkProjeto: "projeto-residencia-academica.html",
    investido: 2200
  }
];

// ——— milestones exemplo (podes mapear por projeto) ———
const milestones = [
  { name:"Bairro do ISEP, Paranhos, Porto", step:"Fundação concluída", pct:82, date:"2026-02-01" },
  { name:"Cabana Compartilhada, Paranhos, Porto", step:"Entrega final", pct:100, date:"2025-07-30" },
  { name:"Mansão do André Coelho Ribeiro, Maia, Porto", step:"Liquidação e escritura", pct:100, date:"2025-06-15" },
  { name:"Residência de Projeto ISEP, Porto", step:"Instalações técnicas 64%", pct:64, date:"2026-03-12" }
];

// ——— rendimentos mock por mês (para o gráfico) ———
const monthlyBase = 200; // base visual
const payouts = [
  { date: "2025-08-28", value: 950.00 },
  { date: "2025-09-28", value: 1140.00 },
  { date: "2025-10-28", value: 1320.00 },
  { date: "2025-11-28", value: 1210.00 }
];

// ——— utilitários ———
const fmtEUR = n => n.toLocaleString("pt-PT", { style:"currency", currency:"EUR" });
const daysUntil = iso => Math.ceil((new Date(iso) - new Date()) / (1000*60*60*24));

// ——— KPIs ———
function renderKPIs(){
  // agora soma apenas o que tu investiste
  const totalInvest = projetos.reduce((a,b)=> a + (b.investido || 0), 0);
  const income = payouts.reduce((a,b)=>a + b.value, 0);
  const ativos = projetos.filter(p=>p.estado !== "Financiado").length;
  const yieldMed = (projetos.reduce((a,b)=>a + b.taxaAnual,0)/projetos.length).toFixed(1) + "%";

  document.getElementById("kpiInvested").textContent = fmtEUR(totalInvest);
  document.getElementById("kpiIncome").textContent = fmtEUR(income);
  document.getElementById("kpiActive").textContent = ativos;
  document.getElementById("kpiApy").textContent = yieldMed;
  const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
}

// ——— gráfico avançado em canvas (linha + área + barras + tooltip + legend toggle) ———
const state = { showLine:true, showArea:true, showBars:true };

function drawChart(months=12){
  const canvas = document.getElementById("incomeChart");
  const tt = document.getElementById("tt");
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  // ajustar tamanho ao container
  const rect = canvas.getBoundingClientRect();
  canvas.width  = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  // gerar labels e dados simulados coerentes
  const now = new Date();
  const labels = [];
  const seriesLine = [];
  const seriesBars = [];
  for(let i=months-1;i>=0;i--){
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    labels.push(d.toLocaleDateString("pt-PT",{ month:"short"}));
    const v = monthlyBase + Math.sin((i)/2)*60 + Math.random()*40 + i*3; // crescente suave
    seriesLine.push(v);
    seriesBars.push(Math.max(0, v * (0.35 + Math.random()*0.15))); // % distribuída
  }

  // extremos e padding
  const maxVal = Math.max(...seriesLine, ...seriesBars) * 1.25;
  const padL=44, padR=16, padT=16, padB=28;
  const w = rect.width, h = rect.height;
  const innerW = w - padL - padR, innerH = h - padT - padB;

  // função auxiliar
  const xAt = i => padL + (innerW * (i/(labels.length-1)));
  const yAt = v => padT + innerH * (1 - v/maxVal);

  // fundo grade
  ctx.clearRect(0,0,w,h);
  ctx.strokeStyle = "rgba(255,255,255,.06)";
  ctx.lineWidth = 1;
  for(let g=0; g<=4; g++){
    const y = padT + innerH * (g/4);
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
    const tickVal = Math.round(maxVal * (1 - g/4));
    ctx.fillStyle = "#9aa0a6"; ctx.font = "12px sans-serif";
    ctx.fillText(`${tickVal}€`, 6, y - 4);
  }

  // área (tendência)
  if (state.showArea){
    const grad = ctx.createLinearGradient(0, padT, 0, padT+innerH);
    grad.addColorStop(0,"rgba(56,189,248,.35)");
    grad.addColorStop(1,"rgba(56,189,248,.02)");
    ctx.beginPath();
    seriesLine.forEach((v,i)=>{
      const x=xAt(i), y=yAt(v);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.lineTo(padL+innerW, padT+innerH);
    ctx.lineTo(padL, padT+innerH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // barras (distribuições)
  if (state.showBars){
    const barW = Math.max(6, innerW/labels.length * 0.5);
    ctx.fillStyle = "rgba(59,130,246,.7)";
    seriesBars.forEach((v,i)=>{
      const x = xAt(i) - barW/2;
      const y = yAt(v);
      ctx.fillRect(x, y, barW, (padT+innerH) - y);
    });
  }

  // linha (rendimento mensal)
  if (state.showLine){
    ctx.beginPath();
    seriesLine.forEach((v,i)=>{
      const x=xAt(i), y=yAt(v);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.strokeStyle = "rgba(56,189,248,.9)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // labels do eixo x
  ctx.fillStyle = "#9aa0a6";
  ctx.font = "12px sans-serif";
  labels.forEach((lab,i)=>{
    const x = xAt(i);
    ctx.fillText(lab, x-10, h-8);
  });

  // interação mouse (tooltip)
  canvas.onmousemove = (ev)=>{
    const bx = ev.offsetX;
    let idx = 0, mind = 1e9;
    labels.forEach((_,i)=>{ const dx = Math.abs(xAt(i)-bx); if(dx<mind){mind=dx; idx=i;}});
    const lx = xAt(idx);

    // linha guia
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.15)";
    ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(lx, padT); ctx.lineTo(lx, padT+innerH); ctx.stroke();
    ctx.restore();

    // tooltip
    const lineVal = seriesLine[idx];
    const barVal  = seriesBars[idx];
    const rows = [];
    if (state.showLine) rows.push(`Rendimento: <b>${fmtEUR(lineVal)}</b>`);
    if (state.showBars) rows.push(`Distribuição: <b>${fmtEUR(barVal)}</b>`);
    if (state.showArea) rows.push(`<span style="opacity:.8;">Tendência ativa</span>`);

    const tt = document.getElementById("tt");
    tt.innerHTML = `<div style="margin-bottom:4px;opacity:.8;">${labels[idx]}</div>${rows.join("<br>")}`;
    tt.style.left = Math.min(w-tt.offsetWidth-16, Math.max(8, lx+12)) + "px";
    tt.style.top  = (padT + 10) + "px";
    tt.style.display = "block";
  };
  canvas.onmouseleave = ()=>{ document.getElementById("tt").style.display="none"; };
}

// alternar séries clicando na legenda
document.addEventListener("click", (e)=>{
  const el = e.target.closest(".legend .item");
  if(!el) return;
  const which = el.getAttribute("data-series");
  if (which === "line") state.showLine = !state.showLine;
  if (which === "bars") state.showBars = !state.showBars;
  if (which === "area") state.showArea = !state.showArea;
  el.classList.toggle("off");
  drawChart(parseInt(document.getElementById("selRange").value,10));
});

// exportar CSV rápido (das distribuições mock)
function exportCSV(){
  const rows = [["Data","Valor (€)"], ...payouts.map(p=>[p.date, p.value])];
  const csv = rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download="equihouse-distribuicoes.csv"; a.click();
  URL.revokeObjectURL(url);
}

// marcos técnicos (lista com badge por prazo)
function renderMilestones(){
  const wrap = document.getElementById("milestonesList");
  wrap.innerHTML = "";
  milestones.forEach(m=>{
    const days = daysUntil(m.date);
    const badge = days<0 ? "danger" : days<=30 ? "warn" : "ok";
    const label = days<0 ? "concluído" : `${days} dias`;
    const el = document.createElement("div");
    el.innerHTML = `
      <div style="display:flex; justify-content:space-between; gap:12px; align-items:center;">
        <div>
          <div style="font-weight:600;">${m.name}</div>
          <div class="muted">${m.step} • ${new Date(m.date).toLocaleDateString("pt-PT")}</div>
        </div>
        <div style="min-width:220px;">
          <div class="progress"><span style="width:${m.pct}%"></span></div>
        </div>
        <span class="badge ${badge}">${label}</span>
      </div>
    `;
    wrap.appendChild(el);
  });
}

// tabela de projetos (com coluna "Investido")
function renderTabela(){
  const q = (document.getElementById("searchInvest")?.value || "").trim().toLowerCase();
  const st = (document.getElementById("statusInvest")?.value || "");
  const tbody = document.getElementById("tbodyInvest");
  tbody.innerHTML = "";

  projetos
    .filter(p => (!q || p.nome.toLowerCase().includes(q) || p.token.toLowerCase().includes(q)))
    .filter(p => (!st || p.estado === st))
    .forEach(p=>{
      const cor = p.estado === "Financiado" ? "danger" : "ok";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <a class="project" href="${p.linkProjeto}" style="color:#fff; text-decoration:none;">
            <img src="${p.imagem}" alt="${p.nome}"/>
            <div>${p.nome}</div>
          </a>
        </td>
        <td>${p.token}</td>
        <td>${p.taxaAnual.toFixed(1)}% a.a.</td>
        <td>${fmtEUR(p.montante)}</td>
        <td>${fmtEUR(p.investido || 0)}</td>  <!-- novo: tua cota -->
        <td style="min-width:180px;"><div class="progress"><span style="width:${p.progresso}%"></span></div></td>
        <td><span class="badge ${cor}">${p.estado}</span></td>
      `;
      tbody.appendChild(tr);
    });

  // kpis: agora com soma da tua cota (não o preço dos projetos)
  const total = projetos.reduce((a,b)=> a + (b.investido || 0), 0);
  document.getElementById("kpiInvested").textContent = fmtEUR(total);
  const income = payouts.reduce((a,b)=>a + b.value, 0);
  document.getElementById("kpiIncome").textContent = fmtEUR(income);
  document.getElementById("kpiActive").textContent = projetos.filter(p=>p.estado!=="Financiado").length;
  const yieldMed = (projetos.reduce((a,b)=>a + b.taxaAnual,0)/projetos.length).toFixed(1) + "%";
  document.getElementById("kpiApy").textContent = yieldMed;
}

// eventos
document.getElementById("selRange")?.addEventListener("change", e => drawChart(parseInt(e.target.value,10)));
document.getElementById("btnExport")?.addEventListener("click", exportCSV);
document.getElementById("searchInvest")?.addEventListener("input", renderTabela);
document.getElementById("statusInvest")?.addEventListener("change", renderTabela);

// init
(function init(){
  renderKPIs();
  drawChart(12);
  renderMilestones();
  renderTabela();
})();

// responsivo
window.addEventListener("resize", ()=> {
  drawChart(parseInt(document.getElementById("selRange")?.value || "12",10));
});
