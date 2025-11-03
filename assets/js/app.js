// muda tema claro/escuro
const btnTheme = document.getElementById('btnTheme');
if (btnTheme) {
  btnTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    // nota: podes criar a classe .dark no css se quiseres outro tema
  });
}

// simulação de login web3
const btnWallet = document.getElementById('btnWallet');
if (btnWallet) {
  btnWallet.addEventListener('click', async () => {
    // isto é só a simulação. no mundo real: window.ethereum.request({ method: 'eth_requestAccounts' })
    alert('a ligar carteira web3... (demo)\nse tivesse Metamask aberta, pedia-te autorização 😉');
    btnWallet.textContent = '✅ Carteira ligada';
  });
}

// projetos fake
const projetos = [
  {
    nome: 'Edifício Riverside, Porto',
    token: 'ED1',
    objetivo: '450 000 €',
    precoToken: '100 €',
    estado: 'A captar',
    img: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=600'
  },
  {
    nome: 'Residência Santos, Lisboa',
    token: 'LS2',
    objetivo: '320 000 €',
    precoToken: '250 €',
    estado: 'A captar',
    img: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=600'
  },
  {
    nome: 'Alojamento Estudantil, Braga',
    token: 'BRG3',
    objetivo: '95 000 €',
    precoToken: '75 €',
    estado: 'A captar',
    img: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600'
  }
];

const listaProjetos = document.getElementById('listaProjetos');
if (listaProjetos) {
  projetos.forEach((p) => {
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <img src="${p.img}" alt="${p.nome}" style="width:100%;height:130px;object-fit:cover;border-radius:0.7rem;margin-bottom:0.6rem;">
      <span class="badge-token">${p.token}</span>
      <h3>${p.nome}</h3>
      <p>Objetivo: <strong>${p.objetivo}</strong></p>
      <p>Preço do token: <strong>${p.precoToken}</strong></p>
      <p class="muted">${p.estado}</p>
      <button class="btn primary" onclick="investirToken('${p.token}')">Comprar tokens ${p.token}</button>
    `;
    listaProjetos.appendChild(el);
  });
}

function investirToken(token) {
  alert(`comprar tokens do projeto ${token} (demo)`);
}

// mercado secundário
const mercado = [
  { token: 'ED1', projeto: 'Edifício Riverside, Porto', preco: 101, qty: 12, yield: '7,8%' },
  { token: 'LS2', projeto: 'Residência Santos, Lisboa', preco: 249, qty: 4, yield: '7,4%' },
  { token: 'BRG3', projeto: 'Alojamento Estudantil, Braga', preco: 76, qty: 30, yield: '6,9%' }
];

const mercadoLista = document.getElementById('mercadoLista');
let grafico;

if (mercadoLista) {
  mercado.forEach((m) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <div>
        <strong>${m.projeto}</strong>
        <div class="muted">${m.token}</div>
      </div>
      <div>${m.preco} €</div>
      <div>${m.yield}</div>
      <div>${m.qty} tokens</div>
      <div><button class="btn primary" onclick="selecionarToken('${m.token}')">Ver gráfico</button></div>
    `;
    mercadoLista.appendChild(row);
  });

  // cria gráfico base com token ED1
  desenharGrafico('ED1');
}

// desenha gráfico simples com canvas
function desenharGrafico(token) {
  const canvas = document.getElementById('graficoMercado');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // limpa
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // dados fake diferentes por token
  const base = token === 'ED1' ? [100, 101, 102, 101, 103, 104] :
               token === 'LS2' ? [250, 249, 248, 249, 251, 252] :
               [75, 76, 76, 77, 78, 78];

  // desenhar eixos very basic
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 10);
  ctx.lineTo(30, 200);
  ctx.lineTo(380, 200);
  ctx.stroke();

  // desenhar linha
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 2;
  ctx.beginPath();
  base.forEach((val, i) => {
    const x = 40 + i * 55;
    // 200 é baixo, 10 é topo → inverter
    const y = 200 - (val - base[0]) * 6; // escala manhosa mas serve
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // título
  ctx.fillStyle = '#0f172a';
  ctx.font = '12px system-ui';
  ctx.fillText('Histórico do token ' + token, 32, 20);
}

function selecionarToken(token) {
  desenharGrafico(token);
  alert(`a mostrar histórico do token ${token}`);
}


