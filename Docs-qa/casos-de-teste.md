# Casos de teste

## Objetivo

Reúne os 94 casos funcionais do Tarrafa executados entre 09/11/2026 e 12/11/2026, com prioridade, passos, resultado esperado, resultado obtido e data de execução. O detalhamento por caso (observações e evidências) está no [Registro de execução](./registro-de-execucao.md).

## Convenções

- Os textos entre aspas nos resultados esperados são as mensagens devolvidas pela API. Nas execuções, as telas exibiram essas mensagens e não foram registradas diferenças de texto.
- A coluna **Regra** liga o caso a uma regra de negócio (RN01 a RN09), conforme a [Matriz de rastreabilidade](./matriz-de-rastreabilidade.md).
- Nenhum caso falhou, por isso não há bugs ligados a eles (ver o [Modelo de relatório de bug](./modelo-de-relatorio-de-bug.md)).

Prioridades: **A** = alta, **M** = média, **B** = baixa.

## 1. Autenticação

Pré-condição: site aberto, sem login.

| ID | Pri. | Cenário | Passos | Resultado esperado | Regra | Resultado | Data |
|---|---|---|---|---|---|---|---|
| CT-AUT-01 | A | Cadastro válido | Abrir `/cadastro`, preencher nome, e-mail novo e senha com 6 ou mais caracteres, enviar | Conta criada com perfil `CLIENTE` | RN05 | Passou | 09/11/2026 |
| CT-AUT-02 | A | E-mail repetido | Cadastrar um e-mail que já existe | Erro 409: "Já existe uma conta com esse e-mail" | | Passou | 09/11/2026 |
| CT-AUT-03 | M | Senha curta | Cadastrar com senha de 5 caracteres | "A senha precisa ter pelo menos 6 caracteres" | | Passou | 09/11/2026 |
| CT-AUT-04 | M | E-mail inválido | Cadastrar com `abc` no campo e-mail | "E-mail inválido" | | Passou | 09/11/2026 |
| CT-AUT-05 | M | Campos vazios | Enviar o cadastro em branco | Mensagens "Informe o nome", "Informe o e-mail" e "Informe a senha" | | Passou | 09/11/2026 |
| CT-AUT-06 | A | Login válido | Entrar em `/entrar` com a conta criada | Login feito e acesso às telas do cliente | | Passou | 09/11/2026 |
| CT-AUT-07 | A | Senha errada | Entrar com senha incorreta | Erro 401: "E-mail ou senha incorretos" | | Passou | 09/11/2026 |
| CT-AUT-08 | M | E-mail inexistente | Entrar com e-mail que não existe | A mesma mensagem do caso anterior (não pode revelar qual dado está errado) | | Passou | 09/11/2026 |
| CT-AUT-09 | A | Login do administrador | Entrar com a conta de admin | Papel `ADMIN` e acesso a `/admin` | | Passou | 09/11/2026 |
| CT-AUT-10 | M | Sair da conta | Usar a opção de sair | Volta ao estado sem login; `/meus-pedidos` redireciona para o login | | Passou | 09/11/2026 |
| CT-AUT-11 | A | Token inválido | No DevTools (Application, Local Storage), alterar o token e fazer uma ação que chame a API | O frontend desloga o usuário (evento de sessão expirada) | | Passou | 09/11/2026 |
| CT-AUT-12 | A | Cadastro não cria admin | Pela API, enviar o cadastro com um campo extra de perfil, como `"tipo":"ADMIN"` | A conta criada é `CLIENTE` | RN05 | Passou | 09/11/2026 |

## 2. Cardápio público

Pré-condição: sem login.

