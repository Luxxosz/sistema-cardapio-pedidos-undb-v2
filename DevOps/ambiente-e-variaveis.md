# Ambiente e variáveis

## Motivo

O backend e o frontend não guardam senhas nem endereços dentro do código. Tudo que muda de um ambiente para outro (ou que é secreto) vem de **variáveis de ambiente**. Este documento explica cada uma, para que servem e onde configurar.

## Variáveis do backend

O backend lê as variáveis no arquivo `backend/src/main/resources/application.properties`.

| Variável | Obrigatória | Para que serve |
|---|---|---|
| `DB_URL` | sim | Endereço JDBC do banco no Neon |
| `DB_USER` | sim | Usuário do banco |
| `DB_PASSWORD` | sim | Senha do banco |
| `JWT_SECRET` | sim | Segredo usado para assinar os tokens JWT |
| `ADMIN_EMAIL` | sim | E-mail da conta fixa do administrador |
| `ADMIN_SENHA` | sim | Senha da conta fixa do administrador |
| `CORS_ORIGENS` | não | Lista de origens que podem chamar a API |
| `PORT` | não | Porta do servidor (padrão `8080`) |

Detalhes de cada uma:

- **`DB_URL`** precisa estar no formato JDBC, por exemplo `jdbc:postgresql://HOST/NOME_DO_BANCO?sslmode=require`. A string que o Neon mostra no painel começa com `postgresql://` e traz usuário e senha juntos. Ela não funciona direto, é preciso trocar para o formato JDBC e pôr usuário e senha em `DB_USER` e `DB_PASSWORD`.
- **`JWT_SECRET`** precisa ter pelo menos 32 caracteres (o próprio `application.properties` avisa isso). Se for menor, o backend não consegue montar a chave. Se o segredo for trocado, todos os tokens já emitidos deixam de valer e todo mundo precisa logar de novo.
- **`ADMIN_EMAIL` e `ADMIN_SENHA`** são usados pela classe `AdminInicial`. Quando o backend sobe, ela confere se já existe um usuário com esse e-mail. Se não existir, cria o administrador, com a senha criptografada (BCrypt). Se já existir, não faz nada. Ou seja, **mudar `ADMIN_SENHA` depois não troca a senha de um administrador que já foi criado**.
- **`CORS_ORIGENS`** aceita vários valores separados por vírgula. Se não for definida, vale o padrão `http://localhost:*,https://tarrafa-bistro.vercel.app`.
- **`PORT`** é entregue pelo Render. Localmente não precisa definir.

Valores fixos no `application.properties` (não são variáveis de ambiente):

| Propriedade | Valor | Significado |
|---|---|---|
| `jwt.expiracao` | `86400000` | O token vale 24 horas (valor em milissegundos) |
| `spring.jpa.hibernate.ddl-auto` | `none` | O Hibernate não cria nem altera tabelas |
| `spring.jpa.show-sql` | `true` | Mostra os comandos SQL no log |

## Variável do frontend

| Variável | Obrigatória | Para que serve |
|---|---|---|
| `VITE_API_URL` | só em produção | Endereço do backend, sem barra no final |

Em desenvolvimento não precisa criar o arquivo, porque o padrão já é `http://localhost:8080`. O valor entra no código no momento do build, então depois de mudar essa variável é preciso fazer um novo deploy.

## Configuração local

### Backend

1. Copie o modelo da raiz do projeto:

```bash
cp .env.example .env
```

No Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

2. Abra o `.env` e troque pelos seus valores. O formato é de arquivo `.properties`, então use `CHAVE=valor`, **sem aspas e sem espaços** em volta do `=`.

```text
DB_URL=jdbc:postgresql://HOST/NOME_DO_BANCO?sslmode=require
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
JWT_SECRET=uma_frase_grande_com_mais_de_32_caracteres
ADMIN_EMAIL=admin@exemplo.com
ADMIN_SENHA=uma_senha_sua
```

3. Rode o backend dentro da pasta `backend` (ver [Docker e backend](./docker-e-backend.md)). O `application.properties` procura o `.env` em `../.env` (raiz do projeto) e em `.env` (pasta `backend`).

### Frontend

Normalmente não precisa de nada. Se o backend local estiver em outra porta:

```bash
cd frontend
cp .env.example .env
```

e altere `VITE_API_URL` no arquivo.

## Configuração em produção

As variáveis são cadastradas direto nos painéis, sem arquivo `.env`.

**Render** (serviço do backend, aba de variáveis de ambiente). Cadastradas hoje: `ADMIN_EMAIL`, `ADMIN_SENHA`, `CORS_ORIGENS`, `DB_PASSWORD`, `DB_URL`, `DB_USER` e `JWT_SECRET`. A `PORT` não foi cadastrada porque o Render já fornece.

**Vercel** (projeto `tarrafa-bistro`, Settings, Environment Variables): `VITE_API_URL`, marcada para Production, Preview e Development.

Depois de mudar uma variável é preciso publicar de novo (o Render reinicia o serviço ao salvar e a Vercel só aplica no próximo build). Ver [Deploy e rollback](./deploy-e-rollback.md).

## Segurança

- O `.env` está no `.gitignore` (`.env` e `.env.*`, exceto `.env.example`). Nunca faça commit dele.
- O `.dockerignore` do backend também ignora o `.env`, para não entrar na imagem.
- Não coloque valores reais no `.env.example`, nem em prints, issues ou mensagens de commit.
- Use um `JWT_SECRET` diferente do que está em qualquer exemplo.
- Confira que o `.env.example` versionado tem só valores de exemplo (sem host nem usuário reais do Neon) antes de cada commit. Mais cuidados em [Segurança e contingência](./seguranca-e-contingencia.md).

## Observação

- O `.env.example` da raiz não lista `CORS_ORIGENS` nem `PORT`. Elas funcionam sem estar no arquivo porque têm valor padrão, mas vale acrescentar para ficar completo (Recomendação).
- O valor real de cada variável de produção não está documentado de propósito. Ele só existe nos painéis do Render e da Vercel.
- O `CORS_ORIGENS` do Render tem as origens `http://localhost:*` e `https://tarrafa-bistro.vercel.app`, iguais ao padrão do código. Para liberar outro endereço (por exemplo, um Preview da Vercel), é preciso acrescentá-lo, separado por vírgula.
- Recomendação: cadastrar no Render a variável `TZ` com o valor `America/Sao_Paulo`, para o fuso do servidor ser o de Brasília (ver [Docker e backend](./docker-e-backend.md)).
