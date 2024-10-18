<script>
    import { irParaHome } from "../stores/navigation";

    export let email;
    export let senha;
    export let error;
    export let mensagem;
    export let resultado;
    import { api_base_url } from "../stores/navigation";


    
  const fazerLogin = async () => {
    try {
      const res = await fetch(api_base_url + "/api/login", {
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
        console.log("Login bem-sucedido:", data);
        email = "";
        senha = "";
      } else {
        resultado = null;
        error = true;
        mensagem = data.error || data.message || "Erro ao fazer login.";
        console.log("Erro no login:", mensagem);
      }
    } catch (err) {
      error = true;
      mensagem = "Erro de conexão. Tente novamente.";
      console.error("Erro de conexão:", err);
    }
  };


  </script>
  
  <div class="card">
    <div class="formulario">
      <h2>Login</h2>
      <form on:submit|preventDefault={fazerLogin}>
        <div>
          <label for="email"><h2>Email:</h2></label>
          <input type="email" id="email" bind:value={email} placeholder="Digite o email" required />
        </div>
        <div>
          <label for="senha"><h2>Senha:</h2></label>
          <input type="password" id="senha" bind:value={senha} placeholder="Digite a senha" required />
        </div>
        <div>
          <button type="submit" class="btn btn-outline-success" style="height: 40px; width: 90px;">Login</button>
        </div>
        <div>
          <button type="button" class="btn btn-outline-warning" on:click={irParaHome} style="height: 40px; width: 90px;">Voltar</button>
        </div>
      </form>
      {#if error}
        <p style="color: red;">{mensagem}</p>
      {/if}
      {#if resultado && resultado.message}
        <p style="color: green;">{resultado.message}</p>
      {/if}
    </div>
  </div>
  