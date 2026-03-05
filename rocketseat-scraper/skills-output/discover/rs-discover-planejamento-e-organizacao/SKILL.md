---
name: rs-discover-planejamento-e-organizacao
description: "Applies planning and organization principles when structuring study plans, project timelines, or learning schedules. Use when user asks to 'plan my studies', 'organize my schedule', 'estimate project time', 'create a study plan', or 'how long will this take'. Enforces direction-over-speed mindset, expectation adjustment with 3x multiplier, and schedule blocking. Make sure to use this skill whenever helping someone plan learning or project completion timelines. Not for code architecture planning, sprint planning, or project management tooling."
---

# Planejamento e Organizacao

> Visualize o objetivo com clareza, ajuste a expectativa com realismo, e organize um cronograma executavel.

## Rules

1. **Visualize o objetivo antes de planejar** — defina com clareza e detalhe PARA ONDE quer ir, porque objetivos vagos geram planos vagos e abandono
2. **Direcao importa mais que velocidade** — `direcao != velocidade`, ir devagar na direcao certa supera correr sem rumo, porque consistencia vence intensidade
3. **Multiplique o tempo estimado por 3x** — se o conteudo tem 4h em video, planeje 12h de estudo real, porque assistir nao e aprender (pratica, pausas, revisao consomem tempo)
4. **Ajuste expectativa ANTES de comecar** — recalcule o prazo com base nas horas reais disponiveis por dia, porque expectativa irrealista gera frustacao e abandono
5. **Bloqueie horarios na agenda** — separe slots especificos e protegidos de interrupcao, porque "vou estudar quando der" significa nunca
6. **Recalcule o cronograma apos organizar** — o plano inicial muda quando confrontado com a realidade dos horarios disponiveis, porque planejamento sem organizacao e fantasia

## How to apply

### Calculo de expectativa realista

```
Horas de video/conteudo:     4h
Multiplicador (3x):          × 3
Horas reais necessarias:     12h
Horas disponiveis por dia:   1h
Dias para concluir:          12 dias
```

### Estrutura de um plano

```markdown
## Objetivo
Concluir [projeto/curso X] com pratica aplicada

## Expectativa ajustada
- Conteudo estimado: Xh
- Tempo real (×3): Yh
- Disponibilidade: Zh/dia
- Prazo realista: Y/Z dias

## Cronograma
- Horario bloqueado: [ex: 21h-22h]
- Dias da semana: [ex: seg-sex]
- Sem interrupcoes nesse slot
```

## Example

**Before (expectativa sem ajuste):**
```
"O curso tem 4 horas, vou terminar hoje a noite."
→ Frustracao, abandono no meio, sensacao de lentidao
```

**After (com esta skill aplicada):**
```
"O curso tem 4h em video. Multiplicando por 3, preciso de 12h.
Consigo 1h por dia. Em 12 dias uteis concluo.
Vou bloquear 21h-22h na minha agenda, sem celular."
→ Progresso consistente, expectativa alinhada, conclusao real
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario pergunta "quanto tempo leva?" | Aplique multiplicador 3x sobre horas de conteudo |
| Usuario quer terminar "rapido" | Reforce: direcao > velocidade, ajuste expectativa |
| Usuario tem pouco tempo por dia | Calcule dias reais, mostre que 1h/dia funciona |
| Usuario se sente atrasado | Lembre: nao precisa correr, precisa ir na direcao certa |
| Objetivo vago ("quero aprender X") | Peca para detalhar: o que especificamente, ate quando, quanto por dia |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Estimar prazo = horas de video | Multiplicar por 3x as horas de video |
| "Estuda quando der" | Bloquear horario fixo na agenda |
| Planejar sem verificar disponibilidade | Confrontar plano com horas reais disponiveis |
| Focar em velocidade | Focar em direcao e consistencia |
| Objetivo generico ("terminar logo") | Objetivo claro com data e horas calculadas |
| Ignorar interrupcoes | Proteger o slot de estudo ativamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos e variacoes de calculo expandidos