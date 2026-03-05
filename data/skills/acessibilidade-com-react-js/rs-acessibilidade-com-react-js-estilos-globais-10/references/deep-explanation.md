# Deep Explanation: Estilos Globais Acessiveis

## Por que resetar estilos?

Cada navegador aplica um "user agent stylesheet" diferente — margens no `body`, padding em listas, bordas em inputs. O reset com `* { margin: 0; padding: 0; box-sizing: border-box; }` garante uma base identica em todos os navegadores.

O `box-sizing: border-box` e especialmente importante: sem ele, adicionar `padding` ou `border` a um elemento faz ele crescer alem da largura definida. Com `border-box`, padding e border sao incluidos no tamanho total, tornando o layout previsivel.

## Por que incluir elementos de formulario na font-family?

O instrutor destaca que `input`, `button`, `textarea` e `select` nao herdam a fonte do `body` por padrao nos navegadores. Isso significa que mesmo definindo `font-family: 'Roboto'` no body, um `<button>` vai usar a fonte padrao do sistema. A solucao e listar explicitamente esses elementos:

```css
body, input, button, textarea, select {
  font-family: 'Roboto', sans-serif;
}
```

## O problema de contraste identificado

O instrutor demonstra um problema real de acessibilidade: ao definir `background-color: #121214` (cinza muito escuro, quase preto) sem definir uma cor de texto clara, o texto herda `color: #000` (preto), resultando em contraste praticamente inexistente (~1.4:1).

Ao inspecionar o elemento no DevTools, o navegador mostra um aviso de contraste. Isso e uma funcionalidade nativa do Chrome DevTools que calcula o ratio de contraste entre texto e background conforme as diretrizes WCAG.

### Niveis de contraste WCAG:
- **AA (minimo):** 4.5:1 para texto normal, 3:1 para texto grande
- **AAA (ideal):** 7:1 para texto normal, 4.5:1 para texto grande

O background `#121214` com texto `#e1e1e6` atinge ratio ~11:1, superando ate o nivel AAA.

## Insight do instrutor

O instrutor intencionalmente mostra o problema antes de corrigi-lo: "A gente pode ver que isso daqui ja nao e acessivel". Essa abordagem pedagogica demonstra que acessibilidade deve ser considerada desde a primeira linha de CSS, nao como um ajuste posterior. Cada decisao de estilo tem implicacoes de acessibilidade.

## Fallback de fontes

O uso de `sans-serif` como fallback apos `'Roboto'` e uma pratica essencial. Se a Google Font nao carregar (conexao lenta, bloqueio de CDN, modo offline), o navegador usa a fonte sans-serif padrao do sistema, mantendo a legibilidade.