# Diagrama de Arquitetura

```mermaid
flowchart TB
    subgraph Client["Camada de apresentação"]
      Browser[Navegador]
      Front[Frontend React + Vite + TypeScript]
      Browser --> Front
    end

    subgraph Backend["Backend — Java 21 / Spring Boot"]
      Controller[Controllers REST]
      Service[Services / regras de negócio]
      Repository[Repositories]
      Security[Segurança e autorização]
      Controller --> Service
      Service --> Repository
      Security -. protege .-> Controller
    end

    DB[(PostgreSQL / Neon)]

    Front <-->|HTTP + JSON| Controller
    Repository <--> DB

    Front -. hospedagem .-> Vercel[Vercel]
    Backend -. hospedagem .-> Render[Render]
```

## Responsabilidades

- **Frontend:** interface e comunicação HTTP.
- **Controllers:** entrada e saída da API.
- **Services:** regras de negócio.
- **Repositories:** persistência.
- **Security:** autenticação e autorização, conforme implementadas.
- **PostgreSQL:** armazenamento persistente.

O diagrama é lógico. Detalhes como rede, CORS, build, health checks, containers e variáveis de ambiente devem ser documentados conforme os arquivos reais de deploy.