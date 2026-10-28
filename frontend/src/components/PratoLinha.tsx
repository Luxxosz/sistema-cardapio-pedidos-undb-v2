import { Plus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCarrinho } from "../hooks/useCarrinho";
import { formatarPreco } from "../utils/formatar";
import type { Produto } from "../types";

// uma linha do cardapio: nome, descricao, preco e o botao de adicionar
export default function PratoLinha({ produto }: { produto: Produto }) {
  const { sessao } = useAuth();
  const { itens, adicionar } = useCarrinho();

  const ehAdmin = sessao?.papel === "ADMIN";
  const noCarrinho = itens.find((item) => item.produto.id === produto.id);

  return (
    <div className="prato">
      {produto.imagemUrl && (
        <img
          className="prato-foto"
          src={produto.imagemUrl}
          alt=""
          loading="lazy"
          onError={(evento) => {
            evento.currentTarget.style.display = "none";
          }}
        />
      )}

      <div className="prato-texto">
        <h3>{produto.nome}</h3>
        {produto.descricao && <p>{produto.descricao}</p>}
      </div>

      <div className="prato-lado">
        <span className="prato-preco">{formatarPreco(produto.preco)}</span>

        {!ehAdmin && (
          <div className="prato-acao">
            {noCarrinho && <span className="prato-qtd">{noCarrinho.quantidade} no pedido</span>}
            <button
              className="botao-mais"
              onClick={() => adicionar(produto)}
              aria-label={`Adicionar ${produto.nome} ao pedido`}
            >
              <Plus size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