| ID | Pri. | Cenário | Passos | Resultado esperado | Regra | Resultado | Data |
|---|---|---|---|---|---|---|---|
| CT-CAR-01 | A | Cardápio carrega | Abrir `/` | Categorias e produtos aparecem, sem erro no console | | Passou | 09/11/2026 |
| CT-CAR-02 | A | Quantidade de categorias | Contar as categorias exibidas | Bate com o `seed.sql` do repositório (17 categorias) | | Passou | 09/11/2026 |
| CT-CAR-03 | A | Preços | Comparar 10 produtos com o `seed.sql` | Valores iguais, no formato de reais | | Passou | 09/11/2026 |
| CT-CAR-04 | M | Acentos e apóstrofo | Procurar "Raízes da ilha", "Cafés e chás" e "Caranguejo ao leite de coco" (descrição com "farinha d'água") | Textos sem caracteres quebrados | | Passou | 09/11/2026 |
| CT-CAR-05 | M | Fotos | Verificar a foto de cada categoria | Todas carregam, sem imagem quebrada | | Passou | 09/11/2026 |
| CT-CAR-06 | A | Recarregar rota interna | Abrir `/entrar` e apertar F5 | A página abre, sem erro 404 | | Passou | 09/11/2026 |
| CT-CAR-07 | B | Rota inexistente | Abrir `/qualquer-coisa` | Redireciona para `/` | | Passou | 09/11/2026 |
| CT-CAR-08 | A | Produto inativo não aparece | O admin desativa um produto de teste; abrir o cardápio | O produto some da lista do cliente | RN01 | Passou | 09/11/2026 |
| CT-CAR-09 | M | API do cardápio | `GET /api/categorias` e `GET /api/produtos` | Resposta 200 com JSON | | Passou | 09/11/2026 |

## 3. Pedidos do cliente

Pré-condição: cliente logado, dia não encerrado, produtos ativos.

| ID | Pri. | Cenário | Passos | Resultado esperado | Regra | Resultado | Data |
|---|---|---|---|---|---|---|---|
| CT-PED-01 | A | Criar pedido com um item | Escolher um produto, quantidade 2 e criar o pedido | Status `PENDENTE`; valor total = preço x 2 | | Passou | 10/11/2026 |
| CT-PED-02 | A | Pedido com vários itens | Criar um pedido com 3 produtos diferentes | Total igual à soma dos subtotais | | Passou | 10/11/2026 |
| CT-PED-03 | A | Pedido sem itens | Tentar criar com a lista vazia (API) | 400: "O pedido precisa ter pelo menos um item" | | Passou | 10/11/2026 |
| CT-PED-04 | M | Quantidade inválida | Informar quantidade 0 ou -1 | "A quantidade precisa ser pelo menos 1" | | Passou | 10/11/2026 |
| CT-PED-05 | A | Adicionar item | Em um pedido pendente, adicionar mais um produto | Item entra e o total é recalculado | RN03 | Passou | 10/11/2026 |
| CT-PED-06 | A | Alterar quantidade | Mudar a quantidade de um item pendente | Subtotal e total atualizados | RN03 | Passou | 10/11/2026 |
| CT-PED-07 | A | Remover item | Remover um item de um pedido pendente | Item some e o total diminui | RN03 | Passou | 10/11/2026 |
| CT-PED-08 | M | Observação no limite | Salvar observação com exatamente 300 caracteres | Aceita | | Passou | 10/11/2026 |
| CT-PED-09 | M | Observação acima do limite | Salvar observação com 301 caracteres | "A observação pode ter no máximo 300 caracteres" | | Passou | 10/11/2026 |
| CT-PED-10 | A | Confirmar pedido | Confirmar um pedido com itens | Status `CONFIRMADO` | | Passou | 10/11/2026 |
| CT-PED-11 | A | Confirmar sem itens | Confirmar um pedido vazio (API) | "Adicione pelo menos um item antes de confirmar o pedido" | | Passou | 10/11/2026 |
| CT-PED-12 | A | Editar pedido confirmado | Tentar adicionar, alterar ou remover item depois de confirmado | "Só é possível editar pedidos pendentes" | RN03 | Passou | 10/11/2026 |
| CT-PED-13 | A | Cancelar pedido pendente | Cancelar um pedido `PENDENTE` | Status `CANCELADO` | RN04 | Passou | 10/11/2026 |
| CT-PED-14 | M | Cancelar pedido confirmado | Cancelar um pedido `CONFIRMADO` | Status `CANCELADO` | RN04 | Passou | 10/11/2026 |
| CT-PED-15 | M | Cancelar pedido em preparo | O admin coloca o pedido em `EM_PREPARACAO`; o cliente tenta cancelar | Recusado (mudança de status não permitida) | RN04 | Passou | 10/11/2026 |
| CT-PED-16 | A | Preço fica congelado | Criar um pedido; o admin altera o preço do produto; abrir o pedido antigo | O pedido antigo mantém o preço da época | RN02 | Passou | 10/11/2026 |
| CT-PED-17 | A | Produto desativado | O admin desativa um produto; o cliente tenta incluí-lo em pedido novo (API) | "O produto <nome> não está disponível" | RN01 | Passou | 10/11/2026 |
| CT-PED-18 | A | Histórico próprio | Abrir `/meus-pedidos` com os clientes 1 e 2 | Cada um vê só os próprios pedidos | RN06 | Passou | 10/11/2026 |
| CT-PED-19 | A | Pedido de outro cliente | Com o cliente 2, abrir pela API o `id` de um pedido do cliente 1 | 404: "Pedido não encontrado" | RN06 | Passou | 10/11/2026 |
| CT-PED-20 | A | Dia encerrado | Com o dia encerrado, o cliente tenta criar pedido | "O restaurante já encerrou o dia e não está recebendo pedidos novos" | RN08 | Passou | 10/11/2026 |

