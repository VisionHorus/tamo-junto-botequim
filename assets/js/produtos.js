import { supabaseConfig } from "./config.js";

// =========================================
// PROTEÇÃO: só deixa continuar se estiver logado
// =========================================
const {
  data: { session },
} = await supabaseConfig.auth.getSession();

if (!session) {
  window.location.href = "login.html";
}

// =========================================
// ELEMENTOS
// =========================================
const nomeInput = document.getElementById("nome");
const descricaoInput = document.getElementById("descricao");
const precoInput = document.getElementById("preco");
const categoriaSelect = document.getElementById("categoria");
const unidadeSelect = document.getElementById("unidade");
const imagemInput = document.getElementById("imagem");
const button = document.getElementById("btn");
const main = document.getElementById("content");

const modal = document.getElementById("modal-produto");
const modalTitulo = document.getElementById("modal-titulo");
const abrirModalCriarBtn = document.getElementById("abrir-modal-criar");
const fecharModalBtn = document.getElementById("fechar-modal");
const cancelarModalBtn = document.getElementById("cancelar-modal");

let editingProductId = null;
let imagemAtualUrl = null;

// =========================================
// CONTROLE DO MODAL
// =========================================
const abrirModal = (modo) => {
  modalTitulo.textContent = modo === "editar" ? "Editar Produto" : "Adicionar Produto";
  button.textContent = modo === "editar" ? "Atualizar Produto" : "Salvar Produto";
  modal.classList.remove("hidden");
};

const fecharModal = () => {
  modal.classList.add("hidden");
  limparFormulario();
};

const limparFormulario = () => {
  nomeInput.value = "";
  descricaoInput.value = "";
  precoInput.value = "";
  categoriaSelect.value = "";
  imagemInput.value = "";
  imagemAtualUrl = null;
  editingProductId = null;
};

abrirModalCriarBtn.addEventListener("click", () => {
  limparFormulario();
  abrirModal("criar");
});

fecharModalBtn.addEventListener("click", fecharModal);
cancelarModalBtn.addEventListener("click", fecharModal);

// fecha clicando fora da caixa branca (no fundo escuro)
modal.addEventListener("click", (event) => {
  if (event.target === modal) fecharModal();
});


// =========================================
// CARREGAR UNIDADES NO <select>
// =========================================
const fetchUnidades = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from("unidades")
      .select()
      .order("nome", { ascending: true });

    if (error) {
      console.error("Erro ao buscar unidades:", error);
      return;
    }

    unidadeSelect.innerHTML =
      `<option value="">Selecione</option>` +
      data.map((unidade) => `<option value="${unidade.id}">${unidade.nome}</option>`).join("");
  } catch (error) {
    console.error("Erro inesperado ao buscar unidades:", error);
  }
};

// =========================================
// CARREGAR CATEGORIAS NO <select>
// =========================================
const fetchCategorias = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from("categorias")
      .select()
      .order("ordem", { ascending: true });

    if (error) {
      console.error("Erro ao buscar categorias:", error);
      return;
    }

    categoriaSelect.innerHTML =
      `<option value="">Selecione</option>` +
      data.map((cat) => `<option value="${cat.id}">${cat.nome}</option>`).join("");
  } catch (error) {
    console.error("Erro inesperado ao buscar categorias:", error);
  }
};

