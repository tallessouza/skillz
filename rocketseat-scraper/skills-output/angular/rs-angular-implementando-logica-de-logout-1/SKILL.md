---
name: rs-angular-implementando-logica-de-logout
description: "Applies Angular logout pattern with token removal and route redirect when implementing authentication flows. Use when user asks to 'implement logout', 'add sign out', 'remove auth token', 'redirect after logout', or 'protect routes' in Angular. Ensures proper service injection, localStorage cleanup, and Router navigation. Make sure to use this skill whenever building auth flows in Angular, even partial ones. Not for login implementation, token generation, or auth guard creation."
---

# Logout em Angular — Token Removal + Redirect

> Ao implementar logout, remova o token via service injetado e redirecione com Router.navigate.

## Rules

1. **Injete services com `inject()`** — `private readonly _service = inject(Service)`, porque é o padrão moderno do Angular (standalone-friendly)
2. **Nunca acesse localStorage diretamente no componente** — use um service dedicado (`UserTokenStore`), porque centraliza a lógica de storage e facilita testes
3. **Sempre redirecione após logout** — `this._router.navigate(['/auth/login'])`, porque deixar o usuário numa tela autenticada sem token causa erros
4. **Bind o método no template com `(click)`** — `(click)="logout()"` em todos os botões de logout (maximizado e minimizado), porque menus responsivos duplicam botões

## How to write

### Service de token (já existente, apenas consuma)

```typescript
// O componente NÃO conhece localStorage — delega ao service
private readonly _userTokenStore = inject(UserTokenStoreService);
private readonly _router = inject(Router);
```

### Método de logout

```typescript
logout(): void {
  this._userTokenStore.removeToken();
  this._router.navigate(['/auth/login']);
}
```

### Template (bind nos dois estados do menu)

```html
<!-- Menu maximizado -->
<button (click)="logout()" class="cursor-pointer">Sair</button>

<!-- Menu minimizado (dentro do @if isMenuOpen) -->
<button (click)="logout()" class="cursor-pointer">Sair</button>
```

## Example

**Before (acesso direto ao localStorage no componente):**

```typescript
logout(): void {
  localStorage.removeItem('token');
  console.log('logged out');
  // esqueceu de redirecionar — usuário fica preso
}
```

**After (com este skill aplicado):**

```typescript
private readonly _userTokenStore = inject(UserTokenStoreService);
private readonly _router = inject(Router);

logout(): void {
  this._userTokenStore.removeToken();
  this._router.navigate(['/auth/login']);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Menu tem versao maximizada e minimizada | Bind `(click)="logout()"` em ambos os botoes |
| Links de navegacao sem cursor pointer | Adicione `cursor-pointer` na classe da ancora |
| Token existe em localStorage apos logout | Verifique se `removeToken()` esta sendo chamado |
| Usuario acessa rota protegida sem token | Auth guard deve redirecionar (responsabilidade separada) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `localStorage.removeItem('token')` no componente | `this._userTokenStore.removeToken()` via service |
| `window.location.href = '/login'` | `this._router.navigate(['/auth/login'])` |
| Logout sem redirect | Sempre `removeToken()` + `navigate()` |
| `console.log` no metodo final | Remova logs de debug antes de commitar |
| Cursor pointer so no menu maximizado | Aplique em ambas versoes do menu |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
