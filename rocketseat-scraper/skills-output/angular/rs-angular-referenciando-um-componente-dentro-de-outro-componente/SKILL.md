---
name: rs-angular-referenciando-componente
description: "Enforces correct Angular component referencing patterns when composing components inside other components. Use when user asks to 'use a component inside another', 'reference a component', 'import component in Angular', 'nest components', or 'add component to template'. Applies rules: import in imports array, use selector tag, self-closing tags, View Encapsulation awareness. Make sure to use this skill whenever creating or composing Angular components. Not for routing, services, directives, or pipes."
---

# Referenciando Componentes no Angular

> Para usar um componente dentro de outro, importe a classe no array `imports` do componente pai e use o seletor como tag no template.

## Rules

1. **Importe no array `imports` do componente pai** — adicione a classe do componente filho em `imports: [MeuBotaoComponent]`, porque sem isso o Angular nao reconhece o seletor e exibe erro "is not a known element"
2. **Use o seletor como tag HTML** — o seletor definido em `@Component({ selector: 'app-meu-botao' })` vira a tag `<app-meu-botao />` no template pai
3. **Prefira tags auto-fechadas** — use `<app-meu-botao />` em vez de `<app-meu-botao></app-meu-botao>`, porque deixa o template mais limpo
4. **Garanta o import no topo do arquivo** — alem do array `imports`, o `import { MeuBotaoComponent } from './meu-botao/meu-botao.component'` deve existir no topo do arquivo TypeScript
5. **Respeite o View Encapsulation** — o Angular adiciona atributos unicos (ng-content, hashes) nos elementos para encapsular estilos por componente; CSS de um componente nao vaza para outros

## How to write

### Importando e usando um componente

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { MeuBotaoComponent } from './meu-botao/meu-botao.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MeuBotaoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
```

```html
<!-- app.component.html -->
<app-meu-botao />
```

### Estrutura do DOM resultante

```html
<body>
  <app-root>           <!-- AppComponent (seletor: app-root) -->
    <app-meu-botao>    <!-- MeuBotaoComponent -->
      <button class="btn btn-flat">Filtrar</button>
      <button class="btn btn-flat">Limpar</button>
    </app-meu-botao>
  </app-root>
</body>
```

## Example

**Before (erro — componente nao importado):**
```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [], // falta o componente
  templateUrl: './app.component.html',
})
export class AppComponent {}
```
```html
<!-- Angular exibe: 'app-meu-botao' is not a known element -->
<app-meu-botao />
```

**After (com import correto):**
```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MeuBotaoComponent], // componente importado
  templateUrl: './app.component.html',
})
export class AppComponent {}
```
```html
<!-- Funciona corretamente -->
<app-meu-botao />
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Erro "is not a known element" | Verificar se o componente esta no array `imports` do componente pai |
| Componente sem conteudo projetado | Usar tag auto-fechada `<app-x />` |
| Componente com content projection | Usar tag aberta/fechada `<app-x>conteudo</app-x>` |
| Seletor do componente | Sempre prefixo `app-` seguido do nome (padrao Angular CLI) |
| Inspecionar estrutura | DevTools > Elements mostra a hierarquia: body > app-root > componentes filhos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Usar componente sem importar no `imports` | Adicionar a classe no array `imports` do decorator |
| `<app-meu-botao></app-meu-botao>` (sem conteudo) | `<app-meu-botao />` |
| Esperar que CSS de um componente afete outro | Respeitar View Encapsulation — estilize dentro do proprio componente |
| Confundir `import` JS com `imports` do decorator | Ambos sao necessarios: `import` no topo + `imports` no `@Component` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
