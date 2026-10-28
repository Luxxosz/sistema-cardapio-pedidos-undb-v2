import { useEffect, useMemo, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import FotoCategoria from "../components/FotoCategoria";
import LogoTarrafa from "../components/LogoTarrafa";
import PainelPedido from "../components/PainelPedido";
import PratoLinha from "../components/PratoLinha";
import { useAuth } from "../hooks/useAuth";
import { useCarrinho } from "../hooks/useCarrinho";
import { api, mensagemDeErro } from "../services/api";
import { semAcento } from "../utils/formatar";
import type { Categoria, Produto } from "../types";

const AVISO_ALCOOL = "Venda de bebidas alcoólicas proibida para menores de 18 anos.";

// avisos que aparecem embaixo da foto de cada categoria (do cardapio oficial)
const NOTAS: Record<string, string> = {
  "Assinaturas do chef":
    "Lagosta e camarão seguem o calendário oficial de defeso; no período, o chef troca o prato por pescados da estação, sem mudar o preço da assinatura.",
  "Pescador júnior": "Para crianças até 10 anos, com brinde da casa.",
  "Sem álcool": "Nos sucos, informe o sabor na observação do pedido.",
  Cervejas: AVISO_ALCOOL,
  "Coquetéis da casa": AVISO_ALCOOL,
  Destilados: "Dose de 50 ml. " + AVISO_ALCOOL,
  "Espumantes e champanhes": "Taça de 125 ml, garrafa de 750 ml. " + AVISO_ALCOOL,
  "Brancos e rosé": "Taça de 125 ml, garrafa de 750 ml. " + AVISO_ALCOOL,
  Tintos: "Taça de 125 ml, garrafa de 750 ml. " + AVISO_ALCOOL,
  "Sobremesa e fortificados": "Taça de 125 ml, garrafa de 750 ml. " + AVISO_ALCOOL,
};

export default function Cardapio() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const { sessao } = useAuth();
  const { quantidadeTotal, setPainelAberto, sincronizar } = useCarrinho();

  const ehAdmin = sessao?.papel === "ADMIN";
  const primeiroNome = sessao ? sessao.nome.split(" ")[0] : "";

  useEffect(() => {
    async function carregar() {
      try {
        const [listaCategorias, listaProdutos] = await Promise.all([
          api.get<Categoria[]>("/api/categorias"),
          api.get<Produto[]>("/api/produtos"),
        ]);
        setCategorias(listaCategorias);
        setProdutos(listaProdutos);
        sincronizar(listaProdutos);
      } catch (e) {
        setErro(mensagemDeErro(e));
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [sincronizar]);

  // so mostra as categorias que tem algum produto ativo
  const categoriasComPratos = categorias.filter((categoria) =>
    produtos.some((produto) => produto.categoria.id === categoria.id)
  );

  const termo = semAcento(busca.trim());
  const buscando = termo.length > 0;

  // cada secao e uma categoria com os pratos que passam pelo filtro e pela busca
  const secoes = useMemo(
    () =>
      categorias
        .filter((categoria) => escolhida === null || categoria.id === escolhida)
        .map((categoria) => ({
          categoria,
          pratos: produtos.filter(
            (produto) =>
              produto.categoria.id === categoria.id &&
              (!termo || semAcento(produto.nome + " " + (produto.descricao ?? "")).includes(termo))
          ),
        }))
        .filter((secao) => secao.pratos.length > 0),
    [categorias, produtos, escolhida, termo]
  );

  return (
    <div className="cardapio-pagina">
      <section className="cardapio-coluna">
        <header className="topo">
          <div>
            <h1>{sessao ? `Olá, ${primeiroNome}` : "Bem-vindo ao Tarrafa"}</h1>
            <p className="texto-pequeno">Escolha os pratos e monte o seu pedido.</p>
          </div>

          <div className="topo-acoes">
            <label className="busca">
              <Search size={18} />
              <input
                type="search"
                placeholder="Buscar no cardápio"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </label>

            {!ehAdmin && (
              <button
                className="botao-carrinho"
                onClick={() => setPainelAberto(true)}
                aria-label="Abrir o meu pedido"
              >
                <span className="icone-contador">
                  <ShoppingBag size={22} />
                  {quantidadeTotal > 0 && <span className="contador">{quantidadeTotal}</span>}
                </span>
              </button>
            )}
          </div>
        </header>

        <div className="banner">
          <div>
            <h2>Pescado da ilha, servido à luz de velas.</h2>
            <p>Cardápio do Tarrafa Bistrô do Mar, São Luís do Maranhão.</p>
          </div>
          <LogoTarrafa tamanho={96} className="banner-logo" />
        </div>

        {carregando && (
          <p>Carregando o cardápio... (na primeira vez do dia pode demorar alguns segundos)</p>
        )}

        {erro && <p className="mensagem-erro">{erro}</p>}

        {!carregando && !erro && (
          <>
            <div className="categorias" role="tablist" aria-label="Categorias do cardápio">
              <button
                className={"categoria-botao" + (escolhida === null ? " ativa" : "")}
                onClick={() => setEscolhida(null)}
                role="tab"
                aria-selected={escolhida === null}
              >
                <span className="foto-categoria categoria-todos">
                  <LogoTarrafa tamanho={40} />
                </span>
                <span>Todos</span>
              </button>

              {categoriasComPratos.map((categoria) => (
                <button
                  key={categoria.id}
                  className={"categoria-botao" + (escolhida === categoria.id ? " ativa" : "")}
                  onClick={() => setEscolhida(categoria.id)}
                  role="tab"
                  aria-selected={escolhida === categoria.id}
                >
                  <FotoCategoria nome={categoria.nome} />
                  <span>{categoria.nome}</span>
                </button>
              ))}
            </div>

            {secoes.length === 0 ? (
              <p className="vazio">Nenhum item encontrado. Tente outra palavra.</p>
            ) : (
              secoes.map(({ categoria, pratos }) => (
                <section key={categoria.id} className="secao">
                  {buscando ? (
                    <h2 className="secao-titulo">{categoria.nome}</h2>
                  ) : (
                    <header className="faixa">
                      <FotoCategoria nome={categoria.nome} className="faixa-foto" />
                      <div className="faixa-texto">
                        <h2>{categoria.nome}</h2>
                        <span>{pratos.length === 1 ? "1 item" : `${pratos.length} itens`}</span>
                      </div>
                    </header>
                  )}

                  {!buscando && NOTAS[categoria.nome] && (
                    <p className="secao-nota">{NOTAS[categoria.nome]}</p>
                  )}

                  <div className="quadro">
                    {pratos.map((produto) => (
                      <PratoLinha key={produto.id} produto={produto} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </>
        )}
      </section>

      {!ehAdmin && <PainelPedido />}
    </div>
  );
}
