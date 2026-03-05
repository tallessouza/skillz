---
name: rs-angular-rota-area-autenticada
description: "Applies Angular authenticated area routing pattern with main layout component and child routes. Use when user asks to 'create authenticated routes', 'setup protected area', 'add layout with header and child routes', 'configure Angular router outlet with children', or 'create main layout component'. Enforces the pattern of structural layout components in core/layout that group header + router-outlet for child route rendering. Make sure to use this skill whenever setting up authenticated areas or layout wrapper components in Angular. Not for route guards, authentication logic, or login/register page routing."
---

# Rotas de Area Autenticada com Main Layout

> Crie um componente estruturante (main layout) que agrupa header fixo + router-outlet para renderizar rotas filhas da area autenticada.

## Rules

1. **Separe layout autenticado do AppComponent** — nao coloque header no AppComponent HTML, porque ele apareceria tambem nas rotas de login/registro
2. **Componentes estruturantes ficam em core/layout** — porque nao sao reutilizaveis (shared), sao necessarios para a aplicacao funcionar
3. **Use children array para rotas filhas** — todas as rotas da area autenticada sao children do main-layout, porque o Angular carrega elas dentro do router-outlet do pai
4. **Redirecione path vazio para rota padrao** — use `redirectTo` com `pathMatch: 'full'` no path vazio dos children, porque o usuario precisa ver algo ao acessar a raiz
5. **Rotas dinamicas usam :param** — `details/:id` permite carregar conteudo baseado no parametro, porque cada filme/item tem seu proprio ID

## How to write

### Estrutura de rotas com area autenticada

```typescript
// app.routes.ts
export const routes: Routes = [
  // Rotas publicas (login, registro) ficam aqui no nivel raiz

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'explore', pathMatch: 'full' },
      { path: 'explore', component: ExploreMoviesComponent },
      { path: 'favorites', component: FavoriteMoviesComponent },
      { path: 'details/:id', component: MovieDetailsComponent },
      { path: 'create', component: CreateMovieComponent },
    ]
  }
];
```

### Main Layout Component

```typescript
// core/layout/main-layout/main-layout.component.ts
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  template: `
    <app-header />
    <router-outlet />
  `
})
export class MainLayoutComponent {}
```

## Example

**Before (header no AppComponent — errado):**
```html
<!-- app.component.html -->
<app-header />
<router-outlet />
<!-- header aparece em TODAS as rotas, incluindo login/registro -->
```

**After (header no MainLayout — correto):**
```html
<!-- app.component.html -->
<router-outlet />

<!-- main-layout.component.html -->
<app-header />
<router-outlet />
<!-- header aparece APENAS nas rotas filhas autenticadas -->
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Header deve aparecer apenas em area logada | Criar MainLayoutComponent com header + router-outlet |
| Componente depende de parametro na URL | Usar rota dinamica `path: 'recurso/:id'` |
| Path vazio nao tem componente proprio | Usar `redirectTo` + `pathMatch: 'full'` |
| Componente e estruturante (nao reutilizavel) | Colocar em `core/layout/` |
| Componente e reutilizavel entre features | Colocar em `shared/` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Header no AppComponent quando ha rotas publicas | Header dentro do MainLayoutComponent |
| Rotas filhas soltas no nivel raiz | Rotas filhas dentro do `children` array |
| Path vazio sem redirect (tela em branco) | `redirectTo: 'explore', pathMatch: 'full'` |
| RouterOutlet sem importar no componente standalone | Importar `RouterOutlet` no array de imports |
| Gerar componente estruturante em shared/ | Gerar em core/layout/ |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
