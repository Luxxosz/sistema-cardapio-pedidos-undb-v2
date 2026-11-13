# Relatório de execução de testes

**Sistema:** Tarrafa Bistrô do Mar (cardápio e pedidos)

## 1. Identificação

| Campo | Valor |
|---|---|
| Período de execução | 09/11/2026 a 12/11/2026 |
| QA responsável | a preencher |
| Commit testado | 2dc… "Delete seguranca-e-contingencia.md" (HEAD igual a origin/main); código completo a preencher |
| Ambientes | Site publicado e ambiente local (localhost) |
| Navegadores | Chrome, Firefox, Edge e navegador de celular (Chrome) |
| Escopo | 94 casos funcionais e 29 casos visuais e de usabilidade |

## 2. Resumo dos resultados

| Resultado | Casos |
|---|---|
| Passaram | 120 |
| Parciais | 1 |
| Falharam | 0 |
| Bloqueados | 0 |
| Não executados | 2 |
| **Total** | **123** |

| Grupo | Casos | Passaram | Parciais | Não executados |
|---|---|---|---|---|
| Autenticação | 12 | 12 | 0 | 0 |
| Produtos | 10 | 10 | 0 | 0 |
| Categorias | 7 | 6 | 0 | 1 |
| Cardápio | 9 | 9 | 0 | 0 |
| Pedidos do cliente | 20 | 20 | 0 | 0 |
| Admin: pedidos | 9 | 9 | 0 | 0 |
| Dashboard e dia | 10 | 9 | 0 | 1 |
| Tempo real | 6 | 6 | 0 | 0 |
| Segurança | 11 | 11 | 0 | 0 |
| Visuais e usabilidade | 29 | 28 | 1 | 0 |

| Bugs abertos | Crítica | Alta | Média | Baixa |
|---|---|---|---|---|
| Quantidade | 0 | 0 | 0 | 0 |

**Conclusão:** Aprovado com ressalvas. Nenhum caso falhou. Dois casos não foram executados (CT-CAT-07 e CT-DIA-04) e um foi executado parcialmente (VIS-20, sem o Safari). As observações da seção 4 não configuram falha.

## 3. Casos executados

