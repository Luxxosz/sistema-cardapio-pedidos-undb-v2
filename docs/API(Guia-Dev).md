# Documentação da API

**Projeto:** Sistema de Cardápio e Pedidos — Tarrafa Bistrô do Mar

## 1. Base URL

Ambiente publicado informado pela equipe:

```text
https://sistema-cardapio-e-pedidos-do-tarrafa.onrender.com
```

Em desenvolvimento local, a URL depende da configuração do backend (frequentemente `http://localhost:8080`, mas deve ser confirmada em `application.properties` e nas variáveis de ambiente).

## 2. Estado de verificação

**Importante:** este documento ainda precisa ser comparado com os Controllers reais do backend antes de ser tratado como contrato definitivo. O material de arquitetura do projeto descreve alguns fluxos e exemplos, mas o código-fonte completo não estava disponível durante a elaboração desta versão. Portanto, as rotas abaixo são **rotas de referência para a equipe confirmar**, não uma declaração de que todas já existem exatamente com esses caminhos.

Antes da entrega, o responsável pelo backend deve:
1. Abrir cada classe em `backend/src/main/java/com/tarrafa/controller/`.
2. Registrar o mapeamento de classe (`@RequestMapping`) e de método (`@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, `@DeleteMapping`).
3. Conferir DTOs, campos obrigatórios, códigos HTTP e regras de segurança.
4. Substituir ou remover qualquer rota abaixo que não corresponda à implementação.

## 3. Convenções

- Formato de dados esperado: JSON, quando o endpoint consumir ou devolver objetos.
- Métodos HTTP: `GET` consulta; `POST` cria; `PUT` substitui/atualiza; `PATCH` altera parcialmente; `DELETE` remove.
- Em endpoints protegidos, o cliente deve enviar o mecanismo de autenticação realmente configurado no backend. Se a implementação usa token Bearer, o cabeçalho tem o formato:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Não inclua tokens reais em exemplos, Issues ou commits.

## 4. Catálogo de rotas de referência — confirmar no código

| Recurso | Método | Rota de referência | Acesso esperado | Finalidade |
|---|---|---|---|---|
| Autenticação | `POST` | `/api/auth/login` | Público | Validar credenciais e iniciar autenticação |
| Cadastro | `POST` | `/api/auth/register` | Público, conforme regra do sistema | Criar conta de usuário |
| Cardápio | `GET` | `/api/produtos` | Público ou autenticado, conforme configuração | Listar produtos |
| Produto | `GET` | `/api/produtos/{id}` | Público ou autenticado | Consultar produto por identificador |
| Categorias | `GET` | `/api/categorias` | Público ou autenticado | Listar categorias |
| Produto | `POST` | `/api/produtos` | Administrador | Cadastrar produto |
| Produto | `PUT` | `/api/produtos/{id}` | Administrador | Atualizar produto |
| Produto | `DELETE` | `/api/produtos/{id}` | Administrador | Remover produto, se permitido |
| Produto | `PATCH` | `/api/produtos/{id}/status` | Administrador | Ativar/desativar produto, se esse for o desenho adotado |
| Pedido | `POST` | `/api/pedidos` | Cliente autenticado | Criar pedido |
| Pedidos do cliente | `GET` | `/api/pedidos/meus` | Cliente autenticado | Listar os pedidos do usuário autenticado |
| Pedidos administrativos | `GET` | `/api/pedidos` | Administrador | Consultar pedidos recebidos |
| Pedido | `GET` | `/api/pedidos/{id}` | Proprietário do pedido ou administrador | Consultar detalhes do pedido, conforme autorização |
| Status do pedido | `PATCH` | `/api/pedidos/{id}/status` | Administrador | Atualizar o status do pedido |

**Não implemente novas rotas apenas para combinar com esta tabela.** A tabela deve ser ajustada ao backend existente, que é a fonte de verdade.

## 5. Exemplos de payloads ilustrativos

Os nomes de campos abaixo são exemplos conceituais baseados no modelo do projeto. Confirme os nomes reais nos DTOs antes de utilizá-los no frontend ou em testes.

### 5.1 Login — exemplo

`POST /api/auth/login`

```json
{
  "email": "cliente@example.com",
  "senha": "senha-de-exemplo"
}
```

Exemplo ilustrativo de resposta de sucesso, caso a API retorne token:

```json
{
  "token": "<token-de-exemplo>",
  "tipo": "CLIENTE"
}
```

O formato real da resposta e os nomes dos campos devem ser copiados do DTO implementado.

### 5.2 Criar pedido — exemplo

`POST /api/pedidos`

```json
{
  "observacao": "Sem observações especiais",
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 2
    },
    {
      "produtoId": 3,
      "quantidade": 1
    }
  ]
}
```

Exemplo ilustrativo de resposta:

```json
{
  "id": 123,
  "status": "PENDENTE",
  "observacao": "Sem observações especiais",
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 2,
      "precoUnitario": 35.00
    }
  ],
  "valorTotal": 70.00
}
```

O servidor deve validar os produtos, determinar os preços aplicáveis e calcular o total. O frontend não deve ser considerado fonte confiável para preço ou total.

### 5.3 Atualizar status — exemplo

Rota de referência: `PATCH /api/pedidos/{id}/status`

```json
{
  "status": "EM_PREPARACAO"
}
```

O nome exato do status serializado (`EM_PREPARACAO`, `EM PREPARAÇÃO` ou outro) depende do enum/DTO implementado. A API deve aceitar apenas transições válidas.

## 6. Códigos HTTP esperados

A tabela é uma referência de boas práticas; confirme os códigos efetivamente devolvidos pela aplicação.

| Código | Significado comum |
|---|---|
| `200 OK` | Consulta ou atualização concluída |
| `201 Created` | Recurso criado |
| `204 No Content` | Operação concluída sem corpo de resposta |
| `400 Bad Request` | Dados inválidos |
| `401 Unauthorized` | Ausência de autenticação válida |
| `403 Forbidden` | Usuário autenticado sem permissão |
| `404 Not Found` | Recurso inexistente |
| `409 Conflict` | Conflito com o estado atual, quando aplicável |
| `500 Internal Server Error` | Erro inesperado no servidor |

## 7. Como manter este documento correto

Quando uma rota mudar:
1. Atualize ou confira o Controller e o DTO.
2. Atualize esta documentação.
3. Atualize o serviço de comunicação do frontend.
4. Ajuste os testes de integração e de interface.
5. Inclua a mudança no Pull Request.

**Fonte de verdade:** Controllers, DTOs, regras de segurança e testes do backend. Esta documentação deve refletir o código, não substituí-lo.
