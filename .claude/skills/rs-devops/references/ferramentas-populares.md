---
name: rs-devops-ferramentas-populares
description: "Applies service mesh tool selection criteria when designing Kubernetes networking architecture. Use when user asks to 'choose a service mesh', 'compare Istio vs Linkerd', 'setup service mesh', 'configure mesh networking', or 'design microservice communication'. Provides decision framework for Linkerd, Istio, Cilium, Consul Connect, Kuma, and AWS App Mesh. Make sure to use this skill whenever evaluating or recommending service mesh tools for Kubernetes clusters. Not for application-level API gateway selection, ingress controller setup, or general Kubernetes networking without mesh requirements."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: service-mesh
  tags: [service-mesh, istio, linkerd, cilium, consul, kuma, aws-app-mesh, ebpf]
---

# Ferramentas de Service Mesh

> Escolha a ferramenta de service mesh pelo equilibrio entre abrangencia de recursos, consumo de recursos e adocao no mercado.

## Key concepts

Todas as ferramentas de service mesh seguem o mesmo modelo de trabalho: um data plane (proxies sidecar ao lado de cada servico) e um control plane (gerenciamento centralizado). A diferenca entre elas esta em peso, foco, licenciamento e ecossistema.

## Decision framework

| Criterio | Istio | Linkerd | Cilium SM | Consul Connect | Kuma | AWS App Mesh |
|----------|-------|---------|-----------|----------------|------|-------------|
| Licenca | Open source | Open source (CNCF) | Open source | Open source | Open source | Closed source |
| Peso | Pesado, muitos recursos | Leve (escrito em Rust) | Leve (eBPF) | Medio | Medio | Medio |
| Abrangencia | Muito ampla | Focado | Focado em rede | Service discovery + mesh | Ecossistema Kong | AWS-native |
| Adocao mercado | Principal, amplamente usado | Top 2, boa adocao | Crescendo | Nicho (HashiCorp) | Crescendo | AWS shops |
| Complexidade | Alta (mais recursos = mais gerenciamento) | Baixa | Baixa-media | Media | Media | Media |
| Consumo recursos | Alto | Baixo | Baixo (kernel-level) | Medio | Medio | Gerenciado |
| Custo | Infra + gerenciamento proprio | Infra + gerenciamento proprio | Infra + gerenciamento proprio | Infra + gerenciamento proprio | Infra + gerenciamento proprio | Infra + licenca + gerenciamento AWS |

## How to think about it

### Istio vs Linkerd (comparacao mais comum)

Istio abrange mais conceitos e atende mais contextos, mas consome mais recursos e tem gerenciamento mais complexo. Linkerd e mais focado, leve e performatico. Para aprendizado, Istio expoe mais conceitos. Para producao com foco em simplicidade, Linkerd e forte candidato.

### Open source vs Closed source (custo real)

Open source nao significa gratis — voce paga o gerenciamento proprio. Closed source (como AWS App Mesh) voce paga pelo gerenciamento E pela ferramenta. A diferenca e quem gerencia e quanto controle voce tem.

### eBPF como diferencial (Cilium)

Cilium opera na camada de kernel via eBPF (Extended Berkeley Packet Filter), usando o CNI do Cilium. Resultado: performance superior por operar mais proximo do kernel. Se performance de rede e prioridade maxima, Cilium merece avaliacao.

### Ecossistemas integrados

- **Kuma** pertence ao ecossistema Kong (API Gateway + Konga + Kuma)
- **Consul Connect** pertence ao ecossistema HashiCorp (Terraform + Nomad + Consul) — alta integracao com Nomad (orquestrador alternativo ao Kubernetes)

## When to apply

| Situacao | Recomendacao |
|----------|-------------|
| Aprendizado amplo de service mesh | Istio (mais conceitos expostos) |
| Producao com foco em leveza | Linkerd ou Cilium |
| Ja usa ecossistema Kong | Avaliar Kuma |
| Ja usa HashiCorp/Nomad | Consul Connect |
| Full AWS, quer gerenciamento AWS | AWS App Mesh |
| Performance de rede e critica | Cilium (eBPF) |
| Mercado/empregabilidade | Istio (principal) e Linkerd (top 2) |

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Open source = gratis | Voce paga infraestrutura e gerenciamento proprio |
| Istio e sempre melhor por ter mais recursos | Mais recursos = mais complexidade e consumo; Linkerd pode ser melhor para casos focados |
| Ferramentas de service mesh sao muito diferentes | Conceitualmente sao similares — nomenclaturas e formas de configurar mudam, mas os conceitos (sidecar, mTLS, traffic management) sao os mesmos |
| Preciso aprender todas | Aprenda uma bem (Istio ou Linkerd), os conceitos transferem para as outras |

## Diagnostic

```bash
# Verificar se Istio esta instalado no cluster
istioctl version

# Verificar se Linkerd esta instalado
linkerd version

# Verificar se Cilium esta instalado
cilium status
```

## Limitations

- Esta referencia cobre selecao de ferramenta, nao configuracao. Para setup de Istio, consulte skills especificas de instalacao e configuracao.
- O mercado de service mesh evolui rapido — Cilium e Kuma estao ganhando tracao e podem mudar de posicao no ranking.

## Troubleshooting

### Dificuldade em escolher entre Istio e Linkerd
**Symptom:** Time gasta tempo comparando ferramentas sem conseguir decidir
**Cause:** Foco excessivo em features ao inves de criterios praticos (peso, complexidade, equipe disponivel)
**Fix:** Se esta aprendendo, use Istio (mais conceitos expostos). Se precisa de leveza em producao com equipe pequena, use Linkerd. Os conceitos transferem entre ferramentas.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
