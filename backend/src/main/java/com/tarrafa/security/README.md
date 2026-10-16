## Motivo
Essa pasta contém as classes responsáveis pela autenticação e validação de tokens JWT (*JSON Web Token*), além do controle de autenticação nas mensagens WebSocket. Esses componentes permitem identificar os usuários que acessam a API e verificar suas permissões durante as requisições e conexões em tempo real.

A configuração geral das rotas públicas e protegidas fica em `config/SecurityConfig.java`, enquanto os componentes dessa pasta executam as verificações necessárias para reconhecer os usuários autenticados.

## Arquivos

`JwtService` - é responsável por gerar e validar tokens JWT, utilizando o e-mail do usuário como assunto do token, além de incluir o papel do usuário e as datas de emissão e expiração. Também permite extrair informações do token recebido.

`JwtFilter` - verifica o cabeçalho HTTP `Authorization` das requisições. Quando encontra um token no formato `Bearer <token>`, valida suas informações e registra a autenticação no contexto de segurança do Spring, permitindo identificar o usuário durante a requisição.

`WebSocketAuthInterceptor` - verifica o token enviado durante a conexão STOMP do WebSocket, autentica o usuário e restringe a assinatura de destinos administrativos, como `/topic/admin`, aos usuários com o papel `ADMIN`.

## Autenticação HTTP
O processo de autenticação da API funciona da seguinte forma:

1. O usuário informa seu e-mail e sua senha no endpoint de login.
2. O `AuthService` verifica as credenciais e utiliza o `JwtService` para gerar o token de autenticação.
3. O frontend envia esse token nas próximas requisições protegidas, utilizando o cabeçalho `Authorization: Bearer <token>`.
4. O `JwtFilter` verifica o token e registra a identidade e o papel do usuário no contexto de segurança do Spring.
5. O Spring Security aplica as permissões definidas em `config/SecurityConfig.java` para determinar se a requisição pode ser realizada.

Dessa forma, o sistema consegue identificar o usuário autenticado sem exigir que ele envie suas credenciais novamente a cada requisição.

## Autenticação WebSocket
A comunicação WebSocket utiliza o protocolo STOMP para organizar as mensagens trocadas entre o frontend e o backend.

Durante a conexão, o cliente envia o token no cabeçalho STOMP `Authorization`. O `WebSocketAuthInterceptor` valida esse token no comando `CONNECT`, registra o usuário associado à conexão e verifica as permissões necessárias para acessar os destinos protegidos.

As assinaturas de canais administrativos, como `/topic/admin`, são restritas aos usuários com o papel `ADMIN`, evitando que clientes sem autorização recebam mensagens destinadas à administração.

## Configuração de segurança
O segredo utilizado na assinatura dos tokens e o tempo de expiração são definidos pelas propriedades `jwt.secret` e `jwt.expiracao`.

O segredo JWT deve ser forte, armazenado em variáveis de ambiente ou em um serviço de gerenciamento de segredos e mantido fora do código-fonte versionado. Também é importante definir um período de validade adequado para os tokens.

As senhas dos usuários devem ser armazenadas utilizando hash, e não em texto puro. A configuração do codificador BCrypt utilizado para esse processo fica em `config/SecurityConfig.java`.
