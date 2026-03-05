---
name: rs-devops-sindrome-da-pessoa-heroi
description: "Identifies and prevents Hero Person Syndrome (knowledge centralization) in DevOps teams. Use when user asks to 'review team structure', 'reduce bus factor', 'document legacy flows', 'identify bottlenecks', or 'improve team autonomy'. Detects single-point-of-failure patterns in knowledge distribution. Make sure to use this skill whenever analyzing team dependencies or proposing documentation strategies. Not for technical architecture, CI/CD pipelines, or infrastructure design."
---

# Síndrome da Pessoa Herói

> Identifique e elimine dependências de conhecimento centralizado em uma única pessoa — o herói que resolve tudo é o maior risco silencioso da organização.

## Key concept

A Síndrome da Pessoa Herói ocorre quando uma única pessoa detém conhecimento exclusivo sobre fluxos críticos, geralmente legados e sem documentação. Toda vez que um problema acontece, a mobilização não é entender o problema — é chamar aquela pessoa. Isso cria um gargalo invisível que só se manifesta quando a pessoa está indisponível (férias, saída, doença).

Isso acontece mesmo com cultura DevOps estabelecida, porque fluxos legados e esporádicos escapam do radar. A pessoa resolve rápido, ninguém questiona, e a centralização cresce silenciosamente.

## Decision framework

| Quando você encontrar | Aplique |
|----------------------|---------|
| Uma pessoa é sempre chamada para resolver um fluxo específico | Sinalize como risco de herói — inicie documentação |
| Fluxo legado sem documentação existe | Mapeie o detentor do conhecimento e promova pair-solving |
| Alguém resolve problemas "rápido demais" sem envolver o time | Questione se outros conseguiriam resolver sozinhos |
| Pessoa saiu de férias e squad ficou bloqueado | Confirme síndrome — implemente rotação e documentação imediata |
| Novo membro não consegue operar fluxo sem ajuda de alguém específico | Bus factor = 1, priorize transferência de conhecimento |

## How to think about it

### Centralização silenciosa

O herói não se cria de propósito. Acontece porque resolver rápido é mais fácil que documentar. Um fluxo legado quebra, a pessoa que conhece resolve em 5 minutos, e ninguém percebe que acabou de reforçar uma dependência. Repetido ao longo de meses, aquela pessoa vira o único ponto de resolução.

### Comunicação como antídoto

A cultura DevOps é fundamentalmente sobre comunicação. Quando identificar um herói, vá até a pessoa, troque ideia, peça que ela ensine ou crie documentação — ou resolva o problema junto com ela e documente você mesmo. O objetivo não é culpar o herói, é distribuir o conhecimento.

### Observabilidade cultural

Assim como sistemas precisam de observabilidade técnica, a cultura precisa de observabilidade cultural — monitorar continuamente quem resolve o quê, onde o conhecimento está concentrado, e quebrar essas dependências progressivamente. Não acontece do dia para a noite.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| "Se a pessoa documenta bem, não tem problema" | Fluxos legados sem documentação são justamente os que criam heróis — os documentados não são o risco |
| "É bom ter alguém que resolve tudo rápido" | A curto prazo sim, a médio/longo prazo é um gargalo organizacional |
| "Só acontece em times sem DevOps" | Acontece mesmo com cultura DevOps estabelecida se não houver acompanhamento contínuo |
| "É problema do time/squad apenas" | Escala para nível organizacional quando o fluxo é crítico |
| "A pessoa herói gosta de ser herói" | É ruim para a pessoa (sobrecarga, dependência) e para a organização |

## When to apply

- Ao revisar estrutura de times e distribuição de responsabilidades
- Ao planejar onboarding de novos membros
- Ao mapear fluxos legados e criar estratégias de documentação
- Ao identificar por que um squad ficou bloqueado com a ausência de alguém
- Ao propor melhorias de cultura DevOps em uma organização
- Ao calcular bus factor de um time

## Limitations

- Nem toda especialização é síndrome de herói — expertise profunda é valiosa, o problema é quando é exclusiva
- A solução é gradual (frameworks, comunicação, documentação), não instantânea
- Em times muito pequenos, algum grau de centralização é inevitável — o foco deve ser em documentação

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
