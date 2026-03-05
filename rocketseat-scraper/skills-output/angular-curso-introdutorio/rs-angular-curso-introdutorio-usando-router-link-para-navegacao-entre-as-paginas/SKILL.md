---
name: rs-angular-intro-router-link-navegacao
description: "Applies Angular RouterLink patterns when building navigation between pages. Use when user asks to 'add navigation', 'link pages', 'redirect on click', 'create navbar links', or 'navigate between routes' in Angular. Enforces correct RouterLink usage: string for static routes, bracket syntax with arrays for dynamic routes, proper import in component TypeScript. Make sure to use this skill whenever creating Angular navigation or linking components to routes. Not for programmatic navigation via Router service, route guards, or lazy loading configuration."
---

# RouterLink para Navegacao em Angular

> Use RouterLink para navegacao declarativa no template: string para rotas fixas, colchetes com array para rotas dinamicas.

## Rules

1. **Importe RouterLink no componente** — adicione `RouterLink` no array de imports do componente TypeScript, porque sem o import o Angular ignora silenciosamente o atributo
2. **Use string para rotas fixas** — `routerLink="/certificados"` quando a rota nunca muda, porque e mais simples e legivel
3. **Use colchetes com array para rotas dinamicas** — `[routerLink]="['/certificados', id]"` quando parte da rota vem de uma variavel, porque colchetes interpretam o valor como TypeScript
4. **Cada item do array e um segmento da rota** — `['/certificados', id]` gera `/certificados/6`, porque o Angular concatena os segmentos automaticamente
5. **RouterLink funciona em qualquer elemento** — divs, botoes, componentes customizados, nao apenas tags `<a>`, porque o Angular aplica o binding independente do elemento
6. **Logo deve ter routerLink para rota raiz** — convencao de UX: clicar no logo redireciona para `/`, porque usuarios esperam esse comportamento

## How to write

### Rota fixa (string)
```html
<!-- Navbar: link para rota fixa -->
<a routerLink="/">Lista de Certificados</a>
<a routerLink="/certificados/novo">Gerar Certificado</a>
```

### Rota dinamica (colchetes + array)
```html
<!-- Lista: link com ID dinamico -->
<app-card [routerLink]="['/certificados', id]"></app-card>
```

```typescript
// No componente TypeScript
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  // ...
})
export class CertificadoCardComponent {
  id: string = '6';
}
```

### Botao de voltar
```html
<div routerLink="/" class="btn-voltar">Voltar</div>
```

## Example

**Before (sem navegacao):**
```html
<!-- navbar.component.html -->
<a>Lista de Certificados</a>
<a>Gerar Certificado</a>
```
```typescript
// navbar.component.ts
@Component({ imports: [] })
export class NavbarComponent {}
```

**After (com RouterLink):**
```html
<!-- navbar.component.html -->
<img routerLink="/" src="logo.svg" alt="Logo" />
<a routerLink="/">Lista de Certificados</a>
<a routerLink="/certificados/novo">Gerar Certificado</a>
```
```typescript
// navbar.component.ts
import { RouterLink } from '@angular/router';

@Component({ imports: [RouterLink] })
export class NavbarComponent {}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota completamente estatica | `routerLink="/path"` (string) |
| Rota com variavel (ID, slug) | `[routerLink]="['/path', variavel]"` (array) |
| Componente customizado precisa navegar | Aplique `[routerLink]` direto no componente |
| Logo/icone do site | `routerLink="/"` para rota raiz |
| Botao de voltar para listagem | `routerLink="/"` ou rota da lista |
| Elemento clicavel sem cursor pointer | Adicione `cursor: pointer` no CSS |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `routerLink="certificados"` (sem barra) | `routerLink="/certificados"` (com barra inicial) |
| `[routerLink]="'/certificados/5'"` (string hardcoded com colchetes) | `routerLink="/certificados/5"` (sem colchetes para string fixa) |
| `[routerLink]="variavel"` (variavel unica para rota dinamica) | `[routerLink]="['/certificados', id]"` (array com segmentos) |
| RouterLink no template sem import no TS | Sempre importe `RouterLink` no array de imports |
| `<a href="/certificados">` (href tradicional) | `<a routerLink="/certificados">` (SPA navigation) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
