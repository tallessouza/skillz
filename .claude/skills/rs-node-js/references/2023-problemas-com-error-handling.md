---
name: rs-node-js-2023-problemas-error-handling
description: "Prevents problematic error handling patterns in TypeScript/Node.js applications. Use when user asks to 'handle errors', 'throw an error', 'return null on error', 'create error handling', or writes try/catch blocks. Enforces rules: never return null/undefined for errors, avoid raw throw new Error without context, ensure errors carry enough data for HTTP status mapping, maintain consistent error format across all layers. Make sure to use this skill whenever reviewing or writing error handling code. Not for frontend error display, logging configuration, or monitoring setup."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: error-handling-problems
  tags: [error-handling, throw, null-return, http-status, anti-patterns, typescript]
---

# Problemas com Error Handling

> Erros precisam carregar informacao suficiente para serem tratados em qualquer camada da aplicacao, com formato consistente e previsivel.

## Rules

1. **Nunca retorne null/undefined como erro** — `null` nao carrega nenhuma informacao sobre o que aconteceu, impossibilita diferenciar tipos de erro e forca quem consome a adivinhar o que deu errado
2. **Nunca use throw new Error generico** — `throw new Error('Not found')` nao permite diferenciar um 400 de um 401 de um 404, porque a classe Error nativa nao carrega dados estruturados como status code ou tipo de erro
3. **Erros devem carregar dados suficientes para mapeamento HTTP** — um erro de "recurso nao encontrado" (400) e um erro de "nao autorizado" (401) precisam ser distinguiveis programaticamente, nao apenas pela mensagem
4. **Padronize o formato de erro em todas as camadas** — use cases, entities, value objects — todos devem retornar erros no mesmo formato, porque inconsistencia entre camadas gera tratativas ad-hoc e bugs
5. **throw interrompe o fluxo como return, mas propaga de forma imprevisivel** — se nenhum try/catch captura a excecao, ela vai bater no error handler global do framework e retornar respostas inesperadas como Internal Server Error
6. **Erros em camadas internas (entities, value objects) tambem precisam de estrategia** — nao e so o use case que dispara erros; um value object que recebe input invalido tambem precisa comunicar o problema de forma estruturada

## Anti-patterns

| Nunca escreva | Problema |
|---------------|----------|
| `return null` | Zero informacao sobre o erro — quem consome nao sabe o que aconteceu |
| `return undefined` | Mesmo problema do null — vazio semantico |
| `throw new Error('Question not found')` | Nao permite mapear para HTTP status code especifico |
| `throw new Error('Not allowed')` | Impossivel distinguir de outros erros sem parsear string |
| Usar throw em uns lugares e return null em outros | Inconsistencia entre camadas gera bugs e dificulta manutencao |
| Depender do error handler global para tratar erros de negocio | Retorna Internal Server Error para erros que deveriam ser 400/401/404 |

## Example

**Antes (problematico):**
```typescript
// use case
export class CommentOnQuestionUseCase {
  execute({ questionId, authorId, content }: Request) {
    const question = this.questionsRepo.findById(questionId)
    if (!question) {
      throw new Error('Question not found') // 400? 404? quem consome nao sabe
    }
    // ...
  }
}

export class DeleteAnswerCommentUseCase {
  execute({ commentId, authorId }: Request) {
    const comment = this.commentsRepo.findById(commentId)
    if (!comment) {
      throw new Error('Comment not found') // mesmo formato generico
    }
    if (comment.authorId !== authorId) {
      throw new Error('Not allowed') // deveria ser 401, mas e indistinguivel
    }
  }
}

// value object
export class Slug {
  static createFromText(text: string) {
    // texto com apenas espacos — retorna o que? null? throw? 
    // nao ha padrao definido
  }
}
```

**Problemas identificados:**
- Todos os erros sao `throw new Error(string)` — impossivel diferenciar programaticamente
- "Question not found" deveria ser 400, "Not allowed" deveria ser 401, mas ambos sao Error generico
- Value objects nao tem estrategia de erro definida
- Se nenhum try/catch captura, vira Internal Server Error no framework

## Heuristics

| Situacao | Sinal de problema |
|----------|-------------------|
| Funcao retorna `null` e quem chama faz `if (!result)` | Null nao comunica QUAL erro aconteceu |
| Todos os erros usam `throw new Error(string)` | Impossivel mapear para HTTP status codes diferentes |
| Entity/Value Object usa throw mas use case usa return null | Inconsistencia entre camadas |
| Error handler global recebe erros de negocio | Erros de negocio devem ser tratados antes de chegar la |
| Mensagem de erro e a unica forma de diferenciar tipos | Strings sao frageis — qualquer typo quebra a logica |

## Decisao

Este skill identifica os PROBLEMAS. A solucao (Either pattern, Result type, custom error classes) e tratada em aulas subsequentes. Ao identificar estes anti-patterns, sinalize ao usuario que o formato atual e problematico e sugira adotar um padrao funcional de error handling.

## Troubleshooting

### Todos os erros retornam 500 Internal Server Error
**Symptom:** Erros de negocio como "usuario nao encontrado" ou "nao autorizado" retornam status 500 em vez de 404 ou 401
**Cause:** Os use cases usam `throw new Error(string)` generico, e o framework nao consegue diferenciar tipos de erro para mapear status codes
**Fix:** Adote um padrao estruturado de erro (Either pattern, custom error classes) que carregue informacao suficiente para o controller mapear para o HTTP status correto

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
