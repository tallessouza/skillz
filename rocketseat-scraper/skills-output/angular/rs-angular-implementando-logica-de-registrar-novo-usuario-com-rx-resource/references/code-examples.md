# Code Examples: RxResource para Registro

## Exemplo completo do componente

### Injecao do service

```typescript
private readonly _userApi = inject(UserApiService);
```

### Signal de parametros

```typescript
registerParams = signal<IRegisterParams | undefined>(undefined);
```

### RxResource

```typescript
registerResource = rxResource({
  params: () => this.registerParams(),
  stream: ({ params }) => {
    return this._userApi.register(params.name, params.email, params.password);
  }
});
```

### Metodo register chamado pelo template

```typescript
register(): void {
  const userInfos = this.registerForm.value as IRegisterParams;
  this.registerParams.set(userInfos);
}
```

### Template do botao

```html
<button (click)="register()">Criar</button>
```

## Interface de parametros

```typescript
// models/register-params.ts
export interface IRegisterParams {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

## Debugging: logando params no stream

```typescript
registerResource = rxResource({
  params: () => this.registerParams(),
  stream: ({ params }) => {
    console.log(params); // { name: '...', email: '...', password: '...', confirmPassword: '...' }
    return this._userApi.register(params.name, params.email, params.password);
  }
});
```

## Comparacao: Login vs Registro (mesmo padrao)

### Login

```typescript
loginParams = signal<ILoginParams | undefined>(undefined);

loginResource = rxResource({
  params: () => this.loginParams(),
  stream: ({ params }) => this._userApi.login(params.email, params.password)
});

login(): void {
  const credentials = this.loginForm.value as ILoginParams;
  this.loginParams.set(credentials);
}
```

### Registro

```typescript
registerParams = signal<IRegisterParams | undefined>(undefined);

registerResource = rxResource({
  params: () => this.registerParams(),
  stream: ({ params }) => this._userApi.register(params.name, params.email, params.password)
});

register(): void {
  const userInfos = this.registerForm.value as IRegisterParams;
  this.registerParams.set(userInfos);
}
```

## Variacao: RxResource com tratamento de erro

```typescript
registerResource = rxResource({
  params: () => this.registerParams(),
  stream: ({ params }) => {
    return this._userApi.register(params.name, params.email, params.password).pipe(
      catchError(error => {
        console.error('Registration failed:', error);
        return EMPTY;
      })
    );
  }
});
```

## Variacao: RxResource com redirect apos sucesso

```typescript
registerResource = rxResource({
  params: () => this.registerParams(),
  stream: ({ params }) => {
    return this._userApi.register(params.name, params.email, params.password).pipe(
      tap(() => this._router.navigate(['/login']))
    );
  }
});
```