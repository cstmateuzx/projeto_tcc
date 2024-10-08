<script>
    export let irParaLogin;
    export let irParaCadastro;
    import { api_base_url } from "../stores/navigation";
  </script>
  
  <header class="header">
    <section>
      <img src="../static/new_logo.png" alt="logo" class="logo" />
      <nav class="navbar">
        <a href="#home">Home</a>
        <a href="#agendamento">Agendamento</a>
        <a href="#catalogo">Catálogo</a>
        <a href="#address">Endereço</a>
      </nav>
      <div class="icons">
        <button on:click={irParaLogin}>
          <img id="login" width="30" height="30" src="https://img.icons8.com/windows/32/FFFFFF/login-rounded-right.png" alt="login-rounded-right" />
        </button>
        <button on:click={irParaCadastro}>
          <img id="cadastro" width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/task.png" alt="task" />
        </button>
      </div>
    </section>
  </header>
  
  <div class="home-container" id="home">
    <section id="home">
      <div class="content">
        <h3>O MELHOR STUDIO DA REGIÃO</h3>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit...</p>
      </div>
    </section>
  </div>
  