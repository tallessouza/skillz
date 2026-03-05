---
name: rs-full-stack-valores-unidades-medida
description: "Applies correct CSS values and units when writing stylesheets. Use when user asks to 'style a component', 'write CSS', 'add styles', 'change font size', 'set colors', or any CSS property assignment. Ensures proper data types (color, length, percentage, keyword) for each property and guides consulting MDN documentation. Make sure to use this skill whenever generating CSS code that assigns values to properties. Not for JavaScript logic, HTML structure, or CSS selectors."
---

# Valores e Unidades de Medida no CSS

> Toda propriedade CSS aceita valores de tipos de dados especificos — conheca os tipos e consulte a documentacao para cada propriedade.

## Rules

1. **Identifique o tipo de dado da propriedade** — antes de atribuir um valor, verifique qual tipo de dado a propriedade aceita (color, length, number, keyword, percentage), porque atribuir o tipo errado causa falha silenciosa
2. **Use a documentacao como parceira constante** — pesquise `mdn {property-name}`, va na secao "Syntax" para ver os valores aceitos, porque ninguem memoriza todas as propriedades e valores
3. **Diferencie keywords de valores genericos** — keywords como `uppercase`, `capitalize` sao especificas de uma propriedade (text-transform), nao funcionam em outras propriedades
4. **Length sempre leva unidade** — `font-size: 24px`, nunca `font-size: 24` sozinho (exceto zero), porque length e um numero seguido de unidade de medida
5. **Hover no editor revela o data type** — o sinal `<nome>` na tooltip indica o tipo de dado esperado, use isso como atalho antes de ir na documentacao
6. **Nao memorize, consulte** — o estudo e constante, volte na documentacao quantas vezes precisar

## Tipos de dados CSS

| Tipo | Exemplo de propriedade | Valores |
|------|----------------------|---------|
| `<color>` | `color`, `background-color` | named colors (`blue`), hex (`#ff0000`), rgb, hsl |
| `<length>` | `font-size`, `margin`, `padding` | numero + unidade (`24px`, `2rem`, `1.5em`) |
| `<number>` | `letter-spacing`, `line-height` | numero puro (`1.5`, `7`) |
| `<percentage>` | `width`, `font-size` | numero + `%` (`50%`, `100%`) |
| `<keyword>` | `text-transform`, `display` | palavras-chave especificas (`uppercase`, `flex`) |

## How to discover values for any property

### Passo 1: Hover no editor
```
Descanse o mouse sobre a propriedade no VS Code.
A tooltip mostra a sintaxe com <data-type> entre sinais < >.
```

### Passo 2: Pesquise na MDN
```
Google: "mdn {nome-da-propriedade}"
→ Abra a pagina
→ Va direto na secao "Syntax"
→ Veja os tipos aceitos
```

### Passo 3: Aprofunde se necessario
```
Na MDN, clique no tipo de dado (ex: <color>) para ver detalhes.
Exemplos e explicacoes adicionais estarao la.
```

## Example

**Before (valor incorreto para a propriedade):**
```css
h1 {
  color: blue;
  font-size: large;      /* funciona, mas e keyword — prefira length */
  letter-spacing: 7;     /* number sem contexto claro */
  text-transform: none;  /* ok, mas poderia usar uppercase */
}
```

**After (valores com tipos de dados corretos e intencionais):**
```css
h1 {
  color: blue;                /* <color>: named color */
  font-size: 24px;            /* <length>: numero + unidade */
  letter-spacing: 7px;        /* <length>: com unidade explicita */
  text-transform: uppercase;  /* <keyword>: especifica do text-transform */
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nao sabe que valores uma propriedade aceita | Pesquise `mdn {propriedade}` → secao Syntax |
| Editor mostra `<length>` na tooltip | Use numero + unidade (px, rem, em, vh) |
| Editor mostra keyword sem `< >` | Sao opcoes fixas daquela propriedade |
| Quer explorar opcoes de cor | Pesquise `mdn color value` — named, hex, rgb, hsl |
| Propriedade nova desconhecida | Hover no editor → MDN → secao Syntax → experimente |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Chutar valores sem verificar o tipo | Consulte a MDN para a propriedade |
| `font-size: 24` (sem unidade) | `font-size: 24px` |
| Usar keyword de uma propriedade em outra | Verifique keywords aceitas por cada propriedade |
| Tentar memorizar todos os valores | Consulte a documentacao constantemente |
| Ignorar a tooltip do editor | Use-a como primeiro recurso rapido |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-valores-e-unidades-de-medida/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-valores-e-unidades-de-medida/references/code-examples.md)
