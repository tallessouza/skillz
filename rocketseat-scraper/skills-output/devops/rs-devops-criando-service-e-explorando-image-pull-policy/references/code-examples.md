# Code Examples: Kubernetes Service e imagePullPolicy

## Service YAML completo

```yaml
# service.yml
apiVersion: v1
kind: Service
metadata:
  name: apts-svc
spec:
  type: ClusterIP
  selector:
    matchLabels:
      app: apts
  ports:
    - port: 80
      targetPort: 3000
```

## Deployment com imagePullPolicy

```yaml
# deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: apts
spec:
  replicas: 2
  selector:
    matchLabels:
      app: apts
  template:
    metadata:
      labels:
        app: apts
    spec:
      containers:
        - name: apts
          image: usuario/app-ts:v2
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3000
```

## Fluxo de deploy manual (CI/CD na mao)

### Passo 1: Build com tag unica

```bash
# Boa pratica: tag unica por versao
docker build -t usuario/app-ts:v2 .

# Ma pratica: reutilizar tag
docker build -t usuario/app-ts:v1 .  # SOBRESCREVE a v1
```

### Passo 2: Push para registry

```bash
docker push usuario/app-ts:v2
```

### Passo 3: Atualizar tag no deployment.yml

```yaml
# Alterar a tag no YAML
image: usuario/app-ts:v2  # era v1, agora v2
```

### Passo 4: Apply

```bash
# Aplicar arquivo especifico
kubectl apply -f service.yml -n primeira-aplicacao

# Aplicar pasta inteira (so altera o que mudou)
kubectl apply -f k8s/ -n primeira-aplicacao
```

## Comparacao das tres opcoes de imagePullPolicy

```yaml
# PRODUCAO — Recomendado
imagePullPolicy: IfNotPresent
# So baixa se a tag nao existir no no
# Forca uso de tags imutaveis

# DESENVOLVIMENTO — Aceitavel
imagePullPolicy: Always
# Sempre baixa, mesmo que tag ja exista
# Util quando esta iterando rapido

# CASO ESPECIAL — Raro
imagePullPolicy: Never
# Nunca baixa, imagem precisa estar pre-carregada
```

## Exemplo da aplicacao NestJS alterada

### Controller com nova rota

```typescript
@Get('example-k8s')
getExample() {
  return this.appService.getExample();
}
```

### Service com novo metodo

```typescript
getExample(): string {
  return 'Estou rodando no k8s';
}
```

## Comandos kubectl uteis para verificacao

```bash
# Ver services no namespace
kubectl get svc -n primeira-aplicacao

# Ver detalhes do service
kubectl describe svc apts-svc -n primeira-aplicacao

# Ver pods e seus status de pull
kubectl get pods -n primeira-aplicacao

# Ver eventos (mostra pull de imagem)
kubectl get events -n primeira-aplicacao --sort-by=.metadata.creationTimestamp
```