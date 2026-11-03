# Docker e backend

## Motivo

O backend do Tarrafa é publicado no Render dentro de um contêiner Docker. O Dockerfile descreve como compilar o projeto e como iniciar a aplicação. Este documento explica cada parte e mostra como rodar o backend na máquina local.

## Tecnologias

| Item | Versão / detalhe | Onde aparece |
|---|---|---|
| Java | 21 | `pom.xml` (`java.version`) |
| Spring Boot | 3.3.5 | `pom.xml` (parent) |
| Maven | 3.9 (na imagem de build) | `Dockerfile` |
| Banco | PostgreSQL (driver `postgresql`) | `pom.xml` |
| JWT | biblioteca jjwt 0.12.6 | `pom.xml` |

Dependências principais do `pom.xml`: `spring-boot-starter-web`, `data-jpa`, `validation`, `security`, `websocket`, o driver do PostgreSQL e `spring-boot-starter-test` (só para testes).

## O Dockerfile

Arquivo: `backend/Dockerfile`. Ele tem duas etapas.

```dockerfile
# etapa 1: compila o projeto
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q package -DskipTests

# etapa 2: roda so o jar, numa imagem menor
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseSerialGC", "-XX:MaxRAMPercentage=70", "-jar", "app.jar"]
```

### Etapa 1: build

- Usa uma imagem com Maven 3.9 e Java 21 (Eclipse Temurin).
- Copia só o `pom.xml` e baixa as dependências (`dependency:go-offline`). Assim o Docker guarda essa camada em cache e não baixa tudo de novo se só o código mudar.
- Copia a pasta `src` e gera o `.jar` com `mvn package`.
- O parâmetro `-DskipTests` pula os testes. Ou seja, **o deploy não roda nenhum teste**.

### Etapa 2: execução

- Usa uma imagem só com o JRE 21, que é menor porque não tem Maven nem código-fonte.
- Copia o `.jar` gerado na etapa 1 para `app.jar`.
- `EXPOSE 8080` é só informativo. A porta real vem da variável `PORT` (`server.port=${PORT:8080}`).
- O comando de início roda o `.jar` com duas opções de memória pensadas para o plano Free: `-XX:+UseSerialGC` (coletor de lixo simples, que gasta pouca memória) e `-XX:MaxRAMPercentage=70` (limita o Java a 70% da memória do contêiner).

### .dockerignore

O arquivo `backend/.dockerignore` ignora `target` e `.env`. Assim a pasta de build local e as senhas não vão para dentro da imagem.

## Como o Render usa o Dockerfile

1. O Render detecta um commit novo na branch `main`.
2. Entra no diretório `sistema-cardapio-pedidos/backend` (configurado no serviço).
3. Monta a imagem com o `Dockerfile`.
4. Sobe o contêiner com as variáveis de ambiente cadastradas no painel.
5. Chama o Health Check `/api/categorias` para saber se a aplicação subiu.

## Como executar localmente

Pré-requisitos: Java 21, Maven 3.9 e um arquivo `.env` configurado (ver [Ambiente e variáveis](./ambiente-e-variaveis.md)).

Conferir as versões:

```bash
java -version
mvn -version
```

Iniciar o backend (dentro da pasta `backend`):

```bash
cd backend
mvn spring-boot:run
```

Testar:

```bash
curl http://localhost:8080/api/categorias
curl http://localhost:8080/api/produtos
```

Rodar os testes unitários:

```bash
mvn test
```

Gerar o `.jar` e rodar sem o Maven:

```bash
mvn package -DskipTests
java -jar target/*.jar
```

### Rodando com Docker (opcional)

Pendente de verificação: estes comandos são os padrões do Docker e não foram testados na máquina local do projeto.

```bash
cd backend
docker build -t tarrafa-backend .
docker run --rm -p 8080:8080 --env-file ../.env tarrafa-backend
```

O `--env-file` do Docker lê linhas `CHAVE=valor` sem aspas, que é o mesmo formato do `.env` do projeto.

## Segurança

- Não coloque senhas dentro do Dockerfile. Elas entram só como variáveis de ambiente na hora de rodar.
- O `.dockerignore` já evita copiar o `.env` para a imagem.
- A imagem final só tem o JRE e o `.jar`, sem o código-fonte.

## Observação

- Os testes não rodam no build do Docker (`-DskipTests`). Para rodar, use `mvn test` na máquina local. Os testes existentes são unitários (classes `PedidoServiceTest`, `FechamentoServiceTest` e `StatusPedidoTest`) e não usam o banco.
- O build no Render pode demorar, principalmente na primeira vez, por causa do download das dependências do Maven.
- O `spring.jpa.show-sql=true` faz o backend imprimir todo SQL nos logs, o que deixa o log grande.
- **Fuso horário (risco conhecido):** o backend usa `LocalDate.now()` para decidir o "dia" do fechamento. O Dockerfile não define fuso horário, então o contêiner provavelmente usa UTC, e o dia viraria 3 horas antes do horário de Brasília (às 21h daqui). Pendente de verificação: o fuso real do contêiner no Render. Recomendação sem mexer no código: cadastrar no Render a variável `TZ` com o valor `America/Sao_Paulo`.
