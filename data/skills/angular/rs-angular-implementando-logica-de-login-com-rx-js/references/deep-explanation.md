# Deep Explanation: Login com RxJS e Signals no Angular

## RxJS e Signals nao se substituem totalmente

O instrutor enfatiza um ponto crucial: **Signals nao substituem completamente o RxJS**. A confusao e comum porque Signals parecem fazer tudo que Observables fazem, mas na pratica:

- **RxJS** brilha em: requisicoes HTTP, chains de eventos complexos (pegar response de um endpoint e chamar outro, fazer tratativas encadeadas), operadores de transformacao
- **Signals** brilham em: tratamento de dados no template do componente, reatividade granular na UI

A coexistencia e esperada e correta. Nao e um erro misturar os dois — e o padrao recomendado atualmente.

## Por que Signals sao mais performaticos que Change Detection + Zone.js

O instrutor explica o mecanismo interno:

1. Quando voce referencia um Signal no template (`{{ signal() }}` ou dentro de `@if`), **so nesse momento** o Angular cria o tracking
2. Quando o Signal muda de valor (via `.set()`), o Angular sabe **exatamente onde** ele esta sendo usado no template
3. O Angular vai **apenas naquele local especifico** e atualiza — nao roda Change Detection na arvore inteira

Isso contrasta com o modelo anterior (Zone.js + Change Detection padrao), que verificava todos os bindings do componente a cada ciclo.

## O problema do subscribe sem gerenciamento

Quando voce faz `.subscribe()` em um Observable, voce cria uma subscription ativa. Se o componente e destruido (usuario navega para outra pagina), essa subscription **continua viva** em memoria — memory leak.

### Solucao classica (verbosa):
```typescript
private subscription: Subscription;

ngOnInit() {
  this.subscription = this.api.getData().subscribe(...);
}

ngOnDestroy() {
  this.subscription.unsubscribe();
}
```

### Solucao moderna (takeUntilDestroyed):
```typescript
private readonly _destroyRef = inject(DestroyRef);

login() {
  this.api.login(email, password)
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe({...});
}
```

O `DestroyRef` e um service injetavel que o Angular fornece. Ele sabe quando o componente morre. O operador `takeUntilDestroyed` (do `@angular/core`) se desinscreve automaticamente quando o componente sai de tela.

## Fluxo completo do login demonstrado

1. Usuario clica "Entrar" → executa `login()`
2. Pega email e password do `loginForm.value` via destructuring
3. Chama `_userApi.login(email, password)` — retorna Observable (nao dispara ainda)
4. `.subscribe()` dispara a requisicao HTTP
5. **Sucesso (next):** `_router.navigate(['/explore'])` redireciona
6. **Erro (error):** `loginErrorMessage.set(error.error.message)` atualiza Signal
7. No template, `@if (loginErrorMessage())` mostra o paragrafo de erro
8. O token retornado e salvo automaticamente via `tap` no service (implementado em aula anterior)
9. Ao redirecionar para `/explore`, o guard valida o token

## Estrutura do HttpErrorResponse

```typescript
HttpErrorResponse {
  error: {
    message: "e-mail ou senha inválidos"  // response do backend
  },
  status: 401,
  statusText: "Unauthorized"
}
```

O instrutor mostrou no console que `error.error.message` e o caminho correto para a mensagem do backend.

## Padrao de injecao preferido pelo instrutor

```typescript
private readonly _userApi = inject(UserApi);
private readonly _router = inject(Router);
private readonly _destroyRef = inject(DestroyRef);
```

Padrao: `private readonly _nomeCamelCase = inject(Classe)` — underscore prefix indica membro privado, readonly impede reatribuicao.