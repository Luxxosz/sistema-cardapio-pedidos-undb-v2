## Motivo
Essa pasta contém as entidades(halloween mentioned bem poggers) do sistema, ou seja, as classes que representam os principais elementos do domínio e os dados armazenados no banco de dados. Elas utilizam os mapeamentos do JPA para relacionar os objetos Java às tabelas e colunas do banco, permitindo que informações como usuários, produtos, categorias e pedidos sejam persistidas pela aplicação.

As entidades representam os dados e seus relacionamentos, enquanto as operações e regras de negócio são executadas principalmente pela camada `service`.

## Arquivos

`Usuario` - é a classe base abstrata dos usuários do sistema, reunindo informações comuns como ID, nome, e-mail e senha. Também define de forma abstrata o papel de cada tipo de usuário.

`Cliente` - representa o usuário que realiza pedidos no sistema e define o papel `CLIENTE`.

`Administrador` - representa o usuário responsável pelas operações administrativas e define o papel `ADMIN`.

`Categoria` - representa as categorias utilizadas para organizar os produtos disponíveis no cardápio.

`Produto` - representa um item do cardápio, armazenando informações como nome, descrição, preço, estado ativo ou inativo, URL da imagem e categoria associada.

`Pedido` - representa um pedido realizado por um usuário, contendo informações como status, observação, valor total, data de criação e lista de itens.

`ItemPedido` - representa cada item que faz parte de um pedido, associando um produto à quantidade solicitada e ao preço unitário aplicado. Também calcula o subtotal do item.

`StatusPedido` - define os estados possíveis de um pedido e verifica se uma mudança de status é permitida conforme as regras estabelecidas na própria enumeração.

`FechamentoDia` - representa o registro do encerramento diário, armazenando informações como data, quantidade de pedidos, faturamento e momento em que o fechamento foi realizado.

## Relacionamentos
As entidades possuem relacionamentos que representam como os dados do sistema se conectam:

- `Usuario` - pode estar associado a vários pedidos realizados no sistema.
- `Pedido` - possui uma lista de itens que compõem o pedido.
- `ItemPedido` - associa um produto a um pedido, registrando a quantidade e o preço unitário.
- `Produto` - pertence a uma categoria do cardápio.
- `FechamentoDia` - registra os indicadores referentes ao encerramento de uma determinada data.

Esses relacionamentos permitem que o sistema organize os dados e mantenha a ligação entre usuários, pedidos, itens, produtos e categorias.

## Preço dos itens do pedido
O `ItemPedido` armazena o preço unitário aplicado no momento em que o pedido é realizado. Isso é importante porque, se o preço de um produto for alterado posteriormente no cardápio, o pedido antigo poderá continuar utilizando o valor registrado originalmente, preservando o cálculo do subtotal e o histórico da compra.

## JPA e banco de dados
As entidades utilizam anotações do JPA para definir como os objetos Java são mapeados para o banco de dados. Entre as anotações utilizadas nesse tipo de mapeamento estão:

- `@Entity` - identifica uma classe como entidade persistente.
- `@Table` - define a tabela associada à entidade.
- `@Id` - identifica a chave primária.
- `@GeneratedValue` - configura a geração automática do identificador.
- `@ManyToOne` - representa um relacionamento de muitos para um.
- `@OneToMany` - representa um relacionamento de um para muitos.
