# Diagrama de Classes / Modelo de Domínio

O modelo abaixo deriva do modelo conceitual apresentado no material do projeto. Ajuste nomes, atributos, tipos, cardinalidades e enums de acordo com as entidades JPA e o esquema SQL reais.

```mermaid
classDiagram
    class Usuario {
      +Long id
      +String nome
      +String email
      +String senha
      +TipoUsuario tipo
    }

    class Categoria {
      +Long id
      +String nome
    }

    class Produto {
      +Long id
      +String nome
      +String descricao
      +BigDecimal preco
      +Boolean ativo
    }

    class Pedido {
      +Long id
      +StatusPedido status
      +String observacao
      +BigDecimal valorTotal
      +LocalDateTime dataCriacao
    }

    class ItemPedido {
      +Long id
      +Integer quantidade
      +BigDecimal precoUnitario
    }

    Usuario "1" --> "0..*" Pedido : realiza
    Categoria "1" --> "0..*" Produto : organiza
    Pedido "1" *-- "1..*" ItemPedido : contém
    Produto "1" --> "0..*" ItemPedido : referenciado por
```

## Regras de modelagem relevantes

- `ItemPedido` liga um pedido a um produto e registra quantidade e preço unitário histórico.
- `valorTotal` deve refletir o cálculo dos itens conforme a regra implementada.
- O atributo `senha` representa uma credencial armazenada de forma segura (hash), nunca a senha em texto puro.
- `TipoUsuario` e `StatusPedido` são nomes conceituais; confirme os enums e valores efetivamente usados no código.
