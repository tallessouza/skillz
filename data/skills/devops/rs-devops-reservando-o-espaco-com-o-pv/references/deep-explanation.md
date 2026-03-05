# Deep Explanation: Persistent Volume (PV) no Kubernetes

## Por que o PV fica "desassociado" da aplicacao

O instrutor enfatiza que o PV e criado **fora** do contexto da aplicacao. Isso e proposital — o PV representa o "disco", a reserva de capacidade no cluster. Ele existe independentemente de qualquer pod ou deployment. A associacao so acontece quando um PVC (Persistent Volume Claim) faz o "pedido" desse espaco.

Analogia: o PV e como alugar um espaco em um galpao. Voce reserva o espaco (PV), mas so quando alguem faz um pedido (PVC) e que aquele espaco e atribuido a um uso especifico.

## Estrutura padrao do YAML Kubernetes

O instrutor destaca que **praticamente todo YAML Kubernetes** segue a mesma estrutura:

```
apiVersion → kind → metadata → spec
```

Excecoes mencionadas: **StorageClass** e **ConfigMap**, que nao tem `spec` da mesma forma. Mas PV segue a regra.

## Access Modes — Explicacao detalhada

### ReadWriteOnce (RWO)
- Acesso de leitura E escrita
- Escopado **por no** — apenas um no por vez acessa
- Previne **lock de arquivos** — quando multiplos processos tentam escrever no mesmo arquivo simultaneamente
- E o modo mais comum e seguro para a maioria dos casos

### ReadWriteMany (RWX)
- Antagonico do RWO
- Multiplos nos podem escrever ao mesmo tempo
- Necessario para workloads distribuidos que precisam de escrita compartilhada
- Requer storage backends que suportem (NFS, CephFS, etc.)

### ReadOnlyMany (ROX)
- Somente leitura de multiplos nos
- Nao faz sentido ter "ReadOnlyOnce" porque leitura nao gera lock
- Util para dados estaticos compartilhados (configs, assets)

### ReadWriteOncePod (RWOP)
- Mesma ideia do RWO, mas escopado **por pod** (nao por no)
- Mais restritivo — apenas um pod pode acessar
- Util quando voce quer garantir exclusividade absoluta

## Reclaim Policy

Tres opcoes disponiveis:

| Policy | Comportamento |
|--------|--------------|
| **Delete** | Quando o PVC e deletado, o PV e o storage sao removidos |
| **Retain** | PV permanece mesmo apos PVC ser deletado (dados preservados, mas PV fica em status Released) |
| **Recycle** | Limpa os dados e torna o PV disponivel novamente (deprecado em favor de dynamic provisioning) |

O instrutor escolheu `Delete` para alinhar com o StorageClass `standard`, mantendo consistencia.

## Volume Mode: FileSystem

O `describe pv` mostra `VolumeMode: Filesystem`, que e o default. Isso significa que o volume e montado como um sistema de arquivos no container. A alternativa seria `Block` para raw block devices.

## hostPath — Limitacoes

O instrutor menciona que `hostPath` monta o volume **dentro do proprio no**. Isso significa:
- Funciona apenas em clusters locais (kind, minikube)
- Os dados ficam no filesystem do no, nao em storage externo
- Se o pod migrar para outro no, perde acesso aos dados
- Nunca deve ser usado em producao

## Fluxo completo de storage no Kubernetes

```
StorageClass (define COMO provisionar)
    ↓
PersistentVolume (reserva o espaco/disco)
    ↓
PersistentVolumeClaim (aplicacao pede o espaco)
    ↓
Pod (monta o volume via PVC)
```

O instrutor esta construindo essa cadeia passo a passo: ja fez StorageClass, agora PV, proximo sera PVC.