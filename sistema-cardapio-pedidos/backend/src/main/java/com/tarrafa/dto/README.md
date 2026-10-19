## Motivo
Essa pasta contém os DTOs (*Data Transfer Objects*) da aplicação, ou seja, as classes responsáveis por organizar os dados que são enviados e recebidos pela API. Eles permitem que o frontend envie e receba apenas as informações necessárias, sem precisar acessar diretamente todas as propriedades das entidades do banco de dados.

Vários DTOs são declarados como `record`, um recurso do Java que permite criar estruturas de dados de forma mais simples e com menos código. Também são utilizadas anotações de validação para verificar os dados recebidos antes que eles sejam processados pela lógica de negócio.

## Arquivos

`CadastroRequest` - recebe os dados necessários para cadastrar um usuário, como nome, e-mail e senha, além de validar os campos obrigatórios, o formato do e-mail e o tamanho mínimo da senha.

`LoginRequest` - recebe o e-mail e a senha informados pelo usuário durante o login.

`AuthResponse` - representa a resposta da autenticação, contendo o token, o nome e o papel do usuário autenticado.

`CategoriaRequest` - recebe os dados necessários para cadastrar ou atualizar uma categoria do cardápio.

`ProdutoRequest` - recebe as informações de um produto, como nome, descrição, preço, categoria e URL da imagem, incluindo validações dos campos e do valor do preço.

`PedidoRequest` - recebe os dados necessários para criar um pedido, incluindo a observação e a lista de itens solicitados.

`ItemRequest` - representa um item solicitado em um pedido, contendo o identificador do produto e a quantidade desejada.

`QuantidadeRequest` - recebe a nova quantidade de um item do pedido, exigindo um valor mínimo de 1.

`ObservacaoRequest` - recebe a nova observação de um pedido, limitada a 300 caracteres.

`StatusRequest` - recebe o novo status solicitado para um pedido.

`ItemResponse` - representa os dados de um item na resposta da API, incluindo produto, quantidade, preço unitário e subtotal.

`PedidoResponse` - representa os dados de um pedido retornado pela API, incluindo identificador, status, observação, valor total, data de criação, cliente e itens.

`DashboardResponse` - reúne os indicadores utilizados no painel administrativo, como data, estado do dia, quantidade de pedidos, faturamento, ticket médio, pedidos por status e produtos mais vendidos.

`ProdutoVendidoResponse` - representa os dados de um produto vendido, incluindo seu nome e a quantidade vendida, utilizados nos indicadores do painel administrativo.

## Validações
Os DTOs utilizam anotações do Bean Validation para verificar os dados recebidos pela API:

- `@NotBlank` - exige um texto preenchido.
- `@NotNull` - exige que um valor seja informado.
- `@Email` - verifica se o e-mail possui um formato válido.
- `@Size` - limita o tamanho de um texto ou a quantidade de elementos.
- `@Min` - define o valor inteiro mínimo permitido.
- `@DecimalMin` - define o valor decimal mínimo permitido.
- `@NotEmpty` - exige que uma coleção ou texto não esteja vazio.
- `@Valid` - ativa ou propaga as validações para objetos e elementos internos.

Quando um controller utiliza `@Valid`, os dados recebidos são verificados antes de serem encaminhados para o processamento. Os erros de validação são tratados pelo `GlobalExceptionHandler`, localizado na pasta `exception/`, que devolve uma resposta de erro ao cliente.

## Organização dos dados
Os DTOs são separados conforme a direção dos dados na aplicação:

- `Request` - representa os dados recebidos do frontend para realizar operações, como cadastro de usuários, criação de produtos e envio de pedidos.
- `Response` - representa os dados devolvidos pela API ao frontend, como informações de autenticação, pedidos, itens e indicadores administrativos.
