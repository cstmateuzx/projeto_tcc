import { writable } from "svelte/store";
import { sessionStore } from "./session"; // Importa o store da sessão

// Define o estado atual da página (controle da navegação)
export const paginaAtual = writable("login");

// Função para redirecionar para a página de login
export const irParaLogin = () => {
  sessionStore.subscribe((token) => {
    if (!token) {
      paginaAtual.set("login"); // Redireciona se o usuário não estiver logado
    } else {
      paginaAtual.set("home"); // Se estiver logado, redireciona para home
    }
  });
};

// Função para redirecionar para a página de agendamento
export const irParaAgendamento = () => {
  sessionStore.subscribe((token) => {
    if (!token) {
      paginaAtual.set("login"); // Redireciona se o usuário não estiver logado
    } else {
      paginaAtual.set("agendamento"); // Se estiver logado, redireciona para agendamento
    }
  });
};

// Função para redirecionar para a página de cadastro
export const irParaCadastro = () => {
  paginaAtual.set("cadastro");
};

// Função para redirecionar para a página inicial
export const irParaHome = () => {
  paginaAtual.set("home");
};

// Função para logout
export const logout = () => {
  sessionStore.set(null); // Limpa o token da sessão
  irParaLogin(); // Redireciona para a página de login
};

// Define a URL base da API
export const api_base_url = "http://localhost:3000";
