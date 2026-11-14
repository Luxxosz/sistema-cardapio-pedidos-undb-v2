# Documentação de QA do Tarrafa

Testes do sistema de cardápio e pedidos executados de 09/11/2026 a 12/11/2026.

## Resultado

**Aprovado com ressalvas.** Dos 123 casos (94 funcionais e 29 visuais e de usabilidade), 122 passaram, 1 foi parcial (VIS-20, Safari não testado) e nenhum falhou. Não há bugs abertos, e o checklist de regressão passou sem falhas.

## Documentos

| Documento | Para que serve |
|---|---|
| [Plano de testes](./plano-de-testes.md) | Objetivo, escopo, estratégia, ambiente, dados de teste, critérios e resultado |
| [Casos de teste](./casos-de-teste.md) | Cenários com passos, resultado esperado e resultado obtido |
| [Checklist de regressão](./checklist-de-regressao.md) | Lista curta de conferência depois de mudanças ou deploys, com o resultado |
| [Testes visuais e de usabilidade](./testes-visuais-e-usabilidade.md) | Fonte, telas, celular, navegadores e acessibilidade básica |
| [Matriz de rastreabilidade](./matriz-de-rastreabilidade.md) | Liga cada regra de negócio aos casos que a testam |
| [Modelo de relatório de bug](./modelo-de-relatorio-de-bug.md) | Modelo de bug, gravidade e situação dos bugs (nenhum aberto) |
| [Registro de execução](./registro-de-execucao.md) | Resultado de cada caso, observações e evidências |
| [Observações para o QA](./observacoes-para-o-qa.md) | Comportamentos que não são bug, riscos e observações da execução |

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

- **Identificação dos casos:** `CT-<GRUPO>-<NÚMERO>`, por exemplo `CT-PED-05`, e `VIS-<NÚMERO>` para os visuais.
- **Resultados possíveis:** Passou, Falhou, Parcial, Bloqueado e Não executado.
- **Prioridade:** Alta (fluxo principal ou segurança), Média e Baixa.
- **Regras de negócio:** `RN01` a `RN09`, tiradas dos comentários do código do backend e ligadas aos casos na [Matriz de rastreabilidade](./matriz-de-rastreabilidade.md).
