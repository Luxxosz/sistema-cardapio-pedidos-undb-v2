## Motivo
Essa pasta contém os controllers da aplicação, ou seja, as classes responsáveis por receber as requisições HTTP enviadas pelo frontend, identificar os dados recebidos e encaminhar as operações para os serviços correspondentes. Também são responsáveis por devolver as respostas da API, normalmente em formato JSON.

Os controllers fazem a comunicação entre o frontend e o backend, enquanto as regras de negócio ficam principalmente na camada `service`.

## Arquivos

`AuthController` - disponibiliza as rotas de cadastro e login dos usuários, encaminhando as informações para o `AuthService` e retornando os dados de autenticação.

`CategoriaController` - disponibiliza a listagem pública das categorias cadastradas no cardápio.

`ProdutoController` - disponibiliza a listagem pública dos produtos ativos que podem ser exibidos no cardápio.

`PedidoController` - gerencia os pedidos do cliente autenticado, permitindo criar pedidos, consultar os próprios pedidos, adicionar e remover itens, alterar quantidades e observações, confirmar e cancelar pedidos.

`AdminCategoriaController` - permite ao administrador cadastrar, atualizar e excluir categorias do cardápio.

`AdminProdutoController` - permite ao administrador consultar todos os produtos, cadastrar novos produtos, atualizar informações, ativar ou desativar produtos e excluí-los.

`AdminPedidoController` - permite ao administrador consultar os pedidos, filtrar por status, visualizar os detalhes de um pedido e alterar seu status.

`AdminDashboardController` - disponibiliza os dados utilizados no painel administrativo e permite realizar as operações de encerramento e reabertura do dia.

## Como funciona
Quando o frontend envia uma requisição para a API, o Spring Boot identifica a rota e executa o método correspondente do controller. Os dados podem ser recebidos pelo corpo da requisição, pelos parâmetros da URL ou pelos identificadores presentes no caminho.

Depois disso, o controller encaminha a operação para a camada `service`, que executa as regras de negócio necessárias. Por fim, o resultado é devolvido ao frontend por meio de uma resposta HTTP, geralmente em formato JSON.

## Validações e requisições
Os controllers utilizam anotações do Spring para definir as rotas e receber os dados enviados pelo frontend:

- `@RestController` - define uma classe responsável por atender requisições REST.
- `@RequestMapping` - define o caminho base de uma rota.
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping` e `@DeleteMapping` - definem as operações HTTP disponíveis.
- `@RequestBody` - recebe os dados enviados no corpo da requisição, normalmente em JSON.
- `@PathVariable` - recebe valores presentes no caminho da URL.
- `@RequestParam` - recebe parâmetros enviados na URL.
- `@Valid` - ativa as validações declaradas nos DTOs.

## Segurança
A proteção das rotas é configurada principalmente no `config/SecurityConfig.java`. As operações administrativas exigem o papel `ADMIN`, enquanto as rotas de pedidos dos clientes exigem o papel `CLIENTE`.

No `PedidoController`, a identidade do usuário autenticado pode ser obtida por meio de `Authentication`, permitindo identificar o cliente responsável pela operação sem depender de um e-mail informado livremente pelo frontend.

## Organização do código
Os controllers devem ficar responsáveis pela comunicação entre o frontend e os serviços, evitando concentrar regras de negócio ou realizar consultas diretamente aos repositórios. Dessa forma, o código fica mais organizado, facilita a manutenção e separa as responsabilidades de cada camada da aplicação.