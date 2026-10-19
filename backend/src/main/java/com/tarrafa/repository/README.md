## Motivo
Essa pasta contém as interfaces responsáveis pela comunicação entre a aplicação e o banco de dados, utilizando o Spring Data JPA. Os repositórios permitem consultar, cadastrar, atualizar e excluir registros sem precisar escrever manualmente todas as operações de persistência.

As interfaces estendem `JpaRepository`, que disponibiliza métodos prontos como `findById`, `findAll`, `save` e `delete`. Também podem definir consultas específicas por meio de métodos que seguem as convenções de nomenclatura do Spring Data JPA.

## Arquivos

`UsuarioRepository` - realiza consultas relacionadas aos usuários, permitindo procurar um usuário pelo e-mail e verificar se determinado e-mail já está cadastrado.

`CategoriaRepository` - realiza consultas relacionadas às categorias do cardápio, incluindo a verificação de existência de uma categoria com determinado nome.

`ProdutoRepository` - realiza consultas relacionadas aos produtos, permitindo listar os produtos ativos em ordem crescente de ID, verificar se uma categoria possui produtos associados e verificar se um produto aparece nos itens de pedidos.

`PedidoRepository` - realiza consultas relacionadas aos pedidos, permitindo listar os pedidos de um cliente, consultar todos os pedidos em ordem decrescente de data de criação, filtrar por status e buscar pedidos dentro de um intervalo de data e hora.

`FechamentoDiaRepository` - realiza consultas relacionadas aos fechamentos diários, permitindo verificar se existe um fechamento para determinada data e localizar o registro correspondente.

## Consultas
Os repositórios utilizam métodos derivados do Spring Data JPA, que identifica a consulta necessária a partir do nome do método, sem exigir a escrita manual de SQL em cada operação.

Alguns exemplos utilizados no projeto:

- `findByEmail(email)` - procura um usuário pelo endereço de e-mail.
- `existsByNome(nome)` - verifica se já existe uma categoria com o nome informado.
- `findByAtivoTrueOrderByIdAsc()` - lista os produtos ativos, ordenados pelo ID em ordem crescente.
- `findByUsuarioEmailOrderByDataCriacaoDesc(email)` - lista os pedidos de um cliente do mais recente para o mais antigo.
- `findByDataCriacaoGreaterThanEqualAndDataCriacaoLessThan(inicio, fim)` - busca pedidos cuja data de criação esteja dentro do intervalo definido, incluindo o início e excluindo o fim.

Além dessas consultas, o método `ProdutoRepository.estaEmPedidos` utiliza uma consulta SQL nativa para verificar se determinado produto aparece na tabela `item_pedido`.

## Como funciona
Os repositórios são utilizados principalmente pela camada `service`, que solicita operações de consulta ou persistência conforme as necessidades da aplicação.

Por exemplo, quando um serviço precisa localizar um produto, pode utilizar o `ProdutoRepository`. Depois de verificar as informações e aplicar as regras de negócio necessárias, o serviço pode utilizar o repositório para salvar ou atualizar os dados.

Dessa forma, os repositórios ficam responsáveis pelo acesso aos dados, enquanto os serviços coordenam as operações e os controllers cuidam da comunicação com o frontend.
