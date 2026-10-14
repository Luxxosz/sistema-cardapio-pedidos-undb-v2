# Diagrama de Sequência — Criação de Pedido

Fluxo conceitual baseado no processo descrito no material do projeto. Confirme o nome dos Controllers, Services, DTOs e métodos com a implementação real.

```mermaid
sequenceDiagram
    actor Cliente
    participant UI as Frontend
    participant API as PedidoController
    participant S as PedidoService
    participant R as Repositories
    participant DB as PostgreSQL

    Cliente->>UI: Seleciona produtos e quantidades
    UI->>API: POST /api/pedidos (JSON)
    API->>S: solicitar criação do pedido
    S->>S: Validar usuário, produtos e quantidades
    S->>S: Calcular total no servidor
    S->>R: Persistir pedido e itens
    R->>DB: INSERT / persistência
    DB-->>R: Dados persistidos
    R-->>S: Pedido salvo
    S-->>API: Resultado da operação
    API-->>UI: Resposta HTTP + JSON
    UI-->>Cliente: Exibe confirmação e status
```

## Regras importantes do fluxo

1. O usuário deve ser identificado a partir do mecanismo de autenticação do backend.
2. Produtos inexistentes ou indisponíveis e quantidades inválidas devem ser recusados.
3. O total é calculado pelo servidor a partir dos itens válidos.
4. Pedido e itens devem ser persistidos de forma consistente.
5. O status inicial previsto no material é `PENDENTE`.
