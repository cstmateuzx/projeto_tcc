<script>
  import { onMount } from "svelte";
  import { paginaAtual, irParaLogin, irParaCadastro, irParaHome } from "./stores/navigation";
  import Home from "./pages/Home.svelte";
  import Login from "./pages/Login.svelte";
  import Cadastro from "./pages/Cadastro.svelte";
  import { get } from "svelte/store";
  
  let nome = "";
  let email = "";
  let senha = "";
  let idade = "";
  let conf_senha = "";
  let usuarios = null;
  let colunas_usuarios = null;
  const api_base_url = "http://localhost:3000";
  let mensagem = "";
  let error = false;
  let resultado = null;


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
      error =
        "Erro ao buscar dados: " + err.response?.data?.message || err.message;
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



  const deletarUsuario = async (id) => {
    // ... (atualizar codigo)
  };

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


  carregarUsuarios();

  onMount(() => {
    carregarUsuarios();
  });
</script>

{#if $paginaAtual === "home"}
  <Home irParaLogin={irParaLogin} irParaCadastro={irParaCadastro} />
{/if}

{#if $paginaAtual === "login"}
  <Login 
    fazerLogin={fazerLogin} 
    irParaHome={irParaHome}
    email={email} 
    senha={senha} 
    error={error} 
    mensagem={mensagem} 
    resultado={resultado} 
  />
{/if}

{#if $paginaAtual === "cadastro"}
  <Cadastro 
    cadastrarUsuario={cadastrarUsuario} 
    irParaHome={irParaHome}
    nome={nome} 
    email={email} 
    idade={idade} 
    senha={senha} 
    conf_senha={conf_senha} 
    error={error} 
    resultado={resultado} 
  />
{/if}
