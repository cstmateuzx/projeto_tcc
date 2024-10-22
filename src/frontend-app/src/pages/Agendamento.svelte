<script>
  import { irParaLogin } from "../stores/navigation";
  import axios from 'axios';

  let usuario = {};

  // Função de logout
  const logout = async () => {
    try {
      await axios.post('http://localhost:3000/api/logout', {}, { withCredentials: true });
      alert('Logout realizado com sucesso!');
      irParaLogin(); // Redireciona para a página de login
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
      alert('Erro ao realizar logout.');
    }
  };

  const pegaDadosUsuario = async () => {
    const response = await fetch('http://localhost:3000/api/usuarios/me', {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    if (data.id_usuario) {
      usuario = data;
    } else {
      alert('Usuário não logado.');
      irParaLogin();
    }
  };

  pegaDadosUsuario();
</script>

<div class="container mt-5">
  <h1>Bem-vindo, {usuario.nome}</h1>
  <p>Email: {usuario.email}</p>
  <button type="button" class="btn btn-danger mt-4" on:click={logout}>Logout</button>
</div>
