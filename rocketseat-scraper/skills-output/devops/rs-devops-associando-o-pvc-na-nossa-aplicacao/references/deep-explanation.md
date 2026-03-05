# Deep Explanation: Associando PVC na Aplicação Kubernetes

## Por que volumes são necessários

O instrutor demonstra um ponto fundamental através de experimentação prática: sem volumes, cada pod tem seu próprio filesystem isolado. Quando você cria um arquivo em um pod, ele **não existe** nos outros pods (réplicas). E quando o pod é deletado (ou o deployment é atualizado), o arquivo desaparece completamente.

Isso é por design — containers são efêmeros. Mas aplicações reais precisam persistir dados: uploads de usuários, dados de banco, caches compartilhados.

## A cadeia completa de objetos de storage

O instrutor mostra a cadeia completa que foi construída ao longo das aulas:

```
StorageClass → PersistentVolume (PV) → PersistentVolumeClaim (PVC) → Deployment (volumeMounts + volumes)
```

1. **StorageClass** define a classe de storage disponível
2. **PV** é o volume físico provisionado
3. **PVC** é o "pedido" de storage que se liga (bind) ao PV
4. **Deployment** é onde de fato se monta o PVC nos containers

O PVC sozinho não faz nada — ele precisa ser referenciado no deployment para que os pods efetivamente usem o storage.

## Dois locais de configuração no deployment

O instrutor enfatiza que são **dois blocos separados** e que esquecer um deles causa erro:

### 1. `volumeMounts` (dentro do container)
- Diz ao container: "monte este volume neste path do seu filesystem"
- Fica dentro de `spec.template.spec.containers[].volumeMounts`
- Define o `mountPath` — onde no container os arquivos vão aparecer

### 2. `volumes` (fora do container, no nível do pod)
- Diz ao pod: "este volume existe e vem deste PVC"
- Fica em `spec.template.spec.volumes`
- Referencia o PVC pelo `claimName`

O `name` é o que conecta os dois. O instrutor usou `app-tsdata` como nome tanto no volumeMount quanto no volume.

## Demonstração prática do instrutor

### Sem volume (filesystem efêmero):
1. `kubectl exec -it <pod> -n primeira-aplicacao -- /bin/sh` — entra no container
2. `echo "olá" > file.txt` — cria arquivo
3. Sai do pod, entra em **outro** pod da mesma aplicação → arquivo **não existe**
4. Deleta o pod original → novo pod criado pelo ReplicaSet → arquivo **perdido**

### Com PVC:
1. Após configurar volumeMounts + volumes no deployment
2. A pasta `/uploads` é criada automaticamente pelo mount (mesmo que não exista na imagem)
3. Cria arquivo dentro de `/uploads`
4. Deleta o pod → entra em qualquer outro pod → arquivo **persiste**
5. Mesmo fazendo redeploy, os dados continuam porque estão no PV, apartados da aplicação

## Volume efêmero vs persistente

O instrutor faz uma distinção importante:

- **emptyDir (efêmero):** compartilha dados entre réplicas durante o ciclo de vida do deployment. Quando o deployment é recriado (nova versão), os dados são perdidos.
- **PVC (persistente):** dados sobrevivem a tudo — delete de pods, redeploy, scaling. Só são perdidos se o próprio PV for deletado (conforme a reclaimPolicy).

## Quando usar cada tipo

O instrutor dá uma recomendação prática:
- **Banco de dados:** caso mais comum para PVC. O mountPath vai ser o data directory do banco.
- **Aplicação com uploads:** PVC montado no diretório de uploads.
- **Aplicação stateless:** idealmente, a aplicação deve ser o mais efêmera possível. Se precisa de storage temporário compartilhado, use emptyDir.

## Como descobrir o mountPath correto

O instrutor menciona que o mountPath depende do container/imagem que você está usando. Para descobrir:
1. Consulte o **Dockerfile** da imagem
2. Identifique o **WORKDIR**
3. Monte o volume no subdiretório onde a aplicação escreve (ex: `WORKDIR/uploads`, `WORKDIR/data`)

Importante: **nunca monte no WORKDIR raiz** se quiser manter os arquivos da aplicação — o volume sobrescreveria o conteúdo original da imagem.

## O erro que acontece se esquecer o bloco `volumes`

O instrutor demonstrou ao vivo: se você configura apenas o `volumeMounts` sem o `volumes`, o `kubectl apply` retorna erro. O Kubernetes precisa de ambos os blocos para funcionar. O `volumeMounts` diz "onde montar" e o `volumes` diz "o que montar".

## Comandos úteis mencionados

- `kubectl exec -it <pod> -n <ns> -- /bin/sh` — entrar no container (ou `bash` ou `sh`, depende da imagem)
- `kubectl describe pod <pod> -n <ns>` — ver detalhes incluindo volumes montados e status do PVC
- `kubectl get pvc -n <ns>` — ver status do PVC (Bound = OK)
- `kubectl get pv` — ver o PersistentVolume e qual claim está bound
- `kubectl delete pod <pod> -n <ns>` — testar persistência deletando pod