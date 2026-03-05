---
name: rs-angular-intro-item-lista-certificados
description: "Applies Angular component composition patterns when building list item components with Bootstrap. Use when user asks to 'create a list item component', 'build a card component', 'compose components in Angular', or 'create a reusable item for a list'. Enforces patterns: component hierarchy, Bootstrap card structure, dynamic-ready markup, consistent spacing via margin-bottom, and custom CSS over Bootstrap utility overrides. Make sure to use this skill whenever generating Angular components that represent items in a list. Not for routing, input bindings, or Angular directives like ngFor."
---

# Componente Item de Lista (Angular + Bootstrap)

> Ao criar componentes que representam itens de uma lista, estruture-os como unidades independentes, reutilizaveis e prontas para receber dados dinamicos.

## Rules

1. **Crie componentes para itens que se repetem** — se um elemento aparece multiplas vezes numa lista, extraia-o como componente proprio, porque isso permite reutilizacao via `*ngFor` sem duplicacao de codigo
2. **Use composicao de componentes** — um componente pode chamar outros componentes internos (ex: `<app-secondary-button>` dentro de `<app-item-certificado>`), porque Angular permite hierarquia livre de componentes
3. **Aplique Bootstrap como base, CSS customizado para ajustes** — use classes do Bootstrap (`card`, `d-flex`, `justify-content-between`, `align-items-center`) para layout, mas crie classes proprias para cores e bordas especificas do design
4. **Componente ocupa 100% da largura por padrao** — nao restrinja largura no componente item, porque quem controla a largura e o componente pai (ex: `container` do Bootstrap)
5. **Inclua margin-bottom no proprio componente** — adicione espacamento inferior diretamente no CSS do item, porque isso elimina trabalho repetitivo ao renderizar listas
6. **Prepare markup para ser dinamico** — mesmo com dados estaticos inicialmente, estruture o HTML pensando que nome, data e botao serao substituidos por inputs futuramente

## How to write

### Gerar o componente via CLI

```bash
ng g c components/item-certificado --skip-tests
```

### Estrutura HTML do card

```html
<div class="card custom-card">
  <div class="d-flex justify-content-between align-items-center">
    <div>
      <div class="nome-aluno fw-bold">Nome do Aluno</div>
      <small class="small-date">Gerado em 28/02/2026</small>
    </div>
    <app-secondary-button></app-secondary-button>
  </div>
</div>
```

### CSS com cores do Figma e espacamento

```css
.custom-card {
  border: 1px solid #E1E1E6;
  border-radius: 8px;
  margin-bottom: 8px;
}

.nome-aluno {
  color: #41414D;
}

.small-date {
  color: #A8A8B3;
}
```

## Example

**Before (tudo inline no app.component.html):**
```html
<div class="card">
  <b>Aluno 1</b>
  <small>01/01/2026</small>
  <button class="btn btn-outline-primary">Ver</button>
</div>
<div class="card">
  <b>Aluno 2</b>
  <small>02/01/2026</small>
  <button class="btn btn-outline-primary">Ver</button>
</div>
```

**After (componente reutilizavel):**
```html
<!-- app.component.html -->
<div class="container">
  <app-item-certificado></app-item-certificado>
  <app-item-certificado></app-item-certificado>
</div>
```

```html
<!-- item-certificado.component.html -->
<div class="card custom-card">
  <div class="d-flex justify-content-between align-items-center">
    <div>
      <div class="nome-aluno fw-bold">Nome do Aluno</div>
      <small class="small-date">Gerado em 28/02/2026</small>
    </div>
    <app-secondary-button></app-secondary-button>
  </div>
</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Elemento se repete em lista | Extrair como componente proprio |
| Cor especifica do design (Figma) | Criar classe CSS customizada, nao usar utility do Bootstrap |
| Botao ja existe como componente | Reutilizar via selector (`<app-secondary-button>`) |
| Largura do item | Deixar 100%, controlar no pai |
| Espacamento entre itens | `margin-bottom` no CSS do proprio componente |
| Dados estaticos por enquanto | Estruturar HTML pronto para receber `@Input()` depois |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Duplicar HTML do card em cada uso | Criar componente e reutilizar via selector |
| `style="color: #41414D"` inline | Classe CSS `.nome-aluno { color: #41414D; }` |
| `text-primary` do Bootstrap para cor custom | Classe propria com a cor exata do Figma |
| Largura fixa no componente item | `width: 100%` implicito, pai controla |
| Criar botao novo dentro do item | Compor com `<app-secondary-button>` existente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
