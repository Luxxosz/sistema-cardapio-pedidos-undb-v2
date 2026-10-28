import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import RotaProtegida from "./components/RotaProtegida";
import AdminCategorias from "./pages/AdminCategorias";
import AdminPainel from "./pages/AdminPainel";
import AdminPedidos from "./pages/AdminPedidos";
import AdminProdutos from "./pages/AdminProdutos";
import Cadastro from "./pages/Cadastro";
import Cardapio from "./pages/Cardapio";
import Entrar from "./pages/Entrar";
import MeusPedidos from "./pages/MeusPedidos";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Cardapio />} />
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route
            path="/meus-pedidos"
            element={
              <RotaProtegida papel="CLIENTE">
                <MeusPedidos />
              </RotaProtegida>
            }
          />

          <Route
            path="/admin"
            element={
              <RotaProtegida papel="ADMIN">
                <AdminPainel />
              </RotaProtegida>
            }
          />
          <Route
            path="/admin/pedidos"
            element={
              <RotaProtegida papel="ADMIN">
                <AdminPedidos />
              </RotaProtegida>
            }
          />
          <Route
            path="/admin/produtos"
            element={
              <RotaProtegida papel="ADMIN">
                <AdminProdutos />
              </RotaProtegida>
            }
          />
          <Route
            path="/admin/categorias"
            element={
              <RotaProtegida papel="ADMIN">
                <AdminCategorias />
              </RotaProtegida>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
