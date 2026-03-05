# Code Examples: Configuracao mTLS por Cluster

## Exemplo 1: Rotulando namespaces para a malha

```bash
# Rotular namespace app para ambient mode
kubectl label namespace app istio.io/dataplane-mode=ambient

# Rotular namespace default (normalmente nao usado em producao)
kubectl label namespace default istio.io/dataplane-mode=ambient

# Verificar labels
kubectl get namespace --show-labels
```

## Exemplo 2: PeerAuthentication por namespace (abordagem limitada)

```yaml
# mtls-namespace.yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: mtls-app
  namespace: app  # So protege o namespace app
spec:
  mtls:
    mode: STRICT
```

```bash
kubectl apply -f mtls-namespace.yaml
```

**Limitacao:** chamadas de outros namespaces que nao estao na malha serao barradas.

## Exemplo 3: PeerAuthentication cluster-wide (abordagem recomendada)

```yaml
# mtls-cluster.yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: mtls-cluster
  namespace: istio-system  # Cobre o cluster inteiro
spec:
  mtls:
    mode: STRICT
```

```bash
# Deletar mTLS por namespace antes de aplicar cluster-wide
kubectl delete peerauthentication mtls-app -n app

# Aplicar no istio-system
kubectl apply -f mtls-cluster.yaml
```

## Exemplo 4: DestinationRule com TLS mutual

```yaml
# destination-rule.yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-destination
  namespace: app
spec:
  host: "*.app.svc.cluster.local"
  trafficPolicy:
    tls:
      mode: ISTIO_MUTUAL
```

```bash
kubectl apply -f destination-rule.yaml
```

## Exemplo 5: Teste de conectividade cross-namespace

```bash
# Teste de dentro do namespace default para o namespace app
kubectl exec -n default deploy/curl-pod -- \
  curl -s app-service.app.svc.cluster.local/

# Se retornar 200: mTLS esta configurado corretamente
# Se falhar: verificar se ambos namespaces estao na malha
```

## Exemplo 6: Verificacao via Kiali

Apos aplicar as configuracoes, no dashboard do Kiali:
- **Workloads** mostra os servicos detectados por namespace
- **Waypoint** mostra o trafego passando pelo proxy
- Icone de **cadeado verde** indica trafego criptografado com mTLS
- Chamadas de fora do cluster aparecem sem cadeado (esperado)

## Exemplo 7: Fluxo completo de configuracao

```bash
# 1. Rotular todos os namespaces que participam da malha
kubectl label namespace app istio.io/dataplane-mode=ambient
kubectl label namespace default istio.io/dataplane-mode=ambient
kubectl label namespace orders istio.io/dataplane-mode=ambient

# 2. Aplicar mTLS cluster-wide
cat <<EOF | kubectl apply -f -
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: mtls-cluster
  namespace: istio-system
spec:
  mtls:
    mode: STRICT
EOF

# 3. Aplicar DestinationRule
cat <<EOF | kubectl apply -f -
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-destination
  namespace: app
spec:
  host: "*.app.svc.cluster.local"
  trafficPolicy:
    tls:
      mode: ISTIO_MUTUAL
EOF

# 4. Testar conectividade
kubectl exec -n default deploy/curl-pod -- \
  curl -s app-service.app.svc.cluster.local/

# 5. Verificar no Kiali que trafego esta criptografado
```

## Variacoes: mTLS mode PERMISSIVE vs STRICT

```yaml
# PERMISSIVE: aceita tanto plain-text quanto mTLS (bom para migracao)
spec:
  mtls:
    mode: PERMISSIVE

# STRICT: exige mTLS (producao)
spec:
  mtls:
    mode: STRICT
```

Use `PERMISSIVE` durante migracao gradual de namespaces para a malha. Mude para `STRICT` quando todos os namespaces estiverem rotulados.