---
name: rs-full-stack-plan-mode-criando-desafios
description: "Enforces the Ask-Plan-Agent workflow when using AI coding assistants like Copilot Chat. Use when user asks to 'use copilot', 'plan a feature', 'create with AI', 'use agent mode', or 'ask copilot to build'. Applies the principle: Ask first to understand, Plan to structure tasks, Agent to generate code. Make sure to use this skill whenever the user jumps straight to agent/generation mode without planning first. Not for manual coding without AI assistants, or for configuring IDE settings."
---

# Plan Mode: Fluxo Ask → Plan → Agent

> Antes de gerar codigo com IA, sempre planeje — o agente de planejamento te forca a entender os passos antes de executar.

## Conceito central

Existem tres modos de interacao com o copilot, e cada um tem um proposito distinto. Usar o modo errado no momento errado gera codigo que voce nao entende ou resolve problemas que voce nao definiu bem.

## Os tres modos

| Modo | Proposito | Quando usar |
|------|-----------|-------------|
| **Ask** | Tirar duvidas, brainstorm, pensar junto, explicar conceitos | Modo padrao — use a maior parte do tempo |
| **Plan** | Criar lista de tarefas, provocar perguntas, estruturar a solucao | Quando teve uma ideia e quer entender os passos antes de implementar |
| **Agent** | Gerar codigo, editar arquivos, executar comandos, buscar na web | Somente apos entender o que precisa ser feito |

## Fluxo correto

### Padrao 1: Planejar, entao gerar
```
Ask (entender) → Plan (estruturar) → Voce tenta resolver → Ask (duvidas) → Agent (gerar)
```

### Padrao 2: Gerar, entao explicar
```
Plan (estruturar) → Agent (gerar) → Ask (explicar o que foi gerado)
```

## Rules

1. **Use Ask como modo padrao** — mantenha Ask ativado na maior parte do tempo, porque ele serve para pensar junto sem que a IA tome acoes no seu codigo
2. **Planeje antes de gerar** — o modo Plan cria uma lista de tarefas e faz perguntas que te forcam a definir escopo, porque pular direto para geracao produz codigo que voce nao entende
3. **O Plan provoca perguntas essenciais** — ele vai perguntar sobre armazenamento, localizacao na UI, funcionalidades necessarias, limites — responda cada uma antes de prosseguir
4. **Tente resolver sozinho primeiro** — apos o planejamento, use Active Recall e tente implementar por conta propria, porque esse e o momento de aprendizado real
5. **Agent so no momento certo** — o modo Agent edita, delega, executa, pesquisa e cria — use apenas quando ja entendeu os passos, porque ele resolve POR voce, nao COM voce

## Heuristics

| Situacao | Modo correto |
|----------|-------------|
| Quer entender um conceito ou tirar duvida | Ask |
| Teve uma ideia de feature e quer estruturar | Plan |
| Ja entendeu os passos e quer codigo gerado | Agent |
| Codigo foi gerado mas nao entendeu | Ask (explicar) |
| Esta aprendendo e quer praticar | Plan → tente sozinho → Ask para duvidas |
| Bug simples que precisa resolver rapido | Agent (com cuidado) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Pular direto para Agent com uma ideia vaga | Use Plan primeiro para estruturar |
| Ficar so no Ask sem nunca implementar | Transite para Plan quando tiver uma ideia |
| Usar Agent como modo padrao | Mantenha Ask como padrao |
| Aceitar o plano sem ler os passos | Leia cada passo e tente resolver sozinho |
| Deixar o Agent resolver tudo por voce | Use o plano como desafio pessoal |

## Exemplo pratico

**Ideia:** "Crie um historico de pesquisas e salve no localStorage"

**Modo Plan gera perguntas como:**
- Como deve ser armazenado? (perguntas e respostas, jogo selecionado, data)
- Onde colocar na UI? (popup, sidebar, aba)
- Quais funcionalidades? (reutilizar pergunta, deletar itens, limpar tudo)
- Qual limite? (sem limite, ultimos 10, ultimos 50)

**Apos responder**, voce tem um plano estruturado com passos claros para tentar implementar sozinho.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre os modos Ask, Plan e Agent
- [code-examples.md](references/code-examples.md) — Exemplo completo do fluxo de historico de pesquisas

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-plan-mode-criando-desafios-com-ia/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-plan-mode-criando-desafios-com-ia/references/code-examples.md)
