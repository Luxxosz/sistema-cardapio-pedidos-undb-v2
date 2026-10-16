## Motivo
Essa pasta contÃ©m as interfaces responsÃ¡veis pela comunicaÃ§Ã£o entre a aplicaÃ§Ã£o e o banco de dados, utilizando o Spring Data JPA. Os repositÃ³rios permitem consultar, cadastrar, atualizar e excluir registros sem precisar escrever manualmente todas as operaÃ§Ãµes de persistÃªncia.

As interfaces estendem `JpaRepository`, que disponibiliza mÃ©todos prontos como `findById`, `findAll`, `save` e `delete`. TambÃ©m podem definir consultas especÃ­ficas por meio de mÃ©todos que seguem as convenÃ§Ãµes de nomenclatura do Spring Data JPA.

## Arquivos

`UsuarioRepository` - realiza consultas relacionadas aos usuÃ¡rios, permitindo procurar um usuÃ¡rio pelo e-mail e verificar se determinado e-mail jÃ¡ estÃ¡ cadastrado.

`CategoriaRepository` - realiza consultas relacionadas Ã s categorias do cardÃ¡pio, incluindo a verificaÃ§Ã£o de existÃªncia de uma categoria com determinado nome.

`ProdutoRepository` - realiza consultas relacionadas aos produtos, permitindo listar os produtos ativos em ordem crescente de ID, verificar se uma categoria possui produtos associados e verificar se um produto aparece nos itens de pedidos.

`PedidoRepository` - realiza consultas relacionadas aos pedidos, permitindo listar os pedidos de um cliente, consultar todos os pedidos em ordem decrescente de data de criaÃ§Ã£o, filtrar por status e buscar pedidos dentro de um intervalo de data e hora.

`FechamentoDiaRepository` - realiza consultas relacionadas aos fechamentos diÃ¡rios, permitindo verificar se existe um fechamento para determinada data e localizar o registro correspondente.

## Consultas
Os repositÃ³rios utilizam mÃ©todos derivados do Spring Data JPA, que identifica a consulta necessÃ¡ria a partir do nome do mÃ©todo, sem exigir a escrita manual de SQL em cada operaÃ§Ã£o.

Alguns exemplos utilizados no projeto:

- `findByEmail(email)` - procura um usuÃ¡rio pelo endereÃ§o de e-mail.
- `existsByNome(nome)` - verifica se jÃ¡ existe uma categoria com o nome informado.
- `findByAtivoTrueOrderByIdAsc()` - lista os produtos ativos, ordenados pelo ID em ordem crescente.
- `findByUsuarioEmailOrderByDataCriacaoDesc(email)` - lista os pedidos de um cliente do mais recente para o mais antigo.
- `findByDataCriacaoGreaterThanEqualAndDataCriacaoLessThan(inicio, fim)` - busca pedidos cuja data de criaÃ§Ã£o esteja dentro do intervalo definido, incluindo o inÃ­cio e excluindo o fim.

AlÃ©m dessas consultas, o mÃ©todo `ProdutoRepository.estaEmPedidos` utiliza uma consulta SQL nativa para verificar se determinado produto aparece na tabela `item_pedido`.

## Como funciona
Os repositÃ³rios sÃ£o utilizados principalmente pela camada `service`, que solicita operaÃ§Ãµes de consulta ou persistÃªncia conforme as necessidades da aplicaÃ§Ã£o.

Por exemplo, quando um serviÃ§o precisa localizar um produto, pode utilizar o `ProdutoRepository`. Depois de verificar as informaÃ§Ãµes e aplicar as regras de negÃ³cio necessÃ¡rias, o serviÃ§o pode utilizar o repositÃ³rio para salvar ou atualizar os dados.

Dessa forma, os repositÃ³rios ficam responsÃ¡veis pelo acesso aos dados, enquanto os serviÃ§os coordenam as operaÃ§Ãµes e os controllers cuidam da comunicaÃ§Ã£o com o frontend.
