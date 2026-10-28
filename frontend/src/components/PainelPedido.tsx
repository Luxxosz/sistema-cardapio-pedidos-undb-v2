import { useState } from "react";
import { useNavigate } from "react-router";
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCarrinho } from "../hooks/useCarrinho";
import { api, mensagemDeErro } from "../services/api";
import { formatarPreco } from "../utils/formatar";
import StatusBadge from "./StatusBadge";
import type { Pedido } from "../types";

// painel do pedido: coluna fixa no computador, gaveta no tablet e no celular
export default function PainelPedido() {
  const { sessao } = useAuth();
  const {
    itens,
    observacao,
    setObservacao,
    alterarQuantidade,
    remover,
    limpar,
    total,
    painelAberto,
    setPainelAberto,
  } = useCarrinho();
  const navegar = useNavigate();

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [pedidoEnviado, setPedidoEnviado] = useState<Pedido | null>(null);

  async function confirmarPedido() {
    // quem nao esta logado precisa entrar primeiro, o carrinho fica guardado
    if (!sessao) {
      setPainelAberto(false);
      navegar("/entrar", { state: { de: "/" } });
      return;
    }

    setErro("");
    setEnviando(true);

    try {
      const corpo = {
        observacao: observacao.trim() === "" ? null : observacao.trim(),
        itens: itens.map((item) => ({ produtoId: item.produto.id, quantidade: item.quantidade })),
      };

      // 1o: cria o pedido (fica PENDENTE)
      const criado = await api.post<Pedido>("/api/pedidos", corpo);
      limpar();

      // 2o: confirma o pedido
      try {
        const confirmado = await api.patch<Pedido>(`/api/pedidos/${criado.id}/confirmar`);
        setPedidoEnviado(confirmado);
        setAviso("");
      } catch (e) {
        setPedidoEnviado(criado);
        setAviso("O pedido foi criado, mas não foi possível confirmar: " + mensagemDeErro(e));
      }
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setEnviando(false);
    }
  }

  function acompanhar() {
    setPedidoEnviado(null);
    setAviso("");
    setPainelAberto(false);
    navegar("/meus-pedidos");
  }

  function novoPedido() {
    setPedidoEnviado(null);
    setAviso("");
    setPainelAberto(false);
  }

  return (
    <>
      {painelAberto && <div className="painel-fundo" onClick={() => setPainelAberto(false)} />}

      <aside className={"painel-pedido" + (painelAberto ? " aberto" : "")}>
        <header className="painel-topo">
          <h2>Meu pedido</h2>
          <button
            className="painel-fechar botao-icone"
            onClick={() => setPainelAberto(false)}
            aria-label="Fechar"
          >
            <X size={22} />
          </button>
        </header>

        {pedidoEnviado ? (
          <div className="painel-sucesso">
            <span className="painel-sucesso-icone">
              <Check size={28} />
            </span>
            <h3>Pedido nº {pedidoEnviado.id}</h3>
            <StatusBadge status={pedidoEnviado.status} />

            {aviso ? (
              <p className="mensagem-aviso">{aviso}</p>
            ) : (
              <p className="mensagem-sucesso">O restaurante já recebeu o seu pedido.</p>
            )}

            <ul className="lista-itens">
              {pedidoEnviado.itens.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.quantidade}x {item.produtoNome}
                  </span>
                  <span>{formatarPreco(item.subtotal)}</span>
                </li>
              ))}
            </ul>

            <p className="painel-total">
              <span>Total</span>
              <strong>{formatarPreco(pedidoEnviado.valorTotal)}</strong>
            </p>

            <button className="botao botao-largo" onClick={acompanhar}>
              Acompanhar o pedido
            </button>
            <button className="botao botao-claro-escuro botao-largo" onClick={novoPedido}>
              Fazer outro pedido
            </button>
          </div>
        ) : itens.length === 0 ? (
          <div className="painel-vazio">
            <ShoppingBag size={36} />
            <p>Seu pedido está vazio.</p>
            <p className="texto-pequeno">Toque no + de um prato para adicionar.</p>
          </div>
        ) : (
          <>
            <div className="painel-lista">
              {itens.map((item) => (
                <div key={item.produto.id} className="painel-item">
                  <div className="painel-item-info">
                    <strong>{item.produto.nome}</strong>
                    <span>{formatarPreco(item.produto.preco * item.quantidade)}</span>

                    <div className="quantidade">
                      <button
                        className="botao-quantidade"
                        onClick={() => alterarQuantidade(item.produto.id, item.quantidade - 1)}
                        disabled={item.quantidade <= 1}
                        aria-label="Diminuir quantidade"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantidade}</span>
                      <button
                        className="botao-quantidade"
                        onClick={() => alterarQuantidade(item.produto.id, item.quantidade + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <button
                    className="botao-icone botao-lixeira"
                    onClick={() => remover(item.produto.id)}
                    aria-label={`Remover ${item.produto.nome}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="painel-rodape">
              <label className="campo">
                Observação (opcional)
                <textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  maxLength={300}
                  rows={2}
                  placeholder="Ex.: sem cebola, ponto da carne..."
                />
              </label>

              <p className="painel-total">
                <span>Total</span>
                <strong>{formatarPreco(total)}</strong>
              </p>

              {erro && <p className="mensagem-erro">{erro}</p>}

              <button className="botao botao-largo" onClick={confirmarPedido} disabled={enviando}>
                {enviando ? "Enviando..." : sessao ? "Confirmar pedido" : "Entrar para confirmar"}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
