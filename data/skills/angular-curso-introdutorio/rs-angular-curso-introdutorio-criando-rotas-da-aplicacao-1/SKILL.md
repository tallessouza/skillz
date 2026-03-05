---
name: rs-angular-intro-criando-rotas
description: "Applies Angular routing patterns when configuring navigation between pages. Use when user asks to 'create routes', 'add navigation', 'configure router', 'setup pages', or 'define paths' in Angular applications. Enforces correct app.routes.ts structure, router-outlet placement, route parameters with :id syntax, and clean import hygiene. Make sure to use this skill whenever scaffolding Angular routes or adding new pages. Not for lazy loading, route guards, or resolvers."
---

# Criando Rotas em Angular

> Defina rotas no `app.routes.ts` com path e component, e use `<router-outlet>` para renderizar dinamicamente.

## Rules

1. **Defina rotas em `app.routes.ts`** — cada rota e um objeto com `path` e `component`, porque centralizar rotas facilita manutencao e leitura
2. **Nunca comece path com barra** — escreva `certificados/novo`, nao `/certificados/novo`, porque o Angular ja resolve o prefixo
3. **Use `<router-outlet>` no template pai** — substitua componentes fixos pelo outlet, porque sem ele as rotas nao renderizam nada
4. **Rota raiz usa string vazia** — `path: ''` define a pagina inicial, porque e o padrao Angular para a rota default
5. **Parametros dinamicos usam `:nome`** — `certificados/:id` captura o valor da URL, porque permite acessar itens especificos
6. **Remova imports nao utilizados** — execute `ng generate @angular/core:cleanup-unused-imports`, porque imports orfaos poluem o console com warnings

## How to write

### Arquivo de rotas (`app.routes.ts`)

```typescript
import { Routes } from '@angular/router';
import { CertificadosComponent } from './pages/certificados/certificados.component';
import { CertificadoFormComponent } from './pages/certificado-form/certificado-form.component';
import { CertificadoComponent } from './pages/certificado/certificado.component';

export const routes: Routes = [
  { path: '', component: CertificadosComponent },
  { path: 'certificados/novo', component: CertificadoFormComponent },
  { path: 'certificados/:id', component: CertificadoComponent },
];
```

### Template principal (`app.component.html`)

```html
<app-navbar />
<router-outlet />
<app-base-layout />
```

## Example

**Before (componente fixo no template):**

```html
<!-- app.component.html -->
<app-navbar />
<app-certificados />
<app-base-layout />
```

**After (router-outlet renderiza dinamicamente):**

```html
<!-- app.component.html -->
<app-navbar />
<router-outlet />
<app-base-layout />
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Pagina inicial (dominio raiz) | `path: ''` com o componente default |
| Pagina de listagem | `path: 'certificados'` |
| Pagina de criacao/formulario | `path: 'certificados/novo'` |
| Pagina de item especifico | `path: 'certificados/:id'` com parametro dinamico |
| Dois estados visuais na mesma tela | Uma unica rota, controle por estado interno do componente |
| Console cheio de warnings de import | `ng generate @angular/core:cleanup-unused-imports` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `path: '/certificados'` | `path: 'certificados'` |
| Trocar componente manualmente no HTML | Usar `<router-outlet>` |
| Uma rota para cada estado visual | Uma rota, dois estados no componente |
| Deixar imports orfaos no component | Executar cleanup de imports |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
