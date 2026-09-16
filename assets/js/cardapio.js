import { supabaseConfig } from "./config.js";

// Mapeamento de texto da URL para o ID numérico (bigint) do banco
const UNIDADES_IDS = {
    "resgate": 1,
    "saude": 2,
    "vale": 3
};

const PRODUTOS_POR_PAGINA = 6;

const content = document.getElementById("content");

// =====================================================
// LEITURA DE PARÂMETROS DA URL
// =====================================================

// Centraliza a leitura de todos os parâmetros relevantes num único lugar.
// Assim, se um dia precisar adicionar mais um filtro, mexe só aqui.
const lerParametrosDaPagina = () => {
    const urlParams = new URLSearchParams(window.location.search);

    const unidadeParam = urlParams.get("unidade")?.toLowerCase();
    const unidade = unidadeParam && UNIDADES_IDS[unidadeParam] ? UNIDADES_IDS[unidadeParam] : null;

    const pagina = parseInt(urlParams.get("pagina")) || 1;

    // .trim() evita que " pizza " e "pizza" sejam tratados como buscas diferentes
    const busca = (urlParams.get("busca") || "").trim();

    return { unidade, pagina, busca };
};

// Gera uma URL preservando os parâmetros atuais e sobrescrevendo só os informados.
// Ex: gerarUrl({ pagina: 2 }) mantém "unidade" e "busca" intactos.
const gerarUrl = (paramsParaAlterar = {}) => {
    const query = new URLSearchParams(window.location.search);

    Object.entries(paramsParaAlterar).forEach(([chave, valor]) => {
        if (valor === null || valor === "") {
            query.delete(chave);
        } else {
            query.set(chave, valor);
        }
    });

    return `?${query.toString()}`;
};

// =====================================================
// FUNÇÕES DE MONTAGEM DE HTML (templates)
// =====================================================

const montarCardProduto = (produto) => `
  <div class="col-md-6 col-ms-2" data-aos="fade-up">
    <div class="menu-item-one">
      <img src="${produto.imagem_url || "assets/images/placeholder.jpg"}" alt="${produto.nome}" />
      <div class="content-wrap">
        <div class="title-wrap">
          <h5>${produto.nome}</h5>
          <span class="price">R$ ${Number(produto.preco || 0).toFixed(2)}</span>
        </div>
        <p>${produto.descricao ?? ""}</p>
      </div>
    </div>
  </div>
`;

const montarTituloCategoria = (nomeCategoria) => `
  <div class="col-md-12" data-aos="fade-up">
    <h2 class="font-heading mt-5 mb-3">${nomeCategoria}</h2>
  </div>
`;

const montarMensagemVazia = (busca, unidade) => {
    if (busca) {
        return `<div class="col-12 text-center">Nenhum produto encontrado para "${busca}".</div>`;
    }
    return `<div class="col-12 text-center">Nenhum produto encontrado para a unidade ${unidade || "Geral"}.</div>`;
};

// =====================================================
// LÓGICA DE DADOS (busca, filtro, agrupamento, paginação)
// =====================================================

const buscarProdutos = async (unidade) => {
    let query = supabaseConfig
        .from("produtos")
        .select("*, categorias(nome, ordem)")
        .eq("disponivel", true);

    if (unidade) {
        query = query.eq("unidade", unidade);
    }

    return query.order("ordem", { foreignTable: "categorias", ascending: true });
};

// Filtra os produtos pelo texto digitado, comparando nome e descrição.
// Feito no cliente porque os produtos da unidade já estão todos carregados.

// Remove acentos ("café" -> "cafe") para "cafe" e "café" serem tratados como a mesma palavra.
const normalizarTexto = (texto) =>
    texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

// Distância de Levenshtein: quantas letras precisam ser trocadas/inseridas/removidas
// para transformar uma palavra na outra. 0 = idêntica, quanto maior, mais diferente.
const distanciaLevenshtein = (a, b) => {
    const linhas = a.length + 1;
    const colunas = b.length + 1;
    const matriz = Array.from({ length: linhas }, (_, i) => [i, ...Array(colunas - 1).fill(0)]);
    matriz[0] = Array.from({ length: colunas }, (_, j) => j);

    for (let i = 1; i < linhas; i++) {
        for (let j = 1; j < colunas; j++) {
            const custo = a[i - 1] === b[j - 1] ? 0 : 1;
            matriz[i][j] = Math.min(
                matriz[i - 1][j] + 1,      // remoção
                matriz[i][j - 1] + 1,      // inserção
                matriz[i - 1][j - 1] + custo // substituição
            );
        }
    }
    return matriz[linhas - 1][colunas - 1];
};

// Quantos erros de digitação são "aceitáveis" depende do tamanho da palavra:
// palavra curta com muitos erros vira outra palavra sem querer.
const distanciaMaximaAceita = (tamanho) => {
    if (tamanho <= 4) return 1;
    if (tamanho <= 8) return 2;
    return 3;
};

