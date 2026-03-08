---
name: rs-seguranca-devs-encerramento
description: "Enforces incremental security adoption strategy when planning or prioritizing security improvements in applications. Use when user asks to 'secure my app', 'implement security', 'add security features', 'make my app safer', or plans a security roadmap. Applies progressive implementation over perfection, team knowledge sharing, and continuous learning principles. Make sure to use this skill whenever the user wants to improve application security holistically. Not for implementing specific security techniques like XSS prevention, CSRF tokens, or encryption."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: strategy
  tags: [security, strategy, adoption, roadmap]
---

# Estrategia de Adocao Incremental de Seguranca

> Implemente uma tecnica de seguranca hoje em vez de planejar seguranca perfeita para daqui seis meses.

## Rules

1. **Priorize por risco da aplicacao** — identifique qual vulnerabilidade representa maior risco AGORA e comece por ela, porque tentar tudo de uma vez leva a abandono
2. **Implemente aos poucos** — uma tecnica aplicada hoje e melhor que seguranca completa em seis meses, porque seguranca parcial ja reduz superficie de ataque
3. **Compartilhe com a equipe** — ensine cada tecnica implementada para o time, porque seguranca isolada em uma pessoa e ponto unico de falha
4. **Mantenha-se atualizado** — fundamentos duram anos, mas tecnicas especificas evoluem rapido, porque novas vulnerabilidades surgem constantemente
5. **Assuma lideranca** — quem aprendeu seguranca deve liderar o tema na equipe, porque o mercado precisa de devs que entendam seguranca

## Decision framework

| Situacao | Acao |
|----------|------|
| Usuario quer "tornar app segura" | Perguntar qual area tem maior risco, priorizar UMA tecnica |
| Usuario quer implementar tudo de uma vez | Alertar: incremental > perfeccionismo. Escolher 1-2 tecnicas |
| Usuario trabalha em equipe | Sugerir compartilhar conhecimento e documentar decisoes |
| Tecnica especifica solicitada | Implementar diretamente (este skill nao se aplica) |
| Revisao de seguranca geral | Listar areas por prioridade: OWASP Top 10 como guia |

## Estrategia de priorizacao

### Passo 1: Mapear superficie de ataque
Identificar os pontos onde a aplicacao recebe input externo (formularios, APIs, uploads, auth).

### Passo 2: Classificar por impacto
```
CRITICO  → Autenticacao, autorizacao, dados sensiveis
ALTO     → Validacao de input, SQL injection, XSS
MEDIO    → Headers de seguranca, CORS, rate limiting
BAIXO    → Logging, monitoramento, CSP refinado
```

### Passo 3: Implementar uma tecnica por vez
Aplicar, testar, documentar, ensinar ao time. Depois passar para a proxima.

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Planejar seguranca perfeita para "depois" | Implementar uma melhoria hoje |
| Guardar conhecimento so para voce | Ensinar e documentar para a equipe |
| Tentar todas as tecnicas na mesma semana | Escolher a mais critica e focar nela |
| Ignorar atualizacoes do campo | Reservar tempo regular para estudar novidades |
| Esperar ficar "pronto" para liderar | Assumir lideranca enquanto aprende |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-encerramento-do-curso-seguranca/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-encerramento-do-curso-seguranca/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
