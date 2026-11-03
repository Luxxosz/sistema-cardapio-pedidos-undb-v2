# Testes pós-deploy

## Motivo

Depois de cada deploy precisamos conferir se o sistema continua funcionando. Este documento é um checklist de testes manuais. Não existe pipeline de testes automatizados rodando no deploy.

## Testes manuais x automatizados

| Tipo | Situação |
|---|---|
| Testes unitários do backend (`mvn test`) | Existem (`PedidoServiceTest`, `FechamentoServiceTest` e `StatusPedidoTest`). Rodam só na máquina local, na mão |
| Testes automatizados no deploy | Não existem |
| Testes de integração e testes do frontend | Não existem |
| Testes pós-deploy | Manuais, com este checklist |

## Preparação

Defina o endereço da API para usar nos comandos:

```bash
API=https://sistema-cardapio-e-pedidos-do-tarrafa.onrender.com
```

Cuidados:

- Use uma conta de teste (por exemplo, `teste@exemplo.com`) e não use dados de clientes de verdade.
- Os testes de pedido criam pedidos de verdade no banco de produção. Cancele os pedidos de teste depois.
- Não rode "encerrar dia" por teste sem necessidade, pois isso registra um fechamento do dia (existe "reabrir dia" para desfazer o de hoje).
- A primeira chamada pode demorar, porque o Render e o Neon podem estar "dormindo".

## Checklist

### 1. Frontend

- [ ] https://tarrafa-bistro.vercel.app abre sem erro.
- [ ] O cardápio mostra categorias, produtos e fotos.
- [ ] Atualizar a página em uma rota interna (por exemplo `/entrar`) continua abrindo, sem erro 404.
- [ ] O console do navegador (F12) não mostra erro de CORS nem chamadas para `localhost`.

### 2. Backend e banco

- [ ] `curl -i $API/api/categorias` responde `200` com a lista de categorias.
- [ ] `curl -i $API/api/produtos` responde `200` com os produtos.
- [ ] A quantidade de categorias e produtos é a esperada para o cardápio.

### 3. CORS

- [ ] No Network (F12) as chamadas do site para a API não aparecem bloqueadas.
- [ ] Teste com `curl`:

```bash
curl -i -X OPTIONS $API/api/categorias \
  -H "Origin: https://tarrafa-bistro.vercel.app" \
  -H "Access-Control-Request-Method: GET"
```

Esperado: cabeçalho `Access-Control-Allow-Origin` presente.

### 4. Autenticação

- [ ] Cadastro de cliente novo funciona (senha com pelo menos 6 caracteres).
- [ ] Cadastro com e-mail repetido é recusado (`409`, "Já existe uma conta com esse e-mail").
- [ ] Login com senha errada responde `401`.
- [ ] Login correto devolve `token`, `nome` e `papel`:

```bash
curl -s -X POST $API/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","senha":"SUA_SENHA"}'
```

- [ ] Login do administrador (com `ADMIN_EMAIL` e `ADMIN_SENHA`) funciona e o papel vem como `ADMIN`.

### 5. Permissões

Use o token do cliente e o do admin nos testes (`Authorization: Bearer <TOKEN>`).

- [ ] Rota de admin sem token responde `403`:

```bash
curl -i $API/api/admin/dashboard
```

- [ ] Rota de admin com token de **cliente** responde `403`.
- [ ] Rota de pedidos (`/api/pedidos`) com token de **admin** responde `403`.
- [ ] No frontend, o cliente não consegue abrir as telas `/admin`.
- [ ] Um token vencido ou inválido faz o frontend deslogar.

### 6. Pedidos (cliente)

- [ ] Criar um pedido com pelo menos um item (pedido sem item é recusado).
- [ ] Alterar a quantidade e remover item enquanto o pedido está pendente.
- [ ] Observação de até 300 caracteres é aceita.
- [ ] Confirmar o pedido.
- [ ] Depois de confirmado, não dá mais para editar itens.
- [ ] Um produto desativado não entra em pedido novo.
- [ ] "Meus pedidos" mostra só os pedidos do próprio cliente.
- [ ] Tentar abrir o pedido de outro cliente responde como se não existisse.

### 7. Pedidos (administrador)

- [ ] A lista de pedidos do admin mostra os pedidos de todos os clientes e aceita filtro por status.
- [ ] O fluxo de status funciona na ordem: PENDENTE, CONFIRMADO, EM_PREPARACAO, PRONTO, FINALIZADO.
- [ ] Pedidos PENDENTE ou CONFIRMADO podem ser CANCELADOS.
- [ ] Uma mudança de status que não é permitida (por exemplo, PRONTO para EM_PREPARACAO) é recusada com `400`.
- [ ] Pedidos FINALIZADO e CANCELADO não mudam mais.

### 8. Tempo real

- [ ] Com o cliente logado em uma aba e o admin em outra, a mudança de status feita pelo admin aparece para o cliente sem recarregar.
- [ ] Um pedido novo aparece para o admin sem recarregar.
- [ ] O cliente não recebe pedidos de outro cliente.
- [ ] Se a conexão cair, ela volta sozinha (o frontend tenta a cada 5 segundos).

### 9. Cardápio (admin)

- [ ] Criar, editar e desativar um produto de teste.
- [ ] O preço alterado não muda o valor de pedidos antigos.
- [ ] Produto que já está em pedido só pode ser desativado, não excluído.
- [ ] Criar e editar uma categoria de teste.

### 10. Dashboard e fechamento do dia

- [ ] O dashboard mostra totais coerentes com os pedidos do dia.
- [ ] Não é possível encerrar o dia com pedidos em andamento (a mensagem informa quantos estão em aberto).
- [ ] Depois de encerrar o dia, pedidos novos são recusados.
- [ ] "Reabrir dia" desfaz o encerramento de hoje.

## Como registrar o resultado

Para a apresentação, anote em uma tabela simples: item testado, data, resultado (passou ou falhou) e observação. Não registre senhas nem tokens.

## Observação

- Os itens das seções 6 a 10 seguem as regras de negócio que estão comentadas no código do backend (RN01 a RN09).
- Recomendação: transformar parte deste checklist em testes automatizados no futuro (por exemplo, testes de integração do backend e um workflow no GitHub Actions).
- Se algum teste falhar, veja [Monitoramento e logs](./monitoramento-e-logs.md) e, se for preciso, [Deploy e rollback](./deploy-e-rollback.md).
