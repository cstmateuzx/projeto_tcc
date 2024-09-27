<script>
    let email = '';
    let senhaDigitada = '';
    let mensagem = '';
    let paginaAtual = "login";
  
    const verificarLogin = async () => {
      const resposta = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senhaDigitada })
      });
  
      const dados = await resposta.json();
      mensagem = dados.message;
  
      if (resposta.ok) {
        paginaAtual = "home";
      }
    };
  </script>
  <div>
    <h1>Login</h1>
    <input type="email"
    bind:value={email}
    placeholder="Email" />
    <input type="password"
    bind:value={senhaDigitada}
    placeholder="Senha" />
    <button on:click={verificarLogin}>Logar</button>
    {#if mensagem}
      <p>{mensagem}</p>
    {/if}
  </div>
