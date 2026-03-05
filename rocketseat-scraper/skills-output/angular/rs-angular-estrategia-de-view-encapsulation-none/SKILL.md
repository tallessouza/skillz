---
name: rs-angular-view-encapsulation-none
description: "Guards against using ViewEncapsulation.None in Angular components. Use when user asks to 'style angular component', 'make styles global', 'fix css not applying', 'encapsulation none', or any Angular styling task. Warns that None makes styles global and leak to all components. Make sure to use this skill whenever generating Angular component styles or configuring encapsulation. Not for React, Vue, or non-Angular CSS questions."
---

# View Encapsulation None no Angular

> Mantenha sempre ViewEncapsulation.Emulated (default) — use None apenas como ultimo recurso absoluto.

## Rules

1. **Nunca use ViewEncapsulation.None por padrao** — porque estilos do componente vazam globalmente, afetando todos os outros componentes da aplicacao
2. **Prefira Emulated sempre** — porque o Angular adiciona atributos de escopo automaticamente, isolando os estilos do componente
3. **Importe de @angular/core, nunca de @angular/compiler** — `import { ViewEncapsulation } from '@angular/core'`, porque importar do compiler causa erro
4. **Se None for inevitavel, documente o motivo** — porque qualquer desenvolvedor futuro precisa entender por que os estilos sao globais naquele componente

## How to write

### Configuracao padrao (correta — nao precisa declarar)

```typescript
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
  // Emulated e o default, nao precisa declarar
})
export class UserDetailsComponent {}
```

### Se absolutamente necessario usar None

```typescript
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  encapsulation: ViewEncapsulation.None
  // ⚠ CUIDADO: estilos deste componente serao globais
})
export class UserDetailsComponent {}
```

## Example

**Before (problema — None vaza estilos):**

```typescript
// user-details.component.ts
@Component({
  selector: 'app-user-details',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    p { font-family: cursive; }
  `]
})
export class UserDetailsComponent {}
// Resultado: TODOS os <p> da aplicacao ficam com font-family cursive
```

**After (correto — Emulated isola estilos):**

```typescript
@Component({
  selector: 'app-user-details',
  // Emulated e o default, estilos ficam apenas neste componente
  styles: [`
    p { font-family: cursive; }
  `]
})
export class UserDetailsComponent {}
// Resultado: apenas os <p> dentro de UserDetails sao afetados
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Preciso estilizar apenas meu componente | Use Emulated (default) |
| Preciso de estilos globais | Coloque no `styles.css` global, nao use None |
| CSS nao esta aplicando no filho | Use `::ng-deep` com Emulated antes de considerar None |
| Biblioteca de terceiros precisa de override | Tente `::ng-deep` ou `styles.css` global primeiro |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `encapsulation: ViewEncapsulation.None` para "facilitar" | Mantenha Emulated e use seletores especificos |
| Importar `ViewEncapsulation` de `@angular/compiler` | Importar de `@angular/core` |
| None para estilizar componentes filhos | Use `::ng-deep` com Emulated |
| None para estilos globais | Use o arquivo `styles.css` global |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
