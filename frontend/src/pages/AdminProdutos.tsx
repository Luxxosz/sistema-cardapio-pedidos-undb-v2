import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import Modal from "../components/Modal";
import { api, mensagemDeErro } from "../services/api";
import { formatarPreco, semAcento } from "../utils/formatar";
import type { Categoria, Produto, ProdutoForm } from "../types";

interface FormProps {
  produto: Produto | null;
  categorias: Categoria[];
  aoSalvar: (produto: Produto) => void;
  aoCancelar: () => void;
}

// formulario de criar e de editar produto (aberto dentro do Modal)
function FormProduto({ produto, categorias, aoSalvar, aoCancelar }: FormProps) {
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [preco, setPreco] = useState(produto ? String(produto.preco) : "");
  const [categoriaId, setCategoriaId] = useState(
    String(produto?.categoria.id ?? categorias[0]?.id ?? "")
  );
  const [imagemUrl, setImagemUrl] = useState(produto?.imagemUrl ?? "");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setErro("");
    setSalvando(true);

    const corpo: ProdutoForm = {
      nome: nome.trim(),
      descricao: descricao.trim() === "" ? null : descricao.trim(),
      preco: Number(preco),
      categoriaId: Number(categoriaId),
      imagemUrl: imagemUrl.trim() === "" ? null : imagemUrl.trim(),
    };

    try {
      const salvo = produto
        ? await api.put<Produto>(`/api/admin/produtos/${produto.id}`, corpo)
        : await api.post<Produto>("/api/admin/produtos", corpo);
      aoSalvar(salvo);
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="formulario">
      <label className="campo">
        Nome
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </label>

      <label className="campo">
        Descrição
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          maxLength={300}
          rows={3}
        />
      </label>

      <div className="campos-linha">
        <label className="campo">
          Preço (R$)
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
        </label>

        <label className="campo">
          Categoria
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="campo">
        Foto do prato (opcional)
        <input
          type="text"
          value={imagemUrl}
          onChange={(e) => setImagemUrl(e.target.value)}
          placeholder="/pratos/moqueca.jpg ou um link da internet"
        />
        <span className="texto-pequeno">
          Deixe em branco para o prato aparecer só com texto, como no cardápio impresso.
        </span>
      </label>

      {erro && <p className="mensagem-erro">{erro}</p>}

      <div className="acoes">
        <button type="submit" className="botao" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar produto"}
        </button>
        <button type="button" className="botao botao-claro-escuro" onClick={aoCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<Produto[] | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [situacao, setSituacao] = useState<"todos" | "ativos" | "inativos">("todos");
  const [editando, setEditando] = useState<Produto | "novo" | null>(null);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");

  // busca produtos e categorias quando a pagina abre
  useEffect(() => {
    let ativo = true;

    Promise.all([
      api.get<Produto[]>("/api/admin/produtos"),
      api.get<Categoria[]>("/api/categorias"),
    ])
      .then(([listaProdutos, listaCategorias]) => {
        if (ativo) {
          setProdutos(listaProdutos);
          setCategorias(listaCategorias);
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

  function aoSalvar(salvo: Produto) {
    setProdutos((atuais) => {
      const lista = atuais ?? [];
      return lista.some((p) => p.id === salvo.id)
        ? lista.map((p) => (p.id === salvo.id ? salvo : p))
        : [...lista, salvo];
    });
    setEditando(null);
    setAviso(`"${salvo.nome}" foi salvo.`);
  }

  async function alternarAtivo(produto: Produto) {
    setErro("");
    setAviso("");
    try {
      const atualizado = await api.patch<Produto>(`/api/admin/produtos/${produto.id}/ativo`);
      setProdutos((atuais) => (atuais ?? []).map((p) => (p.id === atualizado.id ? atualizado : p)));
      setAviso(
        atualizado.ativo
          ? `"${atualizado.nome}" voltou ao cardápio.`
          : `"${atualizado.nome}" saiu do cardápio.`
      );
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  async function excluir(produto: Produto) {
    if (!window.confirm(`Excluir "${produto.nome}"? Não dá para desfazer.`)) {
      return;
    }

    setErro("");
    setAviso("");

    try {
      await api.delete(`/api/admin/produtos/${produto.id}`);
      setProdutos((atuais) => (atuais ?? []).filter((p) => p.id !== produto.id));
      setAviso(`"${produto.nome}" foi excluído.`);
    } catch (e) {
      // RN07: produto que ja esta em pedido so pode ser desativado
      setErro(mensagemDeErro(e));
    }
  }

  const termo = semAcento(busca.trim());
  const lista = (produtos ?? []).filter(
    (produto) =>
      (categoriaFiltro === "todas" || String(produto.categoria.id) === categoriaFiltro) &&
      (situacao === "todos" || (situacao === "ativos") === produto.ativo) &&
      (!termo || semAcento(produto.nome).includes(termo))
  );

  return (
    <div className="pagina-estreita">
      <header className="topo">
        <div>
          <h1>Produtos</h1>
          <p className="texto-pequeno">
            {produtos ? `${produtos.length} itens no cadastro.` : "Carregando..."}
          </p>
        </div>

        <button className="botao botao-com-icone" onClick={() => setEditando("novo")}>
          <Plus size={18} />
          Novo produto
        </button>
      </header>

      <div className="filtros">
        <input
          type="search"
          className="filtro-busca"
          placeholder="Buscar produto"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar produto"
        />

        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          aria-label="Filtrar por categoria"
        >
          <option value="todas">Todas as categorias</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>

        <select
          value={situacao}
          onChange={(e) => setSituacao(e.target.value as "todos" | "ativos" | "inativos")}
          aria-label="Filtrar por situação"
        >
          <option value="todos">Ativos e inativos</option>
          <option value="ativos">Só ativos</option>
          <option value="inativos">Só inativos</option>
        </select>
      </div>

      {aviso && (
        <p className="mensagem-sucesso" role="status">
          {aviso}
        </p>
      )}
      {erro && <p className="mensagem-erro">{erro}</p>}

      {produtos !== null && lista.length === 0 && (
        <p className="vazio">Nenhum produto encontrado com esses filtros.</p>
      )}

      <div className="tabela">
        {lista.map((produto) => (
          <div key={produto.id} className={"tabela-linha" + (produto.ativo ? "" : " inativo")}>
            <div className="tabela-nome">
              <strong>{produto.nome}</strong>
              <span className="texto-pequeno">{produto.categoria.nome}</span>
            </div>

            <span className="tabela-preco">{formatarPreco(produto.preco)}</span>

            <span className={"status " + (produto.ativo ? "status-ativo" : "status-inativo")}>
              {produto.ativo ? "No cardápio" : "Fora do cardápio"}
            </span>

            <div className="tabela-acoes">
              <button
                className="botao-icone"
                onClick={() => setEditando(produto)}
                aria-label={`Editar ${produto.nome}`}
                title="Editar"
              >
                <Pencil size={18} />
              </button>
              <button
                className="botao-icone"
                onClick={() => alternarAtivo(produto)}
                aria-label={produto.ativo ? `Tirar ${produto.nome} do cardápio` : `Colocar ${produto.nome} no cardápio`}
                title={produto.ativo ? "Tirar do cardápio" : "Colocar no cardápio"}
              >
                <Power size={18} />
              </button>
              <button
                className="botao-icone botao-perigo"
                onClick={() => excluir(produto)}
                aria-label={`Excluir ${produto.nome}`}
                title="Excluir"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editando !== null && (
        <Modal
          titulo={editando === "novo" ? "Novo produto" : "Editar produto"}
          aoFechar={() => setEditando(null)}
        >
          <FormProduto
            produto={editando === "novo" ? null : editando}
            categorias={categorias}
            aoSalvar={aoSalvar}
            aoCancelar={() => setEditando(null)}
          />
        </Modal>
      )}
    </div>
  );
}
