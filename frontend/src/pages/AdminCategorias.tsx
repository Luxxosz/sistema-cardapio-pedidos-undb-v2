import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Pencil, Trash2 } from "lucide-react";
import FotoCategoria from "../components/FotoCategoria";
import Modal from "../components/Modal";
import { api, mensagemDeErro } from "../services/api";
import { slug } from "../utils/formatar";
import type { Categoria, Produto } from "../types";

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<Categoria[] | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [novoNome, setNovoNome] = useState("");
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [nomeEditado, setNomeEditado] = useState("");
  const [erro, setErro] = useState("");
  const [erroModal, setErroModal] = useState("");
  const [aviso, setAviso] = useState("");

  // busca categorias e produtos (pra contar quantos tem em cada categoria)
  useEffect(() => {
    let ativo = true;

    Promise.all([
      api.get<Categoria[]>("/api/categorias"),
      api.get<Produto[]>("/api/admin/produtos"),
    ])
      .then(([listaCategorias, listaProdutos]) => {
        if (ativo) {
          setCategorias(listaCategorias);
          setProdutos(listaProdutos);
        }
      })
      .catch((e) => {
        if (ativo) {
          setErro(mensagemDeErro(e));
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function criar(evento: FormEvent) {
    evento.preventDefault();
    setErro("");
    setAviso("");

    try {
      const criada = await api.post<Categoria>("/api/admin/categorias", { nome: novoNome.trim() });
      setCategorias((atuais) => [...(atuais ?? []), criada]);
      setNovoNome("");
      setAviso(`Categoria "${criada.nome}" criada.`);
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  function abrirEdicao(categoria: Categoria) {
    setEditando(categoria);
    setNomeEditado(categoria.nome);
    setErroModal("");
  }

  async function salvarEdicao(evento: FormEvent) {
    evento.preventDefault();
    if (!editando) {
      return;
    }

    setErroModal("");

    try {
      const salva = await api.put<Categoria>(`/api/admin/categorias/${editando.id}`, {
        nome: nomeEditado.trim(),
      });
      setCategorias((atuais) => (atuais ?? []).map((c) => (c.id === salva.id ? salva : c)));
      setEditando(null);
      setAviso(`Categoria renomeada para "${salva.nome}".`);
    } catch (e) {
      setErroModal(mensagemDeErro(e));
    }
  }

  async function excluir(categoria: Categoria) {
    if (!window.confirm(`Excluir a categoria "${categoria.nome}"?`)) {
      return;
    }

    setErro("");
    setAviso("");

    try {
      await api.delete(`/api/admin/categorias/${categoria.id}`);
      setCategorias((atuais) => (atuais ?? []).filter((c) => c.id !== categoria.id));
      setAviso(`Categoria "${categoria.nome}" excluída.`);
    } catch (e) {
      // o backend recusa se a categoria ainda tem produtos
      setErro(mensagemDeErro(e));
    }
  }

  return (
    <div className="pagina-estreita">
      <header className="topo">
        <div>
          <h1>Categorias</h1>
          <p className="texto-pequeno">
            A foto de cada categoria é o arquivo <code>public/categorias/nome-da-categoria.jpg</code>.
          </p>
        </div>
      </header>

      <form onSubmit={criar} className="formulario-linha">
        <input
          type="text"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          placeholder="Nome da nova categoria"
          aria-label="Nome da nova categoria"
          required
        />
        <button type="submit" className="botao">
          Criar categoria
        </button>
      </form>

      {aviso && (
        <p className="mensagem-sucesso" role="status">
          {aviso}
        </p>
      )}
      {erro && <p className="mensagem-erro">{erro}</p>}
      {categorias === null && !erro && <p>Carregando as categorias...</p>}

      <div className="tabela">
        {categorias?.map((categoria) => {
          const quantidade = produtos.filter((p) => p.categoria.id === categoria.id).length;

          return (
            <div key={categoria.id} className="tabela-linha tabela-categoria">
              <FotoCategoria nome={categoria.nome} className="miniatura" />

              <div className="tabela-nome">
                <strong>{categoria.nome}</strong>
                <span className="texto-pequeno">
                  {quantidade === 1 ? "1 produto" : `${quantidade} produtos`} · foto: {slug(categoria.nome)}.jpg
                </span>
              </div>

              <div className="tabela-acoes">
                <button
                  className="botao-icone"
                  onClick={() => abrirEdicao(categoria)}
                  aria-label={`Renomear ${categoria.nome}`}
                  title="Renomear"
                >
                  <Pencil size={18} />
                </button>
                <button
                  className="botao-icone botao-perigo"
                  onClick={() => excluir(categoria)}
                  aria-label={`Excluir ${categoria.nome}`}
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editando && (
        <Modal titulo="Renomear categoria" aoFechar={() => setEditando(null)}>
          <form onSubmit={salvarEdicao} className="formulario">
            <label className="campo">
              Nome
              <input
                type="text"
                value={nomeEditado}
                onChange={(e) => setNomeEditado(e.target.value)}
                required
              />
            </label>

            {erroModal && <p className="mensagem-erro">{erroModal}</p>}

            <div className="acoes">
              <button type="submit" className="botao">
                Salvar
              </button>
              <button
                type="button"
                className="botao botao-claro-escuro"
                onClick={() => setEditando(null)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
