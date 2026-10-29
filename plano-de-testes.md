# Plano de testes

## Motivo

Este plano define o que vai ser testado no Tarrafa, de que forma, em qual ambiente e quando o sistema pode ser considerado aprovado.

## Objetivo

Verificar se o sistema de cardápio e pedidos funciona como esperado depois das últimas alterações, principalmente:

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

## Itens a testar

| Área | Telas (frontend) | Rotas da API |
|---|---|---|
| Cardápio | `/` | `GET /api/categorias`, `GET /api/produtos` |
| Autenticação | `/entrar`, `/cadastro` | `POST /api/auth/cadastro`, `POST /api/auth/login` |
| Pedidos do cliente | `/meus-pedidos` | `/api/pedidos/**` |
| Painel admin | `/admin`, `/admin/pedidos`, `/admin/produtos`, `/admin/categorias` | `/api/admin/**` |
| Tempo real | telas de pedidos | WebSocket em `/ws` |

## Estratégia

| Tipo de teste | Como |
|---|---|
| Funcional | Casos de teste manuais pela interface |
| API | Chamadas com `curl`, Postman ou Insomnia nos casos marcados |
| Regressão | Checklist curto repetido depois de cada mudança |
| Permissões e segurança | Tentar acessar rotas sem token e com perfil errado |
| Visual e usabilidade | Conferir telas, fonte e celular (ver o documento específico) |
| Exploratório | Sessões livres de 30 minutos tentando "quebrar" o sistema |

## Ambiente

O teste é feito no ambiente **de produção**, porque é o único publicado. Isso exige cuidado:

- os dados são reais (cardápio e usuários);
- pedidos de teste ficam gravados no banco e devem ser cancelados ou identificados;
- não existe ambiente separado nem branch de teste no banco.

| Item | Valor |
|---|---|
| Frontend | https://tarrafa-bistro.vercel.app |
| Backend | https://sistema-cardapio-e-pedidos-do-tarrafa.onrender.com |
| Banco | PostgreSQL no Neon (o QA não acessa direto) |
| Navegadores | Chrome e Firefox (mais um navegador de celular) |
| Ferramentas | DevTools (F12), `curl` ou Postman, planilha ou Markdown para registro |

Os links de Preview da Vercel **não** servem para teste: eles não conseguem chamar a API por causa do CORS.

## Dados de teste

- Duas contas de cliente de teste, para testar o isolamento entre clientes. Sugestão de nomes: `qa.cliente1@exemplo.com` e `qa.cliente2@exemplo.com`, com senhas escolhidas por quem testa e não registradas em documentos.
- Uma conta de administrador. A senha vem da equipe de desenvolvimento por um canal seguro (não por documento nem por chat público).
- Um produto de teste, criado pelo admin e com nome começando por `QA-` (por exemplo, `QA-Produto teste`), para poder identificar e desativar depois.
- Produtos conhecidos de teste: o banco pode ter três itens de teste (ids 134, 135 e 136, com nomes como "Não sei" e "Agua barata"). Eles são conhecidos e **não devem gerar bug**. Só desconsidere na contagem do cardápio.

## Critérios

**Para começar**

- Frontend e backend publicados e respondendo (`GET /api/categorias` retorna 200).
- Contas de teste disponíveis.
- Mudanças recentes consultadas no histórico de commits da branch `atualiza-projeto` no GitHub.

**Para aprovar**

- 100% dos casos de prioridade **Alta** passaram.
- Nenhum bug aberto de gravidade **Crítica** ou **Alta**.
- Pelo menos 90% dos casos de prioridade Média passaram, e os que falharam têm bug registrado.
- Checklist de regressão sem falhas.

**Para pausar os testes**

- Backend fora do ar por mais de 15 minutos (depois de acordar o serviço).
- Problema que impede o login de todos os usuários.

## Papéis

| Papel | Responsabilidade |
|---|---|
| QA | Executar os testes, registrar resultados e abrir bugs |
| Desenvolvedor | Corrigir bugs, tirar dúvidas e informar as mudanças |
| Responsável pelo deploy | Publicar as correções e avisar o QA |

## Riscos

| Risco | O que fazer |
|---|---|
| Teste em produção deixa dados de teste no banco | Usar prefixo `QA-`, cancelar pedidos de teste e anotar o que foi criado |
| Primeira chamada lenta (Render e Neon Free "dormem") | Acordar o sistema alguns minutos antes de testar |
| Virada do dia pelo fuso (o servidor pode usar UTC) | Testar o fechamento do dia fora do horário de risco e registrar o horário |
| Mudanças recentes não documentadas | Ler o histórico de commits da branch `atualiza-projeto` e rodar o checklist de regressão completo |
| Encerrar o dia por engano | Usar "reabrir dia" logo depois |

## Entregas do QA

- Registro de execução preenchido.
- Relatórios de bug.
- Resumo final: total de casos, quantos passaram e falharam, bugs abertos e recomendação (aprovado ou não).

