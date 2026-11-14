# Modelo de relatório de bug

## Objetivo

Padroniza como um bug é escrito e classificado no Tarrafa, para que quem corrige consiga reproduzir o problema sem precisar perguntar nada.

## Bugs registrados

Nenhum bug foi aberto entre 09/11/2026 e 12/11/2026: nenhum dos 123 casos executados falhou.

| Gravidade | Abertos | Fechados |
|---|---|---|
| Crítica | 0 | 0 |
| Alta | 0 | 0 |
| Média | 0 | 0 |
| Baixa | 0 | 0 |

### Observações que não viraram bug

Ficaram registradas no [Registro de execução](./registro-de-execucao.md) como melhorias ou ajustes opcionais, pois nenhum caso falhou por causa delas. Se a equipe decidir tratá-las, cada uma pode virar uma issue de gravidade **Baixa** usando o modelo abaixo.

| Observação | Caso relacionado | Classificação |
|---|---|---|
| Aba aberta continua mostrando dados antigos depois que outra aba sai da conta ou troca de conta | CT-PED-19 (passou) | Melhoria: recarregar a página ao detectar a saída em outra aba |
| `index.html` declara `lang="en"` com conteúdo em português | — | Melhoria: usar `pt-BR` |
| Aviso "A form field element should have an id or name attribute" no DevTools | — | Melhoria: acrescentar `id` ou `name` aos campos |
| Frase da categoria "Do mar e da brasa" com redação possivelmente incorreta | CT-CAR-04 | Ajuste de conteúdo opcional |
| Desempenho baixo no Lighthouse em ambiente local (no site publicado, notas excelentes) | VIS-26 | Sem ação: efeito do ambiente local |

## Modelo

```markdown
## BUG-000: título curto e direto

**Gravidade:** Crítica / Alta / Média / Baixa
**Prioridade sugerida:** Urgente / Alta / Média / Baixa
**Caso de teste:** CT-XXX-00 (se houver)
**Regra de negócio:** RN00 (se houver)

### Ambiente
- Data e hora:
- Frontend: https://tarrafa-bistro.vercel.app
- Commit no ar (Vercel e Render):
- Navegador e versão:
- Dispositivo e tamanho da tela:
- Perfil usado: visitante / cliente / admin

### Passos para reproduzir
1.
2.
3.

### Resultado esperado

### Resultado obtido

### Frequência
Sempre / Às vezes (quantas vezes em quantas tentativas) / Uma vez só

### Evidências
- Print ou vídeo:
- Mensagem do console (F12):
- Requisição que falhou (Network): método, rota e código de resposta
- Trecho do log do Render (sem dados pessoais):

### Observações
```

## Gravidade

| Nível | Quando usar | Exemplo |
|---|---|---|
| Crítica | O sistema para ou há risco de segurança ou perda de dados | Ninguém consegue logar; cliente vê pedido de outro; erro apaga dados |
| Alta | Uma função principal não funciona e não há contorno | Não é possível confirmar pedido; admin não consegue mudar status |
| Média | Função com problema, mas há contorno | Filtro de status não funciona, mas dá para ver a lista inteira |
| Baixa | Problema visual ou de texto | Fonte errada em uma tela, texto desalinhado, erro de ortografia |

**Gravidade** é o tamanho do dano. **Prioridade** é a urgência de corrigir, e quem decide é a equipe.

## Boas práticas

- Um bug por relatório, com título que diga o que acontece e onde.
- Passos curtos e numerados, repetidos pelo menos duas vezes e em aba anônima.
- Sem senhas, tokens ou dados pessoais reais (usar `***`).
- Antes de abrir, conferir as [Observações para o QA](./observacoes-para-o-qa.md).
- Depois da correção, repetir o caso de teste e o [Checklist de regressão](./checklist-de-regressao.md) antes de fechar o bug.
- Bugs são abertos como Issues no GitHub, com os rótulos `bug` e `qa`.
