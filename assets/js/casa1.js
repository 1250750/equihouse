document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // botão de investir (simulação)
  const btn = document.getElementById("btnInvestir");
  if (btn) {
    btn.addEventListener("click", () => {
      alert("Para investir, liga a tua carteira digital e confirma o montante no painel de projetos.");
    });
  }
});
