# Code Examples: Configuracao mTLS por Namespace

## Exemplo 1: PeerAuthentication completo

Arquivo `k8s/mtls.yaml`:

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: mtls-default
  namespace: app
spec:
  mtls:
    mode: STRICT
```

### Explicacao campo a campo

- `apiVersion: security.istio.io/v1beta1` — API de seguranca do Istio
- `kind: PeerAuthentication` — recurso que controla autenticacao entre peers (servicos)
- `metadata.name: mtls-default` — nome descritivo da policy
- `metadata.namespace: app` — escopo limitado ao namespace `app`
- `spec.mtls.mode: STRICT` — exige mTLS em todas as comunicacoes

## Exemplo 2: Aplicar e verificar

```bash
# Aplicar a configuracao
kubectl apply -f k8s/mtls.yaml -n app
# Output: peerauthentication.security.istio.io/mtls-default created

# Verificar que foi criado
kubectl get peerauthentication -n app
# NAME           MODE     AGE
# mtls-default   STRICT   5s

# Ver detalhes completos
kubectl describe peerauthentication mtls-default -n app
```

## Exemplo 3: Teste intra-namespace (funciona)

```bash
# Criar pod de teste DENTRO do namespace app
kubectl run fortio --image=fortio/fortio -n app --restart=Never -- \
  load -c 1 -qps 0 -t 10s http://app-service-mesh:8080

# Verificar logs — deve mostrar respostas 200
kubectl logs fortio -n app
```

Como ambos os pods estao no namespace `app` e tem sidecar Istio, a comunicacao mTLS funciona transparentemente.

## Exemplo 4: Teste inter-namespace (falha com STRICT)

```bash
# Criar pod de teste no namespace DEFAULT chamando servico no namespace APP
kubectl run fortio --image=fortio/fortio -n default --restart=Never -- \
  load -c 1 -qps 0 -t 10s http://app-service-mesh.app:8080

# Resultado: timeout — o namespace app rejeita a chamada
# porque o pod no namespace default nao tem certificado mTLS valido
```

Nota: o formato `servico.namespace` (ex: `app-service-mesh.app`) e como Kubernetes resolve DNS cross-namespace.

## Exemplo 5: Remover mTLS para validar que era ele bloqueando

```bash
# Deletar a policy
kubectl delete -f k8s/mtls.yaml
# ou
kubectl delete peerauthentication mtls-default -n app

# Verificar que foi removido
kubectl get peerauthentication -n app
# No resources found in app namespace.

# Repetir teste inter-namespace — agora funciona
kubectl run fortio --image=fortio/fortio -n default --restart=Never -- \
  load -c 1 -qps 0 -t 10s http://app-service-mesh.app:8080
# Resultado: 200 OK — sem mTLS, trafego passa livremente
```

## Exemplo 6: Verificar no Kiali

Apos aplicar mTLS, no Kiali:
1. **Custom Resources** → Security → PeerAuthentication → `mtls-default` visivel
2. **Workload Graph** → icone de cadeado indica trafego criptografado
3. **Workload details** → mostra peer authentication policy aplicada

## Exemplo 7: Mode PERMISSIVE (para migracao gradual)

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: mtls-permissive
  namespace: app
spec:
  mtls:
    mode: PERMISSIVE  # aceita mTLS e plaintext
```

Usar PERMISSIVE como passo intermediario antes de STRICT:
1. Aplicar PERMISSIVE → monitorar no Kiali quais chamadas ja usam mTLS
2. Garantir que todos os servicos tem sidecar Istio
3. Mudar para STRICT quando 100% do trafego ja e mTLS