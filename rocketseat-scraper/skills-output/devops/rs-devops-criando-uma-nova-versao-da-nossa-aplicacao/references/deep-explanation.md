# Deep Explanation: Deploy Multi-Versao com Istio Service Mesh

## Endereco DNS Interno do Kubernetes

Quando voce cria um Service no Kubernetes, ele recebe um endereco DNS interno no formato:

```
nome-do-servico.namespace.svc.cluster.local
```

Esse endereco permite comunicacao intra-cluster — se voce tem `AppServiceMeshSVC` e `AppServiceMeshSVC-B`, eles podem se comunicar sem sair para a internet, usando esse DNS interno.

O formato abreviado (`nome-do-servico.namespace` ou ate so `nome-do-servico`) funciona quando voce esta no mesmo namespace, mas a **boa pratica** e sempre usar o endereco completo com `.svc.cluster.local`. O instrutor enfatiza isso como padrao a ser mantido em todos os manifestos.

**Nota sobre permissoes:** dependendo da configuracao do namespace, pode haver restricoes de acesso entre namespaces. Mas dentro do mesmo cluster e namespace, a comunicacao funciona normalmente.

## Por que arquivos separados por versao

O instrutor explicitamente rejeita a abordagem de juntar multiplos recursos no mesmo YAML usando `---` como separador. Ele considera isso "um pouco baguncado" e prefere criar arquivos separados (`deployment-v2.yaml`) para cada versao.

Isso traz beneficios praticos:
- `kubectl apply -f deployment-v2.yaml` permite deploy seletivo
- Rollback e independente — voce pode reverter uma versao sem tocar na outra
- Mais facil de ler e manter em code review

## Fluxo completo de criar V2

O processo baby-steps que o instrutor segue:

1. **Modificar o codigo fonte** — alterar as respostas dos health checks para incluir "v2" (tanto `/healthz` quanto `/readyz`), para identificar visualmente qual versao esta respondendo

2. **Build local da imagem:**
   ```bash
   docker build -t app-service-mesh:v2 .
   ```

3. **Tag para o registry:**
   ```bash
   docker tag app-service-mesh:v2 usuario/app-service-mesh:v2
   ```
   Dica do instrutor: voce pode pular o tag se ja buildar com o nome completo:
   ```bash
   docker build -t usuario/app-service-mesh:v2 .
   ```

4. **Push para o registry:**
   ```bash
   docker push usuario/app-service-mesh:v2
   ```

5. **Verificar no Docker Hub** — confirmar que a tag v2 aparece no repositorio

6. **Teste rapido** — temporariamente mudar o deployment existente para v2, verificar que funciona, e depois reverter para v1. Isso valida a imagem antes de criar infraestrutura de multi-versao.

7. **Criar deployment-v2.yaml** — arquivo separado com as labels corretas

8. **Aplicar e verificar** — `kubectl apply` e confirmar via port-forward ou Lens

## A label `version` e o Istio/Kiali

O Kiali (dashboard do Istio) monitora workloads e espera encontrar uma label `version` nos pods. Sem ela, aparece o warning "Missing Version" na interface.

**Onde colocar:** A label deve estar no `spec.template.metadata.labels`, NAO apenas no `metadata.labels` do Deployment. E no template que define as labels dos Pods, e os Pods sao o que o Istio injeta com o sidecar.

```yaml
spec:
  template:
    metadata:
      labels:
        app: app-service-mesh
        version: v1  # AQUI, no template
```

O instrutor cometeu o erro de trocar a label em apenas um lugar inicialmente, o que causou erro de labels invalidas no kubectl apply. Todas as referencias de labels (selector.matchLabels, template.metadata.labels) precisam ser consistentes.

## Deploy Canario — Conceito

O instrutor explica que Deploy Canario e um lancamento gradual onde voce controla a porcentagem de trafego entre versoes. Com o DestinationRule + VirtualService do Istio, voce pode dizer:
- 80% do trafego vai para v1
- 20% vai para v2

Isso permite validar a nova versao com uma parcela pequena de usuarios antes de promover para 100%.

## imagePullPolicy e velocidade de rollback

O instrutor destaca que com `imagePullPolicy: IfNotPresent`, o Kubernetes nao re-baixa a imagem se ela ja existe no node. Isso torna rollbacks entre versoes muito mais rapidos, pois as imagens v1 e v2 ja estao em cache local.

## Sidecar do Istio

O instrutor menciona que os pods mostram `0/2 Ready` durante inicializacao — isso porque o Istio injeta automaticamente um sidecar proxy (Envoy) em cada pod. Entao cada pod tem 2 containers: a aplicacao + o sidecar. Esse e o mecanismo que permite ao Istio controlar o trafego entre versoes.