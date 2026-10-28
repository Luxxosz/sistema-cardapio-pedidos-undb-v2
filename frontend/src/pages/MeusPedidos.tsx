import { useEffect, useState } from "react";
import { Link } from "react-router";
import StatusBadge from "../components/StatusBadge";
import { useTempoReal } from "../hooks/useTempoReal";
import { api, mensagemDeErro } from "../services/api";
import { formatarDataHora, formatarPreco, nomeDoStatus } from "../utils/formatar";
import type { Pedido, StatusPedido } from "../types";

const ETAPAS: StatusPedido[] = ["PENDENTE", "CONFIRMADO", "EM_PREPARACAO", "PRONTO", "FINALIZADO"];

// linha do tempo do pedido: so aparece enquanto ele nao foi cancelado
function Etapas({ status }: { status: StatusPedido }) {
  const atual = ETAPAS.indexOf(status);

  return (
    <ol className="etapas">
      {ETAPAS.map((etapa, posicao) => (
        <li
          key={etapa}
          className={posicao < atual ? "feita" : posicao === atual ? "atual" : ""}
          aria-current={posicao === atual ? "step" : undefined}
        >
          <span className="etapa-ponto" />
          <span className="etapa-nome">{nomeDoStatus(etapa)}</span>
        </li>
      ))}
    </ol>
  );
}

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [ocupado, setOcupado] = useState<number | null>(null);

  // busca os pedidos quando a pagina abre
  useEffect(() => {
    let ativo = true;

    api
      .get<Pedido[]>("/api/pedidos")
      .then((lista) => {
        if (ativo) {
          setPedidos(lista);
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

  // some o aviso depois de alguns segundos
  useEffect(() => {
    if (!aviso) {
      return;
    }
    const espera = setTimeout(() => setAviso(""), 7000);
    return () => clearTimeout(espera);
  }, [aviso]);

  function trocarPedido(novo: Pedido) {
    setPedidos((atuais) => {
      const lista = atuais ?? [];
      return lista.some((p) => p.id === novo.id)
        ? lista.map((p) => (p.id === novo.id ? novo : p))
        : [novo, ...lista];
    });
  }

  // o backend avisa quando o restaurante muda o status do pedido
  const aoVivo = useTempoReal((pedido) => {
    trocarPedido(pedido);
    setAviso(`Pedido nº ${pedido.id}: agora está ${nomeDoStatus(pedido.status).toLowerCase()}.`);
  });

  async function mudarStatus(pedido: Pedido, acao: "confirmar" | "cancelar") {
    if (acao === "cancelar" && !window.confirm(`Cancelar o pedido nº ${pedido.id}?`)) {
      return;
    }

    setOcupado(pedido.id);
    setErro("");

    try {
      trocarPedido(await api.patch<Pedido>(`/api/pedidos/${pedido.id}/${acao}`));
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setOcupado(null);
    }
  }

  return (
    <div className="pagina-estreita">
      <header className="topo">
        <div>
          <h1>Meus pedidos</h1>
          <p className="texto-pequeno">
            <span className={"ao-vivo" + (aoVivo ? " ligado" : "")} />
            {aoVivo ? "Atualização em tempo real ligada." : "Conectando a atualização em tempo real..."}
          </p>
        </div>
      </header>

      {aviso && (
        <p className="mensagem-sucesso" role="status">
          {aviso}
        </p>
      )}
      {erro && <p className="mensagem-erro">{erro}</p>}

      {pedidos === null && !erro && <p>Carregando seus pedidos...</p>}

      {pedidos !== null && pedidos.length === 0 && (
        <div className="cartao">
          <p>Você ainda não fez nenhum pedido.</p>
          <Link to="/" className="botao">
            Ver o cardápio
          </Link>
        </div>
      )}

      <div className="lista-cartoes">
        {pedidos?.map((pedido) => (
          <article key={pedido.id} className="pedido">
            <header className="pedido-topo">
              <div>
                <h2>Pedido nº {pedido.id}</h2>
                <span className="texto-pequeno">{formatarDataHora(pedido.dataCriacao)}</span>
              </div>
              <StatusBadge status={pedido.status} />
            </header>

            {pedido.status !== "CANCELADO" && <Etapas status={pedido.status} />}

            <ul className="lista-itens">
              {pedido.itens.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.quantidade}x {item.produtoNome}
                  </span>
                  <span>{formatarPreco(item.subtotal)}</span>
                </li>
              ))}
            </ul>

            {pedido.observacao && <p className="texto-pequeno">Observação: {pedido.observacao}</p>}

            <footer className="pedido-rodape">
              <p className="painel-total">
                <span>Total</span>
                <strong>{formatarPreco(pedido.valorTotal)}</strong>
              </p>

              <div className="acoes">
                {pedido.status === "PENDENTE" && (
                  <button
                    className="botao"
                    onClick={() => mudarStatus(pedido, "confirmar")}
                    disabled={ocupado === pedido.id}
                  >
                    Confirmar pedido
                  </button>
                )}
                {(pedido.status === "PENDENTE" || pedido.status === "CONFIRMADO") && (
                  <button
                    className="botao botao-claro-escuro"
                    onClick={() => mudarStatus(pedido, "cancelar")}
                    disabled={ocupado === pedido.id}
                  >
                    Cancelar pedido
                  </button>
                )}
              </div>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
