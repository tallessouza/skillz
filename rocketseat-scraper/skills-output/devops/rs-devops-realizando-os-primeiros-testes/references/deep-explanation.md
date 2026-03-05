# Deep Explanation: Service Mesh — Primeiros Testes

## Por que labels consistentes sao criticas

O problema central da aula: ao criar o deployment V2 com labels diferentes no selector (por exemplo, `app: app-service-mesh-v2`), o Service do Kubernetes — que faz match por `app: app-service-mesh` — simplesmente nao encontra os pods da V2. O Istio herda esse comportamento porque o Destination Rule tambem depende do host (Service) para localizar os pods.

A solucao: **o nome do Deployment muda** (para segregar os recursos), mas **as labels do selector e template permanecem as mesmas** entre versoes. A unica label que muda e a `version`, usada exclusivamente pelo Destination Rule para criar subsets.

## Troubleshooting: nao da para mutar labels

O Kubernetes nao permite alterar o campo `spec.selector.matchLabels` de um Deployment ja criado. Se voce tentar mudar apenas uma das labels (selector ou template) sem a outra, o deploy vai falhar porque nao havera match. A solucao e deletar o deployment e recria-lo com as labels corretas.

## Relacao Virtual Service ↔ Destination Rule

Esses dois recursos sao complementares:

- **Destination Rule**: define os **subsets** — agrupamentos de pods por label. Exemplo: subset `v1` = pods com `version: v1`.
- **Virtual Service**: define as **regras de roteamento** — quanto trafego vai para cada subset. Exemplo: 80% para subset `v1`, 20% para subset `v2`.

O campo `subset` no Virtual Service referencia o `name` do subset no Destination Rule. O campo `host` em ambos aponta para o Service do Kubernetes.

## Aplicacao agnostica — o grande beneficio

O instrutor enfatiza que a aplicacao **nao sabe nada** sobre o split de trafego. Isso e o ponto mais poderoso do service mesh: o controle de trafego fica 100% na camada de infraestrutura. Voce pode mudar de 80/20 para 50/50 sem tocar em uma linha de codigo da aplicacao, sem redeploy, apenas alterando o Virtual Service e aplicando com `kubectl apply`.

Isso habilita:
- **Canary deployments**: comece com 5% na V2, aumente gradualmente
- **Testes A/B**: split 50/50 entre variantes
- **Rollback instantaneo**: mude weight para 100/0 se V2 tiver problemas

## Validacao com FortIO

O FortIO e usado como pod temporario (`--rm`) dentro do cluster para gerar carga interna. O teste com 8000 QPS, 35 conexoes, durante 60 segundos gera volume suficiente para validar estatisticamente o split de trafego.

No teste 80/20:
- V1 recebeu ~1742 requests, V2 ~500 de um total de ~2200
- Proporcao real: ~79/21 — muito proximo do configurado

No teste 50/50:
- Normalizou para ~733/733 ao final do teste
- Pequenas variacoes sao normais e esperadas

## Kiali como ferramenta de observabilidade

O Kiali mostra em tempo real:
- O grafo de trafego entre servicos
- Quantidade de requests por segundo por versao
- Status codes (100% de 200 = sem erros)
- Recomendacoes (como protocolo de porta nao configurado)

## Endpoints e debugging

`kubectl get endpoints <service>` lista todos os IPs dos pods que o Service reconhece. Com 2 deployments de 4 replicas cada, devem aparecer 8 IPs. Se faltam IPs de uma versao, o problema esta nas labels do selector.