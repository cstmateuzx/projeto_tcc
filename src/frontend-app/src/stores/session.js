// src/stores/session.js
import { writable } from "svelte/store";

// Armazena o token da sessão
export const sessionStore = writable(null);

// Função para setar o token
export const setSession = (token) => {
  sessionStore.set(token);
};

// Função para limpar a sessão
export const clearSession = () => {
  sessionStore.set(null);
};
