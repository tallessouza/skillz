---
name: rs-angular-intro-ng-content-base-ui
description: "Applies Angular ng-content pattern to create reusable layout wrapper components. Use when user asks to 'create a layout component', 'wrap page content', 'add consistent spacing', 'use ng-content', or 'build a base UI component' in Angular. Enforces content projection with ng-content for building shell components that accept arbitrary child content. Make sure to use this skill whenever creating Angular wrapper/layout components. Not for Angular routing, forms, signals, or directive creation."
---

# Componente Base UI com ng-content

> Crie componentes wrapper reutilizaveis usando ng-content para projetar conteudo externo dentro de um layout padrao.

## Rules

1. **Use ng-content para injecao de conteudo** — `<ng-content></ng-content>` dentro do template, porque permite que qualquer HTML externo seja projetado dentro do componente sem acoplamento
2. **Componentes de layout aplicam espacamento via classe wrapper** — uma div container envolve o ng-content, porque centraliza margens e paddings num unico lugar
3. **Reutilize classes do Bootstrap quando possivel** — `container` para limites laterais, porque evita CSS customizado desnecessario
4. **CSS customizado apenas para o que o framework nao cobre** — crie classes como `.custom-ui { margin-top: 40px }` apenas para valores especificos do design, porque mantem o CSS minimo
5. **Componentes de layout ficam em `components/`** — gere com `ng generate component components/base-ui --skip-tests`, porque segue a organizacao padrao Angular

## How to write

### Componente Base UI (template)

```html
<!-- base-ui.component.html -->
<div class="container custom-ui">
  <ng-content></ng-content>
</div>
```

### Estilo do componente

```css
/* base-ui.component.css */
.custom-ui {
  margin-top: 40px;
}
```

### Uso no componente pai

```html
<!-- app.component.html -->
<app-navbar></app-navbar>
<app-base-ui>
  <h1>Qualquer conteudo aqui</h1>
  <p>Sera projetado dentro do container com espacamento padrao</p>
</app-base-ui>
```

## Example

**Before (espacamento repetido em cada pagina):**

```html
<!-- home.component.html -->
<div class="container" style="margin-top: 40px;">
  <h1>Home</h1>
</div>

<!-- certificates.component.html -->
<div class="container" style="margin-top: 40px;">
  <h1>Certificados</h1>
</div>
```

**After (Base UI centraliza o layout):**

```html
<!-- app.component.html -->
<app-navbar></app-navbar>
<app-base-ui>
  <router-outlet></router-outlet>
</app-base-ui>
```

```html
<!-- home.component.html (sem preocupacao com layout) -->
<h1>Home</h1>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Espacamento identico em todas as paginas | Crie um componente wrapper com ng-content |
| Conteudo varia mas layout e fixo | ng-content dentro de div com classes de layout |
| Precisa de multiplas zonas de projecao | Use ng-content com select: `<ng-content select="[header]">` |
| Componente so aplica estilo, sem logica | Componente standalone simples, sem inputs/outputs |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Copiar classes de margem em cada pagina | Criar Base UI com ng-content |
| `style="margin-top: 40px"` inline repetido | Classe CSS `.custom-ui` no componente wrapper |
| Passar conteudo via @Input() string HTML | Usar ng-content para projecao de conteudo |
| Criar wrapper sem ng-content (vazio) | Sempre incluir ng-content para receber filhos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
