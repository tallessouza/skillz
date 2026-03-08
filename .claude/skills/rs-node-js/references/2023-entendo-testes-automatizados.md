---
name: 2023-entendo-testes-automatizados
description: "Applies test strategy selection using the test pyramid: unit tests for isolated functions, integration tests for composed units, and E2E tests for full HTTP flows in Node.js APIs. Use when user asks to 'choose test type', 'write automated tests', 'start testing an API', or 'understand test pyramid'. Make sure to use this skill whenever deciding which type of test to write for a Node.js backend feature or planning a testing strategy for an application. Not for frontend component testing, performance/load testing, or manual QA processes."
category: coding-lens
tags: [deploy, repository, testing, typescript]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: testes-automatizados
  tags: [testing, unit-tests, integration-tests, e2e, test-pyramid, typescript]
---

# Testes Automatizados em APIs Node.js

> Escolha o tipo de teste baseado na maturidade da arquitetura e otimize pela piramide de testes: muitos unitarios, menos integracao, poucos e2e.

## Rules

1. **Testes existem para dar confianca na manutencao** — o proposito principal nao e verificar que funciona agora, e garantir que nao quebra depois, porque alteracoes em uma parte do codigo podem quebrar funcionalidades distantes que voce nem imagina
2. **Comece por testes e2e se a aplicacao nao tem arquitetura definida** — testes e2e nao dependem de arquitetura, framework ou padrao de codigo, qualquer aplicacao pode ter e2e independente de como foi estruturada
3. **Siga a piramide de testes em aplicacoes maduras** — muitos unitarios (base), menos integracao (meio), poucos e2e (topo), porque unitarios executam em milissegundos e e2e podem levar segundos cada
4. **Testes unitarios testam uma funcao isolada, sem contexto** — passe input, verifique output, sem banco de dados, sem HTTP, sem dependencias externas
5. **Testes de integracao testam a comunicacao entre unidades** — quando duas ou mais funcoes trabalham juntas, o teste de integracao verifica se a composicao funciona
6. **Testes e2e simulam o usuario da aplicacao** — no back-end, o "usuario" e o front-end, entao e2e testa chamadas HTTP de ponta a ponta ate o banco de dados, exatamente como em producao

## Decision Framework

| Situacao | Tipo de teste | Razao |
|----------|--------------|-------|
| Aplicacao sem arquitetura definida | e2e primeiro | Barreira de entrada zero, nao exige refatoracao |
| Funcao pura (formatar data, calcular valor) | Unitario | Isolada, sem dependencias, rapida de testar |
| Service que chama repository que chama DB | Integracao | Testa composicao de unidades |
| Rota HTTP completa (request → DB → response) | e2e | Simula o front-end consumindo a API |
| Aplicacao com 2000+ testes | Maioria unitarios | e2e em escala = minutos de execucao (2000 × 500ms = 16min) |

## How to write

### Teste e2e no back-end Node.js

```typescript
// e2e testa a porta de entrada: chamada HTTP real → banco → resposta
// Simula exatamente o que o front-end faria
test('should create a new transaction', async () => {
  const response = await request(app.server)
    .post('/transactions')
    .send({ title: 'New transaction', amount: 5000, type: 'credit' })

  expect(response.statusCode).toBe(201)
})
```

### Teste unitario

```typescript
// Testa UMA funcao isolada, sem contexto, sem banco
function formatDate(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

test('should format date as YYYY-M-D', () => {
  const result = formatDate(new Date(2023, 0, 15))
  expect(result).toBe('2023-1-15')
})
```

## Piramide de Testes

```
        /  e2e  \        ← Poucos (lentos, testam tudo)
       /----------\
      / integracao  \    ← Moderados (comunicacao entre unidades)
     /----------------\
    /    unitarios      \ ← Muitos (rapidos, isolados)
   /--------------------\
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nunca escreveu testes antes | Comece por e2e, barreira de entrada minima |
| Codigo sem separacao de responsabilidades | e2e ate refatorar, depois adicione unitarios |
| Funcao utilitaria pura | Teste unitario sempre |
| Precisa testar fluxo completo antes do deploy | e2e cobrindo as rotas criticas |
| Suite de testes ficando lenta | Converta e2e redundantes em unitarios/integracao |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Testar manualmente abrindo a aplicacao como unica estrategia | Escreva testes automatizados, mesmo que poucos e2e |
| Escrever so testes e2e em aplicacao grande | Siga a piramide: maioria unitarios |
| Testar funcao isolada com banco de dados real | Use teste unitario puro, sem dependencias externas |
| Ignorar testes porque a aplicacao e pequena | Teste desde o inicio, quanto antes melhor |
| Esperar arquitetura perfeita para comecar a testar | Comece com e2e que nao exige arquitetura |

## Troubleshooting

### Suite de testes E2E demora mais de 10 minutos para rodar
**Symptom:** CI fica lento e caro, devs evitam rodar testes localmente
**Cause:** Excesso de testes E2E — cada teste precisa de HTTP + banco de dados, levando ~500ms cada
**Fix:** Siga a piramide de testes: converta testes redundantes em unitarios (ms) e mantenha apenas testes E2E para fluxos criticos

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
