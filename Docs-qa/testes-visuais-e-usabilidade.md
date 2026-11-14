# Testes visuais e de usabilidade

## Objetivo

Reúne os 29 testes de aparência e usabilidade do Tarrafa: fonte, telas, celular, navegadores, acessibilidade básica e desempenho percebido. Foram executados em 12/11/2026, no site publicado e no ambiente local, em Chrome, Firefox, Edge e Chrome no celular.

**Resultado:** 28 casos passaram e 1 foi parcial (VIS-20, sem o Safari). Nenhum caso falhou.

## Fonte

A referência é o arquivo `frontend/src/index.css`, nas variáveis `--fonte-titulo` (títulos) e `--fonte-texto` (textos). A conferência foi feita no painel de elementos do navegador (F12, aba Elements, `font-family` em Computed).

Casos:

| ID | Pri. | Cenário | Como testar | Resultado esperado | Resultado | Data | Observação |
|---|---|---|---|---|---|---|---|
| VIS-01 | A | Fonte definida no CSS aplicada | Abrir cada tela e inspecionar um título e um texto (F12, aba Elements, Computed, `font-family`) | A primeira fonte da lista é a definida em `--fonte-titulo` e `--fonte-texto`; nenhuma tela usa outra fonte | Passou | 12/11/2026 |  |
| VIS-02 | A | Fonte carrega de verdade | Abrir em aba anônima e, no DevTools (Network, filtro Font), ver os arquivos de fonte | Arquivos carregados com status 200 | Passou | 12/11/2026 |  |
| VIS-03 | M | Fonte reserva | Bloquear a fonte no DevTools (ou testar sem internet para a fonte) | O texto continua legível com a fonte reserva, sem layout quebrado | Passou | 12/11/2026 |  |
| VIS-04 | A | Acentos e símbolos | Ver textos com `ç ã é ô` e o símbolo `R$` | Todos aparecem corretamente | Passou | 12/11/2026 |  |
| VIS-05 | M | Peso e tamanho | Comparar títulos, textos e preços | Hierarquia clara; textos fáceis de ler | Passou | 12/11/2026 |  |
| VIS-06 | M | Nada cortado | Ver nomes longos, como "Camurim em crosta de sal, para dois" e "Harmonização sem álcool (degustação)" | Texto quebra de linha sem cortar nem sobrepor | Passou | 12/11/2026 |  |
| VIS-07 | B | Efeito de troca de fonte | Recarregar a página várias vezes | Sem "piscada" forte entre a fonte reserva e a fonte final | Passou | 12/11/2026 |  |

## Telas e layout

| ID | Pri. | Cenário | Como testar | Resultado esperado | Resultado | Data | Observação |
|---|---|---|---|---|---|---|---|
| VIS-08 | A | Todas as telas abrem | Visitar `/`, `/entrar`, `/cadastro`, `/meus-pedidos`, `/admin`, `/admin/pedidos`, `/admin/produtos` e `/admin/categorias` | Nenhuma tela em branco ou com erro | Passou | 12/11/2026 |  |
| VIS-09 | M | Alinhamento e espaçamento | Olhar cada tela com atenção | Sem elementos sobrepostos ou desalinhados | Passou | 12/11/2026 |  |
| VIS-10 | M | Estados vazios | Cliente novo abrindo "Meus pedidos" | Mensagem clara, sem tela quebrada | Passou | 12/11/2026 |  |
| VIS-11 | M | Mensagens de erro | Provocar um erro (senha errada, campo vazio) | A mensagem aparece de forma visível e em português | Passou | 12/11/2026 |  |
| VIS-12 | B | Logo e cores | Conferir o logo e as cores em todas as telas | Consistentes | Passou | 12/11/2026 |  |

## Celular e tamanhos de tela

Verificados pelo modo celular do DevTools e em um celular com Chrome.

