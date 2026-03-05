# Deep Explanation: Gateway no Istio

## Por que o Gateway existe

O instrutor explica com uma analogia clara: o Gateway e um **portao** na borda da rede. Sem ele, voce bate diretamente no servico (`app-service-mesh-svc`). Com poucas aplicacoes, isso funciona. Com muitas, vira caos — voce precisa rastrear hosts, portas, e regras individualmente.

O Gateway centraliza tudo: um unico ponto de entrada. A partir dele, voce cria regras de redirecionamento (HTTPRoutes) para distribuir trafego internamente.

## Beneficios do Gateway como camada de borda

- **Rate limiting** — aplicado antes do trafego entrar na rede
- **Autenticacao** — validada na borda, rejeita antes de consumir recursos internos
- **Kill switch** — se algo da errado, voce bloqueia na borda sem afetar servicos internos
- **Centralizacao** — um ponto unico para todas as regras de entrada

O instrutor enfatiza: "caso tenha algum problema voce pode parar a requisicao na camada da borda, isso nem cai dentro da sua rede".

## Ambient Mode vs Sidecar — Por que importa

### Sidecar: label antes do deploy

No modelo sidecar, a injecao do proxy Envoy acontece como um container adicional no pod. Isso so ocorre no momento da criacao do pod. Portanto:

1. Voce faz deploy da v1 e v2
2. Esquece de rodar o comando de label
3. Os pods sobem SEM sidecar
4. Voce roda o comando de label no namespace
5. Os pods existentes continuam SEM sidecar
6. Precisa redeploy para a injecao acontecer

### Ambient Mode: label a qualquer momento

No Ambient Mode, o ztunnel opera no nivel do node (DaemonSet). Quando voce aplica a label:

1. O ztunnel ja esta rodando em cada node
2. A label ativa a interceptacao de trafego para aquele namespace
3. Pods existentes sao automaticamente incluidos
4. Nenhum redeploy necessario

O instrutor destaca que isso "traz uma certa facilidade — nao precisa ficar rastreando ou tendo que redeployar".

## Gateway API do Kubernetes vs APIs legadas

O arquivo usa `gateway.networking.k8s.io` — esta e a API padrao do Kubernetes Gateway, nao a API legada do Istio (`networking.istio.io`). O Istio suporta ambas, mas a API do Kubernetes e o caminho recomendado porque:

- E um padrao do ecossistema (SIG-Network)
- Funciona com multiplos provedores (Istio, Cilium, etc.)
- Os CRDs sao mantidos separadamente — por isso precisam ser instalados

## O erro de CRD nao encontrado

O instrutor encontrou um erro ao aplicar o gateway pela primeira vez. O motivo: os CRDs do Gateway API nao vem pre-instalados com o Istio. E preciso instalar separadamente com:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/latest/download/standard-install.yaml
```

A documentacao do Istio (tanto para Sidecar quanto Ambient) recomenda essa instalacao como prerequisito.

## Por que o Gateway retorna 404

Apos criar o Gateway, o instrutor acessou pela porta 80 e recebeu 404. Isso e esperado: o Gateway esta ouvindo (listeners configurados), mas nao tem nenhuma rota (HTTPRoute) definida. Ele nao sabe para onde mandar o trafego. Na proxima etapa, as rotas serao configuradas para fazer o redirect para os servicos internos.

## Alternativas ao Istio Gateway

O instrutor menciona outras ferramentas que cumprem papel similar:
- **Kubernetes Gateway API nativa** — padrao do K8s
- **Kong** — API Gateway muito popular, centraliza requisicoes na borda
- Todos compartilham o conceito de centralizar em um ponto unico na borda

## Contexto do teste de carga

O teste usa Fortio com 500 QPS por 10 segundos (5000 requisicoes). O trafego passa pelo VirtualService que faz split:
- Header `teste-ab: true` → v2
- Sem header → v1

O DestinationRule tem circuit breaker configurado. Com Ambient Mode ativo, o Kiali mostra o trafego passando corretamente — confirmando que a malha funciona sem sidecar.