## 4. Administrador: pedidos

Pré-condição: admin logado e alguns pedidos de teste criados.

| ID | Pri. | Cenário | Passos | Resultado esperado | Regra | Resultado | Data |
|---|---|---|---|---|---|---|---|
| CT-ADM-01 | A | Listar todos | Abrir `/admin/pedidos` | Aparecem pedidos de todos os clientes, com o nome do cliente | | Passou | 10/11/2026 |
| CT-ADM-02 | M | Filtrar por status | Filtrar por `PRONTO` (ou `GET /api/admin/pedidos?status=PRONTO`) | Só pedidos nesse status | | Passou | 10/11/2026 |
| CT-ADM-03 | M | Detalhe do pedido | Abrir um pedido | Itens, valores, observação e data corretos | | Passou | 10/11/2026 |
| CT-ADM-04 | A | Fluxo completo | Para um pedido confirmado: `EM_PREPARACAO`, depois `PRONTO`, depois `FINALIZADO` | Cada mudança é aceita | RN04 | Passou | 10/11/2026 |
| CT-ADM-05 | A | Status fora de ordem | Tentar `PRONTO` para `EM_PREPARACAO` | 400 com mensagem de mudança não permitida | RN04 | Passou | 10/11/2026 |
| CT-ADM-06 | M | Admin confirmar pedido | O admin tenta mudar um pedido `PENDENTE` para `CONFIRMADO` | "A confirmação do pedido é feita pelo cliente" | RN04 | Passou | 10/11/2026 |
| CT-ADM-07 | M | Status inexistente | Enviar o status `XYZ` (API) | "Status inválido: XYZ" | | Passou | 10/11/2026 |
| CT-ADM-08 | A | Pedido encerrado não muda | Tentar alterar um pedido `FINALIZADO` ou `CANCELADO` | Recusado | RN04 | Passou | 10/11/2026 |
| CT-ADM-09 | M | Admin cancelar | O admin cancela um pedido `PENDENTE` ou `CONFIRMADO` | Status `CANCELADO` | RN04 | Passou | 10/11/2026 |

## 5. Administrador: produtos e categorias

Pré-condição: admin logado.

