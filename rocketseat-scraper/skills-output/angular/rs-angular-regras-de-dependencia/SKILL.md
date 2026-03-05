---
name: rs-angular-regras-de-dependencia
description: "Enforces dependency rules between Feature, Shared, and Core layers in Angular feature-based component architecture. Use when user asks to 'create a component', 'organize Angular project', 'import a service', 'structure modules', or any Angular architecture task. Applies rules: Features depend on Core/Shared only, Shared depends on Core only, Core depends on nothing. Make sure to use this skill whenever generating Angular imports or structuring component dependencies. Not for non-Angular projects, CSS styling, or API design."
---

# Regras de Dependencia — Feature Based Components

> Cada camada (Feature, Shared, Core) tem regras estritas sobre o que pode consumir, garantindo isolamento e reusabilidade.

## Rules

1. **Feature depende apenas de Core e Shared** — nunca importe componentes ou services de outra Feature, porque isso cria acoplamento entre contextos que devem ser independentes
2. **Shared depende apenas de Core** — nunca importe componentes ou services de uma Feature dentro da Shared, porque Shared deve ser reutilizavel em qualquer contexto
3. **Core nao depende de ninguem** — Core e a base isolada, nao consome Shared nem Feature, porque tudo na Core deve funcionar sozinho
4. **Se consumir outra Feature, nao pode quebrar sem ela** — se o dashboard usa o user-list de outra feature, remover user-list nao pode quebrar o dashboard, porque a feature consumidora deve funcionar independente
5. **Minimize dependencias mesmo quando permitidas** — Shared pode referenciar Core, mas com o minimo de acoplamento possivel, porque menos dependencia significa mais reusabilidade

## Matriz de dependencia

| Camada | Pode depender de | Nao pode depender de |
|--------|-------------------|----------------------|
| **Feature** | Core, Shared | Outras Features |
| **Shared** | Core | Features |
| **Core** | Ninguem | Shared, Features |

## How to write

### Feature consumindo Core e Shared (permitido)

```typescript
// feature/dashboard/dashboard.component.ts
import { AuthService } from '@core/services/auth.service';
import { CardComponent } from '@shared/components/card/card.component';

@Component({
  selector: 'app-dashboard',
  imports: [CardComponent],
})
export class DashboardComponent {
  constructor(private authService: AuthService) {}
}
```

### Shared consumindo Core (permitido, com minimo acoplamento)

```typescript
// shared/components/user-avatar/user-avatar.component.ts
import { UserService } from '@core/services/user.service';

@Component({ selector: 'app-user-avatar' })
export class UserAvatarComponent {
  constructor(private userService: UserService) {}
}
```

### Core isolado (sem dependencias)

```typescript
// core/services/auth.service.ts
// Nenhum import de Shared ou Feature
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Funciona sozinho, sem dependencias externas
}
```

## Example

**Before (violacao — Feature depende de outra Feature):**

```typescript
// feature/dashboard/dashboard.component.ts
import { UserListComponent } from '@feature/users/user-list/user-list.component';

@Component({
  imports: [UserListComponent], // ERRADO: depende de outra feature
})
export class DashboardComponent {}
```

**After (correto — componente isolado ou via Shared):**

```typescript
// feature/dashboard/dashboard.component.ts
import { UserTableComponent } from '@shared/components/user-table/user-table.component';

@Component({
  imports: [UserTableComponent], // CORRETO: usa componente da Shared
})
export class DashboardComponent {}
// Se remover UserTableComponent, dashboard continua funcionando
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Preciso usar componente de outra feature | Mova o componente para Shared ou duplique a logica na feature |
| Componente da Shared precisa de dados de uma feature | Receba via @Input, nunca importe a feature diretamente |
| Service na Core precisa de algo da Shared | Refatore — a dependencia esta invertida, mova para Core |
| Feature consome outra feature e funciona sem ela | Toleravel no dia a dia, mas o ideal e refatorar para Shared |
| Duvida se algo vai na Core ou Shared | Core = funciona sozinho, sem dependencia. Shared = pode depender de Core |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `import { X } from '@feature/outra-feature/...'` em uma Feature | Mova X para `@shared/` ou receba via @Input |
| `import { X } from '@feature/...'` dentro da Shared | Shared nunca importa Features |
| `import { X } from '@shared/...'` dentro da Core | Core nao depende de ninguem |
| Feature que quebra ao remover componente de outra feature | Feature deve funcionar independente, com ou sem o componente externo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
