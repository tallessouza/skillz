---
name: rs-full-stack-agent-mode-gerar-entao-explicar
description: "Enforces the 'generate then explain' learning methodology when using AI to write code. Use when user says 'I don't understand this code', 'explain what the AI generated', 'should I accept this code', 'help me learn from AI output', or 'I'm stuck on a challenge'. Ensures learners understand every line AI produces before moving forward, using first principles, analogies, and micro victories. Make sure to use this skill whenever a learner is working with AI-generated code or expressing frustration with understanding. Not for code generation itself, debugging, or project architecture decisions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [ai, learning, methodology, first-principles, prompting]
---

# Gerar Então Explicar

> Nunca aceite codigo gerado por IA sem entender cada linha — gere primeiro, depois exija explicacao com first principles e analogias.

## Rules

1. **Tente primeiro sozinho** — antes de pedir para a IA gerar, esforce-se por conta propria, porque o esforco consolida o aprendizado e da contexto para avaliar o que a IA produz
2. **Use micro vitorias para manter motivacao** — se travou por dias, peca para a IA resolver um pedaco pequeno para destravar, porque motivacao vem de progresso visivel
3. **Abra contexto separado para explicacoes** — nao misture geracao com aprendizado no mesmo chat, porque contexto limpo gera explicacoes melhores
4. **Exija explicacao com first principles** — sempre peca "explique como se eu fosse da quinta serie e explique os first principles", porque isso forca a IA a ir na raiz do conceito
5. **Entenda TUDO antes de continuar** — cada linha gerada precisa fazer sentido para voce, porque sem entender os fundamentos voce nao consegue julgar se a IA gerou porcaria
6. **Use active recall depois** — relembre ativamente o que aprendeu antes de pedir mais codigo, porque amanha voce vai esquecer e precisara julgar codigo novo

## How to write

### Prompt para explicacao de codigo

```
// Ao encontrar codigo que nao entende, copie o trecho e use este template:
"Isso aqui eu nao entendo [COLE O TRECHO].
Explique com detalhes como se eu fosse da quinta serie
e explique os first principles."
```

### Prompt para aprofundar

```
// Se a explicacao nao ficou clara:
"Me de outros exemplos e outras analogias."
```

### Fluxo correto de aprendizado

```
1. Tente resolver sozinho (dias se necessario)
2. Travou? Peca para IA gerar o codigo
3. Abra NOVO contexto/chat
4. Cole o trecho que nao entendeu
5. Peca explicacao com first principles + analogias
6. Interaja ate ter o "ah-ha moment"
7. So entao volte ao chat original e peca modificacoes
```

## Example

**Before (learner passivo):**
```
// IA gera 150 linhas de JavaScript
// Learner clica "Accept All"
// Segue para proxima tarefa sem entender
// Resultado: nao sabe avaliar quando IA gera codigo ruim
```

**After (com este skill aplicado):**
```
// IA gera 150 linhas de JavaScript
// Learner abre novo chat
// Cola: "Isso aqui eu nao entendo: [localStorage.setItem(...)]. 
//        Explique como se eu fosse da quinta serie e first principles"
// IA explica com analogias (ex: localStorage = caderninho do navegador)
// Learner: "Me de outros exemplos e analogias"
// Learner entende, volta ao chat original
// Agora consegue julgar se o codigo ta bom ou ruim
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Travou por 3+ dias em um desafio | Peca para IA gerar um pedaco pequeno (micro vitoria) |
| IA gerou 100+ linhas de codigo | Abra novo contexto, explique trecho por trecho |
| Explicacao da IA ficou confusa | Peca "outros exemplos e outras analogias" |
| Entendeu o codigo gerado | Volte ao chat original e peca melhorias a partir do que entendeu |
| Quer seguir rapido sem entender | PARE — voce esta acumulando divida de conhecimento |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Aceitar codigo sem entender | Exigir explicacao de cada trecho desconhecido |
| Pedir explicacao no mesmo chat de geracao | Abrir contexto novo para explicacoes |
| Aceitar primeira explicacao confusa | Pedir mais analogias e exemplos |
| Pular entendimento por pressa | Investir tempo agora para julgar melhor depois |
| Depender so da IA sem tentar primeiro | Esforcar-se antes, usar IA como destravamento |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Explicação da IA ficou muito técnica | Não pediu "como se eu fosse da quinta série" | Reformule pedindo analogias simples e first principles |
| Não consegue avaliar se o código está bom | Pulou a etapa de entendimento | Volte e peça explicação trecho por trecho em contexto separado |
| Frustração com progresso lento | Tentando entender tudo de uma vez | Foque em micro vitórias — entenda um trecho pequeno por vez |
| Esqueceu o que aprendeu ontem | Não usou active recall | Antes de pedir novo código, relembre ativamente o que aprendeu |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre micro vitorias, active recall e o ciclo gerar-explicar
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de prompts e fluxos de aprendizado