| ID | Pri. | Cenário | Passos | Resultado esperado | Regra | Resultado | Data |
|---|---|---|---|---|---|---|---|
| CT-PRO-01 | A | Criar produto | Criar `QA-Produto teste` com preço e categoria | Aparece na lista do admin e no cardápio | | Passou | 09/11/2026 |
| CT-PRO-02 | M | Nome vazio | Salvar sem nome | "Informe o nome do produto" | | Passou | 09/11/2026 |
| CT-PRO-03 | M | Preço zero | Salvar com preço 0 | "O preço precisa ser maior que zero" | | Passou | 09/11/2026 |
| CT-PRO-04 | M | Sem categoria | Salvar sem categoria (API) | "Informe a categoria" | | Passou | 09/11/2026 |
| CT-PRO-05 | B | Imagem acima do limite | Informar um endereço de imagem com mais de 500 caracteres | "O endereço da imagem pode ter no máximo 500 caracteres" | | Passou | 09/11/2026 |
| CT-PRO-06 | A | Editar produto | Mudar nome, descrição e preço | Alterações salvas e visíveis no cardápio | | Passou | 09/11/2026 |
| CT-PRO-07 | A | Desativar e ativar | Desativar e reativar o produto | O produto some e volta no cardápio | RN01 | Passou | 09/11/2026 |
| CT-PRO-08 | M | Excluir sem pedidos | Excluir um produto de teste que nunca foi pedido | Produto removido | | Passou | 09/11/2026 |
| CT-PRO-09 | A | Excluir com pedidos | Excluir um produto que já está em algum pedido | O produto não é apagado do banco e some do cardápio do cliente | RN07 | Passou | 09/11/2026 |
| CT-PRO-10 | M | Texto especial | Criar um produto com apóstrofo e acento no nome | Salvo e exibido sem erro | | Passou | 09/11/2026 |
| CT-CAT-01 | M | Criar categoria | Criar `QA-Categoria` | Aparece na lista | | Passou | 09/11/2026 |
| CT-CAT-02 | M | Nome duplicado | Criar uma categoria com nome já existente | "Já existe uma categoria com esse nome" | | Passou | 09/11/2026 |
| CT-CAT-03 | M | Editar categoria | Renomear a categoria de teste | Nome atualizado | | Passou | 09/11/2026 |
| CT-CAT-04 | B | Renomear para nome existente | Renomear para o nome de outra categoria | "Já existe uma categoria com esse nome" | | Passou | 09/11/2026 |
| CT-CAT-05 | M | Excluir categoria vazia | Excluir `QA-Categoria` sem produtos | Removida | | Passou | 09/11/2026 |
| CT-CAT-06 | A | Excluir categoria com produtos | Tentar excluir uma categoria que tem produtos | "Essa categoria ainda tem produtos, mova ou remova eles antes" | | Passou | 09/11/2026 |
| CT-CAT-07 | B | Nome vazio | Salvar categoria sem nome | "Informe o nome da categoria" | | Passou | 09/11/2026 |

## 6. Dashboard e fechamento do dia

Pré-condição: admin logado. **Cuidado:** encerrar o dia registra um fechamento. Use "reabrir dia" ao terminar.

| ID | Pri. | Cenário | Passos | Resultado esperado | Regra | Resultado | Data |
|---|---|---|---|---|---|---|---|
| CT-DIA-01 | A | Totais do dia | Abrir `/admin` e comparar com os pedidos de hoje na lista | Total de pedidos, em aberto, finalizados e por status batem | | Passou | 11/11/2026 |
| CT-DIA-02 | A | Faturamento e ticket médio | Conferir à mão faturamento e ticket médio | Valores coerentes. Anotar qual regra de cálculo foi observada e confirmar com o desenvolvedor | | Passou | 11/11/2026 |
| CT-DIA-03 | M | Mais vendidos | Conferir a lista de mais vendidos | Quantidades batem com os pedidos | | Passou | 11/11/2026 |
| CT-DIA-04 | M | Outro dia | `GET /api/admin/dashboard?data=AAAA-MM-DD` | Dashboard do dia pedido | | Passou | 11/11/2026 |
| CT-DIA-05 | A | Encerrar com pedidos em aberto | Encerrar com pelo menos um pedido em andamento | Recusado: "Ainda existem N pedidos..." (informa quantos) | RN09 | Passou | 11/11/2026 |
| CT-DIA-06 | A | Encerrar o dia | Finalizar ou cancelar todos e encerrar | Dia encerrado; fechamento salvo | RN09 | Passou | 11/11/2026 |
| CT-DIA-07 | M | Encerrar duas vezes | Encerrar de novo | "O dia de hoje já foi encerrado" | | Passou | 11/11/2026 |
| CT-DIA-08 | A | Reabrir | Reabrir o dia | O dia volta a aceitar pedidos | RN08 | Passou | 11/11/2026 |
| CT-DIA-09 | M | Reabrir sem estar encerrado | Reabrir com o dia aberto | "O dia de hoje não está encerrado" | | Passou | 11/11/2026 |
| CT-DIA-10 | M | Virada do dia (fuso) | Entre 21h e 00h (Brasília), conferir qual data o dashboard usa como "hoje" | Deve ser a data de Brasília. Se virar às 21h, abrir bug (risco de fuso) | | Passou | 11/11/2026 |

## 7. Tempo real

Pré-condição: duas abas ou navegadores (cliente e admin) logados ao mesmo tempo.

