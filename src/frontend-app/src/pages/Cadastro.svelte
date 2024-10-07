<script>
  export let cadastrarUsuario;
  export let nome;
  export let email;
  export let idade;
  export let senha;
  export let conf_senha;
  export let error;
  export let resultado;
</script>

<div class="card">
  <div class="formulario">
    <h2>Cadastrar Usuário</h2>
    <form on:submit|preventDefault={cadastrarUsuario}>
      <div>
        <label for="nome"><h2>Nome:</h2></label>
        <input type="text" id="nome" bind:value={nome} placeholder="Digite o nome" required />
      </div>
      <div>
        <label for="email"><h2>Email:</h2></label>
        <input type="email" id="email" bind:value={email} placeholder="Digite o email" required />
      </div>
      <div>
        <label for="idade"><h2>Idade:</h2></label>
        <input type="number" id="idade" bind:value={idade} placeholder="Digite sua idade" required />
      </div>
      <div>
        <label for="senha"><h2>Senha:</h2></label>
        <input type="password" id="senha" bind:value={senha} placeholder="Digite a senha" required />
      </div>
      <div>
        <label for="conf_senha"><h2>Confirme a Senha:</h2></label>
        <input type="password" id="conf_senha" bind:value={conf_senha} placeholder="Confirme a senha" required />
      </div>
      <div>
        <button type="submit">Cadastrar</button>
      </div>
    </form>
    {#if error}
      <p style="color: red;">{error}</p>
    {/if}
    {#if resultado && resultado.message}
      <p style="color: green;">{resultado.message}</p>
    {/if}
  </div>
</div>
