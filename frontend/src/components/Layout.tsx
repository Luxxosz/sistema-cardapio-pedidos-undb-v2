import { NavLink, Outlet, useNavigate } from "react-router";
import type { ReactNode } from "react";
import {
  ClipboardList,
  LayoutDashboard,
  LogIn,
  LogOut,
  ShoppingBag,
  Soup,
  Tags,
  UserPlus,
  UtensilsCrossed,
} from "lucide-react";
import LogoTarrafa from "./LogoTarrafa";
import { useAuth } from "../hooks/useAuth";
import { useCarrinho } from "../hooks/useCarrinho";

interface ItemProps {
  para: string;
  icone: ReactNode;
  texto: string;
  exato?: boolean;
}

function ItemMenu({ para, icone, texto, exato }: ItemProps) {
  return (
    <NavLink to={para} end={exato} className="menu-item">
      {icone}
      <span>{texto}</span>
    </NavLink>
  );
}

function ItemBarra({ para, icone, texto, exato }: ItemProps) {
  return (
    <NavLink to={para} end={exato} className="barra-item">
      {icone}
      <span>{texto}</span>
    </NavLink>
  );
}

export default function Layout() {
  const { sessao, sair } = useAuth();
  const { quantidadeTotal, limpar, setPainelAberto } = useCarrinho();
  const navegar = useNavigate();

  const ehAdmin = sessao?.papel === "ADMIN";

  function aoSair() {
    limpar();
    sair();
    navegar("/");
  }

  function abrirPedido() {
    navegar("/");
    setPainelAberto(true);
  }

  return (
    <div className="app">
      {/* menu lateral (computador e tablet) */}
      <aside className="menu-lateral">
        <div className="menu-logo">
          <LogoTarrafa tamanho={44} className="logo-latao" />
          <span className="menu-logo-texto">Tarrafa</span>
        </div>

        <nav className="menu-itens">
          {ehAdmin && (
            <>
              <ItemMenu para="/admin" exato icone={<LayoutDashboard size={22} />} texto="Painel" />
              <ItemMenu para="/admin/pedidos" icone={<ClipboardList size={22} />} texto="Pedidos" />
              <ItemMenu para="/admin/produtos" icone={<Soup size={22} />} texto="Produtos" />
              <ItemMenu para="/admin/categorias" icone={<Tags size={22} />} texto="Categorias" />
            </>
          )}

          <ItemMenu para="/" exato icone={<UtensilsCrossed size={22} />} texto="Cardápio" />

          {sessao && !ehAdmin && (
            <ItemMenu
              para="/meus-pedidos"
              icone={<ClipboardList size={22} />}
              texto="Meus pedidos"
            />
          )}

          {!sessao && (
            <>
              <ItemMenu para="/entrar" icone={<LogIn size={22} />} texto="Entrar" />
              <ItemMenu para="/cadastro" icone={<UserPlus size={22} />} texto="Cadastrar" />
            </>
          )}
        </nav>

        {sessao && (
          <button className="menu-item" onClick={aoSair}>
            <LogOut size={22} />
            <span>Sair</span>
          </button>
        )}
      </aside>

      <div className="area-principal">
        <Outlet />
      </div>

      {/* barra de baixo (celular) */}
      <nav className="barra-inferior">
        {ehAdmin ? (
          <>
            <ItemBarra para="/admin" exato icone={<LayoutDashboard size={22} />} texto="Painel" />
            <ItemBarra para="/admin/pedidos" icone={<ClipboardList size={22} />} texto="Pedidos" />
            <ItemBarra para="/admin/produtos" icone={<Soup size={22} />} texto="Produtos" />
            <ItemBarra para="/admin/categorias" icone={<Tags size={22} />} texto="Categorias" />
          </>
        ) : (
          <>
            <ItemBarra para="/" exato icone={<UtensilsCrossed size={22} />} texto="Cardápio" />

            <button className="barra-item" onClick={abrirPedido}>
              <span className="icone-contador">
                <ShoppingBag size={22} />
                {quantidadeTotal > 0 && <span className="contador">{quantidadeTotal}</span>}
              </span>
              <span>Pedido</span>
            </button>

            {sessao && (
              <ItemBarra
                para="/meus-pedidos"
                icone={<ClipboardList size={22} />}
                texto="Meus pedidos"
              />
            )}
          </>
        )}

        {sessao ? (
          <button className="barra-item" onClick={aoSair}>
            <LogOut size={22} />
            <span>Sair</span>
          </button>
        ) : (
          <ItemBarra para="/entrar" icone={<LogIn size={22} />} texto="Entrar" />
        )}
      </nav>
    </div>
  );
}
