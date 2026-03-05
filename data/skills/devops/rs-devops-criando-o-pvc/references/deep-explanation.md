# Deep Explanation: Criando PVC no Kubernetes

## PVC no contexto da aplicacao

O PVC (PersistentVolumeClaim) faz parte do contexto da **aplicacao**, nao da infraestrutura. E a aplicacao que requisita espaco de armazenamento. O PV (PersistentVolume) e o disco fisico/logico provisionado pelo admin; o PVC e o "pedido" que a aplicacao faz para usar parte desse disco.

## Relacao PV x PVC: requisitos e match

O instrutor enfatiza que um cluster pode ter **varios PVs**. Quando voce cria um PVC, o Kubernetes precisa encontrar um PV que satisfaca todos os requisitos:

1. **Capacidade**: o PVC pede X, o PV precisa ter >= X
2. **StorageClassName**: precisa ser igual
3. **AccessModes**: precisa ser compativel
4. **Selector (opcional)**: se usar matchLabels, restringe a PVs com aquelas labels

Se qualquer requisito nao bater, **nao ha match** e o PVC fica Pending.

## Storage request nao e por pod

Ponto importante trazido pelo instrutor: se voce declara `storage: 1Gi` no PVC e tem 20 pods, **nao sao 20Gi**. O request e para o deployment inteiro. Todos os pods compartilham o mesmo volume de 1Gi.

## WaitForFirstConsumer

Quando o PVC fica com status `Pending`, isso e normal se o StorageClass usa `volumeBindingMode: WaitForFirstConsumer`. O Kubernetes espera ate que um pod realmente precise do volume antes de fazer o binding. Isso e o comportamento padrao do StorageClass `standard` em muitos clusters.

O instrutor mostra o `kubectl describe pvc` e o output diz: "waiting for first consumer to be created before binding". Isso vem da configuracao do StorageClass, nao e um erro.

Se voce quiser binding imediato, pode criar um StorageClass customizado com `volumeBindingMode: Immediate`.

## Selector e matchLabels — mesma logica do Deployment

O instrutor faz um paralelo: o `selector.matchLabels` no PVC funciona com a mesma logica do selector no Deployment. No Deployment, voce seleciona pods por labels. No PVC, voce seleciona PVs por labels. A mecanica e identica — e um pattern recorrente no Kubernetes.

## Organizacao de arquivos

O instrutor organiza o manifesto como `pvc.yaml` dentro do diretorio `k8s/` da aplicacao. A convencao e usar abreviacoes (`pvc` em vez de `persistent-volume-claim`) para nomes de arquivo, seguindo o mesmo padrao do `pv.yaml`.

## Namespace

PVCs sao **namespaced** — voce precisa aplicar no namespace correto com `-n`. PVs, por outro lado, sao cluster-scoped. Isso significa que o PVC so e visivel dentro do namespace onde foi criado, e apenas pods nesse namespace podem referencia-lo.