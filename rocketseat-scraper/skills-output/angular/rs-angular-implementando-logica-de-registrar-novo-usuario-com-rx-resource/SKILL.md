---
name: rs-angular-rxresource-registro
description: "Applies RxResource pattern for form submission in Angular when writing registration, login, or any form-to-API flows. Use when user asks to 'create a registration form', 'submit form data', 'call API on button click', 'use RxResource', or 'implement signup in Angular'. Enforces signal-based request triggering, undefined-initial-value pattern to prevent premature calls, and deduplication via signal reference equality. Make sure to use this skill whenever implementing form submission with RxResource in Angular. Not for server-side logic, REST API design, or non-Angular frameworks."
---

# RxResource para Submissao de Formularios Angular

> Use RxResource com um signal de parametros iniciado como undefined para controlar quando requisicoes disparam, evitando chamadas duplicadas e chamadas iniciais indesejadas.

## Rules

1. **Crie um signal de parametros tipado como `T | undefined` iniciando com `undefined`** — porque RxResource nao executa o stream quando params retorna undefined, evitando chamada inicial automatica
2. **Atualize o signal via `.set()` no metodo do botao** — porque isso dispara o RxResource apenas quando o usuario clica, nao quando o componente inicializa
3. **Extraia o valor do formulario para uma constante antes de setar** — `const userInfos = this.registerForm.value` antes de `this.registerParams.set(userInfos)`, porque preserva a referencia e evita chamadas duplicadas se o valor nao mudou
4. **Crie uma interface dedicada para os params** — em `models/register-params.ts` dentro da feature, porque tipagem explicita garante contrato entre formulario e API
5. **Acesse os params desestruturados no stream** — `params.name`, `params.email`, `params.password`, porque o RxResource envolve o retorno do callback params em um objeto `{ params }`
6. **Injete o service com `private readonly`** — `private readonly _userApi = inject(UserApiService)`, porque segue o padrao Angular moderno de injecao

## How to write

### Signal de parametros com undefined inicial

```typescript
// Signal comeca undefined = requisicao NAO dispara no init
registerParams = signal<IRegisterParams | undefined>(undefined);
```

### RxResource para registro

```typescript
registerResource = rxResource({
  params: () => this.registerParams(),
  stream: ({ params }) => {
    return this._userApi.register(params.name, params.email, params.password);
  }
});
```

### Metodo de submit no componente

```typescript
register(): void {
  const userInfos = this.registerForm.value as IRegisterParams;
  this.registerParams.set(userInfos);
}
```

### Interface de parametros

```typescript
// models/register-params.ts
export interface IRegisterParams {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

### Template com evento de clique

```html
<button (click)="register()">Criar</button>
```

## Example

**Before (chamada direta sem RxResource):**
```typescript
register(): void {
  const { name, email, password } = this.registerForm.value;
  this._userApi.register(name, email, password).subscribe(res => {
    console.log(res);
  });
}
// Problema: subscribe manual, sem deduplicacao, sem gestao de lifecycle
```

**After (com RxResource):**
```typescript
private readonly _userApi = inject(UserApiService);
registerParams = signal<IRegisterParams | undefined>(undefined);

registerResource = rxResource({
  params: () => this.registerParams(),
  stream: ({ params }) => this._userApi.register(params.name, params.email, params.password)
});

register(): void {
  const userInfos = this.registerForm.value as IRegisterParams;
  this.registerParams.set(userInfos);
}
// RxResource gerencia subscribe, lifecycle e deduplicacao automaticamente
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulario com submit via botao | Signal undefined inicial + `.set()` no click |
| Mesmos dados enviados 2x seguidas | RxResource ignora automaticamente (referencia igual) |
| Precisa logar params para debug | `console.log(params)` dentro do callback stream |
| Tipagem dos params do formulario | Interface dedicada na pasta models da feature |
| Varios campos no formulario | Extraia `.value` do FormGroup inteiro, nao campo a campo |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `.subscribe()` manual para submit | `rxResource` com signal de params |
| `signal<IRegisterParams>(initialValue)` | `signal<IRegisterParams \| undefined>(undefined)` |
| Params inline no set: `this.params.set({name: this.form.get('name')...})` | `const userInfos = this.form.value; this.params.set(userInfos)` |
| Chamada API direta no metodo de click | Signal update que dispara RxResource |
| Interface de params no mesmo arquivo do componente | Arquivo dedicado em `models/register-params.ts` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
