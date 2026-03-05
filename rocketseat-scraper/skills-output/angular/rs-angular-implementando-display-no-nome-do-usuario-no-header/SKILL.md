---
name: rs-angular-user-info-store-signal
description: "Enforces the Signal-based store pattern for sharing user state across Angular components. Use when user asks to 'store user data', 'show username in header', 'share state between components', 'create a service with signals', or 'manage logged user info'. Applies rules: singleton injectable store, private signal with asReadOnly exposure, set via dedicated method, no direct signal mutation from outside. Make sure to use this skill whenever creating Angular services that hold shared state using Signals. Not for HTTP services, route guards, or RxJS-only state management."
---

# Signal Store para Estado de Usuário em Angular

> Crie services com Signals para armazenar estado compartilhado, expondo apenas leitura para consumidores externos.

## Rules

1. **Service singleton com `providedIn: 'root'`** — garante instancia unica em toda a aplicacao, porque valores armazenados nao sao resetados entre componentes
2. **Signal privado, exposicao read-only** — declare o signal como `private readonly` e exponha via `.asReadOnly()`, porque impede que componentes consumidores facam `.set()` diretamente e evita bagunca de manutencao
3. **Mutacao apenas via metodo dedicado** — crie um metodo `setUserInfos()` no service para alterar o signal, porque centraliza o ponto de escrita
4. **Inicialize signals com `undefined`** — signals que comecam com `undefined` nao disparam fluxos dependentes (computed, rxResource) ate receber valor real
5. **Popule o store no service de API, nao no componente** — chame o metodo de set dentro de um `tap()` no pipe do login, porque fica automatico e desacoplado de qualquer componente
6. **Consuma o signal read-only no template com optional chaining** — `store.userInfos()?.name`, porque o valor pode ser undefined antes do login

## How to write

### Service Store com Signal

```typescript
// core/services/user-infos-store.ts
import { Injectable, signal } from '@angular/core';
import { IUserInfos } from '../../shared/models/user-infos';

@Injectable({ providedIn: 'root' })
export class UserInfosStore {
  private readonly user = signal<IUserInfos | undefined>(undefined);

  userInfos = this.user.asReadOnly();

  setUserInfos(user: IUserInfos): void {
    this.user.set(user);
  }
}
```

### Interface do modelo

```typescript
// shared/models/user-infos.ts
export interface IUserInfos {
  id: number;
  name: string;
  email: string;
}
```

### Populando o store no service de API

```typescript
// No service de login (user-api.ts), dentro do pipe do login:
private readonly _userInfosStore = inject(UserInfosStore);

login(credentials: LoginRequest) {
  return this.http.post<LoginResponse>(url, credentials).pipe(
    tap(({ token }) => { /* salvar token */ }),
    tap(({ user: { id, name, email } }) => {
      this._userInfosStore.setUserInfos({ id, name, email });
    })
  );
}
```

### Consumindo no componente Header

```typescript
// header.component.ts
export class HeaderComponent {
  readonly _userInfosStore = inject(UserInfosStore);
}
```

```html
<!-- header.component.html -->
<span>Olá, {{ _userInfosStore.userInfos()?.name }}</span>
```

## Example

**Before (signal exposto diretamente):**
```typescript
@Injectable({ providedIn: 'root' })
export class UserStore {
  user = signal<User | undefined>(undefined); // qualquer componente pode fazer .set()
}
```

**After (com este skill aplicado):**
```typescript
@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly user = signal<User | undefined>(undefined);
  userInfos = this.user.asReadOnly(); // somente leitura externamente

  setUserInfos(user: User): void {
    this.user.set(user);
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa compartilhar estado entre componentes | Crie um service store com signal |
| Signal sera consumido no template | Use `asReadOnly()` e acesse com `()?.property` |
| Dados vem de resposta HTTP | Popule o store dentro de `tap()` no pipe, nao no componente |
| Componente precisa acessar o store no template | Declare a injecao como `readonly` (sem `private`) |
| Componente so usa o store no .ts | Declare como `private readonly` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `public user = signal(...)` exposto direto | `private readonly` + `asReadOnly()` |
| `.set()` chamado de dentro de um componente | `.set()` apenas via metodo do service |
| Inicializar signal com objeto vazio `{}` | Inicializar com `undefined` |
| Popular o store no `ngOnInit` do componente | Popular no `tap()` do service de API |
| BehaviorSubject para estado simples em Angular moderno | Signal + asReadOnly |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
