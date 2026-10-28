import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthResponse } from "../types";

interface AuthContextoTipo {
  sessao: AuthResponse | null;
  guardarSessao: (dados: AuthResponse) => void;
  sair: () => void;
}

const AuthContexto = createContext<AuthContextoTipo | null>(null);

// ao abrir a pagina, recupera o login que ficou salvo no navegador
function lerSessaoSalva(): AuthResponse | null {
  const texto = localStorage.getItem("sessao");
  if (!texto) {
    return null;
  }

  try {
    return JSON.parse(texto) as AuthResponse;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<AuthResponse | null>(lerSessaoSalva);

  const guardarSessao = useCallback((dados: AuthResponse) => {
    localStorage.setItem("token", dados.token);
    localStorage.setItem("sessao", JSON.stringify(dados));
    setSessao(dados);
  }, []);

  const sair = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("sessao");
    setSessao(null);
  }, []);

  // o api.ts avisa quando o token venceu
  useEffect(() => {
    window.addEventListener("sessao-expirada", sair);
    return () => window.removeEventListener("sessao-expirada", sair);
  }, [sair]);

  return (
    <AuthContexto.Provider value={{ sessao, guardarSessao, sair }}>
      {children}
    </AuthContexto.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContexto);
  if (!contexto) {
    throw new Error("useAuth precisa ser usado dentro do AuthProvider");
  }
  return contexto;
}
