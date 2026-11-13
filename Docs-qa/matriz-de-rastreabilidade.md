# Matriz de rastreabilidade

## Objetivo

Liga cada regra de negócio aos casos de teste que a verificam e mostra o resultado da execução de 09/11/2026 a 12/11/2026. Todas as regras têm cobertura, e todos os casos ligados a elas passaram.

## Origem das regras

As regras `RN01` a `RN09` vêm dos comentários do código do backend (classes de serviço). As descrições abaixo são resumos, e o texto original está nos comentários do código.

## Regras e casos

| Regra | Descrição | Casos de teste | Resultado |
|---|---|---|---|
| RN01 | Produto desativado não aparece para o cliente e não entra em pedido novo | CT-CAR-08, CT-PED-17, CT-PRO-07 | Passou (3 de 3) |
| RN02 | O pedido guarda o preço da época; mudar o preço não altera pedidos antigos | CT-PED-16 | Passou (1 de 1) |
| RN03 | Só é possível editar pedidos pendentes | CT-PED-05, CT-PED-06, CT-PED-07, CT-PED-12 | Passou (4 de 4) |
| RN04 | Status só muda por transições permitidas (`PENDENTE`, `CONFIRMADO`, `EM_PREPARACAO`, `PRONTO`, `FINALIZADO`; cancelamento só a partir de `PENDENTE` ou `CONFIRMADO`) | CT-PED-13, CT-PED-14, CT-PED-15, CT-ADM-04, CT-ADM-05, CT-ADM-06, CT-ADM-08, CT-ADM-09 | Passou (8 de 8) |
| RN05 | O cadastro público cria apenas clientes | CT-AUT-01, CT-AUT-12 | Passou (2 de 2) |
| RN06 | O cliente só vê os próprios pedidos; o de outro cliente responde como inexistente | CT-PED-18, CT-PED-19, CT-TR-03 | Passou (3 de 3) |
| RN07 | Produto que já está em pedido não é apagado, apenas desativado | CT-PRO-09 | Passou (1 de 1) |
| RN08 | Com o dia encerrado, não entram pedidos novos | CT-PED-20, CT-DIA-08 | Passou (2 de 2) |
| RN09 | Não é possível encerrar o dia com pedidos em andamento | CT-DIA-05, CT-DIA-06 | Passou (2 de 2) |

## Regras do código sem número

| Regra | Casos | Resultado |
|---|---|---|
| Nome de categoria é único | CT-CAT-02, CT-CAT-04 | Passou (2 de 2) |
| Categoria com produtos não pode ser excluída | CT-CAT-06 | Passou (1 de 1) |
| Pedido precisa ter pelo menos um item para ser criado e confirmado | CT-PED-03, CT-PED-11 | Passou (2 de 2) |
| Quantidade mínima 1 e observação com até 300 caracteres | CT-PED-04, CT-PED-08, CT-PED-09 | Passou (3 de 3) |
| Preço do produto maior que zero | CT-PRO-03 | Passou (1 de 1) |
| E-mail único no cadastro e senha com 6 ou mais caracteres | CT-AUT-02, CT-AUT-03 | Passou (2 de 2) |

## Cobertura por área

| Área | Grupos de casos | Casos | Passaram |
|---|---|---|---|
| Autenticação | CT-AUT | 12 | 12 |
| Cardápio | CT-CAR | 9 | 9 |
| Pedidos | CT-PED, CT-ADM | 29 | 29 |
| Cardápio administrativo | CT-PRO, CT-CAT | 17 | 17 |
| Fechamento do dia | CT-DIA | 10 | 10 |
| Tempo real | CT-TR | 6 | 6 |
| Permissões e segurança | CT-SEG | 11 | 11 |
| Aparência e usabilidade | VIS (ver [Testes visuais](./testes-visuais-e-usabilidade.md)) | 29 | 28 (1 parcial) |

## Observação

- As regras RN10 em diante não constam nos comentários do código analisado.
- Nenhuma regra foi afetada por falha, pois nenhum caso falhou.
