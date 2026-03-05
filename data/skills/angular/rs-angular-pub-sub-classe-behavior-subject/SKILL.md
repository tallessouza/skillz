---
name: rs-angular-pub-sub-behavior-subject
description: "Applies BehaviorSubject patterns when writing Angular reactive code with RxJS. Use when user asks to 'create a service', 'share state between components', 'manage context', 'use BehaviorSubject', or 'implement pub-sub in Angular'. Enforces initial value, last-value semantics, and service-based sharing. Make sure to use this skill whenever generating Angular services that share state or use RxJS subjects. Not for HTTP requests, route params, or form handling with Observables."
---

# BehaviorSubject no Angular

> Utilize BehaviorSubject quando precisar armazenar e compartilhar o ultimo valor emitido entre componentes via Services.

## Rules

1. **Sempre defina um valor inicial** — `new BehaviorSubject<string>('valor padrao')`, porque BehaviorSubject exige um valor no construtor e garante que o primeiro assinante receba algo imediatamente
2. **Use BehaviorSubject para gerenciamento de contexto, Subject para eventos puros** — porque BehaviorSubject armazena o ultimo valor e novos assinantes o recebem imediatamente, enquanto Subject nao tem memoria
3. **Instancie dentro de Services, nunca em componentes** — porque Services tem instancia unica (singleton) e compartilham a mesma referencia do BehaviorSubject para todos os componentes que injetarem o service
4. **Exponha o Observable, esconda o Subject** — use `asObservable()` para expor somente leitura e metodos dedicados para emissao, porque isso impede que componentes chamem `.next()` diretamente
5. **Prefixe com `$` variaveis Observable** — `meuBehaviorSubject$`, porque e convencao RxJS que facilita identificacao no codigo
6. **Sempre faca unsubscribe** — para evitar memory leaks, use `takeUntilDestroyed()` ou gerenciamento manual no `ngOnDestroy`

## How to write

### BehaviorSubject em Service

```typescript
@Injectable({ providedIn: 'root' })
export class UserContextService {
  private userSubject$ = new BehaviorSubject<User | null>(null);

  // Expor somente leitura
  user$ = this.userSubject$.asObservable();

  updateUser(user: User): void {
    this.userSubject$.next(user);
  }

  getCurrentUser(): User | null {
    return this.userSubject$.getValue();
  }
}
```

### Componente consumindo o Service

```typescript
@Component({ selector: 'app-profile' })
export class ProfileComponent implements OnInit {
  private userContext = inject(UserContextService);

  ngOnInit(): void {
    this.userContext.user$.subscribe((user) => {
      console.log('Usuario atualizado:', user);
    });
  }
}
```

### Componente emitindo valor

```typescript
@Component({ selector: 'app-login' })
export class LoginComponent {
  private userContext = inject(UserContextService);

  onLogin(user: User): void {
    this.userContext.updateUser(user);
    // Todos os componentes inscritos recebem o novo user
  }
}
```

## Example

**Before (Subject sem memoria — novo assinante perde valores):**
```typescript
private subject$ = new Subject<string>();

// Componente A emite
this.subject$.next('dados importantes');

// Componente B se inscreve DEPOIS — nao recebe nada
this.subject$.subscribe(value => console.log(value)); // silencio
```

**After (BehaviorSubject — novo assinante recebe ultimo valor):**
```typescript
private subject$ = new BehaviorSubject<string>('valor inicial');

// Componente A emite
this.subject$.next('dados importantes');

// Componente B se inscreve DEPOIS — recebe 'dados importantes' imediatamente
this.subject$.subscribe(value => console.log(value)); // 'dados importantes'
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa que novo assinante receba o ultimo valor | BehaviorSubject |
| Apenas eventos futuros importam (click, notificacao) | Subject |
| Compartilhar estado entre componentes | BehaviorSubject dentro de Service |
| Precisa de valor sincrono via `getValue()` | BehaviorSubject |
| Stream de dados HTTP one-shot | Observable direto, nem Subject nem BehaviorSubject |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `new BehaviorSubject<string>(undefined!)` | `new BehaviorSubject<string \| null>(null)` |
| `this.behaviorSubject$.next()` direto no componente | `this.service.metodoQueEmite(valor)` |
| BehaviorSubject como propriedade publica do service | BehaviorSubject private + `.asObservable()` public |
| Subject quando precisa do ultimo valor | BehaviorSubject |
| BehaviorSubject para eventos sem estado (clicks) | Subject |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
