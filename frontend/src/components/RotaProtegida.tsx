import { Navigate, useLocation } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Papel } from "../types";

// so deixa passar quem esta logado com o perfil certo.
// Quem nao esta logado vai pro login e depois volta pra pagina que queria.
export default function RotaProtegida({ papel, children }: { papel: Papel; children: ReactNode }) {
  const { sessao } = useAuth();
  const local = useLocation();

  if (!sessao) {
    return <Navigate to="/entrar" state={{ de: local.pathname }} replace />;
  }

  if (sessao.papel !== papel) {
    return <Navigate to={sessao.papel === "ADMIN" ? "/admin" : "/"} replace />;
  }

  return <>{children}</>;
}
