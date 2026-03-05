---
name: rs-devops-overview-ferramentas-externas
description: "Applies cost-based decision framework for choosing between open-source and paid observability tools (Datadog, New Relic, Elastic). Use when user asks to 'choose monitoring tool', 'compare Datadog vs Grafana', 'set up observability', 'evaluate APM solutions', or 'decide between open source and SaaS monitoring'. Make sure to use this skill whenever evaluating observability tooling trade-offs. Not for implementing specific tool configurations, writing Grafana dashboards, or OpenTelemetry collector setup."
---

# Ferramentas Externas de Observabilidade: Open Source vs Pagas

> Toda decisao de ferramenta de observabilidade e, no final do dia, uma decisao de custo total de propriedade — nao apenas de licenca.

## Key concept

Ferramentas pagas como Datadog e New Relic entregam tudo "mastigado" — dashboards, alertas, correlacao de dados — por um preco mensal. Ferramentas open source (stack LGTM: Loki, Grafana, Tempo, Mimir) entregam o mesmo poder, mas o custo de operar, manter e escalar e seu. Nenhuma opcao e gratuita. A diferenca e onde o custo aparece: na fatura do vendor ou no time de engenharia.

## Decision framework

| Situacao | Recomendacao |
|----------|-------------|
| Time pequeno, sem expertise em infra | Ferramenta paga (Datadog, New Relic) — custo previsivel, zero manutencao |
| Time com conhecimento de infra/DevOps | Open source (LGTM stack) — custo potencialmente menor, controle total |
| Organizacao com compliance rigoroso | Avaliar onde dados podem residir — open source permite controle de dados |
| Fase de validacao/POC | Usar trial gratuito das ferramentas pagas para comparar |
| Ja usa OpenTelemetry | Ambas opcoes funcionam — OTel e vendor-neutral por design |

## How to think about it

### Custo total, nao apenas licenca

O custo de open source inclui: infraestrutura para rodar (servidores, storage), tempo de engenharia para configurar, manter e debuggar, e conhecimento necessario no time. O custo de SaaS e a fatura mensal, mas inclui suporte, atualizacoes e alta disponibilidade built-in.

### OpenTelemetry como camada de abstracao

Sempre use OpenTelemetry como camada de instrumentacao, independente da ferramenta de backend. O collector do OTel exporta para Datadog, New Relic, Elastic ou qualquer stack open source. Isso permite trocar de ferramenta sem reinstrumentar o codigo.

### Ferramentas pagas sao "built-in"

Datadog e New Relic oferecem experiencia similar ao que se constroi com Grafana + LGTM, porem ja pre-configurado. Quem entende os conceitos por tras (metricas, traces, logs, correlacao) vai navegar qualquer ferramenta paga com facilidade, porque os fundamentos sao os mesmos.

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Open source e gratuito | O custo e transferido para infra e time, nao eliminado |
| Ferramentas pagas sao sempre melhores | Dependem do contexto — para times grandes com expertise, open source pode ser superior |
| Preciso escolher uma e ficar para sempre | Com OpenTelemetry, a troca de backend e relativamente simples |
| Ferramentas pagas nao exigem conhecimento | Exigem sim — sem entender conceitos de observabilidade, qualquer ferramenta e subutilizada |

## When to apply

- Ao iniciar um novo projeto e definir stack de observabilidade
- Ao avaliar migracao de ferramenta paga para open source (ou vice-versa)
- Ao justificar custo de observabilidade para gestao
- Ao comparar propostas de vendors de APM

## Limitations

- Este framework nao cobre pricing detalhado (muda frequentemente)
- Nao substitui um POC real com dados do seu ambiente
- Nao aborda ferramentas especificas de nicho (ex: Honeycomb para tracing puro)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