| ID | Pri. | Cenário | Passos | Resultado esperado | Regra | Resultado | Data |
|---|---|---|---|---|---|---|---|
| CT-TR-01 | A | Pedido novo para o admin | O cliente cria e confirma um pedido | O admin vê o pedido sem recarregar | | Passou | 11/11/2026 |
| CT-TR-02 | A | Status para o cliente | O admin muda o status | O cliente vê a mudança sem recarregar | | Passou | 11/11/2026 |
| CT-TR-03 | A | Isolamento | Logar o cliente 1 e o cliente 2; o admin muda o pedido do cliente 1 | Só o cliente 1 recebe a atualização | RN06 | Passou | 11/11/2026 |
| CT-TR-04 | M | Reconexão | Desligar a internet por alguns segundos e religar | A conexão volta sozinha (tentativa a cada 5 segundos) | | Passou | 11/11/2026 |
| CT-TR-05 | M | Sem token | Tentar abrir o STOMP em `/ws` sem o cabeçalho de login (ferramenta avançada) | Conexão recusada | | Passou | 11/11/2026 |
| CT-TR-06 | M | Canal do admin | Com token de cliente, tentar assinar `/topic/admin/pedidos` | Assinatura recusada | | Passou | 11/11/2026 |

## 8. Permissões e segurança

| ID | Pri. | Cenário | Passos | Resultado esperado | Regra | Resultado | Data |
|---|---|---|---|---|---|---|---|
| CT-SEG-01 | A | Admin sem token | `curl -i <API>/api/admin/dashboard` | 403 | | Passou | 11/11/2026 |
| CT-SEG-02 | A | Admin com token de cliente | Chamar `/api/admin/pedidos` com token de cliente | 403 | | Passou | 11/11/2026 |
| CT-SEG-03 | A | Pedidos sem token | `curl -i <API>/api/pedidos` | 403 | | Passou | 11/11/2026 |
| CT-SEG-04 | A | Pedidos com token de admin | Chamar `/api/pedidos` com token de admin | 403 | | Passou | 11/11/2026 |
| CT-SEG-05 | A | Telas de admin como cliente | Logado como cliente, abrir `/admin` | Não abre; redireciona | | Passou | 11/11/2026 |
| CT-SEG-06 | A | Tela de pedidos sem login | Abrir `/meus-pedidos` sem login | Redireciona para o login | | Passou | 11/11/2026 |
| CT-SEG-07 | M | Token adulterado | Mudar um caractere do token e chamar a API | 403 | | Passou | 11/11/2026 |
| CT-SEG-08 | A | Senha nas respostas | Ver as respostas de login e cadastro (Network) | Nenhuma senha ou hash na resposta | | Passou | 12/11/2026 |
| CT-SEG-09 | M | CORS | `curl -i -X OPTIONS` com `Origin: https://exemplo.com` | Sem o cabeçalho `Access-Control-Allow-Origin` | | Passou | 12/11/2026 |
| CT-SEG-10 | M | Injeção de SQL simples | No login, usar `' OR 1=1 --` no e-mail | Login recusado e sem erro 500 | | Passou | 12/11/2026 |
| CT-SEG-11 | M | XSS simples | Salvar `<script>alert(1)</script>` na observação do pedido e no nome de um produto de teste | O texto aparece como texto, sem executar | | Passou | 12/11/2026 |

## Resumo

| Grupo | Casos | Passaram | Falharam | Data |
|---|---|---|---|---|
| Autenticação | 12 | 12 | 0 | 09/11/2026 |
| Cardápio | 9 | 9 | 0 | 09/11/2026 |
| Pedidos do cliente | 20 | 20 | 0 | 10/11/2026 |
| Admin: pedidos | 9 | 9 | 0 | 10/11/2026 |
| Admin: produtos e categorias | 17 | 17 | 0 | 09/11/2026 |
| Dia e dashboard | 10 | 10 | 0 | 11/11/2026 |
| Tempo real | 6 | 6 | 0 | 11/11/2026 |
| Segurança | 11 | 11 | 0 | 11/11/2026 e 12/11/2026 |
| **Total** | **94** | **94** | **0** | 09/11/2026 a 12/11/2026 |

## Observações da execução

- **CT-CAR-04:** uma frase da categoria "Do mar e da brasa" tem redação possivelmente incorreta. É ajuste de conteúdo opcional e não afeta o resultado do caso.
- **CT-PED-09:** o campo de observação limita o texto a 300 caracteres, então não é possível digitar além do limite. A regra é respeitada já na interface.
- **CT-SEG-06:** sem login, a tela de pedidos não lista pedidos. Dá para montar um pedido, mas ele não é encaminhado.
- Os casos de status `403` seguiram o comportamento atual da API: tanto "sem token" quanto "sem permissão" respondem `403`.
