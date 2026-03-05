---
name: rs-full-stack-o-que-e-depurar-o-codigo
description: "Applies debugging mental model and breakpoint strategy when user asks to 'debug', 'find a bug', 'fix an error', 'inspect variables', 'add breakpoint', or 'step through code'. Guides systematic root-cause analysis using breakpoints and variable inspection. Make sure to use this skill whenever the user reports unexpected behavior or wants to understand code execution flow. Not for writing tests, logging strategies, or error handling patterns."
---

# Depuracao de Codigo (Debug)

> Depurar e encontrar a raiz do problema etapa por etapa, nunca adivinhar.

## Key concept

Depuracao (debug) e o processo sistematico de encontrar e corrigir erros (bugs). O principio fundamental: quando o projeto tem comportamento inesperado, nao tente adivinhar a causa — percorra a execucao etapa por etapa ate chegar na raiz do problema. Breakpoints sao o instrumento principal: pausam a execucao numa linha especifica, dando controle para avancar passo a passo enquanto inspeciona variaveis e fluxos.

## Decision framework

| Quando voce encontra | Faca |
|---------------------|------|
| Comportamento inesperado | Adicione breakpoint ANTES do trecho suspeito, execute passo a passo |
| Variavel com valor errado | Inspecione a variavel no breakpoint, rastreie de onde o valor veio |
| Codigo entra no fluxo errado | Adicione breakpoints nas condicoes (if/else/switch) e observe qual caminho executa |
| Erro sem localizacao clara | Adicione breakpoints progressivos — do ponto de entrada ate o erro aparecer |

## How to think about it

### Analogia do controle remoto

Breakpoints transformam a execucao do programa num video com controle remoto. Voce pausa onde quiser, avanca frame por frame (step over/step into), e observa o estado de cada variavel naquele instante. Sem breakpoints, voce esta assistindo o video em fast-forward tentando ver um detalhe.

### Etapa por etapa, nao salto

O erro quase nunca esta onde voce acha que esta. A disciplina de percorrer etapa por etapa revela o ponto exato onde o comportamento diverge do esperado. Pular etapas e voltar a adivinhar.

## Conceitos-chave

| Conceito | Definicao |
|----------|-----------|
| **Debug / Depuracao** | Processo de encontrar e corrigir erros (bugs) |
| **Breakpoint** | Ponto no codigo-fonte onde a execucao pausa automaticamente |
| **Inspecionar** | Examinar variaveis, fluxos e estrutura durante a pausa |
| **Step (avancar)** | Mover a execucao uma etapa por vez apos o breakpoint |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| console.log e suficiente para debugar | console.log mostra valores pontuais; breakpoints mostram o estado completo e permitem navegacao interativa |
| O bug esta na linha que da erro | O erro frequentemente origina linhas ou funcoes antes — a raiz e diferente do sintoma |
| Debugar e so para codigo quebrado | Debugar tambem serve para entender codigo desconhecido, inspecionando fluxo e variaveis |

## When to apply

- Projeto com comportamento inesperado e a causa nao e obvia
- Variavel com valor que voce nao esperava
- Fluxo de execucao entrando em condicao errada
- Codigo legado que voce precisa entender antes de modificar

## Limitations

- Breakpoints sao mais uteis em execucao sincrona; codigo assincrono pode precisar de estrategias adicionais
- Em producao, breakpoints nao sao viaveis — use logging estruturado
- Performance: debugger ativo pode mascarar bugs de timing/race condition

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos praticos de breakpoints e inspecao

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-o-que-e-depurar-o-codigo/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-o-que-e-depurar-o-codigo/references/code-examples.md)
