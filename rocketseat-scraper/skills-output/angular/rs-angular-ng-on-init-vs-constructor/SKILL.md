---
name: rs-angular-ng-on-init-vs-constructor
description: "Enforces correct usage of ngOnInit vs constructor in Angular components. Use when user asks to 'create a component', 'initialize component data', 'fetch data on init', 'inject a service', or 'use lifecycle hooks'. Applies rules: never use constructor for logic that depends on inputs, use ngOnInit for initialization logic, use inject() instead of constructor injection. Make sure to use this skill whenever generating Angular component code with initialization logic. Not for template syntax, routing, or non-Angular frameworks."
---

# ngOnInit vs Constructor

> Use ngOnInit para logica que depende de inputs; reserve o constructor apenas para casos excepcionais — prefira inject() para dependencias.

## Rules

1. **Nunca acesse inputs no constructor** — `this.meuInput` sera `undefined` no constructor, porque os inputs ainda nao receberam valores nesse momento
2. **Use ngOnInit para logica inicial** — chamadas HTTP, inicializacao de propriedades baseadas em inputs, qualquer logica que dependa dos valores dos inputs, porque ngOnInit so executa depois que os inputs receberam o primeiro valor
3. **Use inject() ao inves de constructor injection** — `meuService = inject(MeuService)` substitui `constructor(private meuService: MeuService)`, porque e a forma moderna e elimina a necessidade do constructor
4. **Use ngOnChanges para inputs que mudam** — constructor e ngOnInit executam uma unica vez; para reagir a atualizacoes subsequentes de inputs, use ngOnChanges
5. **Evite colocar logica no constructor** — o constructor existe para criar a instancia da classe, nao para executar logica de negocio

## How to write

### Inicializacao com ngOnInit

```typescript
export class PessoaComponent implements OnInit {
  pessoa = input.required<Pessoa>();

  dadosProcessados: DadosProcessados;

  private meuService = inject(MeuService);

  ngOnInit() {
    // Aqui o input ja tem valor — seguro para usar
    this.dadosProcessados = this.meuService.processar(this.pessoa());
  }
}
```

### Injecao de dependencia moderna (inject)

```typescript
// CORRETO: inject() como propriedade da classe
export class MeuComponent {
  private meuService = inject(MeuService);
  private router = inject(Router);
}
```

## Example

**Before (constructor para tudo — padrao antigo):**

```typescript
export class PessoaComponent implements OnInit {
  @Input() pessoa: Pessoa;

  constructor(
    private meuService: MeuService,
    private router: Router
  ) {
    // BUG: pessoa e undefined aqui
    console.log(this.pessoa); // undefined
    this.meuService.carregar(this.pessoa.id); // erro em runtime
  }

  ngOnInit() {}
}
```

**After (com esta skill aplicada):**

```typescript
export class PessoaComponent implements OnInit {
  pessoa = input.required<Pessoa>();

  private meuService = inject(MeuService);
  private router = inject(Router);

  ngOnInit() {
    // Inputs ja tem valor — seguro
    console.log(this.pessoa()); // { id: 1, nome: 'João' }
    this.meuService.carregar(this.pessoa().id); // funciona
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa do valor de um input para inicializar | Use ngOnInit |
| Precisa reagir a mudancas nos inputs | Use ngOnChanges |
| Precisa injetar um service | Use `inject()` como propriedade |
| Precisa executar logica uma unica vez na criacao | Use ngOnInit |
| Input pode mudar durante o ciclo de vida | Use ngOnChanges para atualizacoes |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `constructor(private svc: MeuService)` | `private svc = inject(MeuService)` |
| `constructor() { this.input... }` | `ngOnInit() { this.input... }` |
| Logica de negocio no constructor | Logica de negocio no ngOnInit |
| Chamada HTTP no constructor | Chamada HTTP no ngOnInit |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
