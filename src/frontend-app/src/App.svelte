<script>
  // import { onMount } from 'svelte';
  import Cadastro from "./Cadastro.svelte";
import Header from "./Header.svelte";
  import Login from "./Login.svelte";
  import axios from "axios";
  let nome = "";
  let email = "";
  let senha = "";
  let idade = "";
  let emailDigitado = "";
  let senhaDigitada = "";
  let conf_senha = "";
  let error = null;
  let resultado = null;
  let usuarios = null;
  let colunas_usuarios = null;
  const api_base_url = "http://localhost:3000";
  let paginaAtual = "home";

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

  const irParaLogin = () => {
    paginaAtual = "login";
  };

  const irParaHome = () => {
    paginaAtual = "home";
  };
  const irParaCadastro = () => {
    paginaAtual = "home";
  };


  carregarUsuarios();

</script>


{#if paginaAtual == "home"}
<header class="header">
  <section>
      <a href="" on:click={irParaHome}> <img src="../static/new_logo.png" alt="logo" class="logo" /> </a>

      <nav class="navbar">
          <a href="#home">Home</a>
          <a href="#agendamento">Agendamento</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#address">Endereço</a>
      </nav>

      <div class="icons">
          <button on:click={irParaLogin}>
              <img
                  id="login"
                  width="30"
                  height="30"
                  src="https://img.icons8.com/windows/32/FFFFFF/login-rounded-right.png"
                  alt="login-rounded-right"
              />
          </button>

          <button>
              <img
                  id="cadastro"
                  width="30"
                  height="30"
                  src="https://img.icons8.com/ios-glyphs/30/FFFFFF/task.png"
                  alt="task"
              />
          </button>
      </div>
  </section>
</header>

<div class="home-container" id="home">
  <section id="home">
      <div class="content">
          <h3>O MELHOR STUDIO DA REGIÃO</h3>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio recusandae, quo rerum
              perferendis dolorem quam maxime perspiciatis laudantium voluptas ipsum aut voluptatibus qui fuga
              laboriosam voluptates porro. Alias, facilis modi!</p>
      </div>
  </section>
</div>
{/if}
{#if paginaAtual == "login"}
<Login></Login>
{/if}
{#if paginaAtual == "cadastro"}
<Cadastro></Cadastro>
{/if}

