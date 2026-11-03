# Deploy e rollback

## Motivo

Este documento descreve como publicar uma versão nova, como conferir se ela está funcionando e como voltar para uma versão anterior se algo der errado. Também mostra os limites de cada plataforma.

## Antes de publicar

Checklist rápido:

- [ ] O backend compila e os testes passam na máquina local (`mvn test` dentro de `backend`).
- [ ] O frontend compila (`npm run build` dentro de `frontend`).
- [ ] Se mudou alguma tabela, o SQL correspondente está pronto e vai ser aplicado no Neon (ver [Banco de dados](./banco-de-dados.md)).
- [ ] Se criou uma variável nova, ela já foi cadastrada no Render ou na Vercel.
- [ ] Nenhum segredo está no código nem no commit.

## Como publicar

O deploy é automático (ver [Pipeline de CI/CD](./pipeline-ci-cd.md)). Basta enviar o código para a branch de deploy:

```bash
git push origin main
```

Em seguida:

1. Acompanhe o deploy do frontend na aba Deployments da Vercel.
2. Acompanhe o deploy do backend na aba Events do Render e olhe os Logs até aparecer que o serviço subiu.
3. Quando os dois terminarem, rode o [checklist pós-deploy](./testes-pos-deploy.md).

Se a mudança mexe no banco **e** no backend, aplique o SQL no Neon antes de o backend novo ficar no ar, senão ele pode quebrar procurando uma coluna que ainda não existe.

Se a mudança foi só em variável de ambiente:

- **Render:** ao salvar a variável o serviço reinicia sozinho.
- **Vercel:** é preciso gerar um deploy novo (por exemplo, o Redeploy do último deploy), porque o valor de `VITE_API_URL` entra no código no momento do build.

## Histórico de implantações

| Plataforma | Onde ver |
|---|---|
| Vercel | Projeto `tarrafa-bistro`, aba Deployments (commit, status, horário e logs de build) |
| Render | Serviço do backend, aba Events (cada deploy, com o commit e o status) |
| GitHub | Histórico de commits da branch `main` |

Para saber qual versão está no ar, compare o commit do deploy marcado como atual (Vercel e Render) com o histórico do GitHub.

## Rollback

Rollback é voltar para uma versão que funcionava. Existem três caminhos.

### 1. Pelo painel da plataforma

- **Vercel:** na aba Deployments, escolher um deploy anterior que estava bom e promovê-lo para produção (opção de rollback/promote do painel).
- **Render:** no histórico de deploys do serviço, escolher um deploy anterior e fazer o rollback para ele.

Pendente de verificação: se essas opções estão disponíveis e quais limites têm nos planos Free da Vercel e do Render (por exemplo, até quantos deploys para trás).

### 2. Pelo Git (sempre funciona)

Desfazer o commit com problema criando um commit novo e enviando:

```bash
git revert <hash-do-commit-com-problema>
git push origin main
```

Isso dispara os deploys de novo, agora com o código corrigido. Esse caminho mantém o histórico e não exige nenhum recurso especial das plataformas.

### 3. Corrigir para frente

Se o erro é pequeno, pode ser mais rápido corrigir o código e publicar de novo.

## Limites do rollback

- **O banco não volta junto.** Voltar o código não desfaz mudanças no banco. Se a versão nova criou uma coluna ou apagou dados, a versão antiga do backend pode não combinar com o banco. Isso é importante porque o esquema é alterado na mão.
- Para voltar o **banco**, o único recurso que existe é o histórico de 6 horas do Neon. Depois desse prazo não há como recuperar (não há snapshots nem backup próprio).
- **Variáveis de ambiente** não têm histórico no projeto. Anote os nomes e guarde os valores em um lugar seguro, fora do repositório.
- No Render Free, depois de um deploy ou de um período parado, o serviço pode demorar para responder. Não confunda lentidão de "acordar" com falha de deploy.
- Se o Health Check falhar, a versão nova não fica no ar e a anterior continua atendendo (comportamento esperado do deploy no Render, mas confirmar no painel).

## Segurança

- Não envie segredos nas mensagens de commit.
- Se um segredo vazou no repositório, **trocar o segredo** é obrigatório: apagar o commit não resolve, porque o valor já foi exposto. Ver [Segurança e contingência](./seguranca-e-contingencia.md).

## Observação

- O deploy do frontend e o do backend são independentes. Se só um falhar, o outro continua publicado, e as versões podem ficar diferentes por um tempo.
- Para a apresentação, publique com antecedência e teste tudo, para evitar surpresas por causa do plano Free.
