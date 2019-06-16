/* ==================================================
   Constantes
================================================== */

const modulo = document.querySelector(".modulo");
const caractere = document.querySelector(".modulo__caractere");

const padronagem = document.querySelector(".padronagem");

const caractereInput = document.querySelector(".tipografia__caractere");
const tamanhoInput = document.querySelector(".tipografia__tamanho");

const topoInput = document.querySelector(".posicionamento__topo");
const esquerdaInput = document.querySelector(".posicionamento__esquerda");

const limpar = document.querySelector(".opcoes__limpar");
const original = document.querySelector(".opcoes__original");
const salvar = document.querySelector(".opcoes__salvar");

const compartilhar = document.querySelector(".compartilhar__link");

/* ==================================================
   Funções
================================================== */

// Cria a padronagem
function criaPadronagem() {
  // Limpa a padronagem
  while (padronagem.hasChildNodes()) {
    padronagem.removeChild(padronagem.firstChild);
  }

  // Preenche a padronagem
  for (let i = 0; i < 16; i++) {
    const moduloClone = modulo.cloneNode(true);
    moduloClone.classList.add(`modulo-${i + 1}`);
    padronagem.appendChild(moduloClone);
  }
}

// Define a padronagem
function definePadronagem(parametros) {
  caractereInput.value = parametros.caractere.charAt(0);
  tamanhoInput.value = parametros.tamanho;
  topoInput.value = parametros.topo;
  esquerdaInput.value = parametros.esquerda;

  caractere.innerText = parametros.caractere.charAt(0);
  caractere.style.fontSize =
    parametros.tamanho != "" ? `${parametros.tamanho}em` : "";
  caractere.style.top = parametros.topo != "" ? `${parametros.topo}px` : "";
  caractere.style.left =
    parametros.esquerda != "" ? `${parametros.esquerda}px` : "";

  criaPadronagem();
}

// Define caractere
function defineCaractere(valor) {
  caractere.innerText = valor.charAt(0);
  criaPadronagem();
  atualizaUrl();
}

// Define tamanho da fonte
function defineTamanho(valor) {
  caractere.style.fontSize = valor != "" ? `${valor}em` : "";
  criaPadronagem();
  atualizaUrl();
}

// Define distância à esquerda
function defineTopo(valor) {
  caractere.style.top = valor != "" ? `${valor}px` : "";
  criaPadronagem();
  atualizaUrl();
}

// Define distância à direita
function defineEsquerda(valor) {
  caractere.style.left = valor != "" ? `${valor}px` : "";
  criaPadronagem();
  atualizaUrl();
}

// Atualiza a url pra permitir compartilhamento
function atualizaUrl() {
  if (history.pushState) {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const pathname = window.location.pathname;

    const urlCaracter = encodeURIComponent(caractere.innerText);
    const urlTamanho = encodeURIComponent(parseFloat(caractere.style.fontSize));
    const urlTopo = encodeURIComponent(parseFloat(caractere.style.top));
    const urlEsquerda = encodeURIComponent(parseFloat(caractere.style.left));

    const novaUrl = `${protocol}//${host}${pathname}?caractere=${urlCaracter}&tamanho=${urlTamanho}&topo=${urlTopo}&esquerda=${urlEsquerda}`;

    compartilhar.innerText = novaUrl;
    compartilhar.href = novaUrl;
    window.history.pushState({ path: novaUrl }, "", novaUrl);
  }
}

// Inicia o app
function iniciaApp() {
  const parametrosUrl = new URLSearchParams(window.location.search);

  const caractere = parametrosUrl.get("caractere");
  const tamanho = parametrosUrl.get("tamanho");
  const topo = parametrosUrl.get("topo");
  const esquerda = parametrosUrl.get("esquerda");

  if (
    (caractere !== null && caractere !== "NaN" && caractere !== "") ||
    (tamanho !== null && tamanho !== "NaN" && tamanho !== "") ||
    (topo !== null && topo !== "NaN" && topo !== "") ||
    (esquerda !== null && esquerda !== "NaN" && esquerda !== "")
  ) {
    definePadronagem({
      caractere: caractere,
      tamanho: tamanho,
      topo: topo,
      esquerda: esquerda
    });
  } else {
    definePadronagem({
      caractere: "&",
      tamanho: 12,
      topo: 6,
      esquerda: -18
    });
  }
}

/* ==================================================
   Event listeners
================================================== */

// Adiciona event listener aos campos de tipografia
caractereInput.oninput = e => defineCaractere(caractereInput.value);
tamanhoInput.oninput = e => defineTamanho(tamanhoInput.value);

// Adiciona event listener aos campos de posicionamento
topoInput.oninput = e => defineTopo(topoInput.value);
esquerdaInput.oninput = e => defineEsquerda(esquerdaInput.value);

// Adiciona event listener ao botão de limpar
limpar.onclick = e => {
  definePadronagem({
    caractere: "",
    tamanho: "",
    topo: "",
    esquerda: ""
  });

  atualizaUrl();
};

// Adiciona event listener ao botão original
original.onclick = e => {
  definePadronagem({
    caractere: "&",
    tamanho: 12,
    topo: 6,
    esquerda: -18
  });

  atualizaUrl();
};

// Adiciona event listener ao botão de salvar
salvar.onclick = e => {
  domtoimage
    .toPng(padronagem)
    .then(urlImagem => {
      const linkImagem = document.createElement("a");

      linkImagem.style.display = "none";
      linkImagem.download = "padronagem";
      linkImagem.href = urlImagem;

      document.body.appendChild(linkImagem);
      linkImagem.click();
      document.body.removeChild(linkImagem);
    })
    .catch(erro => {
      console.error("Algo deu errado!", erro);
    });
};

// Adiciona event listener aos botões voltar e avançar
window.onpopstate = e => iniciaApp();

/* ==================================================
   Inicialização
================================================== */

window.onload = () => {
  iniciaApp();
  atualizaUrl();
};
