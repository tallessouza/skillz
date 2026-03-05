# Deep Explanation: Configuracao mTLS por Cluster

## Por que mTLS por namespace nao e suficiente

O instrutor demonstra um problema real: quando voce configura mTLS apenas no namespace `app`, chamadas vindas do namespace `default` falham. Isso acontece porque:

1. O namespace `default` nao esta na malha de servicos
2. O Istio retorna `unknown` para namespaces que ele nao reconhece
3. Com STRICT mTLS, conexoes sem certificado mutuo sao rejeitadas

O problema nao e apenas que "nao funciona" — e que voce criou uma configuracao que bloqueia trafego legitimo sem perceber.

## O namespace default e um caso especial

O instrutor faz questao de mencionar: **nao e comum usar o namespace default em producao**. Ele usa apenas como exemplo didatico. Em ambientes reais, voce tera namespaces com nomes semanticos (ex: `payments`, `orders`, `auth`).

O ponto importante e: qualquer namespace que precise se comunicar com servicos protegidos por mTLS precisa estar rotulado na malha. Isso vale para `default` ou qualquer outro.

## Duas configuracoes necessarias

O instrutor identifica duas configuracoes distintas que precisam coexistir:

### 1. PeerAuthentication (quem pode se conectar)
Define que conexoes devem usar mTLS. Quando aplicado no `istio-system`, vale para o cluster inteiro.

### 2. DestinationRule com trafficPolicy (como se conectar)
Define no lado do cliente que o trafego deve usar `ISTIO_MUTUAL`. Sem isso, mesmo com PeerAuthentication ativo, o cliente pode tentar conexao plain-text.

## Escalabilidade da abordagem cluster-wide

A analogia implicita do instrutor: ao inves de colocar uma fechadura em cada porta individualmente (namespace por namespace), voce tranca o predio inteiro (istio-system). Se voce tem 20, 30, 40 namespaces, uma unica configuracao resolve.

## Chamadas intra-cluster vs externas

Ponto crucial que o instrutor enfatiza: mTLS protege **apenas** trafego dentro do cluster. Uma requisicao vindo de fora (ex: via ingress, load balancer) passa normalmente. Isso e por design — o mTLS do Istio protege comunicacao service-to-service, nao substitui TLS de borda.

Porem, se um namespace **dentro** do cluster nao estiver na malha e tentar chamar um servico protegido, sera barrado. A regra e: todo mundo dentro da malha, ou a comunicacao falha.

## Relacao com Sidecar vs Ambient Mode

O instrutor menciona que mTLS funciona identicamente em ambos os modos (Sidecar e Ambient com Waypoint). A diferenca entre eles e arquitetural (proxy por pod vs proxy por namespace), mas a configuracao de seguranca e a mesma.

## Contexto do modulo

Esta aula encerra o modulo de Service Mesh, que cobriu:
- Observabilidade (Prometheus, Jaeger para traces)
- Comparacoes com outras ferramentas de mercado
- Sidecar mode vs Ambient Mode com Waypoint
- mTLS do basico ao avancado

O proximo modulo avanca para Kubernetes em cloud (EKS), Argo, rollout strategies, Gateway, Ingress e external DNS.