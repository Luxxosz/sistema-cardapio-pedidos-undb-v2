export type Papel = "CLIENTE" | "ADMIN";

export interface AuthResponse {
  token: string;
  nome: string;
  papel: Papel;
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  ativo: boolean;
  imagemUrl: string | null;
  categoria: Categoria;
}

export interface ProdutoForm {
  nome: string;
  descricao: string | null;
  preco: number;
  categoriaId: number;
  imagemUrl: string | null;
}

export type StatusPedido =
  | "PENDENTE"
  | "CONFIRMADO"
  | "EM_PREPARACAO"
  | "PRONTO"
  | "FINALIZADO"
  | "CANCELADO";

export interface ItemPedido {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  status: StatusPedido;
  observacao: string | null;
  valorTotal: number;
  dataCriacao: string;
  cliente: string;
  itens: ItemPedido[];
}

export interface ProdutoVendido {
  produto: string;
  quantidade: number;
}

export interface Dashboard {
  data: string;
  diaEncerrado: boolean;
  totalPedidos: number;
  pedidosEmAberto: number;
  pedidosFinalizados: number;
  faturamento: number;
  ticketMedio: number;
  pedidosPorStatus: Record<string, number>;
  maisVendidos: ProdutoVendido[];
}
