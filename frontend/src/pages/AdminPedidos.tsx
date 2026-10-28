import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { useTempoReal } from "../hooks/useTempoReal";
import { api, mensagemDeErro } from "../services/api";
import { formatarDataHora, formatarPreco, nomeDoStatus } from "../utils/formatar";
import type { Pedido, StatusPedido } from "../types";

type Aba = "ANDAMENTO" | "PENDENTE" | "FINALIZADO" | "CANCELADO" | "TODOS";

const ABAS: { valor: Aba; nome: string }[] = [
  { valor: "ANDAMENTO", nome: "Em andamento" },
  { valor: "PENDENTE", nome: "Pendentes" },
  { valor: "FINALIZADO", nome: "Finalizados" },
  { valor: "CANCELADO", nome: "Cancelados" },
  { valor: "TODOS", nome: "Todos" },
];

const EM_ANDAMENTO: StatusPedido[] = ["CONFIRMADO", "EM_PREPARACAO", "PRONTO"];

function pertenceA(aba: Aba, pedido: Pedido): boolean {
  if (aba === "TODOS") {
    return true;
  }
  if (aba === "ANDAMENTO") {
    return EM_ANDAMENTO.includes(pedido.status);
  }
  return pedido.status === aba;
}

// o que o administrador pode fazer em cada status (RN04)
const ACOES: Record<StatusPedido, { rotulo: string; novo: StatusPedido; principal?: boolean }[]> = {
  PENDENTE: [{ rotulo: "Cancelar", novo: "CANCELADO" }],
  CONFIRMADO: [
    { rotulo: "Iniciar preparo", novo: "EM_PREPARACAO", principal: true },
    { rotulo: "Cancelar", novo: "CANCELADO" },
  ],
  EM_PREPARACAO: [{ rotulo: "Marcar como pronto", novo: "PRONTO", principal: true }],
  PRONTO: [{ rotulo: "Finalizar", novo: "FINALIZADO", principal: true }],
  FINALIZADO: [],
  CANCELADO: [],
};

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const [aba, setAba] = useState<Aba>("ANDAMENTO");
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [ocupado, setOcupado] = useState<number | null>(null);

  // busca os pedidos quando a pagina abre
  useEffect(() => {
    let ativo = true;

    api
      .get<Pedido[]>("/api/admin/pedidos")
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

  // pedidos novos e mudancas de status chegam sozinhos
  const aoVivo = useTempoReal((pedido) => {
    trocarPedido(pedido);
    setAviso(
      pedido.status === "CONFIRMADO"
        ? `Novo pedido nº ${pedido.id} de ${pedido.cliente}.`
        : `Pedido nº ${pedido.id}: ${nomeDoStatus(pedido.status).toLowerCase()}.`
    );
  });

  async function mudarStatus(pedido: Pedido, novo: StatusPedido) {
    if (novo === "CANCELADO" && !window.confirm(`Cancelar o pedido nº ${pedido.id}?`)) {
      return;
    }

    setOcupado(pedido.id);
    setErro("");

    try {
      trocarPedido(
        await api.patch<Pedido>(`/api/admin/pedidos/${pedido.id}/status`, { status: novo })
      );
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setOcupado(null);
    }
  }

  const lista = (pedidos ?? []).filter((pedido) => pertenceA(aba, pedido));

  return (
    <div className="pagina-estreita">
      <header className="topo">
        <div>
          <h1>Pedidos</h1>
          <p className="texto-pequeno">
            <span className={"ao-vivo" + (aoVivo ? " ligado" : "")} />
            {aoVivo ? "Novos pedidos aparecem sozinhos." : "Conectando a atualização em tempo real..."}
          </p>
        </div>
      </header>

      <div className="abas" role="tablist" aria-label="Filtrar pedidos">
        {ABAS.map((item) => (
          <button
            key={item.valor}
            className={"aba" + (aba === item.valor ? " ativa" : "")}
            onClick={() => setAba(item.valor)}
            role="tab"
            aria-selected={aba === item.valor}
          >
            {item.nome}
            {pedidos && (
              <span className="aba-contador">
                {pedidos.filter((pedido) => pertenceA(item.valor, pedido)).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {aviso && (
        <p className="mensagem-sucesso" role="status">
          {aviso}
        </p>
      )}
      {erro && <p className="mensagem-erro">{erro}</p>}
      {pedidos === null && !erro && <p>Carregando os pedidos...</p>}

      {pedidos !== null && lista.length === 0 && (
        <p className="vazio">Nenhum pedido nesta lista.</p>
      )}

      <div className="lista-cartoes">
        {lista.map((pedido) => (
          <article key={pedido.id} className="pedido">
            <header className="pedido-topo">
              <div>
                <h2>
                  Pedido nº {pedido.id} · {pedido.cliente}
                </h2>
                <span className="texto-pequeno">{formatarDataHora(pedido.dataCriacao)}</span>
              </div>
              <StatusBadge status={pedido.status} />
            </header>

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

            {pedido.observacao && (
              <p className="observacao">Observação do cliente: {pedido.observacao}</p>
            )}

            <footer className="pedido-rodape">
              <p className="painel-total">
                <span>Total</span>
                <strong>{formatarPreco(pedido.valorTotal)}</strong>
              </p>

              <div className="acoes">
                {ACOES[pedido.status].map((acao) => (
                  <button
                    key={acao.novo}
                    className={"botao" + (acao.principal ? "" : " botao-claro-escuro")}
                    onClick={() => mudarStatus(pedido, acao.novo)}
                    disabled={ocupado === pedido.id}
                  >
                    {acao.rotulo}
                  </button>
                ))}
              </div>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