// =========================================
// CARREGAR E LISTAR PRODUTOS
// =========================================
const fetchData = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from("produtos")
      .select(`
          *,
          categorias(nome),
          unidades(nome)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar produtos:", error);
      return;
    }

    main.innerHTML = "";

    data.forEach((produto) => {
      main.innerHTML += `
        <div class="bg-white border border-[#E4E2E0] rounded-lg shadow-sm overflow-hidden flex flex-col">
          ${
            produto.imagem_url
              ? `<img src="${produto.imagem_url}" alt="${produto.nome}" class="w-full h-40 object-cover" />`
              : `<div class="w-full h-40 bg-[#F6F5F4] flex items-center justify-center text-[#6F6F72]"><i class="fa-solid fa-image text-2xl"></i></div>`
          }
          <div class="p-4 flex flex-col gap-1 flex-1">
            <h3 class="font-semibold text-[#2E2E2F]">${produto.nome}</h3>
            <p class="text-sm text-[#6F6F72] line-clamp-2">${produto.descricao ?? ""}</p>
            <div class="flex items-center justify-between mt-2">
              <span class="font-semibold text-[#C47F4A]">R$ ${Number(produto.preco).toFixed(2)}</span>
              <span class="text-xs text-[#6F6F72]">${produto.categorias?.nome ?? "Sem categoria"}</span>
            </div>
            <div class="flex gap-2 mt-3">
              <button
                class="update-btn flex-1 border border-[#E4E2E0] text-[#6F6F72] hover:bg-[#F6F5F4] rounded-md px-3 py-1.5 text-sm"
                data-id="${produto.id}"
                data-nome="${produto.nome}"
                data-descricao="${produto.descricao ?? ""}"
                data-preco="${produto.preco}"
                data-categoria="${produto.categoria_id ?? ""}"
                data-imagem="${produto.imagem_url ?? ""}"
                data-unidade="${produto.unidade_id ?? ""}"
              >Editar</button>
              <button
                class="delete-btn flex-1 border border-red-200 text-red-500 hover:bg-red-50 rounded-md px-3 py-1.5 text-sm"
                data-id="${produto.id}"
              >Excluir</button>
            </div>
          </div>
        </div>`;
    });

    attachDeleteHandlers();
    attachUpdateHandlers();
  } catch (error) {
    console.error("Erro inesperado ao buscar produtos:", error);
  }
};

// =========================================
// EXCLUIR PRODUTO
// =========================================
const attachDeleteHandlers = () => {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const produtoId = event.target.getAttribute("data-id");

      const confirmacao = await Swal.fire({
        title: "Excluir produto?",
        text: "Essa ação não pode ser desfeita.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Excluir",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#C47F4A",
      });

      if (!confirmacao.isConfirmed) return;

      try {
        const { error } = await supabaseConfig
          .from("produtos")
          .delete()
          .eq("id", produtoId);

        if (error) {
          console.error("Erro ao excluir produto:", error);
          return;
        }

        fetchData();
      } catch (error) {
        console.error("Erro inesperado ao excluir:", error);
      }
    });
  });
};

// =========================================
// ABRIR MODAL JÁ PREENCHIDO PARA EDITAR
// =========================================
const attachUpdateHandlers = () => {
  document.querySelectorAll(".update-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const target = event.target;
      editingProductId = target.getAttribute("data-id");

      nomeInput.value = target.getAttribute("data-nome");
      descricaoInput.value = target.getAttribute("data-descricao");
      precoInput.value = target.getAttribute("data-preco");
      categoriaSelect.value = target.getAttribute("data-categoria");
      imagemAtualUrl = target.getAttribute("data-imagem") || null;
      imagemInput.value = "";
      unidadeSelect.value = target.getAttribute("data-unidade");

      abrirModal("editar");
    });
  });
};

// =========================================
// UPLOAD DE IMAGEM
// =========================================
const uploadImagem = async (arquivo) => {
  const nomeArquivo = `${Date.now()}_${arquivo.name}`;

  const { error: erroUpload } = await supabaseConfig.storage
    .from("produtos-imagens")
    .upload(nomeArquivo, arquivo);

  if (erroUpload) {
    console.error("Erro no upload da imagem:", erroUpload);
    return null;
  }

  const { data: urlData } = supabaseConfig.storage
    .from("produtos-imagens")
    .getPublicUrl(nomeArquivo);

  return urlData.publicUrl;
};

// =========================================
// SALVAR (CRIAR OU ATUALIZAR)
// =========================================
button.addEventListener("click", async () => {
  if (!nomeInput.value || !precoInput.value || !categoriaSelect.value) {
    Swal.fire({ icon: "error", title: "Ops...", text: "Preencha nome, preço e categoria!" });
    return;
  }

  try {
    let imagemUrl = imagemAtualUrl;

    if (imagemInput.files.length > 0) {
      imagemUrl = await uploadImagem(imagemInput.files[0]);
    }

    const dadosProduto = {
      nome: nomeInput.value,
      descricao: descricaoInput.value,
      preco: Number(precoInput.value),
      categoria_id: categoriaSelect.value,
      unidade_id: unidadeSelect.value,       
      imagem_url: imagemUrl,
    };

    if (editingProductId) {
      const { error } = await supabaseConfig
        .from("produtos")
        .update(dadosProduto)
        .eq("id", editingProductId);

      if (error) {
        console.error("Erro ao atualizar produto:", error);
        return;
      }
    } else {
      const { error } = await supabaseConfig.from("produtos").insert([dadosProduto]);

      if (error) {
        console.error("Erro ao inserir produto:", error);
        return;
      }
    }

    fecharModal();
    fetchData();
  } catch (error) {
    console.error("Erro inesperado ao salvar:", error.message);
  }
});

// =========================================
// INICIALIZAÇÃO
// =========================================
fetchCategorias();
fetchUnidades();
fetchData();
