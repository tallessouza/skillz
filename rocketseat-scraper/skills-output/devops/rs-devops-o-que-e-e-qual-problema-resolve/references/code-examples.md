# Code Examples: mTLS e Zero Trust em Service Mesh

## Nota importante

Esta aula e conceitual — nao contem codigo. O instrutor explica que a proxima aula tera a configuracao pratica do mTLS no Istio. Os exemplos abaixo ilustram os conceitos apresentados e antecipam a configuracao que sera vista.

## mTLS no Istio — PeerAuthentication

```yaml
# Ativa mTLS STRICT para todo o namespace
# Todos os servicos no namespace precisam apresentar certificado mutuo
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: my-namespace
spec:
  mtls:
    mode: STRICT  # Rejeita qualquer trafego sem mTLS
```

### Modos de mTLS no Istio

```yaml
# STRICT — apenas trafego mTLS aceito (zero trust completo)
spec:
  mtls:
    mode: STRICT

# PERMISSIVE — aceita mTLS e plaintext (periodo de migracao)
spec:
  mtls:
    mode: PERMISSIVE

# DISABLE — desativa mTLS (nao recomendado)
spec:
  mtls:
    mode: DISABLE
```

## mTLS mesh-wide (todo o cluster)

```yaml
# Aplica mTLS STRICT em todo o mesh
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system  # namespace do Istio = mesh-wide
spec:
  mtls:
    mode: STRICT
```

## DestinationRule com mTLS

```yaml
# Garante que o trafego de saida para um servico use mTLS
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: my-service-mtls
  namespace: my-namespace
spec:
  host: my-service.my-namespace.svc.cluster.local
  trafficPolicy:
    tls:
      mode: ISTIO_MUTUAL  # Usa certificados gerenciados pelo Istio
```

## Verificando mTLS ativo

```bash
# Verificar se mTLS esta ativo entre servicos
istioctl x describe pod <pod-name> -n <namespace>

# Ver certificados sendo usados
istioctl proxy-config secret <pod-name> -n <namespace>

# Testar conexao sem mTLS (deve falhar com STRICT)
kubectl exec -it <pod-sem-sidecar> -- curl http://my-service:8080
# Resultado esperado: connection refused ou reset by peer
```

## Comparacao: TLS vs mTLS

```
# TLS tradicional (HTTPS)
# Cliente verifica servidor, servidor NAO verifica cliente
Client ──[ClientHello]──▶ Server
Client ◀──[Certificate]── Server
Client ──[Verificacao]───▶ (valida certificado do servidor)
Client ◀──────────────────▶ Server (canal criptografado)

# mTLS (Mutual TLS)
# AMBOS verificam um ao outro
Client ──[ClientHello]──────────▶ Server
Client ◀──[ServerCertificate]─── Server
Client ──[ClientCertificate]────▶ Server
Client ──[Verifica servidor]────▶ (valida cert do servidor)
Server ──[Verifica cliente]─────▶ (valida cert do cliente)
Client ◀─────────────────────────▶ Server (canal mutuamente autenticado)
```

## Alternativa sem Istio: AWS ALB com mTLS

```yaml
# Configuracao de ALB com mTLS na AWS (via Terraform)
resource "aws_lb_listener" "mtls" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"

  mutual_authentication {
    mode                             = "verify"
    trust_store_arn                  = aws_lb_trust_store.main.arn
    ignore_client_certificate_expiry = false
  }
}
```