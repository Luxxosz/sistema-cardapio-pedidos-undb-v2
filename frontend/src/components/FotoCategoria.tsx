import { useState } from "react";
import LogoTarrafa from "./LogoTarrafa";
import { fotoDaCategoria } from "../utils/formatar";

interface Props {
  nome: string;
  className?: string;
}

// foto da categoria (public/categorias/nome-da-categoria.jpg).
// Se o arquivo nao existir, mostra o simbolo do Tarrafa.
export default function FotoCategoria({ nome, className }: Props) {
  const [falhou, setFalhou] = useState(false);

  return (
    <div className={"foto-categoria " + (className ?? "")}>
      {falhou ? (
        <LogoTarrafa tamanho={44} />
      ) : (
        <img src={fotoDaCategoria(nome)} alt="" loading="lazy" onError={() => setFalhou(true)} />
      )}
    </div>
  );
}
