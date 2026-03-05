---
name: rs-angular-rota-nao-encontrada
description: "Applies Angular wildcard route configuration for handling unknown/404 routes. Use when user asks to 'handle 404', 'redirect unknown routes', 'configure not found page', 'wildcard route', or 'catch-all route' in Angular. Ensures correct placement, pathMatch, and redirectTo setup. Make sure to use this skill whenever configuring Angular routing that needs fallback behavior. Not for lazy loading, route guards, or route resolvers."
---

# Configurando Rota Nao Encontrada (Angular)

> Toda aplicacao Angular com rotas deve ter um wildcard route no final do array para capturar rotas inexistentes e redirecionar o usuario.

## Rules

1. **Wildcard route sempre no final do array** — `path: '**'` deve ser o ultimo item em `Routes`, porque Angular avalia rotas em ordem e o wildcard captura tudo
2. **Use `redirectTo` com path absoluto** — comece com `/` para evitar redirecionamentos relativos inesperados
3. **Sempre inclua `pathMatch: 'full'`** — necessario para que o redirect funcione corretamente com wildcard

## How to write

### Wildcard route basico

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'explore', component: ExploreComponent },
  // ... todas as outras rotas primeiro
  { path: '**', redirectTo: '/login', pathMatch: 'full' } // SEMPRE por ultimo
];
```

## Example

**Before (rota inexistente cai em pagina vazia):**
```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'explore', component: ExploreComponent },
  // usuario digita /teste → pagina vazia, sem feedback
];
```

**After (com wildcard redirect):**
```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'explore', component: ExploreComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
```

## Heuristics

| Situation | Do |
|-----------|-----|
| App tem autenticacao | Redirecione wildcard para `/login` |
| App publica sem login | Redirecione wildcard para `/home` ou `/` |
| Precisa mostrar pagina 404 customizada | Use `component: NotFoundComponent` em vez de `redirectTo` |
| Tem guards no destino do redirect | O guard sera executado normalmente apos o redirect |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Wildcard no inicio/meio do array | Wildcard como ultimo elemento |
| `path: '*'` (um asterisco) | `path: '**'` (dois asteriscos) |
| `redirectTo: 'login'` (relativo) | `redirectTo: '/login'` (absoluto) |
| Wildcard sem `pathMatch` | Wildcard com `pathMatch: 'full'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
