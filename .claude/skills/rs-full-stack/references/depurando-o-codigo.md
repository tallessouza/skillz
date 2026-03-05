---
name: rs-full-stack-depurando-o-codigo
description: "Applies Chrome DevTools debugging techniques when user asks to 'debug code', 'find a bug', 'add breakpoint', 'inspect variables', or 'step through code'. Guides systematic debugging with breakpoints, watch expressions, and step-by-step execution in browser. Make sure to use this skill whenever the user is troubleshooting frontend JavaScript issues or learning debugging workflows. Not for Node.js server-side debugging, IDE debuggers, or automated testing."
---

# Depurando Código com Chrome DevTools

> Use breakpoints e execucao passo a passo para encontrar bugs sistematicamente, nunca por tentativa e erro com console.log.

## Rules

1. **Use Sources, nao Console** — abra a aba Sources no DevTools para depurar, porque permite execucao controlada linha a linha enquanto console.log so mostra snapshots
2. **Breakpoints sao pontos de parada** — clique no numero da linha para adicionar, porque o codigo para ali toda vez que passar por aquela linha
3. **Watch para observar variaveis** — adicione variaveis ou expressoes inteiras no painel Watch, porque mostra o valor em tempo real a cada passo
4. **Avance passo a passo** — use os botoes de step para navegar pelo fluxo, porque revela exatamente qual caminho o codigo segue
5. **Remova breakpoints apos depurar** — tire os breakpoints quando terminar, porque senao o programa para toda vez que executar
6. **Teste expressoes no Watch** — adicione expressoes completas (como `regex.test(value)`) no Watch para verificar resultados antes de avancar, porque evita suposicoes sobre valores

## How to write

### Codigo preparado para debug

```javascript
// Estruture codigo em passos claros para facilitar breakpoints
const input = document.querySelector("input")
const form = document.querySelector("form")

form.onsubmit = function (event) {
  event.preventDefault()

  const value = input.value // breakpoint aqui para ver o valor

  const hasNumberRegex = /\d+/g
  const hasNumber = hasNumberRegex.test(value) // breakpoint aqui para ver resultado do teste

  if (hasNumber) {
    alert("O texto contem numeros, por favor digite corretamente")
  } else {
    alert("Enviado")
  }
}
```

## Example

**Before (debug por console.log — lento e poluido):**

```javascript
form.onsubmit = function (event) {
  event.preventDefault()
  const value = input.value
  console.log("value:", value) // poluicao
  const hasNumber = /\d+/g.test(value)
  console.log("hasNumber:", hasNumber) // poluicao
  if (hasNumber) {
    alert("Tem numero")
  } else {
    alert("Enviado")
  }
}
```

**After (debug com breakpoints — limpo e sistematico):**

1. Abra DevTools (F12) → aba Sources
2. Encontre o arquivo JavaScript no painel esquerdo
3. Clique na linha onde quer parar (ex: linha do `const value`)
4. Execute a acao no browser (submit do form)
5. Codigo para no breakpoint — inspecione variaveis passando o mouse
6. Adicione `value` e `hasNumberRegex.test(value)` no Watch
7. Avance com Step Over para ver o fluxo
8. Clique Play para continuar ou remova o breakpoint

## Heuristics

| Situacao | Acao |
|----------|------|
| Nao sabe porque entrou/nao entrou no if | Breakpoint na condicao + Watch na expressao |
| Variavel com valor inesperado | Breakpoint na linha de atribuicao + Watch |
| Funcao nao esta sendo chamada | Breakpoint dentro da funcao para confirmar |
| Precisa ver multiplos pontos | Adicione varios breakpoints, desative os que nao precisa |
| Quer pular uma funcao inteira | Use Step Over ao inves de Step Into |
| Quer entrar dentro de uma funcao | Use Step Into |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `console.log` em cada linha | Breakpoint + Watch |
| Adivinhar onde esta o bug | Breakpoints sistematicos no fluxo |
| Deixar breakpoints ativos apos debug | Remover todos ao terminar |
| Recarregar pagina para testar de novo | Usar Play para finalizar e repetir a acao |
| Ignorar o painel Watch | Adicionar variaveis e expressoes para monitorar |

## Controles do Debugger

| Botao | Funcao |
|-------|--------|
| Play (triangulo) | Continua execucao ate proximo breakpoint ou fim |
| Step Over (seta curva) | Executa proxima linha, pula funcoes |
| Step Into (seta para baixo) | Entra dentro da funcao chamada |
| Step Out (seta para cima) | Sai da funcao atual, volta pro chamador |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-depurando-o-codigo/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-depurando-o-codigo/references/code-examples.md)
