import type { StatusPedido } from "../types";

export function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const NOMES_STATUS: Record<StatusPedido, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  EM_PREPARACAO: "Em preparação",
  PRONTO: "Pronto",
  FINALIZADO: "Finalizado",
  CANCELADO: "Cancelado",
};

export function nomeDoStatus(status: StatusPedido): string {
  return NOMES_STATUS[status] ?? status;
}

// tira acentos e deixa minusculo, pra busca achar "pao" quando o prato e "Pão"
export function semAcento(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// "Raízes da ilha" vira "raizes-da-ilha" (e o nome do arquivo da foto da categoria)
export function slug(texto: string): string {
  return semAcento(texto)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function fotoDaCategoria(nome: string): string {
  return `/categorias/${slug(nome)}.jpg`;
}

export function formatarDataHora(iso: string): string {
  const data = new Date(iso);
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// data de hoje no formato yyyy-mm-dd (o que o <input type="date"> e o backend usam)
export function hojeISO(): string {
  return new Date().toLocaleDateString("sv-SE");
}
