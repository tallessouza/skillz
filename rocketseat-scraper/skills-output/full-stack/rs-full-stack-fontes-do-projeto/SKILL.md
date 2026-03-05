---
name: rs-full-stack-fontes-do-projeto
description: "Applies Google Fonts setup and CSS typography variables when configuring project fonts. Use when user asks to 'add a font', 'setup typography', 'configure Google Fonts', 'create font variables', or 'define text styles in CSS'. Enforces font shorthand pattern, CSS custom properties for text sizes, and proper preconnect ordering in HTML head. Make sure to use this skill whenever setting up fonts or typography systems in web projects. Not for icon fonts, font-face declarations, or variable fonts configuration."
---

# Fontes do Projeto

> Definir tipografia do projeto usando Google Fonts com variaveis CSS e a propriedade font shorthand.

## Rules

1. **Preconnect primeiro, fonte depois** — coloque os `<link rel="preconnect">` antes do `<link>` da fonte no `<head>`, porque o preconnect acelera o carregamento estabelecendo conexao antecipada
2. **Importe apenas os pesos usados** — desabilite todos e habilite somente os que o projeto usa (ex: Regular 400 e Bold 700), porque cada peso adicional aumenta o tempo de carregamento
3. **Use variaveis CSS para tipografia** — defina `--font-family`, `--text-lg`, `--text-md`, `--text-sm`, `--text` no `:root`, porque centraliza mudancas e garante consistencia
4. **Use font shorthand** — `font: bold 32px/125% var(--font-family)` ao inves de propriedades separadas, porque o shorthand exige font-size e font-family (obrigatorios) e aceita weight e line-height numa linha so
5. **Observe o projeto, nao apenas o style-guide** — o style-guide e um guia, mas os detalhes reais estao nos componentes do design, porque tamanhos e pesos podem variar entre o guia e o uso real
6. **Line-height pode ser porcentagem ou multiplicador** — `150%` e `1.5` sao equivalentes (16px * 1.5 = 24px), porque CSS aceita ambos os formatos

## Steps

### Step 1: Adicionar fonte no HTML

```html
<head>
  <!-- Preconnect primeiro -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- Outros meta tags e title aqui -->

  <!-- Fonte por ultimo no head -->
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
    rel="stylesheet"
  />
</head>
```

### Step 2: Definir variaveis de tipografia no global.css

```css
:root {
  --font-family: "Poppins", sans-serif;
  --text-lg: bold 32px/125% var(--font-family);
  --text-md: 14px/175% var(--font-family);
  --text-sm: 14px/175% var(--font-family);
  --text: 16px/1.5 var(--font-family);
}
```

### Step 3: Aplicar usando font shorthand

```css
body {
  font: var(--text);
}

h1 {
  font: var(--text-lg);
}
```

## Example

**Before (propriedades separadas e sem variaveis):**
```css
body {
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
}

h1 {
  font-family: "Poppins", sans-serif;
  font-size: 32px;
  line-height: 125%;
  font-weight: 700;
}
```

**After (com variaveis e shorthand):**
```css
:root {
  --font-family: "Poppins", sans-serif;
  --text-lg: bold 32px/125% var(--font-family);
  --text: 16px/1.5 var(--font-family);
}

body {
  font: var(--text);
}

h1 {
  font: var(--text-lg);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto usa 1-2 pesos | Google Fonts com pesos especificos |
| Projeto usa 3+ pesos | Considere hospedar a fonte localmente |
| Style-guide mostra tamanho diferente do layout | Confie no layout, nao no style-guide |
| Line-height em pixels no Figma | Converta para multiplicador (24px / 16px = 1.5) |
| Font shorthand com weight regular | Omita o weight, 400 ja e o padrao |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Importar todos os pesos da fonte | Selecionar apenas Regular e Bold (ou o que o projeto usa) |
| `font-size: 16px; line-height: 24px; font-family: ...` separados | `font: 16px/1.5 var(--font-family)` shorthand |
| Hardcodar `"Poppins"` em cada seletor | Usar `var(--font-family)` definido no `:root` |
| Colocar `<link>` da fonte antes dos preconnects | Preconnects primeiro, fonte depois |
| Copiar CSS inteiro do Figma sem filtrar | Extrair apenas font-family, size, weight e line-height |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre font shorthand, preconnect e observacao de projeto
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes