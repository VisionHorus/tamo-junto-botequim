import { supabaseConfig } from "./config.js";

// =========================================
// SE JÁ ESTIVER LOGADO, PULA DIRETO PRO DASHBOARD
// =========================================
const {
  data: { session: sessaoExistente },
} = await supabaseConfig.auth.getSession();

if (sessaoExistente) {
  window.location.href = "dashboard.html";
}

// =========================================
// LOGIN
// =========================================
const btn = document.getElementById("login");

btn.addEventListener("click", async () => {
  const Email = document.getElementById("email").value.trim();
  const Password = document.getElementById("password").value;

  if (!Email || !Password) {
    Swal.fire({
      icon: "error",
      title: "Campos vazios",
      text: "Preencha email e senha para continuar.",
    });
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Entrando...`;

  try {
    const { data, error } = await supabaseConfig.auth.signInWithPassword({
      email: Email,
      password: Password,
    });

    if (error) {
      console.error("Erro de login:", error);

      // Supabase sempre retorna essa mesma mensagem genérica por segurança,
      // tanto pra email inexistente quanto pra senha errada — assim ninguém
      // descobre se um email está cadastrado ou não só tentando logar.
      const mensagem =
        error.message === "Invalid login credentials"
          ? "Email ou senha incorretos."
          : error.message;

      Swal.fire({
        icon: "error",
        title: "Não foi possível entrar",
        text: mensagem,
      });

      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Entrar`;
      return;
    }

    Swal.fire({
      title: "Bem-vindo de volta!",
      text: "Login realizado com sucesso.",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "dashboard.html";
    });
  } catch (error) {
    console.error("Erro inesperado:", error);
    Swal.fire({
      icon: "error",
      title: "Algo deu errado",
      text: "Tente novamente em alguns instantes.",
    });

    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Entrar`;
  }
});

// permite logar apertando Enter, em vez de só clicando no botão
document.getElementById("password").addEventListener("keydown", (event) => {
  if (event.key === "Enter") btn.click();
});
