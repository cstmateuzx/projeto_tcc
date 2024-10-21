<script>
  import { sessionStore } from "../stores/session"; // Para armazenar o token
  import { irParaHome } from "../stores/navigation"; // Para redirecionar
  import { api_base_url } from "../stores/navigation"; // Para usar a URL da API

  let email = "";
  let senha = "";
  let error = false;
  let mensagem = "";
  let resultado = null;

  const fazerLogin = async () => {
    try {
      const res = await fetch(`${api_base_url}/api/login`, { // Adicionando template string
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();
      if (res.ok) {
        resultado = { message: "Login bem-sucedido!" };
        error = false;
        mensagem = ""; // Limpa a mensagem de erro
        sessionStore.set(data.token); // Salva o token no sessionStore
        email = "";
        senha = "";
        irParaHome(); // Redireciona para a página inicial
      } else {
        resultado = null;
        error = true;
        mensagem = data.error || data.message || "Erro ao fazer login.";
      }
    } catch (err) {
      error = true;
      mensagem = "Erro de conexão. Tente novamente.";
      console.error("Erro de conexão:", err); // Adicionando log de erro para debug
    }
  };
</script>

<main>
  <div class="container mt-5">
    <div class="row justify-content-center m-auto align-items-center d-flex" style="width: 600px; padding-top: 100px; padding-bottom: 100px;">
      <div class="col-md-5">
        <h2 class="text-center mb-4">Login</h2>
        <form on:submit|preventDefault={fazerLogin}>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" bind:value={email} placeholder="Digite seu email" required />
          </div>
          <div class="mb-3">
            <label for="senha" class="form-label">Senha</label>
            <input type="password" class="form-control" id="senha" bind:value={senha} placeholder="Digite sua senha" required />
          </div>
          <button type="submit" class="btn btn-success w-100">Entrar</button>
        </form>
        {#if error}
          <p style="color: red;">{mensagem}</p>
        {/if}
        {#if resultado && resultado.message}
          <p style="color: green;">{resultado.message}</p>
        {/if}
      </div>
    </div>
  </div>
</main>
