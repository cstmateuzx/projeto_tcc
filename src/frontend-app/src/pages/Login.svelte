<script>
    import { irParaHome } from "../stores/navigation";

    export let fazerLogin;
    export let email;
    export let senha;
    export let error;
    export let mensagem;
    export let resultado;
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
          <button type="submit">Login</button>
        </div>
        <div>
          <button on:click={irParaHome}>voltar</button>
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
  