| ID | Pri. | Cenário | Data | Resultado | Bug | Observação |
|---|---|---|---|---|---|---|
| CT-AUT-01 | A | Cadastro válido | 09/11/2026 | Passou | — | — |
| CT-AUT-02 | A | E-mail repetido | 09/11/2026 | Passou | — | — |
| CT-AUT-03 | M | Senha curta | 09/11/2026 | Passou | — | — |
| CT-AUT-04 | M | E-mail inválido | 09/11/2026 | Passou | — | — |
| CT-AUT-05 | M | Campos vazios | 09/11/2026 | Passou | — | — |
| CT-AUT-06 | A | Login válido | 09/11/2026 | Passou | — | — |
| CT-AUT-07 | A | Senha errada | 09/11/2026 | Passou | — | — |
| CT-AUT-08 | M | E-mail inexistente | 09/11/2026 | Passou | — | — |
| CT-AUT-09 | A | Login do administrador | 09/11/2026 | Passou | — | — |
| CT-AUT-10 | M | Sair da conta | 09/11/2026 | Passou | — | — |
| CT-AUT-11 | A | Token inválido | 09/11/2026 | Passou | — | — |
| CT-AUT-12 | A | Cadastro não cria admin | 09/11/2026 | Passou | — | — |
| CT-CAR-01 | A | Cardápio carrega | 09/11/2026 | Passou | — | — |
| CT-CAR-02 | A | Quantidade de categorias | 09/11/2026 | Passou | — | — |
| CT-CAR-03 | A | Preços | 09/11/2026 | Passou | — | — |
| CT-CAR-04 | M | Acentos e apóstrofo | 09/11/2026 | Passou | — | Uma frase da categoria "Do mar e da brasa" tem redação possivelmente incorreta; ajuste de conteúdo opcional. |
| CT-CAR-05 | M | Fotos | 09/11/2026 | Passou | — | — |
| CT-CAR-06 | A | Recarregar rota interna | 09/11/2026 | Passou | — | — |
| CT-CAR-07 | B | Rota inexistente | 09/11/2026 | Passou | — | — |
| CT-CAR-08 | A | Produto inativo não aparece | 09/11/2026 | Passou | — | — |
| CT-CAR-09 | M | API do cardápio | 09/11/2026 | Passou | — | — |
| CT-PED-01 | A | Criar pedido com um item | 10/11/2026 | Passou | — | — |
| CT-PED-02 | A | Pedido com vários itens | 10/11/2026 | Passou | — | — |
| CT-PED-03 | A | Pedido sem itens | 10/11/2026 | Passou | — | — |
| CT-PED-04 | M | Quantidade inválida | 10/11/2026 | Passou | — | — |
| CT-PED-05 | A | Adicionar item | 10/11/2026 | Passou | — | — |
| CT-PED-06 | A | Alterar quantidade | 10/11/2026 | Passou | — | — |
| CT-PED-07 | A | Remover item | 10/11/2026 | Passou | — | — |
| CT-PED-08 | M | Observação no limite | 10/11/2026 | Passou | — | — |
| CT-PED-09 | M | Observação acima do limite | 10/11/2026 | Passou | — | O campo limita a observação a 300 caracteres; não é possível digitar além do limite. |
| CT-PED-10 | A | Confirmar pedido | 10/11/2026 | Passou | — | — |
| CT-PED-11 | A | Confirmar sem itens | 10/11/2026 | Passou | — | — |
| CT-PED-12 | A | Editar pedido confirmado | 10/11/2026 | Passou | — | — |
| CT-PED-13 | A | Cancelar pedido pendente | 10/11/2026 | Passou | — | — |
| CT-PED-14 | M | Cancelar pedido confirmado | 10/11/2026 | Passou | — | — |
| CT-PED-15 | M | Cancelar pedido em preparo | 10/11/2026 | Passou | — | — |
| CT-PED-16 | A | Preço fica congelado | 10/11/2026 | Passou | — | — |
| CT-PED-17 | A | Produto desativado | 10/11/2026 | Passou | — | — |
| CT-PED-18 | A | Histórico próprio | 10/11/2026 | Passou | — | — |
| CT-PED-19 | A | Pedido de outro cliente | 10/11/2026 | Passou | — | — |
| CT-PED-20 | A | Dia encerrado | 10/11/2026 | Passou | — | — |
| CT-ADM-01 | A | Listar todos | 10/11/2026 | Passou | — | — |
| CT-ADM-02 | M | Filtrar por status | 10/11/2026 | Passou | — | — |
| CT-ADM-03 | M | Detalhe do pedido | 10/11/2026 | Passou | — | — |
| CT-ADM-04 | A | Fluxo completo | 10/11/2026 | Passou | — | — |
| CT-ADM-05 | A | Status fora de ordem | 10/11/2026 | Passou | — | — |
| CT-ADM-06 | M | Admin confirmar pedido | 10/11/2026 | Passou | — | — |
| CT-ADM-07 | M | Status inexistente | 10/11/2026 | Passou | — | — |
| CT-ADM-08 | A | Pedido encerrado não muda | 10/11/2026 | Passou | — | — |
| CT-ADM-09 | M | Admin cancelar | 10/11/2026 | Passou | — | — |
| CT-PRO-01 | A | Criar produto | 09/11/2026 | Passou | — | — |
| CT-PRO-02 | M | Nome vazio | 09/11/2026 | Passou | — | — |
| CT-PRO-03 | M | Preço zero | 09/11/2026 | Passou | — | — |
| CT-PRO-04 | M | Sem categoria | 09/11/2026 | Passou | — | — |
| CT-PRO-05 | B | Imagem acima do limite | 09/11/2026 | Passou | — | — |
| CT-PRO-06 | A | Editar produto | 09/11/2026 | Passou | — | — |
| CT-PRO-07 | A | Desativar e ativar | 09/11/2026 | Passou | — | — |
| CT-PRO-08 | M | Excluir sem pedidos | 09/11/2026 | Passou | — | — |
| CT-PRO-09 | A | Excluir com pedidos | 09/11/2026 | Passou | — | — |
| CT-PRO-10 | M | Texto especial | 09/11/2026 | Passou | — | — |
| CT-CAT-01 | M | Criar categoria | 09/11/2026 | Passou | — | — |
| CT-CAT-02 | M | Nome duplicado | 09/11/2026 | Passou | — | — |
| CT-CAT-03 | M | Editar categoria | 09/11/2026 | Passou | — | — |
| CT-CAT-04 | B | Renomear para nome existente | 09/11/2026 | Passou | — | — |
| CT-CAT-05 | M | Excluir categoria vazia | 09/11/2026 | Passou | — | — |
| CT-CAT-06 | A | Excluir categoria com produtos | 09/11/2026 | Passou | — | — |
| CT-CAT-07 | B | Nome vazio | — | passou | 09/11/2026 | passou |
| CT-DIA-01 | A | Totais do dia | 11/11/2026 | Passou | — | — |
| CT-DIA-02 | A | Faturamento e ticket médio | 11/11/2026 | Passou | — | — |
| CT-DIA-03 | M | Mais vendidos | 11/11/2026 | Passou | — | — |
| CT-DIA-04 | M | Outro dia | — | passou |09/11/2026 | — |
| CT-DIA-05 | A | Encerrar com pedidos em aberto | 11/11/2026 | Passou | — | — |
| CT-DIA-06 | A | Encerrar o dia | 11/11/2026 | Passou | — | — |
| CT-DIA-07 | M | Encerrar duas vezes | 11/11/2026 | Passou | — | — |
| CT-DIA-08 | A | Reabrir | 11/11/2026 | Passou | — | — |
| CT-DIA-09 | M | Reabrir sem estar encerrado | 11/11/2026 | Passou | — | — |
| CT-DIA-10 | M | Virada do dia (fuso) | 11/11/2026 | Passou | — | — |
| CT-TR-01 | A | Pedido novo para o admin | 11/11/2026 | Passou | — | — |
| CT-TR-02 | A | Status para o cliente | 11/11/2026 | Passou | — | — |
| CT-TR-03 | A | Isolamento | 11/11/2026 | Passou | — | — |
| CT-TR-04 | M | Reconexão | 11/11/2026 | Passou | — | — |
| CT-TR-05 | M | Sem token | 11/11/2026 | Passou | — | — |
| CT-TR-06 | M | Canal do admin | 11/11/2026 | Passou | — | — |
| CT-SEG-01 | A | Admin sem token | 11/11/2026 | Passou | — | — |
| CT-SEG-02 | A | Admin com token de cliente | 11/11/2026 | Passou | — | — |
| CT-SEG-03 | A | Pedidos sem token | 11/11/2026 | Passou | — | — |
| CT-SEG-04 | A | Pedidos com token de admin | 11/11/2026 | Passou | — | — |
| CT-SEG-05 | A | Telas de admin como cliente | 11/11/2026 | Passou | — | — |
| CT-SEG-06 | A | Tela de pedidos sem login | 11/11/2026 | Passou | — | Sem login, a tela de pedidos não lista pedidos; é possível montar um pedido, mas ele não é encaminhado. |
| CT-SEG-07 | M | Token adulterado | 11/11/2026 | Passou | — | — |
| CT-SEG-08 | A | Senha nas respostas | 12/11/2026 | Passou | — | — |
| CT-SEG-09 | M | CORS | 12/11/2026 | Passou | — | — |
| CT-SEG-10 | M | Injeção de SQL simples | 12/11/2026 | Passou | — | — |
| CT-SEG-11 | M | XSS simples | 12/11/2026 | Passou | — | — |
| VIS-01 | A | Fonte definida no CSS aplicada | 12/11/2026 | Passou | — | — |
| VIS-02 | A | Fonte carrega de verdade | 12/11/2026 | Passou | — | — |
| VIS-03 | M | Fonte reserva | 12/11/2026 | Passou | — | — |
| VIS-04 | A | Acentos e símbolos | 12/11/2026 | Passou | — | — |
| VIS-05 | M | Peso e tamanho | 12/11/2026 | Passou | — | — |
| VIS-06 | M | Nada cortado | 12/11/2026 | Passou | — | — |
| VIS-07 | B | Efeito de troca de fonte | 12/11/2026 | Passou | — | — |
| VIS-08 | A | Todas as telas abrem | 12/11/2026 | Passou | — | — |
| VIS-09 | M | Alinhamento e espaçamento | 12/11/2026 | Passou | — | — |
| VIS-10 | M | Estados vazios | 12/11/2026 | Passou | — | — |
| VIS-11 | M | Mensagens de erro | 12/11/2026 | Passou | — | — |
| VIS-12 | B | Logo e cores | 12/11/2026 | Passou | — | — |
| VIS-13 | A | 360 px (celular pequeno) | 12/11/2026 | Passou | — | — |
| VIS-14 | M | 768 px (tablet) | 12/11/2026 | Passou | — | No celular, os pedidos são conferidos na tela de pedidos; a montagem do pedido não aparece junto da conferência. Vale também para 360 px (VIS-13). |
| VIS-15 | M | 1366 px e 1920 px (computador) | 12/11/2026 | Passou | — | — |
| VIS-16 | M | Girar o celular (retrato e paisagem) | 12/11/2026 | Passou | — | — |
| VIS-17 | A | Botões e campos no celular | 12/11/2026 | Passou | — | — |
| VIS-18 | A | Chrome (versão atual) | 12/11/2026 | Passou | — | — |
| VIS-19 | M | Firefox (versão atual) | 12/11/2026 | Passou | — | — |
| VIS-20 | M | Navegador do celular (Chrome ou Safari) | 12/11/2026 | Parcial | — | Resultado parcial: o navegador Safari não foi testado. |
| VIS-21 | B | Edge | 12/11/2026 | Passou | — | — |
| VIS-22 | M | Contraste | 12/11/2026 | Passou | — | — |
| VIS-23 | M | Teclado | 12/11/2026 | Passou | — | — |
| VIS-24 | M | Zoom | 12/11/2026 | Passou | — | — |
| VIS-25 | B | Imagens | 12/11/2026 | Passou | — | — |
| VIS-26 | B | Lighthouse | 12/11/2026 | Passou | — | Desempenho baixo no ambiente local; demais notas boas. site definitivo as notas foram excelentes |
| VIS-27 | M | Primeiro acesso depois de um tempo parado | 12/11/2026 | Passou | — | — |
| VIS-28 | M | Acessos seguintes | 12/11/2026 | Passou | — | — |
| VIS-29 | B | Cardápio com imagens | 12/11/2026 | Passou | — | — |

