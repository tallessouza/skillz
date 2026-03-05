---
name: rs-angular-trabalhando-com-svgs
description: "Applies SVG integration patterns in Angular components. Use when user asks to 'add an icon', 'use SVG in Angular', 'add FontAwesome icons', 'inline SVG in component', or 'optimize SVG loading'. Covers inline SVG vs file-based SVG trade-offs, dynamic color changes with fill attribute, and build output implications. Make sure to use this skill whenever working with SVGs or icons in Angular projects. Not for raster images (PNG/JPG), CSS-only icons, or non-Angular frameworks."
---

# Trabalhando com SVGs no Angular

> SVGs em Angular seguem duas estrategias: inline no HTML (dinamico, aumenta bundle) ou arquivo separado (estatico, carregamento paralelo).

## Rules

1. **SVG inline no HTML permite estilizacao dinamica** — use o atributo `fill` para mudar cores via property binding, porque o SVG faz parte do DOM do componente
2. **SVG como arquivo separado e tratado como asset** — coloque em `public/icons/` e referencie via `<img>`, porque o Angular copia para `dist/` no build
3. **SVG inline aumenta o bundle JavaScript** — o conteudo entra no `main.js`, porque o HTML do componente e compilado no bundle final
4. **SVG como arquivo gera requisicao HTTP separada** — o navegador faz request paralelo, porque e um asset externo ao bundle
5. **Icones SVG sao geralmente pequenos** — o impacto no bundle e minimo para icones, porque sao poucos KB cada
6. **SVG via `<img>` nao aceita estilizacao CSS direta** — `color`, `fill` nao funcionam, porque o SVG e renderizado como imagem estatica

## How to write

### SVG Inline (dinamico, estilizavel)

```html
<!-- Permite property binding no fill para cores dinamicas -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
     [attr.fill]="iconColor">
  <path d="M135.2 117.4L..."/>
</svg>
```

```typescript
@Component({ /* ... */ })
export class MeuComponent {
  iconColor = 'red'; // Muda dinamicamente a cor do SVG
}
```

### SVG como Arquivo Separado (estatico, leve no bundle)

```
public/
└── icons/
    └── car.svg       <!-- Asset copiado para dist/ no build -->
```

```html
<!-- Carregado via requisicao HTTP separada -->
<img src="icons/car.svg" alt="Car icon">
```

## Example

**Before (tentando estilizar SVG via img — nao funciona):**
```html
<img src="icons/car.svg" style="color: red; fill: red;">
<!-- Nenhuma alteracao visual — SVG e imagem estatica -->
```

**After (SVG inline com fill dinamico):**
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
     fill="red">
  <path d="M135.2 117.4L..."/>
</svg>
<!-- Cor aplicada corretamente -->
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Icone precisa mudar de cor dinamicamente | SVG inline no HTML do componente |
| Icone estatico, nunca muda de cor | Arquivo separado em `public/icons/` |
| Muitos icones na aplicacao | Considere FontAwesome via CDN |
| Icone grande/complexo (muitos paths) | Arquivo separado para nao inflar o bundle |
| Poucos icones pequenos | Inline e aceitavel, impacto minimo |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `<img src="icon.svg" style="fill: red">` | SVG inline com `fill="red"` |
| SVG de 50KB+ inline no HTML | Arquivo separado em `public/icons/` |
| `filter: invert(...) sepia(...)` para mudar cor | SVG inline com property binding no `fill` |
| SVG solto na raiz de `public/` | Organizar em `public/icons/` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
