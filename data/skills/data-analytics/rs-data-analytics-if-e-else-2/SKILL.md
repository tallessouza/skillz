---
name: rs-data-analytics-if-e-else-2
description: "Enforces correct Python conditional structure patterns (if/elif/else) with proper indentation when writing Python code. Use when user asks to 'write a condition', 'check if', 'add validation', 'handle cases', or any Python branching logic. Applies rules: mandatory 4-space indentation, two-colon syntax, block scoping awareness. Make sure to use this skill whenever generating Python conditionals or reviewing indentation issues. Not for loops, functions, or non-Python languages."
---

# Estruturas Condicionais em Python (if / elif / else)

> Toda estrutura condicional em Python depende de indentacao obrigatoria de 4 espacos para definir o escopo do bloco.

## Rules

1. **Sempre use 4 espacos de indentacao** — nunca 2, nunca tab misturado, porque em Python a indentacao define o que pertence ao bloco (nao e apenas estetica como em outras linguagens)
2. **Dois pontos apos cada condicao** — `if idade >= 18:` e `else:`, porque os dois pontos fazem parte obrigatoria da sintaxe Python
3. **A condicao retorna booleano** — use expressoes comparativas ou variaveis booleanas, porque o if avalia apenas True/False
4. **Codigo sem indentacao esta FORA do bloco** — se o comando nao tem os 4 espacos, ele executa independentemente da condicao
5. **Use else para o caminho falso** — quando precisa agir nos dois cenarios (verdadeiro e falso), sempre adicione else

## How to write

### Condicional simples (if)
```python
idade = 25

if idade >= 18:
    print("Você é maior de idade")
```

### Condicional com else
```python
idade = 13

if idade >= 18:
    print("Você é maior de idade")
else:
    print("Você é menor de idade")
```

## Example

**Before (erro de indentacao):**
```python
idade = 15

if idade >= 18:
    print("Maior de idade")
print("Esta linha executa SEMPRE")  # fora do if, sem indentacao
```

**After (indentacao correta):**
```python
idade = 15

if idade >= 18:
    print("Maior de idade")
    print("Esta linha so executa se for maior")  # dentro do if
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Verificar uma unica condicao | Use `if` sozinho |
| Tratar verdadeiro E falso | Use `if` + `else` |
| Multiplas condicoes exclusivas | Use `if` + `elif` + `else` |
| Comando deve executar sempre | Coloque FORA do bloco (sem indentacao) |
| IndentationError no terminal | Verifique se usou 4 espacos consistentes |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `if idade >= 18` (sem dois pontos) | `if idade >= 18:` |
| Indentacao com 2 espacos | Indentacao com 4 espacos |
| Misturar tabs e espacos | Sempre espacos (4) |
| Codigo dentro do if sem indentacao | Indentar 4 espacos para pertencer ao bloco |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
