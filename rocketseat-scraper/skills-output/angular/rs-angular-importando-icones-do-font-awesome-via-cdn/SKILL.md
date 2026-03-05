---
name: rs-angular-font-awesome-cdn
description: "Applies Font Awesome CDN integration pattern when setting up icons in Angular applications. Use when user asks to 'add icons', 'integrate Font Awesome', 'use CDN for icons', 'add font awesome to angular', or 'configure icon library'. Guides correct placement of CDN script in index.html and usage of icon tags with FA classes. Make sure to use this skill whenever adding Font Awesome via CDN to any Angular project. Not for SVG sprite sheets, icon components libraries like ng-icons, or self-hosted font installations."
---

# Font Awesome via CDN no Angular

> Integre Font Awesome usando CDN com script no index.html para usar icones com tags simples em vez de SVGs inline verbosos.

## Rules

1. **Coloque o script do CDN no index.html, dentro do head** — depois da tag link existente, porque o script precisa carregar antes dos componentes renderizarem
2. **Use a tag `<i>` com classes do Font Awesome** — `<i class="fa-solid fa-car"></i>` nao SVG inline, porque o script do CDN faz a substituicao automaticamente
3. **Crie componentes isolados para testar** — gere um componente separado antes de integrar no componente principal, porque facilita o debug
4. **Estilize icones com CSS padrao** — `font-size`, `color` funcionam diretamente na tag `<i>`, porque o script converte para SVG mantendo heranca de estilos

## How to write

### Configuracao no index.html

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>App</title>
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <!-- Font Awesome CDN - colocar aqui dentro do head -->
  <script src="https://kit.fontawesome.com/SEU_KIT_ID.js" crossorigin="anonymous"></script>
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

### Uso no template do componente

```html
<!-- Simples e limpo -->
<i class="fa-solid fa-car"></i>

<!-- Com estilizacao -->
<i class="fa-solid fa-car" style="font-size: 2rem; color: red;"></i>
```

### Gerar componente para teste

```bash
ng generate component components/font-awesome-cdn
```

```typescript
// app.component.ts - importar o componente
import { FontAwesomeCdnComponent } from './components/font-awesome-cdn/font-awesome-cdn.component';

@Component({
  imports: [FontAwesomeCdnComponent],
  // ...
})
export class AppComponent {}
```

## Example

**Before (SVG inline — verboso):**
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24">
  <path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6..."/>
</svg>
```

**After (Font Awesome CDN — limpo):**
```html
<i class="fa-solid fa-car"></i>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa de icones rapido no projeto | CDN no index.html — zero config no Angular |
| Quer customizar cor/tamanho | CSS padrao: `color`, `font-size` na tag `<i>` |
| Quer testar antes de integrar | Gere componente isolado com `ng g c` |
| Precisa ver o que carregou | Aba Network do DevTools — procure o JS do kit |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| SVG inline gigante para icones comuns | `<i class="fa-solid fa-icon-name"></i>` |
| Script do CDN no component template | Script no `index.html` dentro do `<head>` |
| Copiar SVG do Font Awesome manualmente | Copiar a tag `<i>` com classes do FA |
| CDN link em cada componente | Uma unica referencia no `index.html` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
