## Motivo
Essa pasta tem as configurações e componentes de inicialização do Spring Boot, ou seja, tem classes que configuram como a aplicação se comporta, como as requisições são protegidas e como os clientes se conectam à API.

## Arquivos
SecurityConfig - configura os filtros do Spring Security, as rotas, o modo sem sessão, o filtro JWT e o BCrypt para senhas.

CorsConfig - é onde define as origens permitidas, métodos HTTP e cabeçalhos para as rotas `/api/**`, usando a propriedade `app.cors.origens`.

WebSocketConfig - Habilita o broker WebSocket/STOMP, registra o endpoint, configura os destinos `/topic` e `/queue` e adiciona o interceptor de autenticação de mensagens.

AdminInicial - é quem verifica se já existe um usuário com o e-mail admin configurado, se não existir, cria a conta com senha codificada.

## Segurança das rotas
Na configuração atual:
- As requisições `OPTIONS`, `/error`, `/ws` e `/ws/**` são permitidas para viabilizar preflight e conexão.

- `/api/auth/**` é público para cadastro e login.

- Requisições `GET` para `/api/produtos/**` e `/api/categorias/**` são públicas.

- `/api/admin/**` exige o papel `ADMIN`.

- `/api/pedidos/**` exige o papel `CLIENTE`.
- As demais rotas exigem autenticação.
