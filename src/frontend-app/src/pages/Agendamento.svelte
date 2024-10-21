<!-- src/components/Agendamento.svelte -->
<script>
    import { sessionStore } from "../stores/session"; // Para verificar a sessão
    import { irParaLogin } from "../stores/navigation"; // Função para redirecionar
    
    let usuario = {};
    
    // Função de logout
    const logout = () => {
      sessionStore.set(null); // Remove o token da sessão
      irParaLogin(); // Redireciona para a página de login
    };
  
    const pegaDadosUsuario = async () => {
      const response = await fetch('http://localhost:3000/api/usuarios/me', {
        method: 'GET',
        credentials: 'include', // Inclui o cookie de sessão
      });
      const data = await response.json();
      if (data.idUsuario) {
        usuario = data;
      } else {
        alert('Usuário não logado.');
        irParaLogin(); // Redireciona se não estiver logado
      }
    };
  
    pegaDadosUsuario();
  </script>
  
  <div class="container mt-5">
    <h1>Bem-vindo, {usuario.nome}</h1>
    <p>Email: {usuario.email}</p>
    {#if sessionStore}
      <button type="button" class="btn btn-danger mt-4" on:click={logout}>Logout</button>
    {/if}
  </div>
  