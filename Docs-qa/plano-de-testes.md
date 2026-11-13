# Plano de testes

## Objetivo

Verificar se o sistema de cardápio e pedidos do Tarrafa funciona como esperado depois das últimas alterações, principalmente:

- as correções feitas no banco de dados;
- a troca da fonte do frontend;
- os fluxos principais: cadastro, login, pedido, acompanhamento, gestão do cardápio e fechamento do dia.

## Escopo

**Dentro do escopo**

- Cadastro, login e saída.
- Cardápio público (categorias, produtos, preços e fotos).
- Pedidos do cliente (criar, editar, confirmar, cancelar e consultar).
- Painel do administrador: pedidos, produtos, categorias e dashboard.
- Fechamento do dia (encerrar e reabrir).
- Atualização em tempo real (WebSocket).
- Permissões por perfil e segurança básica.
- Aparência, fonte, tela de celular e navegadores.

**Fora do escopo**

- Testes de carga e de desempenho pesado.
- Testes de invasão profissionais (só verificações básicas de segurança).
- Painéis das plataformas (Vercel, Render e Neon). Ver `docs/devops/`.
- Código-fonte: o QA testa o comportamento, não revisa o código.

## Itens testados

| Área | Telas (frontend) | Rotas da API |
|---|---|---|
| Cardápio | `/` | `GET /api/categorias`, `GET /api/produtos` |
| Autenticação | `/entrar`, `/cadastro` | `POST /api/auth/cadastro`, `POST /api/auth/login` |
| Pedidos do cliente | `/meus-pedidos` | `/api/pedidos/**` |
| Painel admin | `/admin`, `/admin/pedidos`, `/admin/produtos`, `/admin/categorias` | `/api/admin/**` |
| Tempo real | telas de pedidos | WebSocket em `/ws` |

## Estratégia

| Tipo de teste | Como foi feito |
|---|---|
| Funcional | Casos de teste manuais pela interface ([Casos de teste](./casos-de-teste.md)) |
| API | Chamadas com `curl`, Postman ou Insomnia nos casos que pedem a API |
| Regressão | [Checklist de regressão](./checklist-de-regressao.md) |
| Permissões e segurança | Acesso a rotas sem token e com perfil errado |
| Visual e usabilidade | [Testes visuais e de usabilidade](./testes-visuais-e-usabilidade.md) |
| Exploratório | Conferências livres durante a execução, que geraram as observações do [Registro de execução](./registro-de-execucao.md) |

## Ambiente

| Item | Valor |
|---|---|
| Frontend | https://tarrafa-bistro.vercel.app e ambiente local (localhost) |
| Backend | https://sistema-cardapio-e-pedidos-do-tarrafa.onrender.com |
| Banco | PostgreSQL no Neon (o QA não acessa direto) |
| Navegadores | Chrome, Firefox, Edge e Chrome no celular |
| Ferramentas | DevTools (F12), `curl` ou Postman, Lighthouse, Markdown para registro |
| Commit testado | `2dc2969796c6fd8fc6bc272dfd1d60013deb9df9` "Delete seguranca-e-contingencia.md" (HEAD igual a origin/main) |

O ambiente publicado é o único com dados reais. Por isso:

- pedidos de teste ficam gravados no banco e foram cancelados ou identificados ao fim;
- não existe ambiente separado nem branch de teste no banco;
- os links de Preview da Vercel não servem para teste, pois não conseguem chamar a API por causa do CORS.

## Dados de teste

- Duas contas de cliente de teste, para verificar o isolamento entre clientes, e uma conta de administrador.
- Produtos de teste criados pelo admin com nome começando por `QA-`, para identificar e desativar depois.
- Itens de teste conhecidos no banco (ids 134, 135 e 136, com nomes como "Não sei" e "Agua barata"): foram desconsiderados na contagem do cardápio e não geram bug.

## Critérios e resultado

| Critério de aprovação | Resultado |
|---|---|
| 100% dos casos de prioridade Alta passaram | Atendido: 58 de 58 |
| Nenhum bug aberto de gravidade Crítica ou Alta | Atendido: nenhum bug aberto |
| Pelo menos 90% dos casos de prioridade Média passaram | Atendido: 54 de 55 (98%); o caso restante é parcial (VIS-20) |
| Checklist de regressão sem falhas | Atendido, em 12/11/2026 |

**Critérios para começar:** frontend e backend publicados e respondendo (`GET /api/categorias` retorna 200), contas de teste disponíveis e mudanças recentes consultadas no histórico de commits. Todos foram atendidos.

**Critérios para pausar:** backend fora do ar por mais de 15 minutos ou impossibilidade de login para todos os usuários. Nenhum dos dois ocorreu.

## Execução

| Data | Atividade |
|---|---|
| 09/11/2026 | Autenticação, cardápio público, produtos e categorias |
| 10/11/2026 | Pedidos do cliente e pedidos no painel do admin |
| 11/11/2026 | Dashboard e fechamento do dia, tempo real e permissões e segurança (CT-SEG-01 a CT-SEG-07) |
| 12/11/2026 | Segurança (CT-SEG-08 a CT-SEG-11), testes visuais e de usabilidade e checklist de regressão |

## Papéis

| Papel | Responsabilidade |
|---|---|
| QA | Executar os testes, registrar resultados e abrir bugs |
| Desenvolvedor | Corrigir bugs, tirar dúvidas e informar as mudanças |
| Responsável pelo deploy | Publicar as correções e avisar o QA |

## Riscos e situação final

| Risco | Situação |
|---|---|
| Teste em produção deixa dados de teste no banco | Dados identificados com `QA-` e pedidos e produtos de teste cancelados ou desativados no fechamento |
| Primeira chamada lenta (Render e Neon Free "dormem") | Sistema aberto antes dos testes; o primeiro acesso após tempo parado foi aceitável (VIS-27) |
| Virada do dia pelo fuso | CT-DIA-10 passou: o dashboard usa a data de Brasília |
| Mudanças recentes não documentadas | Histórico de commits consultado e checklist de regressão executado |
| Encerrar o dia por engano | Dia reaberto com "reabrir dia" após os testes |

## Entregas do QA

- [Registro de execução](./registro-de-execucao.md) com os 123 casos (94 funcionais e 29 visuais).
- Resumo final: **aprovado com ressalvas**. 122 casos passaram, 1 foi parcial (VIS-20, Safari não testado) e nenhum falhou. Não há bugs abertos.
- Prints das mensagens de erro: serão reunidos em documento próprio.
