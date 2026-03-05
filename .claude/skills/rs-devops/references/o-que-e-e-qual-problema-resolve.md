---
name: rs-devops-mtls-service-mesh
description: "Applies mTLS (Mutual TLS) and zero-trust networking concepts when designing Kubernetes service-to-service communication. Use when user asks to 'secure service communication', 'implement mTLS', 'configure zero trust', 'setup Istio security', or 'encrypt inter-service traffic'. Make sure to use this skill whenever designing service mesh security or evaluating whether Istio is appropriate for a cluster. Not for application-level HTTPS/TLS certificates, ingress TLS termination, or frontend SSL setup."
---

# mTLS e Zero Trust em Service Mesh

> Toda comunicacao entre servicos deve ser mutuamente autenticada — nenhum servico confia em outro, mesmo na mesma rede.

## Key concept

mTLS (Mutual TLS) e uma extensao do TLS onde **ambas as partes** verificam a identidade uma da outra. No TLS tradicional (HTTPS), apenas o cliente verifica o servidor (verificacao unilateral). No mTLS, servidor tambem verifica o cliente (verificacao bilateral).

Isso implementa o principio de **zero trust**: servico A nao confia no servico B, mesmo estando na mesma rede, mesmo sendo servicos proximos. Ambos precisam provar identidade antes de trocar dados.

## Decision framework

| Situacao | Decisao |
|----------|---------|
| Ja usa Istio para observabilidade, traffic management, etc | Ative mTLS no Istio — ja tem a infraestrutura |
| Precisa APENAS de mTLS, nao usa Istio para mais nada | Istio e overengineering — use alternativas (ALB da AWS, Linkerd, cert-manager) |
| Precisa de mTLS + circuit breaker + traffic shaping | Istio faz sentido como solucao unificada |
| Ambiente com multiplos servicos se comunicando internamente | mTLS e necessario independente da ferramenta |

## How to think about it

### TLS vs mTLS

```
TLS (unilateral):
  Cliente ──verificacao──▶ Servidor
  (cliente verifica que servidor e quem diz ser)
  Exemplo: browser verificando certificado HTTPS de um site

mTLS (bilateral):
  Cliente ◀──verificacao──▶ Servidor
  (ambos verificam identidade um do outro)
  Exemplo: servico A e servico B dentro do cluster
```

### Analogia do site de compras

Quando voce acessa um site de compras com HTTPS (TLS), seu navegador verifica que o servidor e legitimo. Se nao tiver TLS, seus dados de cartao de credito trafegam abertos e podem ser interceptados (man-in-the-middle).

mTLS aplica essa mesma logica **entre servicos internos**: sem ele, um atacante dentro da rede poderia se passar por um servico legitimo.

### Quando Istio e overengineering

O Istio e um ecossistema grande que resolve muitos problemas (traffic management, observabilidade, circuit breaker, mTLS). Usar Istio **apenas** para mTLS e como comprar um caminhao para carregar uma mochila.

A mesma logica se aplica ao circuit breaker: se voce so precisa de circuit breaker, Istio nao e para voce. Se ja usa Istio para outros fins, ativar circuit breaker ou mTLS nele faz total sentido.

## Common misconceptions

| Pessoas pensam | Realidade |
|----------------|-----------|
| Servicos na mesma rede sao seguros | Zero trust: mesma rede nao significa confianca. Trafego interno pode ser interceptado |
| TLS e mTLS sao a mesma coisa | TLS e verificacao unilateral (cliente→servidor). mTLS e bilateral (ambos verificam) |
| Preciso de Istio para ter mTLS | Existem alternativas: ALB da AWS, Linkerd, SPIFFE/SPIRE, cert-manager com mTLS manual |
| mTLS e so para producao | Em zero trust, ate ambientes de staging devem ter mTLS entre servicos |

## When to apply

- Arquiteturas de microservicos com comunicacao inter-servico
- Ambientes que exigem compliance de seguranca (PCI-DSS, SOC2)
- Clusters Kubernetes com multiplos namespaces e times
- Qualquer cenario onde zero trust e requisito

## Limitations

- mTLS adiciona overhead de handshake TLS em cada chamada entre servicos
- Gerenciamento de certificados pode ser complexo sem service mesh
- Istio como solucao de mTLS so faz sentido se ja usado para outros fins
- Nao substitui autenticacao/autorizacao a nivel de aplicacao (OAuth, JWT)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-o-que-e-e-qual-problema-resolve/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-o-que-e-e-qual-problema-resolve/references/code-examples.md)
