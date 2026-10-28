# Frontend: Tarrafa Bistrô do Mar

React + TypeScript + Vite. Conversa com o backend Spring Boot (`../backend`).

## Rodar

```powershell
npm install
npm run dev
```

Abre em http://localhost:5173. O backend precisa estar rodando em http://localhost:8080
(para outro endereço, copie `.env.example` para `.env` e troque o `VITE_API_URL`).

## Telas

| Rota | Quem acessa | O que é |
| --- | --- | --- |
| `/` | todos | cardápio com as fotos das categorias e o painel do pedido |
| `/entrar` e `/cadastro` | visitante | login e criação de conta |
| `/meus-pedidos` | cliente | pedidos com a linha do tempo, atualizada em tempo real |
| `/admin` | administrador | painel do dia, encerrar e reabrir o dia |
| `/admin/pedidos` | administrador | pedidos que chegam sozinhos, avançar o status |
| `/admin/produtos` | administrador | criar, editar, tirar do cardápio e excluir produtos |
| `/admin/categorias` | administrador | criar, renomear e excluir categorias |

## Fotos

- Cada categoria tem uma foto em `public/categorias/`, com o nome da categoria sem acento
  e com hífen (`raizes-da-ilha.jpg`). Categoria nova sem foto mostra o símbolo do Tarrafa.
- Um produto pode ter foto própria: no cadastro do produto, preencha o campo "Foto do prato"
  com um caminho como `/pratos/moqueca.jpg` (arquivo em `public/pratos/`) ou com um link da internet.

## Estrutura

```text
src/
├── components/   Layout, PainelPedido, PratoLinha, Modal, RotaProtegida...
├── hooks/        useAuth, useCarrinho, useTempoReal
├── pages/        as telas
├── services/     api.ts (chamadas HTTP) e tempoReal.ts (WebSocket)
├── types/        tipos TypeScript
└── utils/        formatação de preço, data e nomes
```

## Antes de publicar (Vercel)

- Defina a variável `VITE_API_URL` com o endereço do backend publicado.
- No backend, libere esse endereço no CORS (`CorsConfig` e `WebSocketConfig`).
