---
name: rs-devops-alternativas-camada-aplicacao
description: "Applies application-layer resilience patterns (Circuit Breaker, Fault Injection, Blast Radius mitigation) when designing or reviewing Kubernetes microservices. Use when user asks to 'handle failing containers', 'prevent cascading failures', 'add circuit breaker', 'test resilience', or 'reduce blast radius'. Make sure to use this skill whenever designing inter-service communication or reviewing microservice fault tolerance. Not for Kubernetes probe configuration, networking/ingress setup, or CI/CD pipelines."
---

# Resiliencia na Camada da Aplicacao

> Construa aplicacoes que desconfiem de tudo — proteja o ecossistema contra falhas em cascata com Circuit Breaker e Fault Injection.

## Key concept

Quando um container defeituoso sobe, o impacto acontece em dois niveis: **local** (a aplicacao nao responde) e **global** (servicos que dependem dela ficam lentos, causando o **blast radius** — o raio de explosao de um problema localizado). Probes resolvem a deteccao, mas a aplicacao precisa de mecanismos proprios para mitigar o impacto global.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Servicos que se chamam entre si | Circuit Breaker para evitar cascata |
| Necessidade de validar resiliencia | Fault Injection para testar cenarios extremos |
| Container defeituoso detectado por probes | Probes resolvem o local, Circuit Breaker resolve o global |
| Duvida sobre comportamento sob carga | Teste de estresse + fault injection |
| Escolha entre sidecar ou framework | Sidecar (Service Mesh) para infra-level, framework para app-level |

## How to think about it

### Circuit Breaker — Analogia do circuito eletrico

O termo vem da engenharia eletrica: circuito **fechado** = energia passa = requisicoes fluem normalmente entre servico A e B. Quando B falha, o circuito **abre** — A para de chamar B, reduzindo o blast radius global.

**Tres estados:**
1. **Closed** — trafego normal, tudo funcionando
2. **Open** — B defeituoso, A nao envia requisicoes
3. **Half-Open** — envia porcentagem pequena (ex: 10%) para testar se B se recuperou. Se as requisicoes retornam erro, volta para Open. Se OK, pode aumentar progressivamente ate fechar o circuito

A estrategia de reabertura pode ser exponencial — de 10% para 20%, 40%, ate 100%.

### Fault Injection — Testar antes que quebre

Injecao proposital de falhas para entender como o ecossistema se comporta em cenarios extremos. Exemplos: adicionar delay na rede, teste de estresse, simular queda de servico.

Nao e bala de prata — e um mecanismo evolutivo que voce revisita para encontrar furos e melhorar continuamente.

## Implementacao

| Abordagem | Quando usar | Ferramentas |
|-----------|-------------|-------------|
| **Sidecar (Service Mesh)** | Infra-level, sem mudar codigo da app | Istio, Linkerd |
| **Framework na aplicacao** | App-level, controle fino | Resilience4j, Polly, opossum |
| **Chaos Engineering** | Testar resiliencia em producao/staging | Chaos Mesh, Litmus |

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Probes resolvem tudo | Probes detectam o problema local; o impacto global precisa de Circuit Breaker |
| Circuit Breaker elimina falhas | Ele mitiga o blast radius, nao elimina a falha no servico defeituoso |
| Fault Injection e so teste de estresse | Inclui delay injection, abort injection, e cenarios combinados |
| Implementar uma vez resolve | E evolutivo — revisitar continuamente para encontrar novos furos |
| Precisa de Service Mesh para Circuit Breaker | Pode ser feito no nivel da aplicacao com frameworks especificos |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|-----------|-------------------|
| Confiar cegamente em servicos downstream | Desconfie de tudo — toda chamada externa pode falhar |
| Deixar requisicoes pendentes em servico defeituoso | Abra o circuito e pare de enviar trafego |
| Reabrir circuito de uma vez (0% → 100%) | Use half-open com porcentagem progressiva |
| So testar o caminho feliz | Use fault injection para validar cenarios de falha |
| Tratar resiliencia como projeto unico | Trate como pratica evolutiva e continua |

## When to apply

- Arquiteturas com multiplos servicos que se comunicam entre si
- Qualquer sistema onde a falha de um componente pode afetar outros
- Antes de ir para producao com microservicos criticos
- Revisoes periodicas de resiliencia do ecossistema

## Limitations

- Circuit Breaker nao conserta o servico defeituoso — so limita o dano
- Fault Injection em producao requer maturidade operacional
- Adiciona complexidade — nao implemente prematuramente em sistemas simples
- Half-open mal calibrado pode causar flapping (abre/fecha repetidamente)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-alternativas-na-camada-da-aplicacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-alternativas-na-camada-da-aplicacao/references/code-examples.md)
