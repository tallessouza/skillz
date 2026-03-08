---
name: rs-devops-config-por-namespace
description: "Applies Istio mTLS PeerAuthentication configuration per Kubernetes namespace. Use when user asks to 'configure mTLS', 'secure namespace communication', 'enable mutual TLS in Kubernetes', 'setup Istio security', or 'protect inter-service traffic'. Enforces strict mode PeerAuthentication with namespace-scoped deployment strategy. Make sure to use this skill whenever configuring service mesh security or namespace isolation. Not for application-level TLS, ingress gateway TLS termination, or certificate management outside Istio."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: istio-mtls-security
  tags: [kubernetes, istio, mtls, service-mesh, security]
---

# Configuracao mTLS por Namespace com Istio

> Configurar mTLS via PeerAuthentication do Istio no namespace, nunca na camada da aplicacao.

## Rules

1. **mTLS pertence a infraestrutura, nao a aplicacao** — a aplicacao nao precisa saber que esta em contexto mTLS, porque isso e responsabilidade da service mesh
2. **Configure por namespace primeiro, cluster depois** — comecar com namespace especifico evita quebrar comunicacoes cross-namespace existentes
3. **Use mode STRICT para enforcement real** — mode PERMISSIVE aceita trafego sem mTLS, o que anula o proposito de seguranca
4. **Arquivo de configuracao fica na pasta de infra** — mTLS nao e config de aplicacao, entao vive junto com os YAMLs de infraestrutura (ex: `k8s/mtls.yaml`)
5. **Chamadas cross-namespace quebram com STRICT** — se namespace A chama namespace B protegido por mTLS, a chamada falha com timeout porque A nao tem certificado valido para B
6. **Valide antes de aplicar em cluster inteiro** — feche um namespace, teste intra e inter namespace, so depois expanda

## How to write

### PeerAuthentication por Namespace

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: mtls-default
  namespace: app  # namespace especifico — obrigatorio para scoped config
spec:
  mtls:
    mode: STRICT
```

### Aplicar a configuracao

```bash
# Aplicar no namespace especifico
kubectl apply -f k8s/mtls.yaml -n app

# Verificar se foi criado
kubectl get peerauthentication -n app
```

### Testar chamada intra-namespace (deve funcionar)

```bash
# Pod no mesmo namespace — funciona com mTLS
kubectl run fortio --image=fortio/fortio -n app -- load -c 1 -qps 0 -t 10s http://app-service-mesh:8080
```

### Testar chamada inter-namespace (deve falhar com STRICT)

```bash
# Pod em namespace diferente chamando namespace protegido — timeout
kubectl run fortio --image=fortio/fortio -n default -- load -c 1 -qps 0 -t 10s http://app-service-mesh.app:8080
```

## Example

**Before (sem mTLS — qualquer namespace chama qualquer servico):**
```bash
# Do namespace default, chamando servico no namespace app
kubectl run test --image=fortio/fortio -n default -- load http://app-service-mesh.app:8080
# Resultado: 200 OK — sem protecao
```

**After (com mTLS STRICT no namespace app):**
```bash
# Mesma chamada cross-namespace
kubectl run test --image=fortio/fortio -n default -- load http://app-service-mesh.app:8080
# Resultado: timeout — namespace protegido bloqueia chamadas sem certificado mTLS
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Servicos so se comunicam dentro do mesmo namespace | Aplicar STRICT no namespace com seguranca |
| Existe comunicacao cross-namespace | Mapear dependencias antes de ativar STRICT |
| Cluster novo sem trafego legado | Pode aplicar STRICT a nivel de cluster |
| Cluster grande em producao | Ativar por namespace incremental, validar cada um |
| Precisa permitir trafego externo temporariamente | Usar mode PERMISSIVE (aceita com e sem mTLS) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Configurar mTLS na camada da aplicacao | Usar PeerAuthentication do Istio na infra |
| Aplicar STRICT no cluster inteiro sem testar | Comecar por um namespace, validar, expandir |
| Gerar certificados manualmente para cada servico | Deixar o Istio gerenciar emissao e rotacao |
| Ignorar chamadas cross-namespace ao ativar mTLS | Mapear todas as dependencias inter-namespace antes |
| Usar mode PERMISSIVE em producao permanentemente | PERMISSIVE so para migracao gradual, depois STRICT |

## Troubleshooting

### Chamada intra-namespace falha com timeout apos ativar mTLS STRICT
**Symptom:** Servicos no mesmo namespace retornam timeout apos aplicar PeerAuthentication STRICT
**Cause:** O namespace nao esta na malha do Istio (falta sidecar ou ambient mode label)
**Fix:** Verifique se o namespace tem o label correto e se os pods possuem sidecar Istio injetado ou estao em ambient mode

### mTLS PERMISSIVE nao bloqueia chamadas sem certificado
**Symptom:** Chamadas sem mTLS continuam funcionando mesmo com PeerAuthentication configurado
**Cause:** O mode esta como PERMISSIVE, que aceita trafego com e sem mTLS
**Fix:** Altere para mode STRICT apos validar que todas as dependencias estao na malha

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-adicionando-configuracao-por-namespace/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-adicionando-configuracao-por-namespace/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
