// 0. menu lateral

import { supabaseConfig } from "./config.js";
 
// Descobre o nome do arquivo da página atual (ex: "dashboard.html")
const paginaAtual = window.location.pathname.split("/").pop();
 
const linkAtivo =
  "flex items-center gap-3 px-3 py-2 rounded-md bg-[#F6F5F4] text-[#C47F4A] font-medium";
const linkInativo =
  "flex items-center gap-3 px-3 py-2 rounded-md text-[#6F6F72] hover:bg-[#F6F5F4]";
 
const sidebarHTML = /* html */ `
  <aside class="w-60 bg-white border-r border-[#E4E2E0] min-h-screen flex flex-col p-4">
    <div class="text-xl font-bold text-[#2E2E2F] mb-8 px-2">🍺 Botequim</div>
    <nav class="flex flex-col gap-1">
      <a href="dashboard.html" class="${paginaAtual === "dashboard.html" ? linkAtivo : linkInativo}">
        <i class="fa-solid fa-house w-4"></i> Dashboard
      </a>
      <a href="produtos.html" class="${paginaAtual === "produtos.html" ? linkAtivo : linkInativo}">
        <i class="fa-solid fa-utensils w-4"></i> Produtos
      </a>
    </nav>
    <button id="logout-btn" class="mt-auto flex items-center gap-3 px-3 py-2 rounded-md text-[#6F6F72] hover:bg-[#F6F5F4]">
      <i class="fa-solid fa-right-from-bracket w-4"></i> Sair
    </button>
  </aside>
`;
 
const sidebarPlaceholder = document.getElementById("sidebar");
 
if (sidebarPlaceholder) {
  sidebarPlaceholder.innerHTML = sidebarHTML;
 
  // conectar o botão de logout AGORA, porque só existe depois do innerHTML acima
  document.getElementById("logout-btn").addEventListener("click", async () => {
    await supabaseConfig.auth.signOut();
    window.location.href = "login.html";
  });
}
