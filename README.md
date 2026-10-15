# Sistema de Cardápio e Pedidos - Tarrafa Bistrô do Mar

Projeto da disciplina de Programação Orientada a Objetos.

## Como rodar o backend

1. Crie o banco no Neon e rode `database/schema.sql` e depois `database/seed.sql` no SQL Editor.
2. Copie `.env.example` para `.env` na raiz e preencha com os seus dados.
3. Na pasta `backend`, rode `mvn spring-boot:run`.
4. Teste em `http://localhost:8080/api/categorias` e `http://localhost:8080/api/produtos`.

## Partes prontas

- Parte 0: estrutura de pastas e banco de dados
- Parte 1: categorias e produtos (listagem)
- Parte 2: cadastro, login e JWT
