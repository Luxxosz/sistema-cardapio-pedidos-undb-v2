import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { entrar } from "../services/authService";
import { mensagemDeErro } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function Entrar() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { guardarSessao } = useAuth();
  const navegar = useNavigate();
  const local = useLocation();

  // se a pessoa veio de outra pagina (ex.: carrinho), volta pra ela depois do login
  const paginaAnterior = (local.state as { de?: string } | null)?.de;

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const dados = await entrar(email, senha);
      guardarSessao(dados);
      navegar(paginaAnterior ?? (dados.papel === "ADMIN" ? "/admin" : "/"));
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cartao cartao-estreito">
      <h1>Entrar</h1>

      <form onSubmit={enviar} className="formulario">
        <label className="campo">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="campo">
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {erro && <p className="mensagem-erro">{erro}</p>}

        <button type="submit" className="botao" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="texto-pequeno">
        Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}
