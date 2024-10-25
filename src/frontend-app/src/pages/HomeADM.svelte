<script>
    import { irParaLogin } from "../stores/navigation";
    import axios from "axios";

    let adm = {};
    let usuarios = [];

    // Função de logout
    const logout = async () => {
        try {
            await axios.post(
                "http://localhost:3000/api/logout",
                {},
                { withCredentials: true },
            );
            alert("Logout realizado com sucesso!");
            irParaLogin(); //Encaminha para pagina de login principal do site
        } catch (error) {
            console.error("Erro ao realizar logout:", error);
            alert("Erro ao realizar logout.");
        }
    };

    // Função para pegar dados do administrador logado
    const pegaDadosADM = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/adms/me", {
                method: "GET",
                credentials: "include", // Importante para incluir cookies nas requisições
            });

            const data = await response.json();

            if (data && data.nome) {
                adm = data; // Atribuir os dados retornados do administrador
            } else {
                alert("Administrador não logado.");
            }
        } catch (error) {
            console.error("Erro ao buscar dados do administrador:", error);
            alert("Erro ao buscar dados do administrador.");
        }
    };

    // Função para pegar todos os usuários cadastrados
    const pegaUsuarios = async () => {
        try {
            const response = await axios.get("http://localhost:3000/usuarios", {
                withCredentials: true,
            });
            usuarios = response.data.usuarios; // Armazena os usuários
        } catch (error) {
            console.error("Erro ao obter lista de usuários:", error);
        }
    };

    // Chama as funções ao carregar a página
    pegaDadosADM();
    pegaUsuarios();
</script>

<div class="container mt-5">
    <h1>Bem-vindo, {adm.nome}!</h1>
    <!-- Exibe o nome do administrador logado -->

    <h2 class="mt-4">Usuários Cadastrados:</h2>
    <table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Idade</th>
            </tr>
        </thead>
        <tbody>
            {#each usuarios as usuario}
                <tr>
                    <td>{usuario.id_usuario}</td>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.idade}</td>
                </tr>
            {/each}
        </tbody>
    </table>

    <button type="button" class="btn btn-danger mt-4" on:click={logout}
        >Logout</button
    >
</div>
