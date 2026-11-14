# Observações para o QA

## Objetivo

Reúne o que não cabe nos casos de teste: comportamentos que parecem bug, mas são o esperado, riscos do ambiente, o que foi observado durante a execução (09/11/2026 a 12/11/2026) e sugestões para depois.

## O que não é bug

| Comportamento | Por quê |
|---|---|
| A primeira chamada depois de um tempo parado demora | O Render Free coloca o backend para dormir e o Neon Free pode suspender o banco. Só vira bug se continuar lento depois de acordar |
| Pedido de outro cliente responde "Pedido não encontrado" (404) | É de propósito (RN06): o sistema não revela que o pedido existe |
| O admin não consegue confirmar um pedido pendente | A confirmação é feita pelo cliente |
| Rota sem token responde `403` em vez de `401` | É o comportamento atual da API; o frontend trata `403` como sessão expirada |
| O login expira depois de 24 horas | O token vale 24 horas |
| Login com e-mail inexistente e com senha errada dão a mesma mensagem | É de propósito, para não revelar quais e-mails existem |
| Produto que já foi pedido não é apagado | RN07: ele só é desativado |
| Links de Preview da Vercel não conseguem chamar a API | O CORS só libera `http://localhost:*` e o endereço de produção |
| O backend mostra consultas SQL nos logs | `spring.jpa.show-sql=true` está ligado |

## Riscos conhecidos do ambiente

- **Teste em produção.** Não existe ambiente separado. Os dados de teste foram identificados com o prefixo `QA-` e os pedidos e produtos de teste foram cancelados ou desativados ao fim.
- **Fuso horário.** O risco era o "dia" virar às 21h de Brasília, caso o servidor usasse UTC. O caso CT-DIA-10 passou: o dashboard usa a data de Brasília.
- **Encerrar o dia.** O botão registra um fechamento de verdade. Depois dos testes, o dia foi reaberto com "reabrir dia".
- **Dados do cardápio.** O cardápio oficial é o do arquivo `database/seed.sql`. Os preços e a contagem de categorias conferiram (CT-CAR-02 e CT-CAR-03).
- **Itens de teste antigos.** O banco tem três itens de teste (ids 134, 135 e 136). São conhecidos e foram desconsiderados.
- **Sem testes automatizados no deploy.** O build do backend pula os testes (`-DskipTests`), por isso a regressão manual é importante.
- **Tempo real com uma instância.** O WebSocket usa um broker em memória e funciona porque há só uma instância do backend.

## Observações da execução

Nenhuma delas configura falha de caso.

1. **Aba desatualizada após troca de conta.** Uma aba aberta continua mostrando dados antigos depois que outra aba troca de conta. Não é falha de isolamento (CT-PED-19 passou). Melhoria sugerida: recarregar a página ao detectar a saída ou a troca de conta em outra aba.
2. **Idioma da página.** O `index.html` declara `lang="en"`, embora o conteúdo seja em português. Sugestão: `pt-BR`.
3. **Campos de formulário.** O DevTools registra o aviso "A form field element should have an id or name attribute".
4. **Texto do cardápio.** Redação possivelmente incorreta em uma frase da categoria "Do mar e da brasa" (CT-CAR-04).
5. **Desempenho local.** O Lighthouse apontou desempenho baixo no ambiente local e notas excelentes no site publicado (VIS-26).
6. **Limite de observação.** O campo limita o texto a 300 caracteres, então não dá para digitar além do limite (CT-PED-09).
7. **Pedidos sem login.** Sem login, a tela de pedidos não lista pedidos; é possível montar um pedido, mas ele não é encaminhado (CT-SEG-06).
8. **Celular e tablet.** Os pedidos são conferidos na tela de pedidos, e a montagem do pedido não aparece junto da conferência (VIS-13 e VIS-14).
9. **Safari.** Não foi testado (VIS-20). Chrome no celular funcionou.

## Pontos confirmados

| Ponto | Situação |
|---|---|
| Faturamento e ticket médio do dashboard | Conferidos à mão e coerentes (CT-DIA-02). A regra exata de cálculo (se cancelados entram, por exemplo) segue para confirmação do desenvolvedor |
| Excluir produto que já foi pedido | O sistema não apaga o produto e mostra a mensagem "Esse produto já aparece em pedidos, então só pode ser desativado" (CT-PRO-09) |
| Fuso horário do servidor | O dashboard usa a data de Brasília (CT-DIA-10) |
| Regras de negócio de referência | Foram usadas as regras RN01 a RN09 da [Matriz de rastreabilidade](./matriz-de-rastreabilidade.md) |

## Ferramentas usadas

- **DevTools (F12):** Console (erros de JavaScript e CORS), Network (método, rota e código de cada chamada), Application (token no Local Storage) e Elements (fonte aplicada).
- **curl, Postman ou Insomnia** para os casos de API, com o token no cabeçalho `Authorization: Bearer`.
- **Lighthouse** para as notas de desempenho e acessibilidade.
- Uma janela normal e uma anônima para testar cliente e admin ao mesmo tempo.

## Códigos de resposta da API

| Código | Quando aparece |
|---|---|
| 200 | Deu certo |
| 400 | Regra de negócio ou validação (pedido sem item, status inválido, preço zero) |
| 401 | E-mail ou senha incorretos no login |
| 403 | Sem token, token inválido ou sem permissão |
| 404 | Recurso não encontrado (inclui pedido de outro cliente) |
| 409 | E-mail já cadastrado |
| 500 | Erro inesperado no servidor (nenhum ocorreu nos testes) |

As respostas de erro trazem um JSON com o campo `mensagem`.

## Bugs

Nenhum bug foi aberto no período. Se surgir algum, ele é aberto como Issue no GitHub com os rótulos `bug` e `qa`, usando o [modelo de relatório](./modelo-de-relatorio-de-bug.md).

## Sugestões de melhoria

- Recarregar a página quando outra aba sair da conta ou trocar de conta.
- Trocar `lang="en"` por `pt-BR` no `index.html` e acrescentar `id` ou `name` nos campos de formulário.
- Revisar a frase da categoria "Do mar e da brasa".
- Testar no Safari do celular.
- Criar um ambiente de teste separado (outra branch no Neon e outro serviço).
- Automatizar os casos de maior prioridade (login, pedido e permissões) em um workflow do GitHub Actions e rodar `mvn test` e o build do frontend antes de cada deploy.
- Colocar um monitor externo chamando `/api/categorias`.

