---
name: rs-angular-intro-services-estado
description: "Applies Angular Services, Dependency Injection, and state management patterns using RxJS BehaviorSubject when building Angular applications. Use when user asks to 'create a service', 'share data between components', 'manage state in Angular', 'use BehaviorSubject', or 'implement pub/sub pattern'. Guides architectural decisions for data flow, singleton services, and Observable-based communication. Make sure to use this skill whenever designing component communication or state management in Angular. Not for React/Vue state management, backend services, or database state."
---

# Services e Gerenciamento de Estado no Angular

> Utilize Services com BehaviorSubject para criar uma unica fonte de verdade para o estado da aplicacao, removendo acoplamento entre componentes.

## Key concept

Services no Angular sao classes compartilhadas entre componentes via injecao de dependencia. Eles centralizam logica e dados, eliminando comunicacao direta (acoplamento) entre componentes. Combinados com o padrao Pub/Sub via RxJS Observables, criam fluxos de dados confiaveis onde nenhum componente manipula o estado diretamente.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Dois ou mais componentes precisam dos mesmos dados | Service com instancia unica (singleton) |
| Componente precisa reagir a mudancas de dados | Pub/Sub com BehaviorSubject no service |
| Lista de itens compartilhada (produtos, usuarios) | Service como fonte de verdade, expor Observable readonly |
| Dados precisam ser transformados antes de chegar ao componente | Operadores RxJS (map, filter, tap) no pipe |
| Componente precisa do valor atual ao se inscrever | BehaviorSubject (emite ultimo valor imediatamente) |
| Componente so precisa de valores futuros | Subject (nao emite valor ao inscrever) |

## How to think about it

### Service como fonte de verdade

O Service e o unico lugar confiavel para acessar dados. Componentes nao acessam nem manipulam o estado diretamente — eles pedem ao service via metodos publicos e se inscrevem nas mudancas via Observables.

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  
  // Expor como Observable readonly — componentes so leem
  readonly products$ = this.productsSubject.asObservable();
  
  // Metodos publicos controlam as mutacoes
  addProduct(product: Product): void {
    const current = this.productsSubject.getValue();
    this.productsSubject.next([...current, product]);
  }
}
```

### Injecao de dependencia

Angular injeta a instancia do service no componente automaticamente. O componente nao cria o service — recebe ele pronto.

```typescript
@Component({ /* ... */ })
export class ProductListComponent {
  products$ = inject(ProductService).products$;
}
```

### Subject vs BehaviorSubject

- **Subject**: so emite para quem ja esta inscrito. Novos inscritos perdem valores anteriores.
- **BehaviorSubject**: exige valor inicial e emite o ultimo valor imediatamente para novos inscritos. Ideal para estado porque o componente sempre recebe o valor atual ao se inscrever.

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Componentes podem compartilhar dados via @Input/@Output em cascata | Funciona para pai-filho direto, mas gera prop drilling. Services resolvem comunicacao entre componentes distantes |
| Qualquer componente pode alterar o estado diretamente | O BehaviorSubject deve ser privado. So o service expoe metodos para mutacao |
| Subject e BehaviorSubject sao a mesma coisa | BehaviorSubject tem valor inicial e emite ultimo valor para novos inscritos. Subject nao |
| RxJS e obrigatorio para tudo | Operadores como tap, map, filter sao uteis mas nao e necessario dominar RxJS inteiro para gerenciar estado |

## When to apply

- Aplicacoes de medio e grande porte com dados compartilhados entre componentes
- Listas de entidades (produtos, usuarios, pedidos) que varios componentes consomem
- Quando precisa de fluxo de dados unidirecional e previsivel
- Quando componentes distantes na arvore precisam se comunicar

## Limitations

- Para estado muito complexo com muitas acoes, considere NgRx ou similar
- BehaviorSubject nao persiste entre recarregamentos — combine com localStorage se necessario
- Nao substitui estado de formulario local (use ReactiveForms para isso)

## Anti-patterns

| Nunca faca | Faca ao inves |
|-----------|---------------|
| Expor o BehaviorSubject como publico | Expor `.asObservable()` como readonly |
| Manipular estado no componente e passar pro service | Chamar metodo do service que encapsula a mutacao |
| Criar instancias multiplas do mesmo service sem necessidade | Usar `providedIn: 'root'` para singleton |
| Esquecer de dar unsubscribe | Usar `async` pipe no template ou `takeUntilDestroyed()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
