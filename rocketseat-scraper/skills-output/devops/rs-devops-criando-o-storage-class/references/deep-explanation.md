# Deep Explanation: Kubernetes StorageClass

## Por que StorageClass é configuração de cluster

O instrutor enfatiza que StorageClass é uma configuração a nível de cluster, não de aplicação. Por isso ele move o manifesto para a raiz do diretório k8s, ao lado de outros recursos de cluster como kind config e metric-server. Isso mantém a organização coesa: recursos com escopo de cluster ficam juntos, separados dos manifests de aplicação que vivem em namespaces.

## O campo provisioner é obrigatório

Durante a aula, o instrutor demonstra que ao criar o YAML sem o campo `provisioner`, o editor (e o kubectl) reclamam imediatamente: "missing property provisioner". Isso porque o provisioner define QUEM vai criar o volume físico quando um PVC solicitar storage. Sem ele, o Kubernetes não sabe como provisionar.

### Provisioners disponíveis

- **`rancher.io/local-path`**: Usado pelo local-path-provisioner (padrão em clusters kind/k3s). Cria volumes em diretórios locais do node.
- **`kubernetes.io/no-provisioner`**: Modo manual — o Kubernetes não provisiona automaticamente. O admin precisa criar PersistentVolumes manualmente. Útil para cenários onde você quer controle total.

## ReclaimPolicy — o que acontece quando o PVC morre

O instrutor lista as três opções:

1. **Delete**: Quando o PVC é deletado, o volume físico também é deletado. É o default do StorageClass `standard` em muitos clusters.
2. **Recycle**: Faz uma limpeza básica (`rm -rf /volume/*`) e disponibiliza o volume para reuso. Deprecated em favor de provisioning dinâmico.
3. **Retain**: Retém os dados mesmo após deleção do PVC. O admin precisa limpar manualmente. O instrutor escolhe este para fins didáticos.

## VolumeBindingMode

- **`WaitForFirstConsumer`**: O volume só é provisionado quando um Pod que referencia o PVC é agendado. Isso garante que o volume seja criado no mesmo node onde o Pod vai rodar — crítico para storage local.
- **`Immediate`**: O volume é provisionado assim que o PVC é criado, independente de existir Pod consumidor. Funciona bem com storage de rede (cloud providers).

## Fluxo prático demonstrado

1. Criar arquivo `storage-class.yaml` na raiz do diretório k8s
2. Escrever o manifesto com apiVersion, kind, metadata, provisioner, reclaimPolicy, volumeBindingMode
3. `kubectl apply -f storage-class.yaml`
4. `kubectl get storageclass` para verificar — mostra o novo StorageClass junto com o `standard` que já existia

## Relação com próximos conceitos

StorageClass é o primeiro passo da cadeia de storage no Kubernetes:
- **StorageClass** → define COMO provisionar (esta aula)
- **PersistentVolume (PV)** → o volume físico em si (próxima aula)
- **PersistentVolumeClaim (PVC)** → o pedido de storage feito pelo Pod