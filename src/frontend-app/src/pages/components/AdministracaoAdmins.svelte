<script>
    import { onMount } from "svelte";
    import { api_base_url } from "../../stores/navigation";
  
    let admins = [];
    let editando = false;
    let id_adm = null;
    let nome = "";
    let user = "";
    let senha = "";
    let mensagem = "";
    let error = false;
  
    const carregarAdmins = async () => {
      try {
        const response = await fetch(`${api_base_url}/admins`);
        admins = await response.json();
      } catch (err) {
        console.error("Erro ao carregar admins:", err);
      }
    };
  
    const salvarAdmin = async () => { 
      try {
        const endpoint = editando ? `${api_base_url}/admins/${id_adm}` : `${api_base_url}/admins`;
        const method = editando ? "PUT" : "POST";
  
        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, user, senha }),
        });
        if (!response.ok) throw new Error("Erro ao salvar admin.");
  
        await carregarAdmins();
        resetarFormulario();
        mensagem = editando ? "Admin atualizado com sucesso!" : "Admin adicionado com sucesso!";
        error = false;
      } catch (err) {
        mensagem = err.message;
        error = true;
      }
    };
  
    const excluirAdmin = async (id_adm) => {
      try {
        const response = await fetch(`${api_base_url}/admins/${id_adm}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erro ao excluir admin.");
        await carregarAdmins();
      } catch (err) {
        console.error("Erro ao excluir admin:", err);
      }
    };
  
    const editarAdmin = (admin) => {
      editando = true;
      id_adm = admin.id_adm;
      nome = admin.nome;
      user = admin.user;
      senha = "";
    };
  
    const resetarFormulario = () => {
      editando = false;
      id_adm = null;
      nome = user = senha = "";
    };
  
    onMount(carregarAdmins);
  </script>
  
  <div class="container">
    <h1>Gerenciar Admins</h1>
  
    <!-- Formulário de Adição/Edição -->
    <form on:submit|preventDefault={salvarAdmin}>
      <div class="row mb-3">
        <div class="col-md-4">
          <input type="text" class="form-control" bind:value={nome} placeholder="Nome" required />
        </div>
        <div class="col-md-4">
          <input type="text" class="form-control" bind:value={user} placeholder="Usuário" required />
        </div>
        <div class="col-md-4">
          <input type="password" class="form-control" bind:value={senha} placeholder="Senha" required />
        </div>
      </div>
      <button type="submit" class="btn btn-primary">{editando ? "Atualizar" : "Adicionar"} Admin</button>
      {#if editando}
        <button type="button" class="btn btn-secondary ms-2" on:click={resetarFormulario}>Cancelar</button>
      {/if}
    </form>
  
    <!-- Mensagem -->
    {#if mensagem}
      <div class="alert {error ? 'alert-danger' : 'alert-success'} mt-3">
        {mensagem}
      </div>
    {/if}
  
    <!-- Tabela de Admins -->
    <table class="table table-dark table-striped mt-4">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Usuário</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {#each admins as admin}
          <tr>
            <td>{admin.id_adm}</td>
            <td>{admin.nome}</td>
            <td>{admin.user}</td>
            <td>
              <button class="btn btn-warning btn-sm" on:click={() => editarAdmin(admin)}>Editar</button>
              <button class="btn btn-danger btn-sm ms-2" on:click={() => excluirAdmin(admin.id_adm)}>Excluir</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  