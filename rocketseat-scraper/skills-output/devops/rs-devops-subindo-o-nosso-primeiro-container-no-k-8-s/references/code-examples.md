# Code Examples: Subindo Containers no Kubernetes

## 1. Explorando o kubectl

```bash
# Ver documentacao e comandos disponiveis
kubectl
# O output mostra os "Basic Commands" incluindo `run`
```

## 2. Criacao imperativa de um pod

```bash
# Formato: kubectl run <nome-do-pod> --image=<imagem>:<tag>
kubectl run nginx --image=nginx:alpine3.20-slim
# Output: pod/nginx created
```

O `kubectl run` sempre cria um objeto **Pod** por default — nao e necessario especificar o tipo de objeto.

### Escolha da imagem

No Docker Hub, o instrutor filtrou por "alpine" e escolheu `alpine3.20-slim` (~5MB). A escolha de imagens slim/alpine reduz:
- Tempo de pull
- Superficie de ataque (menos pacotes)
- Uso de disco no node

## 3. Verificando o pod criado

```bash
# Listar pods (ambas formas funcionam)
kubectl get po
kubectl get pods

# Output exemplo:
# NAME    READY   STATUS    RESTARTS   AGE
# nginx   1/1     Running   0          30s
```

## 4. Verificando eventos do pod

```bash
kubectl get events
# Mostra a sequencia:
# - Pulled image "nginx:alpine3.20-slim"
# - Created container nginx
# - Started container nginx
```

No Lens (UI), o mesmo pode ser visto em: Pod > Events/Overview.

## 5. Verificando logs

```bash
# Via terminal
kubectl logs nginx

# Via Lens: clicar no pod > Pod Logs
```

## 6. Versao declarativa equivalente (boa pratica)

```yaml
# nginx-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  namespace: web-apps
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx:alpine3.20-slim
      ports:
        - containerPort: 80
```

```bash
# Criar namespace primeiro
kubectl create namespace web-apps

# Aplicar o manifest
kubectl apply -f nginx-pod.yaml

# Verificar
kubectl get pods -n web-apps
kubectl describe pod nginx -n web-apps
kubectl logs nginx -n web-apps
```

## 7. Limpeza

```bash
# Deletar pod imperativo
kubectl delete pod nginx

# Deletar pod declarativo
kubectl delete -f nginx-pod.yaml
```

## Comparacao: Imperativo vs Declarativo

| Aspecto | Imperativo | Declarativo |
|---------|-----------|-------------|
| Comando | `kubectl run nginx --image=nginx:tag` | `kubectl apply -f pod.yaml` |
| Rastreabilidade | Nenhuma (terminal) | Git (versionado) |
| Reproducibilidade | Manual | Automatica |
| Uso recomendado | Testes rapidos | Todos os ambientes |
| Rollback | Impossivel | `git revert` + `kubectl apply` |