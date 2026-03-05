---
name: rs-devops-golden-signals
description: "Applies Golden Signals monitoring strategy when designing, reviewing, or instrumenting backend applications. Use when user asks to 'monitor application', 'add observability', 'create alerts', 'check app health', 'setup metrics', or 'instrument service'. Enforces the four signals: latency, traffic, errors, saturation. Recommends Circuit Breaker and async patterns when latency risks arise. Make sure to use this skill whenever designing monitoring dashboards, SLIs/SLOs, or reviewing microservice health. Not for frontend performance, UI metrics, or browser-side monitoring."
---

# Golden Signals — Os Quatro Sinais de Ouro

> Monitore latencia, trafego, erros e saturacao para saber se sua aplicacao esta saudavel.

## Key concept

Golden Signals sao quatro metricas definidas no livro "Site Reliability Engineering" do Google. Elas formam o minimo necessario para avaliar a saude de qualquer aplicacao em producao. Os sinais sao interdependentes — aumento de trafego causa enfileiramento que aumenta latencia, que pode gerar erros, que indica saturacao.

## Os quatro sinais

### 1. Latencia (tempo de resposta)

Tempo que a aplicacao leva para processar uma solicitacao e devolver resposta.

| Situacao | Acao |
|----------|------|
| Salto significativo (ex: 100ms → 500ms) | Investigar imediatamente, mesmo que o valor absoluto pareca aceitavel |
| Latencia alta em microservicos | Efeito hierarquico — todos os servicos dependentes herdam o atraso |
| Muitas operacoes sincronas | Mover para async tudo que nao precisa de resposta imediata |

**Regra:** Observe o SALTO, nao o valor absoluto. 500ms pode ser ok isolado, mas um salto de 5x indica problema.

### 2. Trafego (demanda)

Volume de solicitacoes que o sistema recebe (RPS, RPM).

| Situacao | Acao |
|----------|------|
| Trafego triplicou sem explicacao | Investigar origem — pode ser ataque, bot, ou bug em retry |
| Trafego alto + fluxo sincrono | Enfileiramento inevitavel — latencia vai subir |
| Trafego alto + fluxo assincrono | Camadas de buffer seguram melhor, mas nao resolvem tudo |

### 3. Erros (taxa de falhas)

Quantidade de respostas com erro (5xx principalmente).

| Situacao | Acao |
|----------|------|
| Erros 500 aumentando | Verificar traces para origem, nao apenas logs isolados |
| Erros correlacionados com deploy | Rollback ou hotfix imediato |
| Logs mostram erro mas sem contexto | Usar trace para ver a cadeia completa de chamadas |

**Regra:** Log mostra o erro no servico individual. Trace mostra DE ONDE veio e QUEM foi afetado.

### 4. Saturacao (recursos do cluster)

CPU, memoria e largura de banda disponiveis para a aplicacao.

| Situacao | Acao |
|----------|------|
| Falta de CPU/memoria | Aplicacao degrada e pode cair — escalar ou otimizar |
| Servico saturado em rede de microservicos | Blast radius alto — Circuit Breaker para isolar |

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Projetando monitoramento de app | Dashboard com os 4 sinais como minimo |
| Latencia subindo em microservicos | Circuit Breaker + avaliar sync vs async |
| Trafego inesperado | Correlacionar com latencia e erros |
| Erros sem contexto | Trace distribuido, nao apenas logs |
| Saturacao de recursos | Escalar + Circuit Breaker para proteger a rede |

## Circuit Breaker

Quando um servico tem latencia/saturacao alta, o Circuit Breaker "abre o circuito" — servicos dependentes param de chamar o servico degradado, protegendo a rede inteira.

```
Estado normal: A → B → C (circuito fechado)
Servico C degradado: A → B → X (circuito aberto, C isolado)
Resultado: rede nao degrada globalmente
```

**Aplicar Circuit Breaker quando:** blast radius de um servico degradado afeta multiplos dependentes.

## Interdependencia dos sinais

```
Trafego ↑ → Enfileiramento → Latencia ↑ → Erros ↑ → Saturacao ↑ → App cai
```

Nunca analise um sinal isolado. Correlacione sempre.

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Monitorar apenas erros | Monitorar os 4 sinais juntos |
| Avaliar latencia pelo valor absoluto | Avaliar pelo salto relativo ao baseline |
| Manter tudo sincrono em microservicos | Async para tudo que nao precisa de resposta imediata |
| Ignorar blast radius de servico degradado | Circuit Breaker para isolar falhas |
| Investigar erro apenas pelo log | Usar trace para ver cadeia completa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-entendendo-os-quatro-sinais-principais-da-aplicacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-entendendo-os-quatro-sinais-principais-da-aplicacao/references/code-examples.md)
