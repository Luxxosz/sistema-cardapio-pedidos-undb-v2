# Checklist de regressão

## Objetivo

Lista curta (cerca de 20 minutos) para conferir, depois de uma correção de banco, da troca de fonte ou de um deploy, se o que já funcionava continua funcionando. Também serve como teste de fumaça.

## Execução

| Item | Resultado |
|---|---|
| Data | 12/11/2026 |
| Commit no ar | `2dc2969796c6fd8fc6bc272dfd1d60013deb9df9` "Delete seguranca-e-contingencia.md" (HEAD igual a origin/main) |
| Ambiente | Site publicado (Vercel e Render) |
| Falhas encontradas | Nenhuma |
| Decisão | **Aprovado** |

## Preparação

- [x] Site e API abertos alguns minutos antes, para o Render e o Neon "acordarem".
- [x] Data, navegador e último commit no ar anotados (aba Deployments da Vercel e Events do Render).
- [x] Contas de cliente e de admin prontas.

## 1. Sistema no ar

- [x] https://tarrafa-bistro.vercel.app abre sem erro.
- [x] `GET /api/categorias` responde 200:

```bash
curl -i https://sistema-cardapio-e-pedidos-do-tarrafa.onrender.com/api/categorias
```

- [x] O console do navegador (F12) não mostra erro de CORS nem chamadas para `localhost`.

## 2. Cardápio

- [x] As 17 categorias aparecem com foto.
- [x] Os produtos aparecem com nome, descrição e preço.
- [x] Acentos e apóstrofos aparecem certos.
- [x] Recarregar uma rota interna (`/entrar`) não dá erro 404.

## 3. Login

- [x] Cadastro de cliente novo funciona.
- [x] Login do cliente funciona.
- [x] Login do admin funciona.
- [x] Senha errada mostra "E-mail ou senha incorretos".

## 4. Pedido (fluxo principal)

- [x] O cliente cria um pedido com 2 itens e confirma.
- [x] O pedido aparece para o admin sem recarregar.
- [x] O admin passa o pedido por `EM_PREPARACAO`, `PRONTO` e `FINALIZADO`.
- [x] O cliente vê o status mudar sem recarregar.
- [x] Depois de confirmado, o cliente não consegue editar os itens.

## 5. Admin

- [x] Criar, editar e desativar um produto `QA-...`.
- [x] O produto desativado some do cardápio do cliente.
- [x] O dashboard mostra totais coerentes com os pedidos do dia.

## 6. Permissões

- [x] `/api/admin/dashboard` sem token responde 403.
- [x] O cliente não abre as telas `/admin`.
- [x] O cliente 2 não vê pedidos do cliente 1.

## 7. Depois da correção do banco

- [x] Listar produtos funciona (a coluna `imagem_url` existe; se faltasse, a listagem daria erro 500).
- [x] A quantidade de categorias e produtos bate com o `database/seed.sql`.
- [x] Os pedidos antigos continuam abrindo, com itens e valores corretos.

## 8. Depois da troca de fonte

- [x] Títulos e textos aparecem com a fonte nova em todas as telas (ver [Testes visuais e de usabilidade](./testes-visuais-e-usabilidade.md)).
- [x] Nada fica cortado, sobreposto ou quebrado por causa do tamanho da fonte.
- [x] A fonte carrega também em um navegador sem cache (aba anônima).
- [x] Os caracteres acentuados aparecem corretamente.

## Fechamento

- [x] Tudo o que foi criado para o teste foi cancelado ou desativado.
- [x] O dia encerrado para teste foi reaberto com "reabrir dia".
- [x] Resultado registrado no [Registro de execução](./registro-de-execucao.md).

## Observações

- **Aba desatualizada após troca de conta.** Uma aba aberta continua mostrando dados antigos depois que outra aba sai da conta ou troca de conta. Não é falha de isolamento: o cliente 2 não vê pedidos do cliente 1, e o item de permissões passou. Foi registrado como observação, com a sugestão de recarregar a página ao detectar a saída da conta em outra aba.
- Este checklist cobre só o essencial e não substitui os [casos de teste](./casos-de-teste.md).
