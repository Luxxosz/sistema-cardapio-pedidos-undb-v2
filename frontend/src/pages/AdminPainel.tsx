import { useEffect, useState } from "react";
import { useTempoReal } from "../hooks/useTempoReal";
import { api, mensagemDeErro } from "../services/api";
import { formatarPreco, hojeISO, nomeDoStatus } from "../utils/formatar";
import type { Dashboard, StatusPedido } from "../types";

const ORDEM_STATUS: StatusPedido[] = [
  "PENDENTE",
  "CONFIRMADO",
  "EM_PREPARACAO",
  "PRONTO",
  "FINALIZADO",
  "CANCELADO",
];

function formatarDataLonga(iso: string): string {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function AdminPainel() {
  const hoje = hojeISO();
  const [data, setData] = useState(hoje);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  // busca o resumo quando a pagina abre e quando o dia escolhido muda
  useEffect(() => {
    let ativo = true;

    api
      .get<Dashboard>(`/api/admin/dashboard?data=${data}`)
      .then((resumo) => {
        if (ativo) {
          setDashboard(resumo);
          setErro("");
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
  }, [data]);

  // quando um pedido muda de status, o resumo do dia se atualiza sozinho
  const aoVivo = useTempoReal(() => {
    if (data === hoje) {
      api
        .get<Dashboard>(`/api/admin/dashboard?data=${data}`)
        .then(setDashboard)
        .catch((e) => setErro(mensagemDeErro(e)));
    }
  });

  async function encerrarOuReabrir(acao: "encerrar-dia" | "reabrir-dia") {
    const pergunta =
      acao === "encerrar-dia"
        ? "Encerrar o dia? Depois disso o restaurante não recebe novos pedidos hoje."
        : "Reabrir o dia? O restaurante volta a receber pedidos.";

    if (!window.confirm(pergunta)) {
      return;
    }

    setOcupado(true);
    setErro("");

    try {
      setDashboard(await api.post<Dashboard>(`/api/admin/dashboard/${acao}`));
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setOcupado(false);
    }
  }

  const ehHoje = data === hoje;
  const maiorQuantidade = Math.max(1, ...(dashboard?.maisVendidos.map((p) => p.quantidade) ?? [1]));
  const totalPedidos = Math.max(1, dashboard?.totalPedidos ?? 1);

  return (
    <div className="pagina-estreita">
      <header className="topo">
        <div>
          <h1>Painel do dia</h1>
          <p className="texto-pequeno">
            <span className={"ao-vivo" + (aoVivo ? " ligado" : "")} />
            {formatarDataLonga(data)}
          </p>
        </div>

        <label className="campo campo-data">
          Dia
          <input
            type="date"
            value={data}
            max={hoje}
            onChange={(e) => setData(e.target.value || hoje)}
          />
        </label>
      </header>

      {erro && <p className="mensagem-erro">{erro}</p>}
      {!dashboard && !erro && <p>Carregando o resumo...</p>}

      {dashboard && (
        <>
          {dashboard.diaEncerrado && (
            <p className="mensagem-aviso" role="status">
              Este dia foi encerrado. O restaurante não recebe novos pedidos nele.
            </p>
          )}

          <section className="quadro quadro-recibo" aria-label="Resumo do dia">
            <dl className="recibo">
              <div className="recibo-linha recibo-destaque">
                <dt>Faturamento</dt>
                <span className="pontilhado" aria-hidden="true" />
                <dd>{formatarPreco(dashboard.faturamento)}</dd>
              </div>
              <div className="recibo-linha">
                <dt>Pedidos finalizados</dt>
                <span className="pontilhado" aria-hidden="true" />
                <dd>{dashboard.pedidosFinalizados}</dd>
              </div>
              <div className="recibo-linha">
                <dt>Ticket médio</dt>
                <span className="pontilhado" aria-hidden="true" />
                <dd>{formatarPreco(dashboard.ticketMedio)}</dd>
              </div>
              <div className="recibo-linha">
                <dt>Pedidos em aberto</dt>
                <span className="pontilhado" aria-hidden="true" />
                <dd>{dashboard.pedidosEmAberto}</dd>
              </div>
              <div className="recibo-linha">
                <dt>Total de pedidos do dia</dt>
                <span className="pontilhado" aria-hidden="true" />
                <dd>{dashboard.totalPedidos}</dd>
              </div>
            </dl>

            <div className="acoes">
              {ehHoje && !dashboard.diaEncerrado && (
                <button
                  className="botao"
                  onClick={() => encerrarOuReabrir("encerrar-dia")}
                  disabled={ocupado}
                >
                  Encerrar o dia
                </button>
              )}
              {ehHoje && dashboard.diaEncerrado && (
                <button
                  className="botao botao-claro-escuro"
                  onClick={() => encerrarOuReabrir("reabrir-dia")}
                  disabled={ocupado}
                >
                  Reabrir o dia
                </button>
              )}
            </div>
            {!ehHoje && (
              <p className="texto-pequeno">Só é possível encerrar ou reabrir o dia de hoje.</p>
            )}
          </section>

          <div className="duas-colunas">
            <section className="cartao">
              <h2>Pedidos por status</h2>
              <ul className="barras">
                {ORDEM_STATUS.map((status) => {
                  const quantidade = dashboard.pedidosPorStatus[status] ?? 0;
                  return (
                    <li key={status}>
                      <div className="barra-texto">
                        <span>{nomeDoStatus(status)}</span>
                        <strong>{quantidade}</strong>
                      </div>
                      <div className="barra-trilho">
                        <div
                          className={"barra-preenchida status-" + status.toLowerCase()}
                          style={{ width: `${(quantidade / totalPedidos) * 100}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="cartao">
              <h2>Mais vendidos</h2>
              {dashboard.maisVendidos.length === 0 ? (
                <p className="texto-pequeno">
                  Ainda não há pedidos finalizados neste dia. Os mais vendidos aparecem aqui.
                </p>
              ) : (
                <ul className="barras">
                  {dashboard.maisVendidos.map((item) => (
                    <li key={item.produto}>
                      <div className="barra-texto">
                        <span>{item.produto}</span>
                        <strong>{item.quantidade}</strong>
                      </div>
                      <div className="barra-trilho">
                        <div
                          className="barra-preenchida barra-latao"
                          style={{ width: `${(item.quantidade / maiorQuantidade) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
