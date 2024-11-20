<script>
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import { api_base_url } from "../../stores/navigation";
  import axios from "axios";

  const usuarios = writable([]);
  let usuarioParaEditar = null;
  let nomeEditado = "";
  let emailEditado = "";
  let idadeEditada = "";
  let senhaAdm = "";
  let mensagem = "";
  let error = false;
  const carregarUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "GET",
        credentials: "include", // Inclui o cookie na requisição
      });

      // Verificando a estrutura da resposta
      const data = await response.json();

      // Verifique se a estrutura da resposta é o que esperamos
      if (data && data.result && data.result.usuarios) {
        // Agora procura por result.usuarios
        usuarios.set(data.result.usuarios); // Atualiza o store com os usuários
      } else {
        throw new Error(
          "Estrutura de dados inesperada. A chave 'result.usuarios' não foi encontrada.",
        );
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  
// Função para editar um usuário
const editarUsuario = async (id_usuario, dados) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/usuarios/${id_usuario}`, // Substitua pelo caminho correto da API
      dados,
      {
        withCredentials: true, // Para incluir cookies (caso necessário)
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) throw new Error("Erro ao editar usuário.");

    await carregarUsuarios(); // Recarrega a lista de usuários
    cancelarEdicao(); // Cancela a edição
    mensagem = "Usuário atualizado com sucesso!";
    error = false;
  } catch (err) {
    console.error("Erro ao editar usuário:", err);

    if (err.response && err.response.status === 409) {
      // Caso o erro seja um 409 (conflito), exiba uma mensagem mais detalhada
      mensagem = err.response.data.message || "Conflito ao tentar editar o usuário. Verifique os dados.";
    } else {
      mensagem = err.message || "Erro ao editar usuário.";
    }

    error = true;
  }
};

  // Função para excluir um usuário
  const excluirUsuario = async (id_usuario) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        const response = await fetch(`${api_base_url}/usuarios/${id_usuario}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Erro ao excluir usuário.");
        await carregarUsuarios(); // Recarrega a lista de usuários
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
      }
    }
  };

  // Função para iniciar a edição de um usuário
  const iniciarEdicao = (usuario) => {
    usuarioParaEditar = usuario;
    nomeEditado = usuario.nome;
    emailEditado = usuario.email;
    idadeEditada = usuario.idade;
  };

  // Função para cancelar a edição
  const cancelarEdicao = () => {
    usuarioParaEditar = null;
    nomeEditado = "";
    emailEditado = "";
    idadeEditada = "";
  };

  onMount(() => {
    carregarUsuarios(); // Carrega a lista de usuários ao iniciar
  });
</script>

<div class="container">
  <h1>Lista de Usuários</h1>

  <!-- Mensagem de status -->
  {#if mensagem}
    <div class="alert {error ? 'alert-danger' : 'alert-success'}">
      {mensagem}
    </div>
  {/if}

  <table class="table table-striped">
    <thead>
      <tr>
        <th>Nome</th>
        <th>Email</th>
        <th>Idade</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {#each $usuarios as usuario}
        <tr>
          <td>{usuario.nome}</td>
          <td>{usuario.email}</td>
          <td>{usuario.idade}</td>
          <td>
            <button
              on:click={() => iniciarEdicao(usuario)}
              class="btn btn-warning btn-sm">Editar</button
            >
            <button
              on:click={() => excluirUsuario(usuario.id_usuario)}
              class="btn btn-danger btn-sm">Excluir</button
            >
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <!-- Modal para editar usuário -->
  {#if usuarioParaEditar}
    <div class="modal fade show" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Usuário</h5>
            <button
              type="button"
              class="close"
              aria-label="Close"
              on:click={cancelarEdicao}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <label>Nome:</label>
            <input type="text" bind:value={nomeEditado} class="form-control" />
            <label>Email:</label>
            <input
              type="email"
              bind:value={emailEditado}
              class="form-control"
            />
            <label>Idade:</label>
            <input
              type="number"
              bind:value={idadeEditada}
              class="form-control"
            />
            <label>Senha ADM:</label>
            <input type="password" bind:value={senhaAdm} class="form-control" />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              on:click={cancelarEdicao}>Cancelar</button
            >
            <button
              type="button"
              class="btn btn-success"
              on:click={() =>
                editarUsuario(usuarioParaEditar.id_usuario, {
                  nome: nomeEditado,
                  email: emailEditado,
                  idade: idadeEditada,
                  senha: senhaAdm,
                })}>Salvar</button
            >
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
