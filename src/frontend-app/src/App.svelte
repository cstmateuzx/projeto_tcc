<script>
  // import { onMount } from 'svelte';
  import Header from "./Header.svelte";
  import axios from "axios";
  let nome = "";
  let email = "";
  let senha = "";
  let idade = "";
  let conf_senha = "";
  let error = null;
  let resultado = null;
  let usuarios = null;
  let colunas_usuarios = null;
  const api_base_url = "http://localhost:3000";

  const carregarUsuarios = async () => {
    try {
      let res = await axios.get(api_base_url + "/usuarios", {
        responseType: "json",
        headers: {
          Accept: "application/json",
        },
      });
      usuarios = res.data.usuarios;
      colunas_usuarios = Object.keys(usuarios[0]);
      error = null; // Limpa o erro se a requisição for bem-sucedida
    } catch (err) {
      error = "Erro ao buscar dados: " + err.response?.data?.message || err.message;;
      console.error(err);
      usuarios = null; // Limpa o resultado em caso de erro
    }
  };

  const cadastrarUsuario = async () => {
    try {
      let res = await axios.post(
        api_base_url + "/usuarios/novo",
        {
          nome,
          email,
          idade,
          senha,
          conf_senha,
        },
        {
          headers: {
            Accept: "application/json",
          },
        },
      );
      resultado = res.data;
      error = null; // Limpa o erro se a requisição for bem-sucedida
      // recarrega lista de usuários apresentada
      carregarUsuarios();
    } catch (err) {
      error =
        "Erro ao enviar dados: " + err.response?.data?.message || err.message;
      resultado = null; // Limpa o resultado em caso de erro
    }
    
  };

  // Função para deletar o usuário pelo ID
  const deletarUsuario = async (id) => {
    try {
      let res = await axios.delete(`${api_base_url}/usuarios/${id}`, {
        headers: {
          Accept: "application/json",
        },
      });
      resultado = res.data;
      error = null;
      // recarrega lista de usuários apresentada
      carregarUsuarios();
    } catch (err) {
      error =
        "Erro ao deletar usuário: " +
        (err.response?.data?.message || err.message);
      resultado = null;
    }
  };

  carregarUsuarios();
</script>

<main>

  <Header></Header>

  <div class="card">
    <div class="formulario">
      <h2>Cadastrar Usuário</h2>
      <form on:submit|preventDefault={cadastrarUsuario}>
        <div>
          <label for="nome"><h2>Nome:</h2></label>
          <input
            type="text"
            id="nome"
            bind:value={nome}
            placeholder="Digite o nome"
            required
          />
        </div>
        <div>
          <label for="email"><h2>Email:</h2></label>
          <input
            type="email"
            id="email"
            bind:value={email}
            placeholder="Digite o email"
            required
          />
        </div>
        <div>
          <label for="idade"><h2>Idade:</h2></label>
          <input
            type="number"
            id="idade"
            bind:value={idade}
            placeholder="Digite sua idade"
            required
          />
        </div>
        <div>
          <label for="senha"><h2>Senha:</h2></label>
          <input
            type="password"
            id="senha"
            bind:value={senha}
            placeholder="Digite a senha"
            required
          />
        </div>
        <div>
          <label for="conf_senha"><h2>Confirme a Senha:</h2></label>
          <input
            type="password"
            id="conf_senha"
            bind:value={conf_senha}
            placeholder="Confirme a senha"
            required
          />
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
</main>
