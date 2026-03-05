---
name: rs-angular-o-que-e-um-componente
description: "Applies Angular component architecture principles when designing, creating, or refactoring components. Use when user asks to 'create a component', 'componentize a layout', 'split into components', 'organize Angular code', or designs component hierarchy. Enforces rules: three-part structure (template/class/styles), encapsulation by default, balanced granularity, single responsibility, reusability mindset. Make sure to use this skill whenever creating or restructuring Angular components. Not for routing, services, or state management patterns."
---

# Componentizacao Angular

> Cada componente encapsula template, classe e estilos, com responsabilidades bem definidas e granularidade equilibrada.

## Rules

1. **Estrutura de tres partes** — todo componente Angular e composto de template (HTML), classe (TypeScript) e estilos (CSS/SCSS), porque cada parte tem responsabilidade distinta: forma, logica e aparencia
2. **Manter encapsulamento padrao** — nunca altere o ViewEncapsulation padrao, porque classes CSS de um componente nao devem vazar para outros — mudar isso causa bugs de estilo extremamente dificeis de rastrear
3. **Evitar micro-componentizacao** — nao crie componentes filhos para elementos simples sem logica propria, porque excesso de componentes dificulta manutencao tanto quanto um componente monolitico
4. **Evitar componentes monoliticos** — se o template ultrapassar ~200 linhas ou tiver multiplas responsabilidades distintas, separe em componentes filhos, porque facilita manutencao e localizacao de bugs
5. **Pensar em reutilizacao ao criar** — mesmo componentes que hoje nao serao reutilizados devem ser criados como se pudessem ser, porque isso resulta em codigo menos acoplado e mais facil de manter
6. **Separar item de lista** — quando renderizar listas, crie um componente para a lista (loop) e outro para o item individual, porque o item geralmente tem logica e template proprios

## How to write

### Componente simples (tela de login)

```typescript
// Quando a tela e simples e tem poucas responsabilidades,
// um unico componente basta — sem filhos desnecessarios
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  onSubmit() {
    // logica de autenticacao
  }
}
```

### Componente complexo (tela home com filhos)

```typescript
// Quando a tela tem multiplas areas com logicas distintas,
// separe em componentes filhos com responsabilidades claras
@Component({
  selector: 'app-home',
  template: `
    <app-header />
    <app-calendar />
    <app-card-summary />
    <app-transactions-list />
  `
})
export class HomeComponent {}
```

### Padrao lista + item

```typescript
// Componente lista: faz o loop
@Component({
  selector: 'app-transactions-list',
  template: `
    @for (transaction of transactions; track transaction.id) {
      <app-transaction-item [transaction]="transaction" />
    }
  `
})
export class TransactionsListComponent {
  transactions: Transaction[] = [];
}

// Componente item: renderiza um unico elemento
@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.css']
})
export class TransactionItemComponent {
  @Input() transaction!: Transaction;
}
```

## Example

**Before (monolitico — tudo no app.component):**
```html
<!-- app.component.html com 2000 linhas -->
<header>...</header>
<div class="calendar">...</div>
<div class="card">...</div>
<div class="transactions">
  <div *ngFor="let t of transactions" class="item">...</div>
</div>
```

**After (componentizado):**
```html
<!-- app.component.html — limpo e organizado -->
<app-header />
<app-calendar />
<app-card-summary />
<app-transactions-list />
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Tela simples (login, registro basico) | Um unico componente, sem filhos |
| Tela com areas visuais distintas (home, dashboard) | Separar cada area em componente filho |
| Lista de itens renderizados em loop | Criar componente lista + componente item |
| Elemento com logica propria (upload de imagem) | Extrair para componente filho dedicado |
| Template ultrapassou ~200 linhas | Hora de extrair componentes filhos |
| Duvida se deve separar ou nao | Perguntar: "esse trecho tem logica propria?" — se sim, separe |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Colocar todo HTML/CSS/logica no app.component | Dividir em componentes por responsabilidade |
| Criar componente filho para cada tag HTML | Agrupar elementos relacionados sem logica propria |
| Alterar ViewEncapsulation para None | Manter encapsulamento padrao (Emulated) |
| Componente de lista que tambem renderiza logica do item | Separar lista (loop) e item (renderizacao unitaria) |
| Duplicar CSS entre componentes | Encapsular estilos dentro de cada componente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
