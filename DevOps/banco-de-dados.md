# Banco de dados

## Motivo

Todos os dados do sistema (usuários, cardápio, pedidos e fechamentos do dia) ficam em um banco PostgreSQL hospedado no **Neon**. Este documento explica como o banco é configurado, como as tabelas são criadas, e quais cuidados precisamos ter para não perder dados.

## Configuração

### O banco no Neon

| Item | Valor |
|---|---|
| Plano | Free |
| Versão | PostgreSQL 18 |
| Região | São Paulo |
| Branch do banco | só uma, chamada `production` |
| Histórico (restauração) | 6 horas |
| Snapshots | não configurados |
| Proteção da branch | não configurada |

### Conexão

O backend conecta usando três variáveis de ambiente:

| Variável | Conteúdo |
|---|---|
| `DB_URL` | endereço JDBC, no formato `jdbc:postgresql://HOST/NOME_DO_BANCO?sslmode=require` |
| `DB_USER` | usuário do banco |
| `DB_PASSWORD` | senha do banco |

O `sslmode=require` faz a conexão ser criptografada. O pool de conexões (HikariCP) tem no máximo 5 conexões, espera até 30 segundos por uma conexão e renova cada conexão a cada 4 minutos (`max-lifetime=240000`). O Neon pode suspender o banco quando ele fica parado, então a primeira conexão depois de um tempo parado pode demorar.

### Como o esquema é criado

O backend **não cria nem altera tabelas** (`spring.jpa.hibernate.ddl-auto=none`). Quem cria as tabelas são os scripts da pasta `database/`, executados na mão no SQL Editor do Neon.

| Script | O que faz |
|---|---|
| `database/schema.sql` | Apaga as tabelas e cria tudo de novo |
| `database/seed.sql` | Insere o cardápio (17 categorias e seus produtos) |

Tabelas criadas pelo `schema.sql`:

| Tabela | Conteúdo |
|---|---|
| `usuario` | Clientes e administrador (coluna `tipo`, padrão `CLIENTE`) |
| `categoria` | Categorias do cardápio |
| `produto` | Pratos e bebidas, ligados a uma categoria, com o endereço da imagem (`imagem_url`) |
| `pedido` | Pedidos, com status, observação e valor total |
| `item_pedido` | Itens de cada pedido, com o preço da época |
| `fechamento_dia` | Resumo de cada dia encerrado |

O administrador **não** é criado pelo SQL. Ele é criado pelo backend na primeira vez que sobe, usando `ADMIN_EMAIL` e `ADMIN_SENHA` (ver [Ambiente e variáveis](./ambiente-e-variaveis.md)).

## Funcionamento

Fluxo para montar um banco novo (procedimento existente):

1. Criar o projeto e o banco no Neon.
2. Abrir o SQL Editor do Neon.
3. Rodar o `schema.sql`.
4. Rodar o `seed.sql`.
5. Cadastrar `DB_URL`, `DB_USER` e `DB_PASSWORD` no `.env` (local) ou no Render (produção).
6. Subir o backend. Ele cria o administrador se ainda não existir.

## Como executar

Conferir se o banco responde, pelo backend:

```bash
curl https://sistema-cardapio-e-pedidos-do-tarrafa.onrender.com/api/categorias
```

Contar os registros no SQL Editor do Neon:

```sql
SELECT COUNT(*) FROM categoria;
SELECT COUNT(*) FROM produto;
SELECT COUNT(*) FROM usuario;
```

Listar as colunas de `produto` (útil para conferir se `imagem_url` existe):

```sql
SELECT column_name FROM information_schema.columns WHERE table_name = 'produto';
```

Gerar de novo o `seed.sql` a partir do banco (os valores entre `<>` são os do Neon, e o comando tem a senha, então não compartilhe a linha preenchida):

```bash
pg_dump "postgresql://<USUARIO>:<SENHA>@<HOST>/<BANCO>?sslmode=require" --data-only --column-inserts --table=categoria --table=produto -f seed.sql
```

O `pg_dump` precisa ser da mesma versão do banco ou mais novo (o Neon está no PostgreSQL 18). O arquivo gerado traz linhas de controle (`\restrict` e `\unrestrict`) e comandos `SET` que o SQL Editor do Neon não aceita, então elas precisam ser removidas antes de usar o arquivo como `seed.sql`.

## Segurança

- **O `schema.sql` apaga tudo.** Ele começa com `DROP TABLE ... CASCADE` em todas as tabelas. Rodar esse script no banco de produção apaga usuários, pedidos e cardápio. Só use em banco novo ou de teste.
- **Cuidado com scripts de troca de cardápio.** O script que foi usado no Neon para colocar o cardápio de 17 categorias começava com `TRUNCATE TABLE item_pedido, pedido, fechamento_dia, produto, categoria RESTART IDENTITY`. Isso apaga **todos os pedidos e fechamentos** (os usuários são mantidos). O `seed.sql` atual do repositório não tem `TRUNCATE`: ele usa ids fixos e roda dentro de uma transação, então em um banco que já tem dados ele dá erro de chave duplicada e não altera nada.
- Nunca coloque senha do banco em arquivo versionado nem em print.
- A senha do banco só deve estar no Render (`DB_PASSWORD`) e no `.env` local.

## Backups e recuperação

**Implementado**

- O Neon guarda um histórico de 6 horas, que permite voltar o banco a um ponto desse período pelo painel do Neon. Pendente de verificação: o caminho exato da opção de restauração no painel.

**Não existe**

- Snapshots configurados.
- Rotina de backup própria (por exemplo, exportação periódica do banco).
- Proteção da branch `production`.

**Recomendação**

- Antes de qualquer script que altere dados, exportar o banco com `pg_dump` (os valores entre `<>` são os do Neon):

```bash
pg_dump "postgresql://<USUARIO>:<SENHA>@<HOST>/<BANCO>?sslmode=require" -f backup-tarrafa.sql
```

- Criar uma branch separada no Neon para testar scripts SQL.
- Ligar a proteção da branch `production`, se o plano permitir.
- Antes de uma apresentação, fazer um backup e conferir se o cardápio está completo.

## Observação

- **Scripts do repositório.** O `schema.sql` inclui a coluna `produto.imagem_url`, que o backend usa (entidade `Produto`). No Neon ela foi criada à parte com `ALTER TABLE produto ADD COLUMN imagem_url VARCHAR(500);`. O `seed.sql` foi gerado a partir do banco de produção com o `pg_dump` e tem o cardápio de 17 categorias. Todos os produtos têm `imagem_url` vazia, porque as fotos são por categoria e ficam no frontend.
- Para montar um banco novo, rode o `schema.sql` e depois o `seed.sql`, nessa ordem, em um banco vazio.
- O banco de produção é alterado na mão. Se mudar uma tabela, a nova versão do backend e o SQL precisam ir juntos, senão o backend quebra.
- Os horários gravados com `NOW()` seguem o fuso do banco (pendente de verificação), que pode ser diferente do horário de Brasília.
