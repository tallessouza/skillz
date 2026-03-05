# Code Examples: AsyncPipe em Angular

## Exemplo 1: Abordagem com AsyncPipe (recomendada)

Componente final demonstrado na aula:

```typescript
@Component({
  selector: 'app-users',
  template: `
    @for (user of usersService.getUsers() | async; track user.id) {
      <p>{{ user.name }}</p>
    }
  `,
  imports: [AsyncPipe]
})
export class UsersComponent {
  usersService = inject(UsersService);
}
```

O service:

```typescript
@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);

  getUsers() {
    return this.http.get<User[]>('/api/users');
  }
}
```

## Exemplo 2: Abordagem manual (demonstrada para comparação)

O instrutor construiu este código passo a passo para mostrar a verbosidade:

```typescript
@Component({
  selector: 'app-users',
  template: `
    @for (user of usersList; track user.id) {
      <p>{{ user.name }}</p>
    }
  `
})
export class UsersComponent implements OnInit, OnDestroy {
  usersList: any[] = [];
  getUsersSubs!: Subscription;

  usersService = inject(UsersService);

  ngOnInit() {
    this.getUsersSubs = this.usersService.getUsers()
      .subscribe((usersListResponse) => {
        this.usersList = usersListResponse;
      });
  }

  ngOnDestroy() {
    this.getUsersSubs.unsubscribe();
  }
}
```

### Problemas identificados:
- 3 propriedades extras (`usersList`, `getUsersSubs`, `usersService` com mais uso)
- 2 lifecycle hooks (`OnInit`, `OnDestroy`)
- Callback aninhado no subscribe
- Risco de esquecer o unsubscribe

## Exemplo 3: Variação com Observable como propriedade

Padrão alternativo não mostrado na aula, mas alinhado com a filosofia:

```typescript
@Component({
  template: `
    @for (user of users$ | async; track user.id) {
      <p>{{ user.name }}</p>
    }
  `,
  imports: [AsyncPipe]
})
export class UsersComponent {
  private usersService = inject(UsersService);
  users$ = this.usersService.getUsers();
}
```

## Exemplo 4: Múltiplos Observables no template

```typescript
@Component({
  template: `
    <h1>{{ title$ | async }}</h1>
    @for (user of users$ | async; track user.id) {
      <p>{{ user.name }}</p>
    }
    <footer>Total: {{ count$ | async }}</footer>
  `,
  imports: [AsyncPipe]
})
export class DashboardComponent {
  private service = inject(DashboardService);
  title$ = this.service.getTitle();
  users$ = this.service.getUsers();
  count$ = this.service.getUserCount();
}
```

## Exemplo 5: AsyncPipe com Promises

O instrutor menciona que AsyncPipe também funciona com Promises:

```typescript
@Component({
  template: `<p>{{ greeting | async }}</p>`,
  imports: [AsyncPipe]
})
export class GreetingComponent {
  greeting = Promise.resolve('Hello, Angular!');
}
```