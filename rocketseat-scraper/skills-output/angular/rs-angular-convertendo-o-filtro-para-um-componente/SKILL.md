---
name: rs-angular-convertendo-filtro-componente
description: "Applies Angular component extraction pattern when refactoring large components into smaller ones. Use when user asks to 'extract component', 'split component', 'create child component', 'refactor template', or 'separate concerns' in Angular. Enforces correct folder structure (components/pages/layout), CLI generation, and import wiring. Make sure to use this skill whenever breaking Angular components into smaller pieces. Not for creating routed pages, services, or directives."
---

# Extraindo Componentes em Angular

> Ao identificar um trecho de template com logica propria, extraia-o para um componente dedicado dentro de `components/`.

## Rules

1. **Classifique antes de criar** — componentes vao em `components/`, paginas roteadas em `pages/`, componentes puramente visuais em `layout/`, porque a organizacao por responsabilidade facilita navegacao e manutencao
2. **Use o Angular CLI para gerar** — `ng generate component {nome} --skip-tests=true`, porque garante estrutura padrao e registra automaticamente no modulo
3. **Recorte o HTML inteiro do trecho** — mova o bloco completo (da div pai ate o fechamento), nunca copie parcialmente, porque referencias quebradas sao bugs silenciosos
4. **Importe o componente no pai** — adicione o componente nos `imports` do componente pai (standalone) ou no modulo, porque Angular nao resolve componentes nao declarados
5. **Use o seletor padrao** — `app-{nome-do-componente}` no template do pai, porque e a convencao que o CLI gera automaticamente
6. **Mantenha a logica para o proximo passo** — na extracao inicial, mova apenas o template; adicione inputs/outputs e logica depois, porque separar estrutura de comportamento reduz erros

## How to write

### Estrutura de pastas para features

```
features/
  movies/
    components/       # Componentes reutilizaveis da feature
      movies-filter/
    pages/            # Componentes roteados
      explore-movies/
    layout/           # Componentes puramente visuais
```

### Gerando o componente via CLI

```bash
ng generate component features/movies/components/movies-filter --skip-tests=true
```

### Substituindo no template pai

```html
<!-- explore-movies.component.html -->
<!-- ANTES: 60 linhas de HTML de filtro inline -->
<!-- DEPOIS: -->
<app-movies-filter />
```

### Importando no componente pai (standalone)

```typescript
// explore-movies.component.ts
import { MoviesFilterComponent } from '../components/movies-filter/movies-filter.component';

@Component({
  selector: 'app-explore-movies',
  standalone: true,
  imports: [MoviesFilterComponent],
  templateUrl: './explore-movies.component.html',
})
export class ExploreMoviesComponent {}
```

## Example

**Before (template do pai com 90+ linhas):**
```html
<!-- explore-movies.component.html -->
<div class="container">
  <h1>Explorar Filmes</h1>

  <!-- 60 linhas de filtro misturadas aqui -->
  <div class="md:w-full">
    <select>...</select>
    <input type="text" />
    <div class="filter-options">...</div>
  </div>

  <div class="movies-grid">...</div>
</div>
```

**After (template limpo + componente extraido):**
```html
<!-- explore-movies.component.html -->
<div class="container">
  <h1>Explorar Filmes</h1>

  <app-movies-filter />

  <div class="movies-grid">...</div>
</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Trecho tem logica propria (filtro, form, card) | Extrair para componente em `components/` |
| Trecho e puramente visual (header, footer) | Extrair para `layout/` |
| Trecho e uma rota | Criar em `pages/` |
| Componente pai tem mais de 80 linhas de template | Forte sinal de que precisa extrair |
| Trecho sera reutilizado em outra page | Extrair imediatamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Componente de filtro dentro de `pages/` | Colocar em `components/` (nao e roteado) |
| Copiar HTML manualmente sem usar CLI | `ng generate component` para estrutura padrao |
| Esquecer de adicionar nos `imports` do pai | Sempre importar e declarar no componente standalone |
| Mover HTML + logica + bindings de uma vez | Primeiro mover HTML, depois adicionar logica |
| Criar componente na raiz do projeto | Criar dentro da feature correspondente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
