---
name: rs-angular-binding-informacoes-filmes
description: "Applies Angular template binding patterns when rendering dynamic lists with property binding, interpolation, DecimalPipe, and locale configuration. Use when user asks to 'render a list', 'bind data to template', 'format numbers in Angular', 'use DecimalPipe', 'configure locale pt-BR', or 'loop through items with @for'. Make sure to use this skill whenever generating Angular templates that display dynamic data from HTTP responses. Not for Angular routing, forms, or HTTP service creation."
---

# Binding de Informacoes em Templates Angular

> Renderize listas dinamicas usando @for com track, property binding para atributos, interpolacao para texto, e DecimalPipe com locale para formatacao numerica.

## Rules

1. **Use @for com track obrigatorio** — `@for (item of items; track item.id)` porque o Angular precisa do track para atualizar itens de forma performatica
2. **Property binding para atributos dinamicos** — `[src]="expressao"` nao `src="{{expressao}}"`, porque property binding avalia a expressao corretamente para atributos HTML
3. **Interpolacao para conteudo textual** — `{{ movie.titulo }}` dentro de tags de texto, porque interpolacao e o padrao para renderizar valores inline
4. **DecimalPipe com parametros explicitos** — `{{ valor | number:'1.0-1' }}` onde `1.0-1` significa minimo 1 inteiro, minimo 0 decimais, maximo 1 decimal, porque evita exibir numeros com precisao excessiva como `3.3486`
5. **Registre locales antes de usar** — chame `registerLocaleData(pt)` no `app.config.ts` antes de usar `pt-BR` no pipe, porque Angular so registra locale americano por padrao
6. **Propriedades fixas nao precisam de signal** — use propriedade simples (`basePath = 'http://...'`) quando o valor nunca muda, porque signal adiciona complexidade desnecessaria

## How to write

### Loop com @for e track

```typescript
// No template: renderize um elemento para cada item
@for (movie of movies(); track movie.id) {
  <button class="movie-card">
    <!-- conteudo do filme -->
  </button>
}
```

### Property binding para imagens

```typescript
// Concatene base path com caminho dinamico
// No componente:
basePath = 'http://localhost:3000';

// No template:
<img [src]="basePath + '/upload/' + movie.imagem" />
```

### DecimalPipe com locale brasileiro

```typescript
// No componente, importe DecimalPipe:
imports: [DecimalPipe]

// No template:
{{ movie.mediaVotos | number:'1.0-1':'pt-BR' }}
// Resultado: 3,3 (virgula, nao ponto)
```

### Registro de locale no app.config.ts

```typescript
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';

registerLocaleData(pt);
```

## Example

**Before (lista chumbada):**
```html
<button class="movie-card">
  <img src="/assets/matrix.jpg" />
  <span>3.3486</span>
  <h3>Matrix</h3>
</button>
<button class="movie-card">
  <img src="/assets/interstellar.jpg" />
  <span>4.8</span>
  <h3>Interestelar</h3>
</button>
```

**After (com binding dinamico):**
```html
@for (movie of movies(); track movie.id) {
  <button class="movie-card">
    <img [src]="basePath + '/upload/' + movie.imagem" />
    <span>⭐ {{ movie.mediaVotos | number:'1.0-1':'pt-BR' }}</span>
    <h3>{{ movie.titulo }}</h3>
    <p>{{ movie.genero }} - {{ movie.anoLancamento }}</p>
  </button>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Lista vinda de HTTP response | Use @for com track pelo id unico |
| Atributo HTML precisa de valor dinamico | Property binding `[attr]="expr"` |
| Texto dentro de tag | Interpolacao `{{ valor }}` |
| Numero decimal para exibicao | DecimalPipe com formato explicito |
| Formato brasileiro (virgula) | Terceiro parametro `'pt-BR'` + registerLocaleData |
| URL base fixa usada em concatenacao | Propriedade simples, sem signal |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `@for (movie of movies(); track $index)` | `@for (movie of movies(); track movie.id)` |
| `src="{{ basePath + movie.img }}"` | `[src]="basePath + '/upload/' + movie.imagem"` |
| `{{ movie.mediaVotos }}` sem pipe | `{{ movie.mediaVotos \| number:'1.0-1':'pt-BR' }}` |
| Usar locale `pt-BR` sem registerLocaleData | Registrar locale no app.config.ts primeiro |
| Multiplos botoes chumbados para cada filme | Um unico template com @for |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
