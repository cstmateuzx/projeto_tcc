<script>
    import { onMount } from "svelte";
    import { api_base_url } from "../../stores/navigation";
  
    let servicos = [];
    let editando = false;
    let id_servico = null;
    let tamanho = "";
    let complexidade = "";
    let cores = "";
    let preco = "";
    let mensagem = "";
    let error = false;
  
    const carregarservicos = async () => {
      try {
        const response = await fetch(`${api_base_url}/servicos`);
        servicos = await response.json();
      } catch (err) {
        console.error("Erro ao carregar servicos:", err);
      }
    };
  
    const salvarservico = async () => { 
      try {
        const endpoint = editando ? `${api_base_url}/servicos/${id_servico}` : `${api_base_url}/servicos`;
        const method = editando ? "PUT" : "POST";
  
        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tamanho, complexidade, cores, preco }),
        });
        if (!response.ok) throw new Error("Erro ao salvar servico.");
  
        await carregarservicos();
        resetarFormulario();
        mensagem = editando ? "servico atualizado com sucesso!" : "servico adicionado com sucesso!";
        error = false;
      } catch (err) {
        mensagem = err.message;
        error = true;
      }
    };
  
    const excluirservico = async (id_servico) => {
      try {
        const response = await fetch(`${api_base_url}/servicos/${id_servico}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erro ao excluir servico.");
        await carregarservicos();
      } catch (err) {
        console.error("Erro ao excluir servico:", err);
      }
    };
  
    const editarservico = (servico) => {
      editando = true;
      id_servico = servico.id_servico;
      tamanho = servico.tamanho;
      complexidade = servico.complexidade;
      cores = servico.cores;
      preco = servico.preco;
    };
  
    const resetarFormulario = () => {
      editando = false;
      id_servico = null;
      tamanho = complexidade = cores = preco = "";
    };
  
    onMount(carregarservicos);
  </script>
  
  <div class="container">
    <h1>Gerenciar servicos</h1>
  
    <!-- Formulário de Adição/Edição -->
    <form on:submit|preventDefault={salvarservico}>
      <div class="row mb-3">
        <div class="col-md-4">
          <input type="text" class="form-control" bind:value={tamanho} placeholder="Tamanho" required />
        </div>
        <div class="col-md-4">
          <input type="text" class="form-control" bind:value={complexidade} placeholder="Complexidade" required />
        </div>
        <div class="col-md-4">
          <input type="text" class="form-control" bind:value={cores} placeholder="Cores" required />
        </div>
        <div class="col-md-4">
          <input type="password" class="form-control" bind:value={preco} placeholder="Preço" required />
        </div>
      </div>
      <button type="submit" class="btn btn-primary">{editando ? "Atualizar" : "Adicionar"} Servico</button>
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
  
    <!-- Tabela de servicos -->
    <table class="table table-dark table-striped mt-4">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tamanho</th>
          <th>Complexidade</th>
          <th>Cores</th>
          <th>Preço</th>
        </tr>
      </thead>
      <tbody>
        {#each servicos as servico}
          <tr>
            <td>{servico.id_servico}</td>
            <td>{servico.tamanho}</td>
            <td>{servico.complexidade}</td>
            <td>{servico.cores}</td>
            <td>{servico.preco}</td>
            <td>
              <button class="btn btn-warning btn-sm" on:click={() => editarservico(servico)}>Editar</button>
              <button class="btn btn-danger btn-sm ms-2" on:click={() => excluirservico(servico.id_servico)}>Excluir</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  