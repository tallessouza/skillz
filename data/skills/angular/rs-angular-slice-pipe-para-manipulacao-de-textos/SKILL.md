---
name: rs-angular-slice-pipe-textos
description: "Applies Angular SlicePipe patterns when manipulating strings or arrays in templates. Use when user asks to 'truncate text', 'extract substring', 'slice array in template', 'limit characters', or 'show partial text' in Angular components. Enforces correct start/end index logic including negative indices and end-exclusive behavior. Make sure to use this skill whenever generating Angular template code that needs string or array subsetting. Not for TypeScript-only string manipulation, RxJS operators, or JavaScript slice outside Angular templates."
---

# SlicePipe para Manipulacao de Textos

> Usar SlicePipe no template Angular para extrair partes de strings e arrays, respeitando a regra de que o indice end e sempre exclusivo (end - 1).

## Rules

1. **Importe SlicePipe no componente** — adicione `SlicePipe` nos imports do componente standalone, porque sem isso o pipe nao e reconhecido no template
2. **Start conta do zero** — indice 0 e o primeiro caractere/item, porque segue a mesma convencao do `String.prototype.slice` nativo do JavaScript
3. **End e exclusivo (end - 1)** — passar end=3 retorna indices 0,1,2 (3 itens), porque o elemento no indice end nao e incluido
4. **Indices negativos contam do final** — start=-4 extrai os ultimos 4 caracteres, porque o pipe replica o comportamento do slice nativo
5. **End omitido vai ate o final** — sem end, a extracao vai do start ate o ultimo caractere/item, porque e o comportamento padrao do slice
6. **Valor maior que o tamanho retorna vazio** — se start excede o comprimento, retorna string/array vazio, porque nao ha indices para extrair

## How to write

### Truncar texto (inicio ate limite)

```html
<!-- Mostra os primeiros 50 caracteres -->
<p>{{ descricao | slice:0:50 }}...</p>
```

### Extrair do final com indice negativo

```html
<!-- Mostra os ultimos 4 caracteres -->
<p>{{ codigo | slice:-4 }}</p>
```

### Extrair secao central

```html
<!-- Extrai do indice 4 ate o 9 (end 10 - 1) -->
<p>{{ texto | slice:4:10 }}</p>
```

## Example

**Before (logica no componente):**
```typescript
@Component({
  template: `<p>{{ textoTruncado }}</p>`
})
export class AppComponent {
  texto = 'Angular e uma plataforma incrivel para desenvolvimento web';
  textoTruncado = this.texto.slice(0, 20);
}
```

**After (com SlicePipe no template):**
```typescript
@Component({
  imports: [SlicePipe],
  template: `<p>{{ texto | slice:0:20 }}...</p>`
})
export class AppComponent {
  texto = 'Angular e uma plataforma incrivel para desenvolvimento web';
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Truncar texto longo no template | `{{ texto \| slice:0:N }}...` |
| Pegar ultimos N caracteres | `{{ texto \| slice:-N }}` |
| Extrair trecho do meio | `{{ texto \| slice:start:end }}` com end = indice desejado + 1 |
| Remover ultimo caractere | `{{ texto \| slice:0:-1 }}` |
| End omitido | Deixe sem end para ir ate o final |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Truncar string no `.ts` so para exibir | Use `slice` pipe no template |
| Esquecer que end e exclusivo e passar indice exato | Passe end = indice desejado + 1 |
| Usar `substring` pipe (nao existe) | Use `slice` pipe |
| Passar start maior que o tamanho sem tratamento | Valide ou use `@if` para verificar tamanho |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
