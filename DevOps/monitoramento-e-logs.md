# Monitoramento e logs

## Motivo

Quando alguma coisa para de funcionar, a primeira pergunta é: onde eu olho? Este documento mostra onde ficam os logs e como investigar os problemas mais comuns de conexão, inicialização e comunicação entre os serviços.

## O que existe hoje

| Item | Situação |
|---|---|
| Logs do backend | Existem, no painel do Render |
| Estado dos deploys | Existem, no Render (Events) e na Vercel (Deployments) |
| Logs de build do frontend | Existem, na Vercel |
| Health Check | Existe, o Render consulta `/api/categorias` |
| Monitoramento externo (uptime, alertas, métricas) | **Não existe** |
| Alertas por e-mail ou mensagem | **Não existem** (pendente de verificação se o Render envia aviso de deploy falho) |

O acompanhamento é feito olhando os logs na mão.

## Onde olhar

### Render (backend)

1. Entre no serviço do backend.
2. Aba **Logs**: mostra o que o Spring Boot imprime, em tempo real. Dá para procurar por palavras como `ERROR`, `Exception` ou `Hikari`.
3. Aba **Events**: mostra cada deploy e se ele deu certo.

O backend tem `spring.jpa.show-sql=true`, então os logs também mostram as consultas SQL. Isso ajuda a depurar, mas deixa o log grande. Procure por `ERROR` para pular o ruído.

Na subida, a classe `AdminInicial` escreve no log a mensagem "Conta do administrador criada: <email>" quando cria o administrador. Se o administrador já existe, não escreve nada.

### Vercel (frontend)

1. Abra o projeto `tarrafa-bistro`.
2. Aba **Deployments**: escolha o deploy e veja o **Build Logs**. É aqui que aparecem erros de TypeScript e de build.
3. Como o frontend é estático, quase não há log de execução. Os erros de execução aparecem no console do navegador (F12).

### Navegador

- **Console (F12):** erros de JavaScript e de CORS.
- **Network (F12):** cada chamada para a API, com o código de resposta (`200`, `400`, `403` etc.).

## Como diagnosticar

### Problemas de inicialização do backend

| Sintoma no log | Causa provável | O que fazer |
|---|---|---|
| `Could not resolve placeholder 'DB_URL'` (ou outra variável) | Variável de ambiente não cadastrada | Cadastrar a variável no Render |
| Erro de chave fraca (`WeakKeyException`) | `JWT_SECRET` com menos de 32 caracteres | Usar um segredo maior |
| Falha ao conectar no banco logo na subida | `DB_URL`, `DB_USER` ou `DB_PASSWORD` errados | Conferir os valores (formato JDBC, ver [Ambiente e variáveis](./ambiente-e-variaveis.md)) |
| Build do Docker falha | Erro de compilação ou dependência | Ler o log de build do deploy no Render |
| Deploy não fica "live" | Health Check `/api/categorias` não respondeu | Ver o log e testar o banco |

### Problemas de conexão com o banco

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| `Connection is not available, request timed out after 30000ms` | Banco suspenso ou lento (Neon Free) ou conexões esgotadas | Tentar de novo depois de alguns segundos; ver o painel do Neon |
| `password authentication failed` | `DB_USER` ou `DB_PASSWORD` incorretos | Corrigir no Render |
| `relation ... does not exist` ou `column ... does not exist` | Tabela ou coluna não existe (por exemplo, `imagem_url`) | Aplicar o SQL que falta (ver [Banco de dados](./banco-de-dados.md)) |
| Primeira requisição muito lenta | Render ou Neon "acordando" | Esperar e tentar de novo |

### Problemas de comunicação entre frontend e backend

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Erro "blocked by CORS policy" no console | A origem do site não está em `CORS_ORIGENS` | Incluir a origem no Render |
| O site chama `localhost:8080` em produção | `VITE_API_URL` não estava definida no build | Definir na Vercel e fazer novo deploy |
| `403` em rotas que deveriam funcionar | Token vencido (vale 24 horas), papel errado ou sem token | Logar de novo e conferir o papel |
| `403` em rotas públicas | Rota errada ou backend com versão antiga | Conferir a URL e o deploy |
| Tempo real não atualiza | WebSocket não conectou (token inválido, backend dormindo ou CORS do `/ws`) | Ver Network, aba WS, e os logs do Render |
| Tela em branco ao recarregar uma rota | Falta a regra de reescrita do `vercel.json` | Conferir o arquivo |

### Mensagens de erro da API

O backend devolve erros em JSON no formato `{"mensagem": "..."}`:

| Código | Quando acontece |
|---|---|
| `400` | Regra de negócio ou validação (por exemplo, pedido sem item, status inválido) |
| `401` | Login com e-mail ou senha incorretos |
| `404` | Recurso não encontrado (inclui pedido de outro cliente) |
| `409` | E-mail já cadastrado |
| `403` | Sem token, token inválido ou sem permissão |

## Como executar

Passos rápidos quando "o site não funciona":

1. Abra https://tarrafa-bistro.vercel.app. Se não abrir, o problema é na Vercel (veja Deployments).
2. Teste a API:

```bash
curl -i https://sistema-cardapio-e-pedidos-do-tarrafa.onrender.com/api/categorias
```

3. Se der erro ou demorar muito, olhe a aba Logs e Events do Render.
4. Se a API responde mas o site falha, abra o F12 e veja Console e Network.
5. Se os logs falam de banco, confira o painel do Neon e os valores `DB_*`.

## Segurança

- Não cole logs completos em lugares públicos sem conferir: eles podem trazer e-mails de usuários e detalhes da infraestrutura.
- Nunca cole variáveis de ambiente com valores em prints.

## Observação

- Pendente de verificação: tempo de retenção dos logs no plano Free do Render e da Vercel.
- Recomendação: usar um monitor externo gratuito chamando `/api/categorias` de tempos em tempos, para receber aviso quando o backend cair.
- Recomendação: desligar `spring.jpa.show-sql` em produção para deixar os logs mais limpos.