// Verifica se ALGUMA palavra do texto do produto é parecida o suficiente
// com ALGUMA palavra digitada pelo usuário.
const textoContemPalavraParecida = (texto, palavrasBusca) => {
    const palavrasTexto = texto.split(/\s+/).filter(Boolean);

    return palavrasBusca.some((palavraBusca) =>
        palavrasTexto.some((palavraTexto) => {
            // Caminho rápido: substring exata (ex: "cerv" dentro de "cerveja")
            if (palavraTexto.includes(palavraBusca)) return true;

            // Caminho fuzzy: tolera erros de digitação
            const distancia = distanciaLevenshtein(palavraBusca, palavraTexto);
            return distancia <= distanciaMaximaAceita(palavraBusca.length);
        })
    );
};

const filtrarPorBusca = (produtos, busca) => {
    if (!busca) return produtos;

    const palavrasBusca = normalizarTexto(busca).split(/\s+/).filter(Boolean);

    return produtos.filter((produto) => {
        const nome = normalizarTexto(produto.nome ?? "");
        const descricao = normalizarTexto(produto.descricao ?? "");
        return (
            textoContemPalavraParecida(nome, palavrasBusca) ||
            textoContemPalavraParecida(descricao, palavrasBusca)
        );
    });
};

const agruparPorCategoria = (produtos) => {
    const grupos = {};
    produtos.forEach((produto) => {
        const nomeCategoria = produto.categorias?.nome ?? "Outros";
        if (!grupos[nomeCategoria]) grupos[nomeCategoria] = [];
        grupos[nomeCategoria].push(produto);
    });
    return grupos;
};

// Achata o objeto agrupado numa lista única, guardando o nome da categoria em cada item.
// Isso é o que permite descobrir "em qual página cada categoria começa".
const achatarComCategoria = (produtosPorCategoria) => {
    const lista = [];
    Object.entries(produtosPorCategoria).forEach(([nomeCategoria, produtosDaCategoria]) => {
        produtosDaCategoria.forEach((prod) => {
            lista.push({ ...prod, categoriaNomePai: nomeCategoria });
        });
    });
    return lista;
};

const calcularPaginaPorCategoria = (listaOrdenada) => {
    const paginaPorCategoria = {};
    listaOrdenada.forEach((prod, index) => {
        const cat = prod.categoriaNomePai;
        if (!(cat in paginaPorCategoria)) {
            paginaPorCategoria[cat] = Math.floor(index / PRODUTOS_POR_PAGINA) + 1;
        }
    });
    return paginaPorCategoria;
};

// =====================================================
// RENDERIZAÇÃO DE BLOCOS DA PÁGINA
// =====================================================

const renderizarMenuCategorias = (categoriasArray, paginaPorCategoria) => `
    <div class="col-12 mb-3" data-aos="fade-up">
        <div class="menu-categorias-scroll d-flex flex-nowrap gap-1">
            ${categoriasArray.map((cat) => {
                const idAncora = cat.replace(/\s+/g, "-").toLowerCase();
                const paginaDaCategoria = paginaPorCategoria[cat] || 1;
                const href = `${gerarUrl({ pagina: paginaDaCategoria })}#cat-${idAncora}`;
                return `
                <a href="${href}" class="btn btn-outline-dark btn-sm rounded-pill px-4 flex-shrink-0">
                    ${cat}
                </a>
            `;
            }).join("")}
        </div>
    </div>
