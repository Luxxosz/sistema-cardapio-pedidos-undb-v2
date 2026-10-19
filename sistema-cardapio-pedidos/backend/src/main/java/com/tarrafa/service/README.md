## Motivo
Essa pasta contém os serviços da aplicação, ou seja, as classes responsáveis por executar os casos de uso e aplicar as regras de negócio do Sistema de Cardápio e Pedidos. É nessa camada que ficam as operações relacionadas ao cadastro de usuários, gerenciamento de produtos e categorias, processamento de pedidos, cálculo de valores e fechamento diário.

Os serviços fazem a ligação entre os controllers, as entidades e os repositórios, coordenando as consultas e alterações necessárias no banco de dados. Também podem preparar os dados de resposta e enviar notificações em tempo real quando uma operação exige isso.

## Arquivos

`AuthService` - realiza o cadastro e o login dos usuários, consulta os registros necessários, verifica as credenciais, utiliza o codificador de senhas e gera o token de autenticação.

`CategoriaService` - gerencia as categorias do cardápio, permitindo listar, cadastrar, atualizar e excluir categorias. Também verifica as condições de negócio e as dependências com produtos antes de realizar determinadas operações.

`ProdutoService` - gerencia os produtos do cardápio, permitindo listar os produtos ativos para exibição pública e consultar todos os produtos na administração. Também realiza o cadastro, a atualização, a ativação, a desativação, a consulta e a exclusão de produtos.

`PedidoService` - concentra as operações relacionadas aos pedidos, incluindo criação, consulta dos pedidos do cliente, alteração de itens e observações, cálculo de valores, confirmação e cancelamento. Também permite operações administrativas de consulta e alteração de status, além de converter entidades de pedidos em objetos `PedidoResponse`.

`FechamentoService` - reúne as operações relacionadas ao painel administrativo e ao fechamento diário, preparando os indicadores por data, calculando informações sobre pedidos e faturamento, encerrando ou reabrindo o dia e verificando se o dia está aberto para operações que dependem dessa condição.

`NotificacaoService` - envia atualizações de pedidos por meio do mecanismo de mensagens do Spring, permitindo que os clientes e as interfaces administrativas recebam notificações em tempo real.

## Como funciona
Quando o frontend envia uma solicitação, o controller recebe os dados e encaminha a operação para o serviço correspondente. O serviço verifica as regras de negócio, consulta os repositórios e, quando necessário, cria ou modifica entidades e persiste as alterações no banco de dados.

Depois de concluir a operação, o serviço prepara os dados que serão devolvidos ao controller, geralmente por meio de um DTO de resposta. Em operações que exigem atualização em tempo real, também pode acionar o `NotificacaoService` para enviar mensagens aos clientes conectados.

## Regras de negócio
Cada serviço concentra as regras relacionadas à sua responsabilidade:

- `AuthService` - controla as operações de cadastro e autenticação, incluindo a verificação das credenciais e a geração do token.
- `CategoriaService` - verifica as condições necessárias para alterar ou excluir categorias, considerando suas dependências com os produtos.
- `ProdutoService` - diferencia os produtos ativos exibidos publicamente daqueles disponibilizados para consulta administrativa.
- `PedidoService` - calcula os valores dos pedidos, verifica as condições de alteração, respeita o cliente responsável e considera as transições de status permitidas por `StatusPedido`.
- `FechamentoService` - centraliza os indicadores do painel administrativo e as regras relacionadas ao encerramento e à reabertura do dia.
- `NotificacaoService` - permite comunicar atualizações dos pedidos por meio de mensagens em tempo real.

No cálculo dos pedidos, o `PedidoService` utiliza o preço unitário registrado em cada `ItemPedido`, preservando o valor aplicado no momento da compra mesmo que o preço do produto seja alterado posteriormente.

## Comunicação com outras camadas
Os serviços utilizam os repositórios para consultar e persistir dados, trabalham com as entidades para representar os registros do sistema e utilizam DTOs para organizar as informações recebidas e devolvidas pela API.

Quando ocorre uma situação que impede uma operação, os serviços também podem lançar exceções específicas da pasta `exception/`, permitindo que o `GlobalExceptionHandler` transforme esses erros em respostas HTTP padronizadas.
