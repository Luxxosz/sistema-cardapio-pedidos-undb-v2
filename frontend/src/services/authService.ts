import { api } from "./api";
import type { AuthResponse } from "../types";

export function entrar(email: string, senha: string) {
  return api.post<AuthResponse>("/api/auth/login", { email, senha });
}

export function cadastrar(nome: string, email: string, senha: string) {
  return api.post<AuthResponse>("/api/auth/cadastro", { nome, email, senha });
}
