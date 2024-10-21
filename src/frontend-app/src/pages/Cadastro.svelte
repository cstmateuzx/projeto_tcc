<script>
  import { onMount } from "svelte";
  import axios from "axios";
  export let nome;
  export let email;
  export let idade;
  export let senha;
  export let conf_senha;
  export let error;
  export let resultado;
  export let usuarios;
  export let colunas_usuarios;
  import { api_base_url } from "../stores/navigation";

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
      error = "Erro ao buscar dados: " + err.response?.data?.message || err.message;
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
      error = "Erro ao enviar dados: " + err.response?.data?.message || err.message;
      resultado = null; // Limpa o resultado em caso de erro
    }
  };

  carregarUsuarios();

  onMount(() => {
    carregarUsuarios();
  });
</script>

<div class="container mt-5">
  <div class="row justify-content-center">
    <div class="col-md-6">
      <h2 class="text-center mb-4">Cadastrar-se</h2>
      <form>
        <div class="mb-3">
          <label for="nome" class="form-label">Nome</label>
          <input type="text" class="form-control" id="nome" bind:value={nome} placeholder="Digite seu nome" />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" bind:value={email} placeholder="Digite seu email" />
        </div>
        <div class="mb-3">
          <label for="idade" class="form-label">Idade</label>
          <input type="number" class="form-control" id="idade" bind:value={idade} placeholder="Digite sua idade" />
        </div>
        <div class="mb-3">
          <label for="senha" class="form-label">Senha</label>
          <input type="password" class="form-control" id="senha" bind:value={senha} placeholder="Digite sua senha" />
        </div>
        <button type="button" class="btn btn-primary w-100" on:click={cadastrarUsuario}>Cadastrar</button>
      </form>
    </div>
  </div>
</div>
