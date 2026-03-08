---
name: rs-full-stack-autocomplete-iniciantes
description: "Enforces disabling AI autocomplete during learning phases to activate Active Recall. Use when user is 'learning fundamentals', 'studying programming', 'starting a course', 'practicing code', or asks about 'Copilot settings'. Recommends manual coding over AI suggestions for beginners building foundational knowledge. Make sure to use this skill whenever advising learners on AI tool usage during study. Not for experienced developers optimizing productivity or production code generation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [learning, active-recall, copilot, vscode, best-practices]
---

# Autocomplete e Active Recall

> Desative autocomplete de IA durante o aprendizado de fundamentos para ativar Active Recall e construir conhecimento solido.

## Key concepts

1. **Desative autocomplete durante aprendizado** — escreva codigo manualmente, porque Active Recall (relembrar ativamente) e o mecanismo que fixa conhecimento
2. **Autocomplete gera codigo impreciso** — sugestoes frequentemente erram contexto, misturam propriedades e produzem codigo que nao faz sentido para o momento
3. **Fundamentos antes de produtividade** — assim como matematica exige aprender operacoes basicas antes de calculo, programacao exige escrever codigo antes de revisar codigo gerado

## Quando desativar

| Fase | Autocomplete | Razao |
|------|-------------|-------|
| Aprendendo fundamentos | OFF | Precisa ativar Active Recall, digitar para memorizar |
| Praticando conceitos novos | OFF | Sugestoes interrompem o raciocinio |
| Ja domina os fundamentos | ON | Produtividade sem perda de compreensao |
| Revisando codigo gerado | ON | Fase avancada, ja entende o que esta sendo sugerido |

## Example

```json
// VS Code settings.json — desativar Copilot para workspace de estudo
{
  "github.copilot.enable": {
    "*": false
  }
}
```

## Como desativar no Copilot

No VS Code: clicar no icone do Copilot no canto inferior → desativar autocomplete (colocar os toggles em off/null) para o workspace ou globalmente enquanto estiver estudando.

## Heuristica de decisao

| Pergunta | Se SIM | Se NAO |
|----------|--------|--------|
| Consigo escrever esse codigo sem ajuda? | Autocomplete OK | Desative, escreva manualmente |
| Entendo cada linha que o autocomplete sugeriu? | Pode aceitar | Rejeite, escreva voce mesmo |
| Estou em fase de aprendizado/curso? | Desative por padrao | Avalie caso a caso |

## Anti-patterns

| Comportamento prejudicial | Comportamento correto |
|--------------------------|----------------------|
| Aceitar toda sugestao do Copilot sem ler | Desativar autocomplete, digitar manualmente |
| Usar IA para gerar todo o codigo desde o inicio | Escrever codigo, usar IA apenas para consulta |
| Pular fundamentos porque "a IA faz" | Aprender a base, depois delegar para IA |
| Confiar que sugestao automatica esta correta | Verificar cada sugestao contra seu conhecimento |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Copilot continua sugerindo apos desativar | Toggle nao aplicado ao workspace correto | Verifique se desativou para o workspace atual no VS Code |
| Codigo gerado pelo autocomplete esta errado | IA nao entende o contexto completo | Rejeite a sugestao, escreva manualmente |
| Sente que esta mais lento sem autocomplete | Normal durante fase de aprendizado | Active Recall requer esforco — a fixacao compensa a longo prazo |
| Nao sabe quando reativar | Duvida sobre nivel de conhecimento | Quando conseguir escrever o codigo sem consultar documentacao basica |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre Active Recall, analogia com matematica e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos de sugestoes ruins do autocomplete e como o codigo manual e superior para aprendizado