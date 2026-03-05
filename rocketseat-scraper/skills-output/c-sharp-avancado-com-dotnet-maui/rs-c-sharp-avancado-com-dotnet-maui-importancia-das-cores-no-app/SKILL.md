---
name: rs-csharp-maui-cores-app
description: "Enforces color palette organization and accessibility standards when designing or implementing app themes. Use when user asks to 'define colors', 'create a theme', 'set up dark mode', 'organize color palette', or 'choose app colors'. Applies rules: semantic color naming by category not color name, WCAG AAA contrast compliance, balanced palette size, dark backgrounds as dark gray not pure black. Make sure to use this skill whenever defining or reviewing color systems for apps or sites. Not for icon design, typography, or layout decisions."
---

# Organizacao de Cores no App

> Nomeie cores pela categoria semantica (highlight, danger), nunca pelo nome da cor (azul, vermelho), e garanta contraste WCAG entre fundo e conteudo.

## Rules

1. **Nomeie por categoria, nao por cor** — `highlightColor` nao `azulTurquesa`, porque se trocar de azul para laranja, basta mudar o hexadecimal sem cacar referencias no codigo
2. **Mantenha paleta equilibrada** — nem cores demais (tudo chama atencao, usuario fica perdido) nem de menos (app monótono e chato)
3. **Consistencia entre paginas** — o mesmo tipo de acao usa a mesma cor em todas as telas, porque isso cria modelo mental no usuario
4. **Contraste WCAG AAA** — verifique sempre a diferenca entre cor de fundo e cor de conteudo (texto/imagem), porque contraste baixo impede leitura para pessoas com deficiencia visual
5. **Dark mode usa cinza escuro, nao preto puro** — `#3D3C40` nao `#000000`, porque preto puro nao existe na natureza e causa desconforto visual
6. **Defina variaveis para Light e Dark mode separadamente** — cada categoria de cor tem dois valores, um por tema

## How to write

### Categorias semanticas de cores

```xml
<!-- CORRETO: nomes por categoria -->
<Color x:Key="HighlightColor">#3B82F6</Color>
<Color x:Key="DangerActionColor">#EF4444</Color>
<Color x:Key="PageBackgroundColor">#FFFFFF</Color>
<Color x:Key="PrimaryColor">#000000</Color>
<Color x:Key="SecondaryColor">#FFFFFF</Color>
<Color x:Key="LineColor">#00000033</Color>
<Color x:Key="PlaceholderColor">#00000080</Color>
```

### Dark mode com cinza escuro

```xml
<!-- CORRETO: cinza escuro tendendo ao preto -->
<Color x:Key="PageBackgroundColor">#3D3C40</Color>

<!-- ERRADO: preto puro -->
<Color x:Key="PageBackgroundColor">#000000</Color>
```

## Example

**Before (nomes pela cor):**
```csharp
var azulTurquesa = Color.FromHex("#3B82F6");
var vermelhoEscuro = Color.FromHex("#EF4444");
var pretoPuro = Color.FromHex("#000000");
```

**After (nomes pela categoria):**
```csharp
var highlightColor = Color.FromHex("#3B82F6");
var dangerActionColor = Color.FromHex("#EF4444");
var pageBackgroundDark = Color.FromHex("#3D3C40");
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Botao de acao destaque (CTA) | Use `HighlightColor` |
| Acao perigosa (deletar conta, remover item) | Use `DangerActionColor` |
| Fundo da pagina dark mode | Cinza escuro (#3D3C40), nunca preto puro |
| Fundo da pagina light mode | Branco ou cinza bem clarinho |
| Escolhendo cor para um fundo | Valide contraste WCAG AAA com o texto |
| Quer trocar cor do app no futuro | Troque o hexadecimal da categoria, nao o nome |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `var azulTurquesa = "#3B82F6"` | `var highlightColor = "#3B82F6"` |
| `var vermelhoEscuro = "#EF4444"` | `var dangerActionColor = "#EF4444"` |
| Fundo dark mode `#000000` | Fundo dark mode `#3D3C40` |
| Cor diferente para botao em cada pagina | Mesma categoria de cor para mesma acao |
| Escolher cor "porque e bonita" sem checar contraste | Validar WCAG AAA antes de usar |
| 15+ cores na paleta | Paleta equilibrada com categorias claras |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
