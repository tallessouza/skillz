---
name: rs-clean-code-principios
description: "Enforces five Clean Code team principles when user asks to 'review code', 'improve code quality', 'set up a project', 'organize team workflow', or 'refactor codebase'. Applies: automated tests for confidence, code review with 2+ reviewers, constant refactoring, KISS simplicity, short iterations with small PRs. Make sure to use this skill whenever discussing code quality practices, team workflows, or project maintainability. Not for variable naming, formatting, or syntax-level clean code rules."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: clean-code
  module: principios-do-codigo-limpo
  tags: [clean-code, team-practices, code-review, testing, kiss, refactoring, small-prs]
---

# Principios do Codigo Limpo

> Codigo limpo nao e um manual de sintaxe — e um conjunto de principios de time que mantém legibilidade, manutenabilidade e confianca conforme o projeto cresce.

## Premissa fundamental

Qualquer pessoa escreve codigo limpo sozinha. O desafio e manter codigo limpo em time. Estes cinco principios existem para resolver esse problema.

## Rules

1. **Testes automatizados sao obrigatorios** — sem testes, nao ha confianca nem previsibilidade, porque ninguem sabe se uma alteracao quebrou algo em producao
2. **Revisao de codigo com pelo menos 2 pessoas** — uma mais experiente e uma menos experiente, porque sem revisao cada pessoa coda de um jeito e o projeto vira um Frankenstein
3. **Refatore constantemente** — se voce nao refatora, o codigo acumula remendos ate o ponto em que ninguem se orgulha dele, porque codigo e um organismo vivo que precisa de manutencao
4. **KISS: mantenha simples e idiota** — so adicione complexidade quando houver necessidade real, porque 64% das features desenvolvidas nao sao usadas pelo usuario final
5. **Iteracoes curtas** — PRs pequenas, no maximo 1-2 dias de trabalho, porque ninguem consegue revisar bem uma PR com 100 arquivos alterados

## Heuristics

| Situacao | Acao |
|----------|------|
| Novo dev entrando no projeto | Verificar cobertura de testes antes de pedir features |
| PR aberta ha mais de 2 dias | Quebrar em PRs menores, enviar parcial |
| Vontade de usar tecnologia nova que so voce conhece | Nao usar — KISS prevalece sobre hype |
| Feature grande | Dividir em PRs incrementais, mesmo que usuario nao veja tudo ainda |
| Codigo legado feio | Nao usar como desculpa para escrever feio — refatorar aos poucos |
| Ninguem revisa codigo no time | Implementar code review como processo obrigatorio |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Enviar PR bomba com 50+ arquivos | Quebrar em 3-5 PRs incrementais |
| Usar framework da moda que so voce conhece | Usar tecnologia que o time domina |
| Otimizar para problemas futuros imaginarios | Resolver o problema de hoje com simplicidade |
| Aprovar PR com "LGTM" sem ler | Revisar cada arquivo, apontar padroes inconsistentes |
| Cuspir features sem refatorar | Reservar tempo para melhorar codigo existente |
| Confiar no codigo sem testes | Escrever testes que garantam confianca em alteracoes |

## Troubleshooting

### PRs grandes que ninguem consegue revisar
**Symptom:** PR aberta com 50+ arquivos alterados fica dias sem revisao ou recebe "LGTM" sem leitura real
**Cause:** O desenvolvedor acumulou trabalho de varios dias em uma unica PR em vez de dividir em incrementos menores
**Fix:** Quebre em PRs de 1-2 dias de trabalho (3-5 arquivos), envie parcialmente mesmo que o usuario final nao veja a feature completa ainda

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-principios-do-codigo-limpo/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-principios-do-codigo-limpo/references/code-examples.md)
