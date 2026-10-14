# Requisitos do Sistema

**Projeto:** Sistema de Cardápio e Pedidos — Tarrafa Bistrô do Mar  
**Objetivo:** organizar o cardápio, centralizar pedidos e permitir o acompanhamento do seu andamento.

> Este documento consolida os requisitos descritos no material acadêmico do projeto. Antes da entrega final, a equipe deve verificar quais funcionalidades já estão implementadas e ajustar o status de cada requisito.

## 1. Atores

### A01 — Cliente
Pessoa que consulta o cardápio, cria pedidos e acompanha os próprios pedidos.

### A02 — Administrador
Responsável por manter categorias e produtos, consultar pedidos e atualizar seu status.

### A03 — Serviço de persistência
PostgreSQL utilizado pelo backend para armazenar e recuperar os dados. Não é um usuário humano, mas participa dos fluxos do sistema.

## 2. Requisitos funcionais

| ID | Requisito | Ator principal | Prioridade |
|---|---|---|---|
| RF01 | Permitir cadastro de usuário com nome, e-mail e senha. | Cliente | Alta |
| RF02 | Permitir login e validação das credenciais. | Cliente / Administrador | Alta |
| RF03 | Permitir logout/encerramento da sessão no fluxo implementado. | Cliente / Administrador | Média |
| RF04 | Proteger recursos restritos para usuários autenticados. | Sistema | Alta |
| RF05 | Diferenciar permissões de cliente e administrador. | Sistema | Alta |
| RF06 | Exibir o cardápio e os produtos disponíveis. | Cliente / Administrador | Alta |
| RF07 | Organizar produtos por categoria. | Cliente / Administrador | Alta |
| RF08 | Permitir que o administrador cadastre produtos. | Administrador | Alta |
| RF09 | Permitir que o administrador edite produtos existentes. | Administrador | Alta |
| RF10 | Permitir que o administrador remova produtos conforme as regras de integridade. | Administrador | Média |
| RF11 | Permitir ativar e desativar produtos. | Administrador | Alta |
| RF12 | Permitir gerenciar categorias. | Administrador | Média |
| RF13 | Permitir criar pedido associado ao usuário autenticado. | Cliente | Alta |
| RF14 | Permitir incluir produtos e quantidades no pedido. | Cliente | Alta |
| RF15 | Permitir alterar quantidades e remover itens antes da confirmação, se previsto no fluxo implementado. | Cliente | Alta |
| RF16 | Calcular o valor total do pedido com base nos itens e quantidades. | Sistema | Alta |
| RF17 | Permitir incluir observações no pedido. | Cliente | Média |
| RF18 | Permitir consultar os próprios pedidos e seus status. | Cliente | Alta |
| RF19 | Permitir ao administrador consultar os pedidos recebidos. | Administrador | Alta |
| RF20 | Permitir ao administrador atualizar o status dos pedidos respeitando transições válidas. | Administrador | Alta |

## 3. Requisitos não funcionais

| ID | Requisito | Critério / orientação |
|---|---|---|
| RNF01 | Segurança de credenciais | Senhas devem ser armazenadas com hash apropriado, nunca em texto puro. |
| RNF02 | Controle de acesso | A autorização deve ser validada no backend para cada operação protegida. |
| RNF03 | Integridade | Pedido e itens devem ser persistidos de forma consistente; o total deve ser calculado no servidor. |
| RNF04 | Usabilidade | Telas e mensagens devem orientar o usuário, inclusive em caso de erro ou carregamento. |
| RNF05 | Manutenibilidade | Separar responsabilidades de controller, service e repository, conforme a arquitetura do projeto. |
| RNF06 | Compatibilidade | A interface deve funcionar nos navegadores modernos definidos para o projeto. |
| RNF07 | Disponibilidade | A aplicação deve tratar falhas de comunicação com API ou banco sem expor informações sensíveis. |
| RNF08 | Configuração segura | Segredos devem ficar em variáveis de ambiente e fora do controle de versão. |
| RNF09 | Testabilidade | Funcionalidades críticas devem ter testes unitários, de integração ou de ponta a ponta adequados. |
| RNF10 | Documentação | Instruções de execução, requisitos e contrato da API devem acompanhar a evolução do código. |

## 4. Regras de negócio

### RN01 — Categoria e produto
Cada produto pertence a uma categoria. A integridade dessa associação deve ser mantida.

### RN02 — Disponibilidade
Produtos inativos não devem ser oferecidos para novos pedidos. O comportamento exato da consulta deve seguir a implementação.

### RN03 — Pedido associado ao usuário
O pedido deve ser vinculado ao usuário autenticado no servidor; não se deve confiar apenas em um identificador de usuário enviado pelo cliente.

### RN04 — Quantidade
A quantidade de cada item deve ser válida e positiva.

### RN05 — Preço histórico
Cada item do pedido deve guardar o preço unitário praticado no momento da compra, para que uma alteração futura do preço do produto não altere o histórico.

### RN06 — Total do pedido
O total deve ser calculado pelo backend a partir das quantidades e dos preços unitários válidos, não aceitando como fonte de verdade um total enviado pelo frontend.

### RN07 — Status inicial
O material do projeto descreve o status inicial como `PENDENTE`.

### RN08 — Fluxo de status
Fluxo previsto:
`PENDENTE → CONFIRMADO → EM PREPARAÇÃO → PRONTO → FINALIZADO`

### RN09 — Cancelamento
O material do projeto permite cancelamento quando o pedido está `PENDENTE` ou `CONFIRMADO`. A implementação deve impedir cancelamentos fora das transições autorizadas.

### RN10 — Permissões administrativas
Somente administradores autorizados podem gerenciar produtos/categorias e alterar status dos pedidos.

### RN11 — Acesso do cliente
O cliente deve consultar apenas os próprios pedidos, salvo regra diferente explicitamente aprovada e implementada.

### RN12 — Validação de entrada
Dados obrigatórios, formatos, existência de produtos e quantidades devem ser validados no backend.

## 5. Critérios de aceite sugeridos

- [ ] Um usuário consegue se cadastrar e autenticar com credenciais válidas.
- [ ] Credenciais inválidas não concedem acesso.
- [ ] Recursos administrativos são inacessíveis a um cliente comum.
- [ ] O cardápio apresenta os produtos disponíveis e suas categorias.
- [ ] Um pedido válido é associado ao usuário correto.
- [ ] O total do pedido é calculado no servidor.
- [ ] O preço histórico de um item permanece igual após alteração do preço do produto.
- [ ] Um cliente não consegue consultar pedidos de outro cliente.
- [ ] Alterações de status inválidas são recusadas.
- [ ] Erros de validação retornam respostas compreensíveis e não expõem segredos.

## 6. Observação sobre escopo e implementação

A lista acima documenta o escopo descrito no material acadêmico. Ela não comprova que todas as funcionalidades estejam implementadas. O Tech Lead e o QA devem comparar cada requisito com o código atual, registrar o status (implementado, parcial, pendente ou fora do escopo) e abrir Issues para divergências.
