---
name: rs-angular-intro-comunicacao-componentes
description: "Applies Angular component communication patterns using @Input, @Output, and lifecycle hooks. Use when user asks to 'create Angular component', 'pass data between components', 'use @Input or @Output', 'handle component lifecycle', or 'ngOnChanges vs ngOnInit'. Enforces correct parent-child data flow, lifecycle hook selection, and constructor vs ngOnInit decisions. Make sure to use this skill whenever building Angular components that need to communicate. Not for React, Vue, or non-Angular component patterns."
---

# Comunicacao entre Componentes Angular

> Componentes Angular comunicam-se via @Input (pai→filho) e @Output (filho→pai), e o ciclo de vida determina QUANDO os dados estao disponiveis.

## Rules

1. **Use @Input para pai→filho** — `@Input() userName: string` no componente filho, porque o fluxo unidirecional mantém a rastreabilidade dos dados
2. **Use @Output para filho→pai** — `@Output() saved = new EventEmitter<T>()` no componente filho, porque eventos sobem enquanto dados descem
3. **Use ngOnChanges para reagir a mudancas de @Input** — implementar `OnChanges` e inspecionar `SimpleChanges`, porque ele dispara toda vez que um input muda e fornece valor anterior e atual
4. **Logica de inicializacao vai no ngOnInit, NAO no constructor** — porque no constructor os @Input ainda nao estao valorizados
5. **Constructor apenas para injecao de dependencia** — `constructor(private service: MyService)`, porque o Angular resolve DI no constructor antes de popular inputs
6. **Separe componentes para organizar** — quebre a aplicacao em componentes menores pai-filho, porque componentes monoliticos dificultam manutencao e reuso

## How to write

### @Input (pai envia para filho)

```typescript
// filho.component.ts
@Component({ selector: 'app-filho' })
export class FilhoComponent {
  @Input() titulo: string = '';
}

// pai.component.html
<app-filho [titulo]="tituloDoComponentePai"></app-filho>
```

### @Output (filho envia para pai)

```typescript
// filho.component.ts
@Output() itemSelecionado = new EventEmitter<Item>();

selecionarItem(item: Item) {
  this.itemSelecionado.emit(item);
}

// pai.component.html
<app-filho (itemSelecionado)="onItemSelecionado($event)"></app-filho>
```

### ngOnChanges para monitorar inputs

```typescript
export class FilhoComponent implements OnChanges {
  @Input() valor: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['valor']) {
      const anterior = changes['valor'].previousValue;
      const atual = changes['valor'].currentValue;
      console.log(`valor mudou de ${anterior} para ${atual}`);
    }
  }
}
```

### ngOnInit vs Constructor

```typescript
export class MeuComponent implements OnInit {
  @Input() dados: string = '';

  // Constructor: apenas DI — inputs ainda NAO tem valor aqui
  constructor(private service: MeuService) {}

  // ngOnInit: inputs JA estao valorizados — logica de inicializacao aqui
  ngOnInit() {
    this.service.carregar(this.dados); // dados ja disponivel
  }
}
```

## Example

**Before (logica no constructor, sem separacao):**

```typescript
export class AppComponent {
  usuarios: Usuario[] = [];

  constructor(private service: UsuarioService) {
    // ERRADO: inputs nao estariam valorizados aqui
    this.usuarios = this.service.getAll();
  }
}
```

**After (ciclo de vida correto, componentes separados):**

```typescript
// lista-usuarios.component.ts
export class ListaUsuariosComponent implements OnInit {
  @Input() filtro: string = '';
  @Output() usuarioSelecionado = new EventEmitter<Usuario>();

  usuarios: Usuario[] = [];

  constructor(private service: UsuarioService) {} // apenas DI

  ngOnInit() {
    this.usuarios = this.service.getAll(); // inicializacao aqui
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dado flui de pai para filho | @Input no filho, property binding `[prop]` no pai |
| Filho precisa notificar pai | @Output com EventEmitter, event binding `(evento)` no pai |
| Precisa reagir quando input muda | Implemente OnChanges, inspecione SimpleChanges |
| Inicializar dados do componente | Use ngOnInit, nunca o constructor |
| Injetar servicos | Use o constructor para DI apenas |
| Componente ficou grande demais | Separe em pai-filho com @Input/@Output |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Logica de negocio no constructor | Logica no ngOnInit |
| Acessar @Input no constructor | Acessar @Input no ngOnInit ou ngOnChanges |
| Componente monolitico com tudo | Componentes separados comunicando via @Input/@Output |
| Ignorar valor anterior no ngOnChanges | Comparar previousValue e currentValue |
| EventEmitter sem tipagem | `new EventEmitter<TipoEspecifico>()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
