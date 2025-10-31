// gera os cards de ofertas (para não ficares a repetir html)
const offers = [
  {
    nome: "Praça Armando Pimentel, Porto (II)",
    taxa: "12% p.a",
    investidores: 104,
    montante: "26 600€",
    progresso: 100,
    estado: "Financiado"
  },
  {
    nome: "Rua da Portela, Nogueira (VII)",
    taxa: "11,5% p.a",
    investidores: 206,
    montante: "51 300€",
    progresso: 100,
    estado: "Financiado"
  },
  {
    nome: "Residencial Parque, Lisboa",
    taxa: "10,2% p.a",
    investidores: 143,
    montante: "39 900€",
    progresso: 82,
    estado: "A financiar"
  },
  {
    nome: "Lote industrial, Braga",
    taxa: "9,8% p.a",
    investidores: 88,
    montante: "21 000€",
    progresso: 57,
    estado: "A financiar"
  }
];

const grid = document.getElementById("offersGrid");
if (grid) {
  offers.forEach((o) => {
    const card = document.createElement("article");
    card.className = "offer-card";
    card.innerHTML = `
      <div class="offer-top">
        <div>
          <h3>${o.nome}</h3>
          <small>${o.investidores} investidores</small>
        </div>
        <span class="badge">${o.estado}</span>
      </div>
      <div class="offer-meta">
        <span><strong>${o.taxa}</strong></span>
        <span>${o.montante}</span>
      </div>
      <div class="progress">
        <div style="width:${o.progresso}%;"></div>
      </div>
      <button class="btn outline">Ver projeto</button>
    `;
    grid.appendChild(card);
  });
}

// menu mobile
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

// newsletter fake
const form = document.getElementById("newsletterForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("subscreveste (fake). mete aqui o teu fetch depois.");
    form.reset();
  });
}

// ano no footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// scroll suave
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth" });
}

// lang toggle (só para parecer pro)
const btnLang = document.getElementById("btnLang");
if (btnLang) {
  btnLang.addEventListener("click", () => {
    // so mostra que clicaste
    alert("a troca de idioma aqui é só visual. mete o teu handler.");
  });
}
