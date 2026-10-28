import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { cadastrar } from "../services/authService";
import { mensagemDeErro } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { guardarSessao } = useAuth();
  const navegar = useNavigate();
  const local = useLocation();

  const paginaAnterior = (local.state as { de?: string } | null)?.de;

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setErro("");

    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres");
      return;
    }

    setCarregando(true);

    try {
      const dados = await cadastrar(nome, email, senha);
      guardarSessao(dados);
      navegar(paginaAnterior ?? "/");
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cartao cartao-estreito">
      <h1>Criar conta</h1>

      <form onSubmit={enviar} className="formulario">
        <label className="campo">
          Nome
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            required
          />
        </label>

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
            autoComplete="new-password"
            required
          />
        </label>

        {erro && <p className="mensagem-erro">{erro}</p>}

        <button type="submit" className="botao" disabled={carregando}>
          {carregando ? "Criando..." : "Cadastrar"}
        </button>
      </form>

      <p className="texto-pequeno">
        Já tem conta? <Link to="/entrar">Entrar</Link>
      </p>
    </div>
  );
}
