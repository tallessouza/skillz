# Code Examples: Evitando Chamadas Duplicadas com Signals

## Exemplo completo do instrutor

### Componente de Login (antes — com duplicatas)

```typescript
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  loginParams = signal<LoginParams | null>(null);

  loginResource = rxResource({
    request: () => this.loginParams(),
    loader: ({ request }) => {
      if (!request) return of(null);
      return this.authService.login(request);
    }
  });

  onSubmit() {
    // PROBLEMA: cria novo objeto a cada clique
    this.loginParams.set({
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    });
  }
}
```

### Componente de Login (depois — sem duplicatas)

```typescript
onSubmit() {
  // SOLUCAO: preservar referencia de memoria
  const credentials = this.loginForm.value as LoginParams;
  this.loginParams.set(credentials);
}
```

## Demonstracao do comportamento do Signal

### Signal com primitivo (comparacao por valor)

```typescript
const count = signal(1);

count.set(1); // NAO dispara — mesmo valor
count.set(2); // DISPARA — valor diferente
count.set(2); // NAO dispara — mesmo valor
```

### Signal com objeto (comparacao por referencia)

```typescript
const params = signal({ email: 'a@b.com', password: '123' });

// DISPARA — novo objeto, nova referencia (mesmo conteudo!)
params.set({ email: 'a@b.com', password: '123' });

// NAO DISPARA — mesma referencia
const ref = { email: 'a@b.com', password: '123' };
params.set(ref);
params.set(ref); // nao dispara
params.set(ref); // nao dispara
```

## Variacao: formulario de busca/filtro

```typescript
@Component({ ... })
export class SearchComponent {
  searchParams = signal<SearchFilters | null>(null);

  searchResource = rxResource({
    request: () => this.searchParams(),
    loader: ({ request }) => {
      if (!request) return of([]);
      return this.movieService.search(request);
    }
  });

  onSearch() {
    // Preserva referencia — evita buscas duplicadas
    const filters = this.searchForm.value as SearchFilters;
    this.searchParams.set(filters);
  }
}
```

## Variacao: custom equality function

Para casos onde voce precisa comparar por conteudo (deep equality) em vez de referencia:

```typescript
const params = signal<LoginParams | null>(null, {
  equal: (a, b) => {
    if (!a || !b) return a === b;
    return a.email === b.email && a.password === b.password;
  }
});

// Agora compara por CONTEUDO, nao por referencia
params.set({ email: 'a@b.com', password: '123' }); // dispara (primeiro set)
params.set({ email: 'a@b.com', password: '123' }); // NAO dispara (mesmo conteudo)
```

Esta e uma alternativa quando nao e possivel garantir a mesma referencia de memoria (ex: dados vindos de fontes diferentes).