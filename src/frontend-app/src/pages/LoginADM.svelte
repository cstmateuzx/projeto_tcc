<script>
    import { sessionStore } from "../stores/session"; // Para armazenar o token
    import { irParaHome, irParaCadastro, irParaCadastroADM} from "../stores/navigation"; // Para redirecionar
    import { api_base_url } from "../stores/navigation"; // Base da URL da API
  
    let user = "";
    let senha = "";
    let error = false;
    let mensagem = "";
    let resultado = null;
  
    // Função para fazer login
    const fazerLoginADM = async () => {
      try {
        const res = await fetch(`${api_base_url}/api/login/adm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user, senha }),
          credentials: 'include' // Importante para que cookies de sessão JWT sejam enviados e recebidos
        });
  
        // Tratamento da resposta
        const data = await res.json();
        if (res.ok) {
          resultado = { message: "Login bem-sucedido!" };
          error = false;
          mensagem = ""; // Limpa a mensagem de erro
          sessionStore.set(data.token); // Armazena o token JWT no sessionStore
          user = "";
          senha = "";
        } else {
          resultado = null;
          error = true;
          mensagem = data.error || data.message || "Erro ao fazer login.";
        }
      } catch (err) {
        error = true;
        mensagem = "Erro de conexão. Tente novamente.";
        console.error("Erro de conexão:", err); // Log do erro para debug
      }
    };
  </script>
  
  <main>
    <div class="container mt-5">
      <div class="row justify-content-center m-auto align-items-center d-flex" style="width: 600px; padding-top: 100px; padding-bottom: 100px;">
        <div class="col-md-5">
          <h2 class="text-center mb-4">Login</h2>
          <form on:submit|preventDefault={fazerLoginADM}>
            <div class="mb-3">
              <label for="user" class="form-label">User</label>
              <input type="text" class="form-control" id="user" bind:value={user} placeholder="Digite seu user" required />
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
  