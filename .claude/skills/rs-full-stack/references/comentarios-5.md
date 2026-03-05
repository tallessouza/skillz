---
name: rs-full-stack-comentarios-5
description: "Applies JavaScript comment conventions when writing or reviewing code. Use when user asks to 'add comments', 'document code', 'explain this code', or 'annotate'. Enforces single-line (//) for inline notes and multi-line (/* */) for block explanations. Guides when comments add value vs when code should be self-explanatory. Make sure to use this skill whenever adding comments to JavaScript/TypeScript files. Not for JSDoc generation, README files, or markdown documentation."
---

# Comentarios em JavaScript

> Comentarios explicam o PORQUÊ, nunca o QUÊ — codigo bem escrito e auto-explicativo dispensa comentarios obvios.

## Rules

1. **Use `//` para comentarios de uma linha** — posicione acima da linha ou ao lado, porque mantém a anotacao próxima do contexto
2. **Use `/* */` para comentarios de multiplas linhas** — quando a explicacao exige mais de uma linha, porque evita repetir `//` em cada linha
3. **Comente o raciocinio, nao o comando** — `// calcula desconto progressivo por volume` nao `// multiplica preco por fator`, porque o codigo ja mostra a operacao
4. **Reduza comentarios conforme evolui** — iniciantes comentam mais para fixar conceitos, codigo maduro e auto-explicativo precisa de menos comentarios, porque nomes descritivos substituem anotacoes
5. **Nunca deixe comentarios desatualizados** — comentario que contradiz o codigo e pior que nenhum comentario, porque induz erro de interpretacao

## How to write

### Comentario de uma linha

```javascript
// Exibe mensagem de boas-vindas no console
console.log("Bem-vindo!")

console.log("Total: " + total) // valor ja inclui impostos
```

### Comentario de multiplas linhas

```javascript
/*
  Calcula o preco final aplicando:
  - Desconto por volume
  - Taxa de entrega regional
  - Imposto estadual
*/
const precoFinal = calcularPrecoFinal(itens)
```

## Example

**Before (comentarios obvios que nao agregam):**

```javascript
// declarando variavel nome
let nome = "Maria"

// fazendo um console.log
console.log(nome) // imprime o nome
```

**After (comentarios uteis ou removidos por serem desnecessarios):**

```javascript
let nome = "Maria"
console.log(nome)

// Timeout de 30min exigido pelo contrato do cliente X
const sessionTimeoutInMs = 1800000
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Aprendendo um conceito novo | Comente livremente para fixar o entendimento |
| Codigo de producao com nomes descritivos | Remova comentarios que repetem o que o codigo diz |
| Logica complexa ou workaround | Comente o PORQUÊ da abordagem |
| TODO ou lembrete temporario | Use `// TODO:` com descricao clara |
| Codigo comentado (desativado) | Delete — controle de versao guarda o historico |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `// declarando variavel` | (remova — o codigo e obvio) |
| `// fazendo um loop` | (remova — `for` ja diz isso) |
| `// console.log(x)` (codigo comentado) | (delete a linha — git guarda o historico) |
| Comentario desatualizado que contradiz o codigo | Atualize ou remova o comentario |
| `/* ... */` para uma unica linha curta | `// comentario curto` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-comentarios-5/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-comentarios-5/references/code-examples.md)