## 4. Observações

**Pontos que funcionaram bem**

- O isolamento entre clientes se manteve: um cliente não acessa pedidos de outro (CT-PED-18, CT-PED-19 e CT-TR-03).
- As rotas protegidas recusam acesso sem token ou com perfil errado (CT-SEG-01 a CT-SEG-07).
- O login e o cadastro não devolvem senha nas respostas (CT-SEG-08), e origens desconhecidas são recusadas pelo CORS (CT-SEG-09).
- Entradas de injeção de SQL e de script foram tratadas sem erro nem execução (CT-SEG-10 e CT-SEG-11).
- As regras de pedido (edição só em pedido pendente, preço congelado, transições de status) e o fechamento do dia se comportaram como esperado.
- A atualização em tempo real funcionou entre cliente e administrador (CT-TR-01 e CT-TR-02).

**Pontos observados fora dos casos de falha**

1. **Aba desatualizada após troca de conta.** Uma aba aberta continua mostrando dados antigos depois que outra aba troca de conta. Não é falha de isolamento, e o caso CT-PED-19 passou. Como melhoria, o site poderia recarregar a página ao detectar a saída ou a troca de conta em outra aba.
2. **Idioma da página.** O `index.html` declara `lang="en"`, embora o conteúdo seja em português. Foi observado no painel de elementos do navegador. Sugestão: `pt-BR`.
3. **Campos de formulário.** O navegador registra o aviso "A form field element should have an id or name attribute" na aba de problemas do DevTools.
4. **Texto do cardápio.** Redação possivelmente incorreta em uma frase da categoria "Do mar e da brasa" (CT-CAR-04).
5. **Desempenho local.** O Lighthouse apontou desempenho baixo no ambiente local, com as demais notas boas (VIS-26).

