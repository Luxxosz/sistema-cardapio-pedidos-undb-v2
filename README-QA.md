# Documentação de QA do Tarrafa


## Documentos

| Documento | Para que serve |
|---|---|
| [Plano de testes](./plano-de-testes.md) | Objetivo, escopo, estratégia, ambiente, dados de teste e critérios para aprovar |
| [Casos de teste](./casos-de-teste.md) | Lista de cenários com passos e resultado esperado |
| [Checklist de regressão](./checklist-de-regressao.md) | Lista curta para repetir depois de cada mudança ou deploy |
| [Testes visuais e de usabilidade](./testes-visuais-e-usabilidade.md) | Fonte, telas, celular, navegadores e acessibilidade básica |
| [Matriz de rastreabilidade](./matriz-de-rastreabilidade.md) | Liga cada regra de negócio aos casos que a testam |
| [Modelo de relatório de bug](./modelo-de-relatorio-de-bug.md) | Como escrever um bug e como classificar a gravidade |
| [Registro de execução](./registro-de-execucao.md) | Tabela para anotar o resultado de cada teste |
| [Observações para o QA](./observacoes-para-o-qa.md) | Dicas, comportamentos que não são bug e riscos conhecidos |

## Endereços

- Frontend: https://tarrafa-bistro.vercel.app
- Backend (API): https://sistema-cardapio-e-pedidos-do-tarrafa.onrender.com

## Perfis do sistema

| Perfil | O que pode fazer |
|---|---|
| Visitante (sem login) | Ver o cardápio, cadastrar-se e entrar |
| `CLIENTE` | Montar, editar, confirmar e cancelar os próprios pedidos e ver o histórico |
| `ADMIN` | Ver todos os pedidos, mudar o status, gerenciar produtos e categorias, ver o dashboard e encerrar o dia |

## Convenções

- **Identificação dos casos:** `CT-<GRUPO>-<NÚMERO>`, por exemplo `CT-PED-05`.
- **Resultados possíveis:** Passou, Falhou, Bloqueado (não deu para executar) e Não executado.
- **Prioridade:** Alta (fluxo principal ou segurança), Média e Baixa.
- **Regras de negócio:** aparecem como `RN01` a `RN09`. Elas vêm dos comentários do código do backend e estão ligadas aos casos na [Matriz de rastreabilidade](./matriz-de-rastreabilidade.md).

