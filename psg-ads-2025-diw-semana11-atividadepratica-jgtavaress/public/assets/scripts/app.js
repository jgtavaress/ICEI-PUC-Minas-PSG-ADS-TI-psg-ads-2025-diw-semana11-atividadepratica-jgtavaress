// Obtém o ID da receita a partir da URL
function obterIdDaUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

// Carrega as receitas a partir do arquivo JSON
async function carregarReceitas() {
  const resposta = await fetch('receitas.json');
  const dados = await resposta.json();
  return dados;
}

// Cria os cards dinamicamente na home
async function criarCards(filtro = "") {
  const container = document.querySelector("#area-cards");

  container.innerHTML = ""; // Limpa os cards anteriores

  const receitas = await carregarReceitas();
  const receitasFiltradas = receitas.filter(item =>
    item.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  receitasFiltradas.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4 mb-4";


    const card = document.createElement("div");
    card.className = "card h-100";

    card.innerHTML = `
      <img src="${item.imagem}" alt="${item.titulo}" class="card-img-top" />
      <div class="card-body d-flex flex-column">
        <h3 class="card-title">${item.titulo}</h3>
        <p class="card-text">${item.descricao}</p>
        <a href="detalhes.html?id=${item.id}" class="btn btn-outline-warning mt-auto">Ver Receita</a>
      </div>
    `;

    col.appendChild(card);
    container.appendChild(col);
  });
}

// Mostra os detalhes da receita na página de detalhes
async function mostrarDetalhesReceita() {
  const id = obterIdDaUrl();
  const receitas = await carregarReceitas();
  const receita = receitas.find(item => item.id === id);
  const container = document.getElementById("detalhes-receita");

  if (receita) {
    container.innerHTML = `
      <img src="${receita.imagem}" alt="${receita.titulo}" class="receita-img" />
      <h1>${receita.titulo}</h1>
      <p class="meta">Por ${receita.autor} • ${receita.data}</p>
      <p class="conteudo">${receita.conteudo}</p>
      ${receita.dica ? `<div class="dica"><strong>Dica:</strong> ${receita.dica}</div>` : ''}
    `;
  } else {
    container.innerHTML = "<p>Receita não encontrada.</p>";
  }
}
// Cria o carrossel de destaques com receitas
async function criarCarrossel() {
  const receitas = await carregarReceitas();
  const container = document.getElementById("carousel-inner");

  if (!container) return;

  receitas.slice(0, 5).forEach((item, index) => {
    const activeClass = index === 0 ? "active" : "";

    const slide = document.createElement("div");
    slide.className = `carousel-item ${activeClass}`;
    slide.innerHTML = `
      <img src="${item.imagem}" class="d-block w-100 rounded" style="height: 400px; object-fit: cover;" alt="${item.titulo}">
      <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
        <h5>${item.titulo}</h5>
        <p>${item.descricao}</p>
        <a href="detalhes.html?id=${item.id}" class="btn btn-outline-light">Ver Receita</a>
      </div>
    `;
    container.appendChild(slide);
  });
}

// Inicializa as funções corretas com base na página
if (document.querySelector("#container-receitas")) {
  criarCards();
  criarCarrossel(); // ⬅️ Aqui!

  const input = document.getElementById("campo-busca");
  if (input) {
    input.addEventListener("input", () => {
      criarCards(input.value);
    });
  }
} 
else if (document.querySelector("#detalhes-receita")) {
  const container = document.getElementById("detalhes-receita");
  container.innerHTML = "<p>Carregando receita...</p>"; 
  mostrarDetalhesReceita();
}
fetch("http://localhost:3000/receitas")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("receitas");
    data.forEach(receita => {
      const card = `
        <div class="card">
          <img src="${receita.imagem}" alt="${receita.titulo}" />
          <h3>${receita.titulo}</h3>
          <p>${receita.descricao}</p>
          <small>${receita.data}</small>
        </div>
      `;
      container.innerHTML += card;
    });
  })
  .catch(error => console.error("Erro ao carregar receitas:", error));
