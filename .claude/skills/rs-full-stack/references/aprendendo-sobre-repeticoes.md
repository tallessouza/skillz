---
name: rs-full-stack-aprendendo-sobre-repeticoes
description: "Applies loop structure patterns when writing JavaScript repetition logic. Use when user asks to 'create a loop', 'iterate over', 'repeat code', 'write a for/while', or any task requiring repeated execution. Enforces condition-first thinking, proper counter management, and avoids code duplication. Make sure to use this skill whenever generating loops or refactoring duplicated code blocks. Not for array methods like map/filter/reduce or recursion patterns."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, loops, for, while, iteration, control-flow]
---

# Estruturas de Repetição

> Usar estruturas de repetição para executar um bloco de código várias vezes enquanto uma condição é satisfeita, eliminando duplicação.

## Key concept

Uma estrutura de repetição substitui código duplicado por um bloco executado múltiplas vezes sob controle de uma condição. O ciclo tem três partes: **estado inicial** (onde começa), **condição de continuidade** (quando parar), e **atualização do estado** (como avançar). Se qualquer parte faltar, o loop ou não executa ou nunca para.

A analogia do Mário: imagine o Mário no bloco 1 precisando chegar ao bloco 6. Em vez de escrever "andar" 5 vezes, uma repetição faz isso automaticamente — incrementando o passo e verificando a condição a cada iteração.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Mesmo código escrito N vezes | Extrair para um loop com contador |
| Ação repetida até condição mudar | `while` com verificação no início |
| Ação que deve executar pelo menos 1 vez | `do...while` com verificação no final |
| Número exato de iterações conhecido | `for` com contador explícito |
| Iteração sobre coleção | `for...of` ou métodos de array |

## How to think about it

### Anatomia de toda repetição

```javascript
// 1. Estado inicial
let step = 1

// 2. Condição de continuidade (verificada ANTES de cada execução)
while (step < 6) {
  // 3. Bloco de código repetido
  marioAndar()

  // 4. Atualização do estado (sem isso = loop infinito)
  step++
}

// 5. Fluxo continua após condição ser falsa
marioPular()
```

### Verificação no início vs no final

```javascript
// Verificação NO INÍCIO — pode nunca executar
while (condition) {
  doSomething()
}

// Verificação NO FINAL — executa pelo menos 1 vez
do {
  doSomething()
} while (condition)
```

## Example

**Before (código duplicado):**
```javascript
marioAndar() // bloco 1 → 2
marioAndar() // bloco 2 → 3
marioAndar() // bloco 3 → 4
marioAndar() // bloco 4 → 5
marioAndar() // bloco 5 → 6
marioPular()
```

**After (com estrutura de repetição):**
```javascript
let step = 1

while (step < 6) {
  marioAndar()
  step++
}

marioPular()
```

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Loop sempre executa pelo menos 1 vez | `while` verifica ANTES — se condição já é falsa, nunca executa |
| Condição é verificada só no fim | Depende da estrutura: `while` verifica no início, `do...while` no final |
| `step < 6` inclui o 6 | Não — quando `step` chega a 6, `6 < 6` é falso e o loop para |
| Esquecer o incremento não tem problema | Sem atualização do estado = loop infinito que trava o programa |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| Mesmo código copiado 3+ vezes | Loop com contador |
| `while (true)` sem `break` claro | `while (condition)` com condição explícita |
| Modificar a variável de controle de formas imprevisíveis dentro do loop | Incremento simples e previsível (`step++`) |
| Condição que nunca se torna falsa | Garantir que a atualização do estado caminha em direção à saída |

## Heuristics

| Situação | Faça |
|----------|------|
| Sabe quantas vezes repetir | Use `for (let i = 0; i < n; i++)` |
| Não sabe quantas vezes, mas sabe a condição de parada | Use `while (condition)` |
| Precisa executar pelo menos 1 vez antes de verificar | Use `do...while` |
| Código duplicado apareceu durante desenvolvimento | Refatore para loop imediatamente |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Loop infinito trava o programa | Falta de atualizacao do estado (incremento) ou condicao que nunca se torna falsa | Adicione `step++` ou equivalente e verifique a condicao de parada |
| Loop nao executa nenhuma vez | Condicao ja e falsa na primeira verificacao (`while`) | Verifique o valor inicial e a condicao; use `do...while` se precisa executar ao menos uma vez |
| Loop executa uma vez a mais | Condicao usa `<=` em vez de `<` | Ajuste o operador de comparacao conforme o range desejado |
| Variavel do loop acessivel fora do bloco | Declarada com `var` em vez de `let` | Use `let` para escopo de bloco no `for` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogia do Mário detalhada, e edge cases de loops
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações