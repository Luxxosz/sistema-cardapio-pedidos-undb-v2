# Diagrama de Casos de Uso

O diagrama apresenta os casos de uso descritos no escopo acadêmico. Ele representa o comportamento esperado do sistema e deve ser revisado caso o escopo implementado seja diferente.

```mermaid
flowchart LR
    C[Cliente]
    A[Administrador]
    subgraph S[Sistema de Cardápio e Pedidos]
      UC1((Cadastrar-se))
      UC2((Autenticar-se))
      UC3((Visualizar cardápio))
      UC4((Criar pedido))
      UC5((Consultar próprios pedidos))
      UC6((Acompanhar status))
      UC7((Gerenciar categorias))
      UC8((Gerenciar produtos))
      UC9((Ativar/desativar produto))
      UC10((Consultar pedidos))
      UC11((Atualizar status do pedido))
    end
    C --- UC1
    C --- UC2
    C --- UC3
    C --- UC4
    C --- UC5
    C --- UC6
    A --- UC2
    A --- UC3
    A --- UC7
    A --- UC8
    A --- UC9
    A --- UC10
    A --- UC11
```

## Atores e responsabilidades

- **Cliente:** cadastro/autenticação, consulta do cardápio, criação e acompanhamento dos próprios pedidos.
- **Administrador:** autenticação, gerenciamento do cardápio, consulta de pedidos e atualização de status.

## Observações

- A autenticação é uma pré-condição para operações protegidas.
- O controle de permissões deve ser aplicado no backend.
- O diagrama não afirma que todas as operações já estão implementadas; compare-o com o código atual e os requisitos.