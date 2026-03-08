---
name: rs-full-stack-tree-of-thought-aprendizado
description: "Applies Tree of Thought prompting technique to expand learning beyond base knowledge. Use when user asks to 'learn alternatives', 'compare implementations', 'explore options', 'understand trade-offs', or 'deepen understanding' of a technical choice. Guides AI to explain its choices, suggest alternatives with pros/cons, and open focused deep-dive chats. Make sure to use this skill whenever the user wants to understand WHY a particular implementation was chosen over alternatives. Not for code generation, debugging, or project setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: ai-learning
  tags: [ai, prompting, tree-of-thought, learning, alternatives, trade-offs]
---

# Tree of Thought no Aprendizado

> Use a IA para expandir conhecimento alem do basico, pedindo alternativas e trade-offs de cada decisao tecnica antes de encontra-los em producao.

## Conceito central

Tree of Thought (arvore de pensamento) e uma tecnica de prompt onde voce pede a IA para:
1. Explicar POR QUE escolheu uma implementacao especifica
2. Sugerir 2+ alternativas diferentes
3. Detalhar pontos positivos e negativos de CADA alternativa

Isso traz para o presente conhecimento que so viria com experiencia em campo.

## Quando aplicar

| Situacao | Acao |
|----------|------|
| IA gerou codigo e voce quer entender a escolha | Ativar Tree of Thought |
| Voce conhece uma forma mas suspeita que ha outras | Ativar Tree of Thought |
| Conceito desconhecido apareceu numa alternativa | Abrir novo chat focado nesse conceito |
| Curiosidade pura sem necessidade imediata | Ler, anotar, seguir em frente — nao se sobrecarregar |

## Prompt template

### Passo 1: Pedir justificativa da escolha
```
Explique no detalhe o motivo dessa implementacao que voce escolheu.
```

### Passo 2: Ativar a arvore de pensamento
```
Sugira mais duas implementacoes diferentes e para cada
explique detalhes dos pontos positivos e negativos de cada escolha.
```

### Passo 3: Deep-dive em conceito desconhecido (novo chat)
```
Poderia explicar melhor o que e [CONCEITO]?
Explique em detalhes como se fosse para uma crianca da quinta serie,
explique os first principles.
```

## Rules

1. **Sempre abrir novo chat para deep-dives** — porque o contexto do chat original e sobre alternativas, nao sobre explicacao detalhada de um conceito especifico
2. **Nao se sobrecarregar** — Tree of Thought e para expandir consciencia sobre alternativas, nao para estudar tudo profundamente agora. Leia, entenda o trade-off, siga em frente
3. **Selecionar o codigo relevante antes de perguntar** — a IA precisa do contexto exato da implementacao para comparar alternativas
4. **Usar modo Ask (nao edit) para perguntas de aprendizado** — porque voce quer explicacao, nao modificacao de codigo

## Example

**Cenario:** IA implementou historico de pesquisa usando Local Storage.

**Pergunta Tree of Thought:**
```
Explique no detalhe o motivo dessa implementacao que voce escolheu.
Sugira mais duas implementacoes diferentes e para cada explique
detalhes dos pontos positivos e negativos de cada escolha.
```

**Resultado esperado:**
- Justificativa: persistencia simples, limite controlado, modelo minimo (resposta + jogo + timestamp)
- Alternativa 1: Delegar a eventos + render de HTML (pontos positivos/negativos)
- Alternativa 2: IndexedDB (pontos positivos/negativos — ex: overkill para app leve, API verbosa)

**Insight antecipado:** Sem a IA, voce so descobriria que IndexedDB e overkill para historico curto DEPOIS de implementar e sofrer com a API verbosa.

## Heuristics

| Situacao | Do |
|----------|-----|
| Alternativa menciona tecnologia desconhecida | Abrir novo chat, pedir explicacao first principles |
| Todas alternativas parecem equivalentes | Pedir cenarios onde cada uma BRILHA e onde cada uma FALHA |
| Voce ficou curioso mas nao precisa agora | Anotar, seguir em frente, voltar quando precisar |
| Resposta muito superficial | Pedir "explique como se fosse para crianca da quinta serie" |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Estudar profundamente cada alternativa imediatamente | Ler trade-offs, anotar, seguir em frente |
| Perguntar deep-dive no mesmo chat das alternativas | Abrir novo chat limpo para deep-dive |
| Selecionar todo o codigo do projeto | Selecionar apenas o trecho relevante da implementacao |
| Aceitar a primeira implementacao sem questionar | Sempre perguntar "por que essa e nao outra?" |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| IA retorna resposta generica sem alternativas | Prompt muito vago, sem codigo selecionado | Selecionar o trecho de codigo especifico antes de perguntar |
| Alternativas sugeridas sao irrelevantes | Contexto insuficiente no prompt | Incluir stack, restricoes e objetivo no prompt |
| Deep-dive perde contexto do problema original | Pergunta feita no mesmo chat | Abrir novo chat limpo para deep-dive de conceitos |
| Sobrecarga de informacao | Tentando estudar todas alternativas de uma vez | Ler trade-offs, anotar, seguir em frente — voltar quando precisar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre Tree of Thought, analogias e quando nao usar
- [code-examples.md](references/code-examples.md) — Exemplos completos de prompts e respostas esperadas