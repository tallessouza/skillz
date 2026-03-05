---
name: rs-discover-devtools-analise
description: "Applies browser DevTools inspection techniques when debugging CSS layout issues, analyzing box model, or verifying padding/margins. Use when user asks to 'debug layout', 'inspect element', 'check padding', 'fix CSS spacing', 'open DevTools', or 'analyze box model'. Make sure to use this skill whenever diagnosing visual layout discrepancies or verifying CSS properties on elements. Not for writing new CSS from scratch, JavaScript debugging, or network/performance profiling."
---

# Analisando Layout com DevTools

> Use a ferramenta de desenvolvedor do navegador para verificar se o CSS aplicado corresponde ao design esperado, antes de alterar codigo.

## Rules

1. **Inspecione antes de editar CSS** — abra DevTools e verifique o estado atual do elemento, porque muitas vezes o problema ja esta visivel no box model sem precisar ler todo o CSS
2. **Identifique estilos injetados** — plugins (Grammarly, Live Server) e o proprio browser (user agent styles) injetam estilos e atributos que voce nao escreveu, porque confundir estilos injetados com os seus causa debugging desnecessario
3. **Use o box model visual** — passe o mouse sobre elementos no painel Elements para ver margin, border, padding e content com cores distintas, porque isso revela espacamentos invisiveis instantaneamente
4. **Verifique a origem do estilo** — DevTools mostra de onde vem cada regra (seu arquivo, user agent, plugin), porque saber a origem determina onde corrigir
5. **Use a aba Computed para valores finais** — quando ha muitas regras cascateando, Computed mostra o valor final aplicado com filtro por propriedade, porque elimina ambiguidade da cascata
6. **Leia os warnings do DevTools** — alertas como "not supported by Firefox" indicam problemas de compatibilidade antes que usuarios reportem

## Steps

### Step 1: Abrir DevTools
- Botao direito → Inspect (ou Inspecionar)
- Atalhos: `F12`, `Cmd+Option+I` (Mac), `Ctrl+Shift+I` (Windows/Linux)
- A ferramenta abre na ultima aba selecionada

### Step 2: Selecionar o elemento
- Clique no elemento no painel Elements, ou
- Use o seletor de elementos (icone de cursor no canto superior esquerdo do DevTools)
- Ao passar o mouse, o navegador destaca o elemento com cores do box model

### Step 3: Analisar o Box Model
- Role ate a secao "Box Model" no painel Styles
- Identifique as 4 camadas com cores:
  - **Margin** (externo, laranja)
  - **Border** (borda)
  - **Padding** (preenchimento, verde)
  - **Content** (conteudo, azul)
- Compare os valores com o design esperado

### Step 4: Verificar origem dos estilos
- No painel Styles, cada regra mostra o arquivo de origem
- `user agent stylesheet` = estilo padrao do navegador (ex: `div` tem `display: block`)
- `injected stylesheet` = plugin ou extensao
- `seu-arquivo.css:linha` = seu codigo

### Step 5: Usar Computed para filtrar
- Va na aba **Computed**
- Use o campo de filtro para buscar propriedades especificas (ex: `display`, `padding`)
- Mostra o valor final calculado apos toda a cascata CSS

### Step 6: Interpretar warnings
- DevTools exibe avisos de compatibilidade (ex: `backdrop-filter` nao suportado em Firefox)
- Clique nos links fornecidos para documentacao
- Use isso como fonte de aprendizado continuo

## Output format

Ao diagnosticar um problema de layout, reporte:
```
Elemento: .container
Esperado: padding lateral de 24px
Encontrado: padding 0 (nenhum padding aplicado)
Origem: nenhuma regra de padding no styles.css
Correcao: adicionar `padding: 0 24px` no seletor .container
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Espacamento nao bate com o design | Inspecione o box model do elemento e dos pais |
| Estilo aparece que voce nao escreveu | Verifique se e user agent ou plugin injetado |
| Propriedade nao funciona | Cheque warnings no DevTools sobre compatibilidade |
| Valor CSS parece errado | Use aba Computed com filtro pela propriedade |
| Layout quebra ao redimensionar | Lembre que viewport muda o comportamento — isso e esperado sem media queries |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Alterar CSS as cegas ate funcionar | Inspecionar o elemento primeiro no DevTools |
| Ignorar estilos que voce nao reconhece | Verificar se sao de plugins ou user agent |
| Debugar so lendo o arquivo CSS | Usar DevTools para ver o estado real renderizado |
| Ignorar warnings do DevTools | Ler e entender os alertas de compatibilidade |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre viewport, box model visual e estilos injetados
- [code-examples.md](references/code-examples.md) — Exemplos praticos de inspecao e correcao via DevTools