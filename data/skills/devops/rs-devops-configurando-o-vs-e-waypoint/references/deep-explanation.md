# Deep Explanation: Waypoint e Virtual Service no Ambient Mode

## Por que o Virtual Service e ignorado sem Waypoint?

No modelo tradicional do Istio (sidecar), cada pod tem um proxy Envoy rodando ao lado do container da aplicacao. Esse proxy intercepta TODAS as requisicoes de entrada e saida, consultando as configuracoes de Virtual Service, Destination Rule, Circuit Breaker, etc.

No **Ambient Mode**, nao existe sidecar. O trafego flui diretamente entre pods sem interceptacao. Isso significa que as regras de roteamento definidas no Virtual Service simplesmente nao tem quem as execute — nao ha proxy para consulta-las.

O **Waypoint** resolve esse problema. Ele funciona como um "grande sidecar do namespace" — um gateway intermediario que intercepta o trafego dentro do namespace e aplica todas as regras de roteamento, policies e observabilidade.

### Analogia do instrutor

O Waypoint e "muito entre aspas, como se fosse um grande sidecar dentro do namespace". Em vez de ter um proxy por pod, voce tem um proxy por namespace que faz o mesmo trabalho.

## GatewayClass Names disponiveis

Quando voce instala os CRDs do Gateway API do Kubernetes (recomendado pela documentacao do Istio), tres GatewayClass sao criados:

| GatewayClass | Uso |
|-------------|-----|
| `istio` | Gateway de ingress tradicional (entrada de trafego externo) |
| `istio-remote` | Configuracoes multi-cluster |
| `istio-waypoint` | Interceptacao de trafego interno no Ambient Mode |

Esses podem ser visualizados em `Gateway.networking > Gateway Class` no Lens, ou via:
```bash
kubectl get gatewayclasses
```

## Gateway API do Kubernetes vs Gateway do Istio

O instrutor destaca que estao usando a **Gateway API do Kubernetes** (do Kubernetes SIGs), nao o Gateway nativo do Istio. O Gateway do Istio (em `networking.istio.io`) ainda funciona, mas nao e mais a opcao recomendada. A Gateway API do Kubernetes e o padrao atual.

Os recursos do Istio como Virtual Service e Destination Rule continuam em `networking.istio.io` — essa separacao e importante para entender onde cada recurso vive.

## O problema observado na aula

### Teste 1: Chamada direta ao servico (sem Waypoint)
- 15.000 requisicoes via `kubectl run fortio`
- Apontando para `app-service-mesh-svc/healthz`
- **Resultado:** Kiali nao registrou NENHUMA metrica
- Trafego foi dividido 50/50 entre v1 e v2 (ignorando Virtual Service)

### Teste 2: Chamada via Gateway de ingress
- Mesmas 15.000 requisicoes
- Apontando para `app-service-mesh-gateway-istio/healthz`
- **Resultado:** Kiali registrou, mas trafego ainda 50/50
- O Gateway de ingress nao substitui o Waypoint para roteamento interno

### Teste 3: Apos configurar Waypoint + label
- Chamada direta ao servico novamente
- **Resultado:** Kiali registrou metricas, trafego respeitou Virtual Service
- O Traffic Graph do Kiali teve problemas de visualizacao (possivel bug de versao)

## HTTPRoute: exact vs pathPrefix

O instrutor mostrou duas abordagens para o HTTPRoute do Gateway:

```yaml
# Abordagem 1: Rotas exatas (usada na aula)
matches:
  - path:
      type: Exact
      value: /healthz

# Abordagem 2: Catch-all com prefix (dica do instrutor)
matches:
  - path:
      type: PathPrefix
      value: /
```

A abordagem com `PathPrefix: /` redireciona QUALQUER rota para o servico backend, evitando definir cada rota individualmente. Util quando o servico tem muitas rotas (100, 200+).

## Headers em Virtual Service

O instrutor reforça: headers SEMPRE chegam como string, independente do tipo original. Se voce envia um booleano `true` ou um numero `42`, o servidor recebe `"true"` e `"42"`. Por isso o match usa `exact: "true"` (com aspas).

## Waypoint NAO e ponto de acesso

O instrutor testou acessar o Waypoint diretamente pelas portas 15021 e 15008:
- Porta 15021: retornou 404
- Porta 15008: retornou empty response

Isso confirma que o Waypoint nao serve como endpoint — ele e puramente um interceptador transparente.