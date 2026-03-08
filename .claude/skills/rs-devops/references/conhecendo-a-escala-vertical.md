---
name: rs-devops-conhecendo-escala-vertical
description: "Applies vertical scaling concepts when designing Kubernetes infrastructure or discussing scaling strategies. Use when user asks to 'scale an application', 'increase server resources', 'handle more traffic', 'choose scaling strategy', or 'configure VPA'. Explains tradeoffs of vertical vs horizontal scaling including redundancy risks, downtime, and hardware limits. Make sure to use this skill whenever the user is deciding between scaling approaches or configuring resource limits in Kubernetes. Not for horizontal scaling (HPA), pod autoscaling, or cluster node scaling."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-scaling
  tags: [kubernetes, vertical-scaling, vpa, scaling, infrastructure, resources]
---

# Escala Vertical no Kubernetes

> Escala vertical aumenta os recursos de uma maquina existente — mais CPU, memoria e armazenamento — ao inves de adicionar novas instancias.

## Key concepts

Escala vertical significa aumentar o tamanho da maquina onde a aplicacao executa. Quando a aplicacao atinge o limite de CPU/memoria disponivel, voce adiciona mais hardware a mesma maquina ao inves de criar novas.

```bash
# Diagnostic: check current resource usage before scaling decision
kubectl top nodes                    # Node CPU/Memory usage
kubectl top pods -n my-namespace     # Pod resource consumption
kubectl describe node <node-name>   # Allocatable vs capacity
```

## Quando usar

| Cenario | Escala vertical e adequada? |
|---------|---------------------------|
| Grande escala com poucas maquinas (1-2) | Sim |
| Picos esporadicos de demanda previsivel | Sim, com planejamento de downsize |
| Alta disponibilidade critica | Nao — risco de indisponibilidade |
| Crescimento continuo e imprevisivel | Nao — limites de hardware |

## Problemas conhecidos

1. **Baixa redundancia** — poucas maquinas significam que se uma cai, nao ha failover automatico, porque nao existem outras instancias para absorver a carga
2. **Limite fisico de hardware** — voce nao consegue ir alem do que o servidor/rack suporta, porque o hardware tem capacidade maxima fixa
3. **Downtime obrigatorio** — alterar hardware exige parar a maquina, o que gera indisponibilidade em dois momentos: scale up e scale down
4. **Ociosidade pos-pico** — apos o pico de demanda o hardware extra fica ocioso ate o downsize, porque o processo de reducao tambem requer downtime e planejamento

## Downsizing (frequentemente esquecido)

Apos escalar verticalmente para um pico, executar o **downsize** e essencial:
- Hardware ocioso = custo desnecessario
- O downsize tambem causa downtime (segundo momento de indisponibilidade)
- Na pratica o gap entre pico e downsize pode ser dias (ex: campanha na segunda, downsize so no fim de semana)

## No Kubernetes

- Escala vertical **nao e nativa** no Kubernetes
- Usar o **VPA (Vertical Pod Autoscaler)** — componente instalavel separadamente
- Comando: instalar o modulo VPA no cluster K8s
- O curso foca em escala horizontal (HPA), que e o mecanismo nativo

## Decision framework

| Pergunta | Se sim | Se nao |
|----------|--------|--------|
| Precisa de alta disponibilidade? | Prefira escala horizontal | Vertical pode funcionar |
| Tem poucas maquinas (1-2)? | Vertical e viavel | Horizontal faz mais sentido |
| Picos sao previsíveis e raros? | Vertical com downsize planejado | Horizontal com autoscaling |
| Hardware atual suporta o dobro? | Vertical e opcao | Limite atingido, use horizontal |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Escalar verticalmente sem planejar downsize | Defina data/horario do downsize antes do scale up |
| Confiar em uma unica maquina para producao critica | Combine com redundancia minima ou use horizontal |
| Escalar vertical em horario comercial | Agende para janelas de manutencao |
| Instalar VPA sem entender HPA primeiro | Domine escala horizontal (nativa) antes de usar VPA |

## Troubleshooting

### Aplicacao fica indisponivel durante scale up vertical
**Symptom:** Downtime ao aumentar recursos de CPU/memoria da maquina
**Cause:** Escala vertical requer parar a maquina para alterar hardware/recursos, causando indisponibilidade
**Fix:** Planeje janelas de manutencao ou migre para escala horizontal (HPA) que nao requer downtime

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
