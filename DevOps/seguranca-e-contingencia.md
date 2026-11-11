# Segurança e contingência

## Motivo

Este documento reúne os cuidados de segurança do projeto e o que fazer quando algo dá errado (falha, vazamento de segredo, perda de dados). Separamos o que já está implementado do que é só recomendação.

## Segurança

### O que já está implementado

| Cuidado | Como é feito |
|---|---|
| Segredos fora do código | Senhas e chaves vêm de variáveis de ambiente (`DB_PASSWORD`, `JWT_SECRET`, `ADMIN_SENHA` etc.) |
| `.env` fora do Git | O `.gitignore` ignora `.env` e `.env.*` (menos `.env.example`) |
| `.env` fora da imagem Docker | O `.dockerignore` do backend ignora `.env` |
| Senhas criptografadas | As senhas dos usuários são salvas com BCrypt |
| Login com JWT | Token assinado com `JWT_SECRET`, válido por 24 horas |
| API sem sessão | `SessionCreationPolicy.STATELESS`; o CSRF está desligado porque o token vai no cabeçalho |
| Permissões por papel | `/api/admin/**` só `ADMIN` e `/api/pedidos/**` só `CLIENTE` |
| Cadastro público só cria cliente | O administrador não pode ser criado pelo cadastro |
| Administrador fixo | Criado pelo backend a partir de `ADMIN_EMAIL` e `ADMIN_SENHA` |
| WebSocket autenticado | O `CONNECT` do STOMP exige o JWT e o canal `/topic/admin` só aceita `ADMIN` |
| Isolamento dos pedidos | O cliente só vê os próprios pedidos (pedido de outro cliente responde como "não encontrado") |
| CORS restrito | Só as origens da lista `CORS_ORIGENS` |
| Conexão criptografada com o banco | `sslmode=require` |
| Erros sem detalhes internos | O `GlobalExceptionHandler` devolve só uma mensagem |

### Cuidados com cada item

**Segredos e `.env`**

- Nunca fazer commit do `.env`.
- Usar valores de exemplo no `.env.example`.
- O `.gitignore` fica dentro da pasta `sistema-cardapio-pedidos/`. Se o repositório Git começa na pasta de fora, um `.env` colocado lá fora não seria ignorado. Por isso, confira com `git status` antes de cada commit que o `.env` não aparece na lista.
- O `.env.example` versionado deve ter só valores de exemplo, sem host nem usuário reais do Neon.

**JWT**

- `JWT_SECRET` com pelo menos 32 caracteres e diferente de qualquer exemplo.
- Trocar o `JWT_SECRET` invalida todos os tokens. É o jeito de "deslogar todo mundo" em caso de suspeita de vazamento.
- O frontend guarda o token no `localStorage`, o que o deixa exposto se houver uma falha de XSS.

**Credenciais do administrador**

- Usar uma senha forte em `ADMIN_SENHA`.
- Trocar `ADMIN_SENHA` no Render **não** muda a senha de um administrador que já existe no banco, porque a classe `AdminInicial` só cria a conta se o e-mail não existir.

**Exposição de endpoints**

Públicos: `/api/auth/**`, `GET /api/categorias/**`, `GET /api/produtos/**` e o handshake de `/ws`. O resto exige token.

### Recomendações

Nada disto existe hoje.

| Ideia | Motivo |
|---|---|
| Colocar um `.gitignore` na raiz do repositório | Garantir que `.env` fica fora do Git em qualquer pasta |
| Desligar `spring.jpa.show-sql` em produção | Logs mais limpos |
| Limitar tentativas de login | Dificultar tentativas de adivinhar senha |
| Proteger a branch `main` no GitHub | Evitar push direto em produção |
| Ativar a varredura de segredos do GitHub | Avisar se um segredo for commitado |
| Guardar os segredos em um gerenciador de senhas | Ter uma cópia segura fora das plataformas |

## Contingência

### Backups

**Implementado:** histórico de 6 horas no Neon.

**Não existe:** snapshots, backup periódico próprio e proteção da branch `production`.

**Recomendação:** exportar o banco com `pg_dump` antes de mudanças importantes e antes de apresentações. O comando está em [Banco de dados](./banco-de-dados.md).

### O que fazer quando algo falha

| Situação | O que fazer |
|---|---|
| Deploy novo quebrou o backend | Voltar pelo painel do Render ou usar `git revert` e `git push` (ver [Deploy e rollback](./deploy-e-rollback.md)) |
| Deploy novo quebrou o frontend | Voltar pelo painel da Vercel ou usar `git revert` |
| Backend fora do ar | Ver Logs e Events do Render. Se foi só repouso do plano Free, a primeira chamada acorda o serviço |
| Banco não responde | Ver o painel do Neon. Pode ser suspensão por inatividade do plano Free |
| Dados apagados por engano | Se foi há menos de 6 horas, usar o histórico do Neon para restaurar. Depois desse prazo não há recuperação |
| Script `schema.sql` ou seed rodado em produção por engano | Mesmo caso acima: restaurar pelo histórico do Neon o quanto antes |
| Esqueci a senha do administrador | Atualizar o hash da senha no banco, ou apagar o usuário administrador e reiniciar o backend para ele ser recriado com `ADMIN_SENHA` (cuidado: pedidos ligados a esse usuário podem impedir a exclusão) |

### Se um segredo vazou

1. **Senha do banco:** criar uma nova senha no Neon, atualizar `DB_PASSWORD` no Render e no `.env` local.
2. **`JWT_SECRET`:** gerar um novo valor e atualizar no Render. Todos os usuários vão precisar logar de novo.
3. **Senha do administrador:** trocar a senha no banco (ver a linha da tabela acima).
4. Remover o segredo de onde ele apareceu (arquivo, print, mensagem), sabendo que apagar o commit **não** basta: o valor já foi exposto, então o segredo precisa ser trocado.
5. Conferir os logs do Render por acessos estranhos.

### Antes de uma apresentação

- [ ] Fazer um backup do banco.
- [ ] Abrir o site e a API alguns minutos antes, para o Render e o Neon "acordarem".
- [ ] Rodar o [checklist pós-deploy](./testes-pos-deploy.md).
- [ ] Ter uma versão rodando localmente como plano B (ver [Docker e backend](./docker-e-backend.md)).

## Observação

- Esta é uma aplicação acadêmica em planos gratuitos. Os limites de histórico do Neon e do repouso do Render fazem parte do risco aceito.
- Pendente de verificação: política de retenção do Neon Free além das 6 horas informadas e opções de restauração disponíveis no painel.
