---
name: rs-full-stack-comentario-de-documentacao
description: "Enforces JSDoc documentation comments on functions when writing JavaScript/TypeScript code. Use when user asks to 'create a function', 'document code', 'add JSDoc', 'write a utility', or any function creation task. Applies @param with types and descriptions, @returns with type and meaning, and summary line. Make sure to use this skill whenever generating exported or shared functions. Not for inline comments, TODO comments, or README documentation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, jsdoc, documentation, functions, typescript]
---

# Comentário de Documentação (JSDoc)

> Toda função compartilhada ou exportada recebe um bloco JSDoc com resumo, @param tipado e descrito, e @returns tipado e descrito.

## Rules

1. **Use `/** */` nunca `/* */` para documentação** — apenas o padrão com dois asteriscos (`/**`) ativa o JSDoc e a integração com IDEs, porque editores ignoram comentários normais no hover/autocomplete
2. **Sempre declare o tipo no @param** — `@param {string} email` não `@param email`, porque sem tipo o IDE mostra `any` e perde-se a principal vantagem da documentação
3. **Adicione descrição após o nome do parâmetro** — `@param {string} email - User email address.` porque o tipo sozinho não comunica restrições ou formato esperado
4. **Sempre inclua @returns quando a função retorna valor** — `@returns {number} User ID.` porque quem consome a função precisa saber o que recebe de volta sem ler a implementação
5. **Adicione uma linha de resumo no topo do bloco** — descreve O QUE a função faz em uma frase, porque aparece no autocomplete antes mesmo de abrir a documentação completa
6. **Documente restrições nos parâmetros** — `@param {string} password - Must be more than 6 characters.` porque validações implícitas causam bugs silenciosos

## How to write

### Bloco JSDoc completo

```javascript
/**
 * Authenticates the user.
 * @param {string} email - User email.
 * @param {string} password - More than 6 characters.
 * @returns {number} User ID.
 */
function signIn(email, password) {
  // authentication flow
  return 7
}
```

### Função sem retorno

```javascript
/**
 * Logs the user out and clears session data.
 * @param {string} sessionId - Active session identifier.
 */
function signOut(sessionId) {
  // cleanup flow
}
```

## Example

**Before (sem documentação):**
```javascript
function signIn(email, password) {
  // authentication flow
  return 7
}
// IDE mostra apenas: signIn(email: any, password: any): number
```

**After (com JSDoc aplicado):**
```javascript
/**
 * Authenticates the user.
 * @param {string} email - User email.
 * @param {string} password - More than 6 characters.
 * @returns {number} User ID.
 */
function signIn(email, password) {
  // authentication flow
  return 7
}
// IDE mostra: resumo, tipos, descrições e retorno no hover
```

## Heuristics

| Situação | Ação |
|----------|------|
| Função exportada ou pública | JSDoc obrigatório com todos os campos |
| Função interna curta (<5 linhas) e óbvia | JSDoc opcional |
| Função com parâmetros que têm restrições | Documentar restrições no @param |
| Função sem retorno (void) | Omitir @returns |
| Função com múltiplos retornos possíveis | Usar `@returns {string\|null}` com descrição de cada caso |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `/* documenta a função */` | `/** Documenta a função. */` (dois asteriscos) |
| `@param email` (sem tipo) | `@param {string} email` |
| `@param {string} email` (sem descrição para param complexo) | `@param {string} email - User email address.` |
| Função pública sem JSDoc | Sempre adicionar bloco `/** */` |
| `@returns` sem tipo | `@returns {number} User ID.` |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| IDE não mostra documentação no hover | Usando `/* */` em vez de `/** */` | Troque para dois asteriscos: `/** */` |
| @param mostra tipo `any` | Tipo não declarado no @param | Adicione tipo: `@param {string} name` |
| @returns não aparece no autocomplete | Bloco JSDoc mal formatado ou sem `*/` de fechamento | Verifique a sintaxe do bloco completo |
| Documentação desatualizada após refactor | JSDoc não foi atualizado junto com o código | Atualize @param e @returns sempre que mudar a assinatura |
| JSDoc não funciona em TypeScript | TypeScript já infere tipos, mas JSDoc ainda funciona | Use JSDoc para descrições textuais, tipos vêm das annotations TS |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre JSDoc, analogias do instrutor e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações