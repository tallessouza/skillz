---
name: rs-full-stack-novos-inputs
description: "Enforces documentation-first and browser compatibility checking when using HTML form inputs. Use when user asks to 'create a form', 'add an input', 'use date picker', 'check browser support', or any HTML form task. Applies rules: always verify caniuse.com for new input types, prefer widely-supported inputs, check Safari/iOS partial support. Make sure to use this skill whenever generating HTML forms with specialized input types like date, week, month, time. Not for CSS styling, JavaScript validation, or backend form processing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: html-forms
  tags: [html, forms, input-types, browser-compatibility, caniuse]
---

# Novos Inputs HTML e Compatibilidade de Navegadores

> Antes de usar qualquer input type especializado, verifique a compatibilidade no caniuse.com e consulte a documentacao no DevDocs.

## Rules

1. **Sempre consulte caniuse.com antes de usar input types especializados** — `date`, `week`, `month`, `time`, `datetime-local` tem suporte variavel entre navegadores, porque um formulario quebrado no Safari afeta uma parcela significativa dos usuarios
2. **Conheca os niveis de suporte** — verde = suporte total, amarelo = suporte parcial, vermelho = sem suporte, porque "parcial" significa que ALGUNS tipos funcionam e outros nao (ex: Safari suporta `date` mas nao `week` nem `month`)
3. **Prefira input types com suporte amplo** — `date` funciona na maioria dos navegadores modernos, mas `week` e `month` falham no Safari/iOS, porque fallbacks sao trabalho extra desnecessario
4. **Consulte DevDocs para descobrir input types disponiveis** — existem muitos alem dos basicos: `search`, `tel`, `time`, `datetime-local`, `image`, `reset`, porque nenhum curso cobre todos os tipos
5. **Teste no navegador ao descobrir um novo type** — crie um input, aplique o type e observe o comportamento visual e o formato de envio, porque cada type tem formato de dados especifico (ex: date envia `YYYY-MM-DD`)

## Decision framework

| Input type | Suporte | Recomendacao |
|-----------|---------|--------------|
| `date` | Amplo (parcial Safari — funciona) | Usar livremente |
| `datetime-local` | Amplo | Usar livremente |
| `time` | Amplo | Usar livremente |
| `week` | Sem suporte Safari/iOS | Evitar ou adicionar fallback |
| `month` | Sem suporte Safari/iOS | Evitar ou adicionar fallback |
| `search` | Amplo | Usar livremente |
| `tel` | Amplo | Usar livremente |

## How to verify

### Passo 1: Consultar DevDocs
```
1. Acesse devdocs.io
2. Busque "Input" na secao HTML
3. Explore os types disponiveis: button, checkbox, date, email, hidden, image, reset, search, submit, tel, time, week, month
4. Leia o comportamento e formato de envio de cada um
```

### Passo 2: Verificar no caniuse.com
```
1. Acesse caniuse.com
2. Busque o input type (ex: "Date and Time input")
3. Verifique: verde = OK, amarelo = parcial (leia os detalhes), vermelho = nao funciona
4. Preste atencao especial a Safari e iOS
```

### Passo 3: Testar localmente
```html
<!-- Teste rapido de um input type -->
<form>
  <label for="birth">Nascimento:</label>
  <input type="date" id="birth" name="birth">
  <button type="submit">Enviar</button>
</form>
<!-- date envia no formato: YYYY-MM-DD -->
```

## Example

**Before (sem verificar compatibilidade):**
```html
<form>
  <input type="week" name="semana">
  <input type="month" name="mes">
  <button type="submit">Enviar</button>
</form>
<!-- Quebra no Safari/iOS — usuario ve campo de texto vazio -->
```

**After (com verificacao de compatibilidade):**
```html
<form>
  <!-- date tem suporte amplo, incluindo Safari -->
  <input type="date" name="data_inicio">
  <input type="date" name="data_fim">
  <button type="submit">Enviar</button>
</form>
<!-- Funciona em todos os navegadores modernos -->
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de selecao de data | Use `type="date"` — suporte amplo |
| Precisa de semana ou mes especifico | Evite `week`/`month`, use `date` com logica no backend |
| Input type novo que voce nunca usou | caniuse.com ANTES de implementar |
| Cliente reporta campo quebrado | Verifique Safari/iOS primeiro |
| Formulario para publico geral | Teste nos 3 principais: Chrome, Safari, Firefox |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Usar `type="week"` sem fallback | Usar `type="date"` que funciona em todos |
| Assumir que todo input type funciona igual em todo navegador | Verificar caniuse.com antes |
| Ignorar Safari/iOS por ser "minoria" | Testar sempre, iOS tem parcela significativa de usuarios |
| Decorar todos os input types | Consultar DevDocs quando precisar |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Input `type="week"` aparece como texto no Safari | Safari/iOS nao suporta `week` | Use `type="date"` que tem suporte amplo |
| Input `type="month"` nao funciona no iOS | Safari/iOS nao suporta `month` | Use `type="date"` e extraia o mes no backend |
| Campo de data nao aparece com date picker | Navegador antigo ou tipo nao suportado | Verifique no caniuse.com e considere fallback |
| Formato de data enviado diferente do esperado | Cada input type tem formato proprio | `date` envia `YYYY-MM-DD`, verifique a documentacao no DevDocs |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre compatibilidade, analogias do instrutor e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de input types com variacoes e formatos de envio