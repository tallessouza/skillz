# Code Examples: Acessando Container Dentro do Cluster

## 1. Port-Forward via CLI

```bash
# Comando basico de port-forward
# Sintaxe: kubectl port-forward pod/<nome-pod> <porta-local>:<porta-container> -n <namespace>
kubectl port-forward pod/nginx 8081:80 -n primeira-app

# Output esperado:
# Forwarding from 127.0.0.1:8081 -> 80
# Forwarding from [::1]:8081 -> 80
```

Apos rodar, acesse `http://localhost:8081` no browser para ver "Welcome to nginx!".

## 2. Port-Forward via Lens (GUI)

```
Passos no Lens:
1. Navegue ate Workloads → Pods → selecione o namespace "primeira-app"
2. Clique no Pod "nginx"
3. Na secao "Containers" embaixo, veja a porta listada (80 — definida como containerPort)
4. Clique no botao "Forward"
5. Defina a porta local (ex: 8080)
6. Clique "Start" → "Open in Browser"
7. O browser abre em http://localhost:8080 mostrando "Welcome to nginx!"
```

## 3. Verificar Pods no Namespace

```bash
# Listar pods no namespace default (nao vai mostrar nada se o pod esta em outro ns)
kubectl get pods
# No resources found in default namespace.

# Listar pods no namespace correto
kubectl get pods -n primeira-app
# NAME    READY   STATUS    RESTARTS   AGE
# nginx   1/1     Running   0          5m
```

## 4. Deletar e Recriar Pod

```bash
# Deletar o Pod
kubectl delete pod nginx -n primeira-app
# pod "nginx" deleted

# Neste momento, o port-forward que estava rodando quebra:
# error: error upgrading connection: pod not found

# Verificar que o Pod foi removido
kubectl get pods -n primeira-app
# No resources found in primera-app namespace.

# Recriar a partir do manifesto declarativo
kubectl apply -f pod.yaml
# pod/nginx created

# Verificar que voltou
kubectl get pods -n primeira-app
# NAME    READY   STATUS    RESTARTS   AGE
# nginx   1/1     Running   0          10s
```

## 5. Verificar Consumo de Recursos

```bash
# Requer Metrics API (metrics-server) instalado no cluster
kubectl top pods -n primera-app

# Sem metrics-server:
# error: Metrics API not available

# Com metrics-server instalado:
# NAME    CPU(cores)   MEMORY(bytes)
# nginx   1m           5Mi
```

## 6. Variacao: Usando portas diferentes

```bash
# Porta local 8080 → container 80
kubectl port-forward pod/nginx 8080:80 -n primera-app

# Porta local 3000 → container 80 (util se 8080 ja esta em uso)
kubectl port-forward pod/nginx 3000:80 -n primera-app

# Porta local 9090 → container 80
kubectl port-forward pod/nginx 9090:80 -n primera-app
```

## 7. Manifesto YAML de referencia (Pod com containerPort)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  namespace: primera-app
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80  # Esta e a porta que aparece no Lens e que voce usa no port-forward
```