---
name: rs-angular-introducao-a-pipes
description: "Applies Angular Pipes knowledge when working with template transformations, formatting, and display logic. Use when user asks to 'format a date', 'display currency', 'transform text in template', 'create a custom pipe', or 'optimize Angular template performance'. Guides pipe selection (slice, lowercase, uppercase, titlecase, json, percent, currency, date, keyvalue, async) and locale configuration. Make sure to use this skill whenever generating Angular template code that involves data formatting or transformation. Not for RxJS operators, component logic, or service-layer transformations."
---

# Angular Pipes — Visao Geral e Decisao

> Utilize Pipes para transformar dados diretamente no template, mantendo a classe do componente limpa e performatica.

## Conceito central

Pipes sao funcoes de transformacao aplicadas no template Angular com a sintaxe `{{ valor | pipe }}`. Eles existem para:
1. **Performance** — pipes puros so re-executam quando a referencia do input muda
2. **Separacao de responsabilidades** — formatacao fica no template, logica de negocio na classe
3. **Reutilizacao** — um pipe customizado pode ser usado em qualquer template

## Decision framework

| Necessidade | Pipe | Exemplo |
|-------------|------|---------|
| Fatiar array ou string | `slice` | `{{ items \| slice:0:5 }}` |
| Texto minusculo | `lowercase` | `{{ nome \| lowercase }}` |
| Texto maiusculo | `uppercase` | `{{ nome \| uppercase }}` |
| Texto Title Case | `titlecase` | `{{ nome \| titlecase }}` |
| Debug de objeto no template | `json` | `{{ obj \| json }}` |
| Formatar porcentagem | `percent` | `{{ valor \| percent:'1.0-2' }}` |
| Formatar moeda | `currency` | `{{ preco \| currency:'BRL' }}` |
| Formatar data | `date` | `{{ data \| date:'dd/MM/yyyy' }}` |
| Iterar objeto como key-value | `keyvalue` | `*ngFor="let item of obj \| keyvalue"` |
| Resolver Observable no template | `async` | `{{ obs$ \| async }}` |
| Pluralizacao condicional | `plural` | Mapeia quantidade → texto |
| Selecao de texto por chave | `select` | Mapeia string → texto |

## Regras

1. **Prefira pipe a metodo no template** — metodos re-executam a cada change detection cycle, pipes puros so re-executam quando o input muda, porque Angular cacheia o resultado
2. **Configure locale da aplicacao** — pipes como `currency`, `percent` e `date` formatam de acordo com a regiao configurada via `LOCALE_ID` injection token, porque usuarios de regioes diferentes esperam formatos diferentes
3. **Use `json` pipe para debug, nunca em producao** — porque expoe estrutura interna do objeto
4. **Crie pipes customizados para transformacoes reutilizaveis** — porque evita duplicacao de logica de formatacao entre componentes
5. **Entenda pipe puro vs impuro** — pipes puros (default) so re-executam quando a referencia muda; pipes impuros re-executam a cada cycle, porque impuros podem causar problemas de performance

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa formatar dado para exibicao | Use pipe built-in no template |
| Nenhum pipe built-in atende | Crie pipe customizado (`ng generate pipe`) |
| Transformacao depende de logica de negocio complexa | Faca no service/component, nao no pipe |
| Precisa debugar objeto no template | `{{ obj \| json }}` temporariamente |
| App atende multiplas regioes | Configure `LOCALE_ID` e use pipes com locale |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Metodo no template para formatar data | `{{ data \| date:'dd/MM/yyyy' }}` |
| `console.log` para debug de objeto no template | `<pre>{{ obj \| json }}</pre>` |
| Formatar moeda manualmente com string interpolation | `{{ valor \| currency:'BRL':'symbol' }}` |
| Pipe impuro sem necessidade real | Pipe puro (default) |
| Hardcodar formato de data/moeda ignorando locale | Configurar `LOCALE_ID` no app |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
