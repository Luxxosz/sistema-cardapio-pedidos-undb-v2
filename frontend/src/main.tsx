import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/marcellus";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";
import { CarrinhoProvider } from "./hooks/useCarrinho";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <CarrinhoProvider>
        <App />
      </CarrinhoProvider>
    </AuthProvider>
  </StrictMode>,
);
