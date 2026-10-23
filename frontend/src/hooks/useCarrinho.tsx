import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Produto } from "../types";

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

interface CarrinhoSalvo {
  itens: ItemCarrinho[];
  observacao: string;
}

interface CarrinhoContextoTipo {
  itens: ItemCarrinho[];
  observacao: string;
  setObservacao: (texto: string) => void;
  adicionar: (produto: Produto) => void;
  alterarQuantidade: (produtoId: number, quantidade: number) => void;
  remover: (produtoId: number) => void;
  limpar: () => void;
  sincronizar: (produtosAtivos: Produto[]) => void;
  total: number;
  quantidadeTotal: number;
  painelAberto: boolean;
  setPainelAberto: (aberto: boolean) => void;
}

const CarrinhoContexto = createContext<CarrinhoContextoTipo | null>(null);

// o carrinho fica salvo no navegador, entao nao some se recarregar a pagina
function lerCarrinhoSalvo(): CarrinhoSalvo {
  const texto = localStorage.getItem("carrinho");
  if (!texto) {
    return { itens: [], observacao: "" };
  }

  try {
    return JSON.parse(texto) as CarrinhoSalvo;
  } catch {
    return { itens: [], observacao: "" };
  }
}

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>(() => lerCarrinhoSalvo().itens);
  const [observacao, setObservacao] = useState<string>(() => lerCarrinhoSalvo().observacao);
  const [painelAberto, setPainelAberto] = useState(false);

  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify({ itens, observacao }));
  }, [itens, observacao]);

  function adicionar(produto: Produto) {
    const existente = itens.find((item) => item.produto.id === produto.id);

    if (existente) {
      setItens(
        itens.map((item) =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        )
      );
    } else {
      setItens([...itens, { produto, quantidade: 1 }]);
    }
  }

  function alterarQuantidade(produtoId: number, quantidade: number) {
    if (quantidade < 1) {
      return;
    }

    setItens(
      itens.map((item) => (item.produto.id === produtoId ? { ...item, quantidade } : item))
    );
  }

  function remover(produtoId: number) {
    setItens(itens.filter((item) => item.produto.id !== produtoId));
  }

  function limpar() {
    setItens([]);
    setObservacao("");
  }

  // quando o cardapio carrega, atualiza preco e nome dos itens do carrinho
  // e tira os produtos que foram desativados
  const sincronizar = useCallback((produtosAtivos: Produto[]) => {
    setItens((atuais) =>
      atuais.flatMap((item) => {
        const atualizado = produtosAtivos.find((produto) => produto.id === item.produto.id);
        return atualizado ? [{ ...item, produto: atualizado }] : [];
      })
    );
  }, []);

  // so uma previa: o valor de verdade e calculado pelo backend ao criar o pedido
  const total = itens.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0);
  const quantidadeTotal = itens.reduce((soma, item) => soma + item.quantidade, 0);

  return (
    <CarrinhoContexto.Provider
      value={{
        itens,
        observacao,
        setObservacao,
        adicionar,
        alterarQuantidade,
        remover,
        limpar,
        sincronizar,
        total,
        quantidadeTotal,
        painelAberto,
        setPainelAberto,
      }}
    >
      {children}
    </CarrinhoContexto.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCarrinho() {
  const contexto = useContext(CarrinhoContexto);
  if (!contexto) {
    throw new Error("useCarrinho precisa ser usado dentro do CarrinhoProvider");
  }
  return contexto;
}
