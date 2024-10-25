<script>
  import { paginaAtual, irParaLogin, irParaCadastro, irParaHome } from "./stores/navigation";
  import Home from "./pages/Home.svelte";
  import Login from "./pages/Login.svelte";
  import Cadastro from "./pages/Cadastro.svelte";
  import Agendamento from "./pages/Agendamento.svelte";
  import CadastroAdm from "./pages/CadastroADM.svelte";
    import LoginAdm from "./pages/LoginADM.svelte";
    import HomeAdm from "./pages/HomeADM.svelte";

  
  let nome = "";
  let email = "";
  let senha = "";
  let idade = "";
  let conf_senha = "";
  let usuarios = null;
  let colunas_usuarios = null;
  let mensagem = "";
  let error = false;
  let resultado = null;
</script>

{#if $paginaAtual === "home"}
  <Home irParaLogin={irParaLogin} irParaCadastro={irParaCadastro} />
{/if}

{#if $paginaAtual === "login"}
  <Login 
    email={email} 
    senha={senha} 
    error={error} 
    usuarios={usuarios}
    colunas_usuarios={colunas_usuarios}
    mensagem={mensagem} 
    resultado={resultado} 
  />
{/if}

{#if $paginaAtual === "cadastro"}
  <Cadastro 
    nome={nome} 
    email={email} 
    idade={idade} 
    senha={senha} 
    conf_senha={conf_senha} 
    error={error} 
    resultado={resultado} 
  />
{/if}


{#if $paginaAtual === "agendamento"}
  <Agendamento/>
{/if}

{#if $paginaAtual === "cadadm"}
  <CadastroAdm/>
{/if}

{#if $paginaAtual === "loginadm"}
  <LoginAdm/>
{/if}

{#if $paginaAtual === "homeadm"}
  <HomeAdm/>
{/if}