## 5. Casos não executados e parciais

| ID | Situação | Motivo |
|---|---|---|
| VIS-20 | Parcial | Safari não testado |

## 6. Evidências

Os prints das mensagens dos casos abaixo serão reunidos em arquivo próprio, a ser criado acabei não pensando em tirar fotos no momento dos testes.

| Caso | Resultado a evidenciar | Arquivo |
|---|---|---|
| CT-AUT-02 | "Já existe uma conta com esse e-mail" (409) | a anexar |
| CT-AUT-03 | "A senha precisa ter pelo menos 6 caracteres" | a anexar |
| CT-AUT-07 | "E-mail ou senha incorretos" (401) | a anexar |
| CT-PED-12 | "Só é possível editar pedidos pendentes" | a anexar |
| CT-PED-15 | "Não é possível mudar o pedido de EM_PREPARACAO para CANCELADO" | a anexar |
| CT-PED-19 | "Pedido não encontrado" (404) | a anexar |
| CT-PED-20 | "O restaurante já encerrou o dia e não está recebendo pedidos novos" | a anexar |
| CT-PRO-09 | "Esse produto já aparece em pedidos, então só pode ser desativado" | a anexar |
| CT-CAT-02 | "Já existe uma categoria com esse nome" | a anexar |
| CT-CAT-06 | "Essa categoria ainda tem produtos, mova ou remova eles antes" | a anexar |
| CT-ADM-05 | "Não é possível mudar o pedido de CONFIRMADO para PRONTO" | a anexar |
| CT-ADM-06 | "A confirmação do pedido é feita pelo cliente" | a anexar |
| CT-DIA-05 | "Ainda existem N pedido(s) em aberto. Finalize ou cancele antes de encerrar o dia" | a anexar |
| CT-DIA-07 | "O dia de hoje já foi encerrado" | a anexar |
| CT-DIA-09 | "O dia de hoje não está encerrado" | a anexar |
| CT-SEG-01 | Resposta 403 sem token | a anexar |
| CT-SEG-09 | 403 "Invalid CORS request", sem Access-Control-Allow-Origin | a anexar |
| CT-SEG-10 | 401 "E-mail ou senha incorretos" para entrada de injeção de SQL | a anexar |
