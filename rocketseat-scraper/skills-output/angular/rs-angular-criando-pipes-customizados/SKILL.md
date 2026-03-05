---
name: rs-angular-criando-pipes-customizados
description: "Enforces best practices when creating custom Angular pipes. Use when user asks to 'create a pipe', 'transform data in template', 'convert status to text', 'format display value', or 'build custom pipe in Angular'. Applies rules: never mutate object references inside pipes, return single typed value, use lookup objects for status mapping, prefer AsyncPipe over manual subscriptions. Make sure to use this skill whenever generating Angular pipes or transforming data for display in templates. Not for Angular services, HTTP interceptors, or route guards."
---

# Criando Pipes Customizados no Angular

> Pipes transformam valores para display sem mutar dados originais — receba primitivos, retorne um unico tipo.

## Rules

1. **Nunca passe referencias de memoria para pipes** — passe o valor primitivo (`user.status`) nao o objeto inteiro (`user`), porque manipular referencias dentro do pipe causa mutacao silenciosa no objeto original
2. **Retorne sempre um unico tipo** — se o pipe retorna `string`, nunca tipar como `string | number | any`, porque pipes com retorno ambiguo quebram previsibilidade do template
3. **Use objetos de lookup para mapeamento de status** — `const statusObj: { [key: number]: string } = { 1: 'Ativo', 0: 'Inativo' }`, porque e extensivel, legivel e O(1)
4. **Prefira AsyncPipe no template** — inscreva-se em Observables diretamente no HTML com `| async`, porque evita gerenciar subscriptions manualmente e mantem a classe do componente limpa
5. **Reutilize pipes em vez de criar metodos no componente** — se 2+ componentes precisam da mesma transformacao, um pipe e mais performatico e DRY que metodos duplicados
6. **Se precisar receber objeto, clone antes de manipular** — `const clone = { ...obj }`, porque pipes nao devem causar side effects no dado original

## How to write

### Pipe com lookup object

```typescript
@Pipe({ name: 'userStatus' })
export class UserStatusPipe implements PipeTransform {
  transform(status: number): string {
    const userStatusObj: { [key: number]: string } = {
      1: 'Ativo',
      0: 'Inativo',
    };
    return userStatusObj[status];
  }
}
```

### Usando AsyncPipe no template com @for

```html
@for (user of userService.getUsers() | async; track user.name) {
  <div>
    <p>Nome: {{ user.name }}</p>
    <p>Status: {{ user.status | userStatus }}</p>
  </div>
}
```

### Componente limpo (sem subscriptions manuais)

```typescript
@Component({
  imports: [AsyncPipe, UserStatusPipe],
  templateUrl: './custom-pipe.component.html',
})
export class CustomPipeComponent {
  userService = inject(UserService);
}
```

## Example

**Before (metodo no componente, subscription manual):**

```typescript
@Component({...})
export class CustomPipeComponent implements OnInit, OnDestroy {
  users: any[] = [];
  private sub!: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.sub = this.userService.getUsers().subscribe(u => this.users = u);
  }

  ngOnDestroy() { this.sub.unsubscribe(); }

  getStatusText(status: number): string {
    return status === 1 ? 'Ativo' : 'Inativo';
  }
}
```

**After (AsyncPipe + custom pipe):**

```typescript
@Component({
  imports: [AsyncPipe, UserStatusPipe],
  templateUrl: './custom-pipe.component.html',
})
export class CustomPipeComponent {
  userService = inject(UserService);
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Transformar valor para display (status, enum, data) | Criar pipe customizado |
| Mesma transformacao em 2+ componentes | Pipe reutilizavel, nunca metodo duplicado |
| Observable retornado por service | AsyncPipe no template, nao subscribe manual |
| Pipe precisa de objeto complexo | Passe apenas o campo necessario (primitivo) |
| Pipe inevitavelmente recebe objeto | Clone antes de qualquer manipulacao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `transform(user: any): any` | `transform(status: number): string` |
| `transform(value: unknown): string \| number` | `transform(value: number): string` |
| `user.status = 'Ativo'` dentro do pipe | `return statusObj[status]` |
| `this.users$.subscribe(...)` no componente | `users$ \| async` no template |
| `getStatusText()` metodo no componente | `\| userStatus` pipe no template |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