`;

const renderizarProdutos = (produtosFiltradosEAgrupados) =>
    Object.entries(produtosFiltradosEAgrupados)
        .map(([nomeCategoria, produtosDaCategoria]) => {
            const idAncora = nomeCategoria.replace(/\s+/g, "-").toLowerCase();
            return `
                <div id="cat-${idAncora}" class="row w-100 d-contents">
                    ${montarTituloCategoria(nomeCategoria)}
                    ${produtosDaCategoria.map(montarCardProduto).join("")}
                </div>
            `;
        })
        .join("");

const renderizarPaginacao = (paginaAtual, totalPaginas) => {
    if (totalPaginas <= 1) return "";

    return `
        <div class="col-12 d-flex justify-content-center mt-5" data-aos="fade-up">
            <nav aria-label="Navegação do cardápio">
                <ul class="pagination pagination-md">
                    <li class="page-item ${paginaAtual === 1 ? "disabled" : ""}">
                        <a class="page-item page-link" href="${gerarUrl({ pagina: paginaAtual - 1 })}">Anterior</a>
                    </li>
                    ${Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => `
                        <li class="page-item ${paginaAtual === num ? "active" : ""}">
                            <a class="page-item page-link" href="${gerarUrl({ pagina: num })}">${num}</a>
                        </li>
                    `).join("")}
                    <li class="page-item ${paginaAtual === totalPaginas ? "disabled" : ""}">
                        <a class="page-item page-link" href="${gerarUrl({ pagina: paginaAtual + 1 })}">Próximo</a>
                    </li>
                </ul>
            </nav>
        </div>
    `;
};

// =====================================================
// FUNÇÃO PRINCIPAL
// =====================================================

const carregarCardapio = async () => {
    try {
        if (!content) return;
        content.innerHTML = '<div class="col-12 text-center">Carregando cardápio...</div>';

        const { unidade, pagina, busca } = lerParametrosDaPagina();

        const { data, error } = await buscarProdutos(unidade);

        if (error) {
            console.error("Erro Supabase:", error);
            content.innerHTML = '<div class="col-12 text-center text-danger">Erro ao conectar com o banco de dados.</div>';
            return;
        }

        if (!data || data.length === 0) {
            content.innerHTML = montarMensagemVazia(busca, unidade);
            return;
        }

        // Aplica a busca ANTES de agrupar/paginar
        const produtosFiltrados = filtrarPorBusca(data, busca);

        if (produtosFiltrados.length === 0) {
            content.innerHTML = montarMensagemVazia(busca, unidade);
            return;
        }

        const produtosPorCategoria = agruparPorCategoria(produtosFiltrados);
        const listaOrdenada = achatarComCategoria(produtosPorCategoria);
        const paginaPorCategoria = calcularPaginaPorCategoria(listaOrdenada);

        const totalPaginas = Math.ceil(listaOrdenada.length / PRODUTOS_POR_PAGINA);
        let paginaAtual = pagina;
        if (paginaAtual < 1) paginaAtual = 1;
        if (paginaAtual > totalPaginas && totalPaginas > 0) paginaAtual = totalPaginas;

        const inicioIndex = (paginaAtual - 1) * PRODUTOS_POR_PAGINA;
        const produtosExibidosNaPagina = listaOrdenada.slice(inicioIndex, inicioIndex + PRODUTOS_POR_PAGINA);

        const produtosFiltradosEAgrupados = agruparPorCategoria(produtosExibidosNaPagina);

        const menuCategoriasHTML = renderizarMenuCategorias(Object.keys(produtosPorCategoria), paginaPorCategoria);
        const produtosHTML = renderizarProdutos(produtosFiltradosEAgrupados);
        const paginacaoHTML = renderizarPaginacao(paginaAtual, totalPaginas);

        content.innerHTML = menuCategoriasHTML + produtosHTML + paginacaoHTML;

        if (window.location.hash) {
            const alvo = document.querySelector(window.location.hash);
            if (alvo) {
                setTimeout(() => alvo.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
            }
        }

        if (typeof destacarBotaoAtivo === "function") destacarBotaoAtivo();

        if (window.AOS) {
            setTimeout(() => { AOS.refresh(); }, 500);
        }

    } catch (err) {
        console.error("Erro crítico:", err);
        content.innerHTML = '<div class="col-12 text-center">Erro ao processar o cardápio.</div>';
    }
};

// =====================================================
// CAMPO DE BUSCA
// =====================================================

// Espera o usuário parar de digitar por X ms antes de disparar a função.
// Evita refazer a busca a cada tecla apertada.
const debounce = (fn, delay = 350) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

const inicializarCampoBusca = () => {
    const inputBusca = document.getElementById("busca-cardapio");
    if (!inputBusca) return;

    // Preenche o campo com o valor já presente na URL (ex: usuário atualizou a página)
    const { busca } = lerParametrosDaPagina();
    inputBusca.value = busca;

    const aoDigitar = debounce((valor) => {
        const novaUrl = gerarUrl({ busca: valor.trim(), pagina: 1 });
        // Atualiza a URL sem recarregar a página
        window.history.pushState({}, "", novaUrl);
        carregarCardapio();
    });

    inputBusca.addEventListener("input", (e) => aoDigitar(e.target.value));
};

// =====================================================
// DESTAQUE DO BOTÃO DE UNIDADE ATIVA
// =====================================================

const destacarBotaoAtivo = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const unidadeParam = urlParams.get("unidade")?.toLowerCase();

    if (!unidadeParam) return;

    const botoes = document.querySelectorAll(".btn-filtro-unidade");

    botoes.forEach((botao) => {
        const textoBotao = botao.textContent.trim().toLowerCase();
        const hrefBotao = botao.getAttribute("href")?.toLowerCase() || "";

        if (textoBotao === unidadeParam || hrefBotao.includes(`unidade=${unidadeParam}`)) {
            botao.classList.remove("btn-outline-primary");
            botao.classList.add("btn-primary");
        }
    });
};

// =====================================================
// INICIALIZAÇÃO
// =====================================================

carregarCardapio();
inicializarCampoBusca();
destacarBotaoAtivo();