| ID | Pri. | Largura | Resultado esperado | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| VIS-13 | A | 360 px (celular pequeno) | Cardápio, login e pedido usáveis, sem barra de rolagem horizontal | Passou | 12/11/2026 |  |
| VIS-14 | M | 768 px (tablet) | Layout se adapta | Passou | 12/11/2026 | No celular, os pedidos são conferidos na tela de pedidos; a montagem do pedido não aparece junto da conferência. Vale também para 360 px (VIS-13). |
| VIS-15 | M | 1366 px e 1920 px (computador) | Conteúdo bem distribuído | Passou | 12/11/2026 |  |
| VIS-16 | M | Girar o celular (retrato e paisagem) | Nada quebra | Passou | 12/11/2026 |  |
| VIS-17 | A | Botões e campos no celular | Dá para tocar sem acertar o vizinho | Passou | 12/11/2026 |  |

## Navegadores

| ID | Pri. | Navegador | Resultado esperado | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| VIS-18 | A | Chrome (versão atual) | Tudo funciona | Passou | 12/11/2026 |  |
| VIS-19 | M | Firefox (versão atual) | Tudo funciona | Passou | 12/11/2026 |  |
| VIS-20 | M | Navegador do celular (Chrome ou Safari) | Tudo funciona, inclusive o tempo real | Parcial | 12/11/2026 | Resultado parcial: o navegador Safari não foi testado. |
| VIS-21 | B | Edge | Tudo funciona | Passou | 12/11/2026 |  |

## Acessibilidade básica

| ID | Pri. | Cenário | Como testar | Resultado esperado | Resultado | Data | Observação |
|---|---|---|---|---|---|---|---|
| VIS-22 | M | Contraste | Olhar textos claros sobre fundo claro, ou escuros sobre escuro | Textos legíveis (tentar a ferramenta de contraste do DevTools) | Passou | 12/11/2026 |  |
| VIS-23 | M | Teclado | Navegar no login com a tecla Tab e enviar com Enter | Foco visível e formulário funciona | Passou | 12/11/2026 |  |
| VIS-24 | M | Zoom | Aumentar o zoom do navegador para 200% | Conteúdo continua acessível | Passou | 12/11/2026 |  |
| VIS-25 | B | Imagens | Passar o leitor de acessibilidade ou inspecionar as fotos | As imagens importantes têm texto alternativo | Passou | 12/11/2026 |  |
| VIS-26 | B | Lighthouse | Rodar o Lighthouse (DevTools) na página inicial | Anotar as notas de desempenho e acessibilidade (não há meta oficial) | Passou | 12/11/2026 | Desempenho baixo no ambiente local; demais notas boas. site definitivo as notas foram excelentes |

## Desempenho percebido

| ID | Pri. | Cenário | Resultado esperado | Resultado | Data | Observação |
|---|---|---|---|---|---|---|
| VIS-27 | M | Primeiro acesso depois de um tempo parado | Pode demorar (Render e Neon Free). Anotar o tempo. Se passar de 1 minuto, abrir bug | Passou | 12/11/2026 |  |
| VIS-28 | M | Acessos seguintes | Respostas rápidas, a poucos segundos | Passou | 12/11/2026 |  |
| VIS-29 | B | Cardápio com imagens | Fotos não travam a rolagem | Passou | 12/11/2026 |  |

## Resumo

| Bloco | Casos | Passaram | Parciais |
|---|---|---|---|
| Fonte | 7 | 7 | 0 |
| Telas e layout | 5 | 5 | 0 |
| Celular e tamanhos de tela | 5 | 5 | 0 |
| Navegadores | 4 | 3 | 1 |
| Acessibilidade básica | 5 | 5 | 0 |
| Desempenho percebido | 3 | 3 | 0 |
| **Total** | **29** | **28** | **1** |

## Observações

- **Telas pequenas (VIS-13 e VIS-14):** no celular e no tablet, os pedidos são conferidos na tela de pedidos, e a montagem do pedido não aparece junto da conferência.
- **Safari (VIS-20):** não foi testado, por isso o caso ficou parcial. Chrome no celular funcionou, inclusive o tempo real.
- **Lighthouse (VIS-26):** desempenho baixo no ambiente local e demais notas boas. No site publicado, as notas foram excelentes.
- **Idioma e formulários:** o `index.html` declara `lang="en"` e o DevTools avisa sobre campos de formulário sem `id` ou `name`. Os dois pontos não afetam a aparência e estão na seção de observações do [Registro de execução](./registro-de-execucao.md).

