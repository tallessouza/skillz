# Code Examples: Instalando o Istio e Primeiras Configuracoes

## Download e instalacao do istioctl

```bash
# 1. Download automatico da versao mais recente
curl -L https://istio.io/downloadIstio | sh -

# 2. Entrar no diretorio criado
cd istio-1.26.0

# 3. Exportar o binario para o PATH
export PATH=$PWD/bin:$PATH

# 4. (Opcional) Adicionar permanentemente ao shell profile
echo 'export PATH="$HOME/istio-1.26.0/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## Verificacao da instalacao

```bash
# Verificar versao do istioctl
istioctl version

# Saida esperada (antes de instalar no cluster):
# client version: 1.26.0
# control plane version: not running
# data plane version: none
```

## Instalacao no cluster

### Instalacao completa (perfil default)

```bash
# Instala IstiodCore + IstiodD + Ingress Gateway
istioctl install

# Prompt interativo:
# This will install the Istio 1.26.0 "default" profile... Proceed? (y/N)
# Responder: y
```

### Instalacao minimal (sem gateways)

```bash
# Instala apenas IstiodD (control plane)
istioctl install --set profile=minimal
```

## Verificacao pos-instalacao

### Via kubectl

```bash
# Listar pods no namespace istio-system
kubectl get pods -n istio-system
# NAME                                    READY   STATUS    RESTARTS   AGE
# istio-ingressgateway-xxx-yyy            1/1     Running   0          2m
# istiod-xxx-yyy                          1/1     Running   0          2m

# Listar services
kubectl get svc -n istio-system
# NAME                   TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)
# istio-ingressgateway   LoadBalancer   10.96.x.x      <pending>     15021,80,443
# istiod                 ClusterIP      10.96.x.x      <none>        15010,15012,443,15014
```

### Via logs

```bash
# Logs do Ingress Gateway
kubectl logs -n istio-system -l app=istio-ingressgateway
# Esperado: "Envoy proxy is ready"

# Logs do IstiodD
kubectl logs -n istio-system -l app=istiod
# Esperado: validacoes sem erros criticos
```

### Via istioctl

```bash
# Verificar estado geral do Istio no cluster
istioctl version
# Agora deve mostrar client E control plane version

# Verificar configuracao
istioctl verify-install
```

## Visualizacao via Lens

```
1. Abrir Lens
2. Selecionar o cluster (kubeconfig local)
3. Navegar para Workloads > Pods
4. Filtrar por namespace: istio-system
5. Verificar IstiodD e Ingress Gateway rodando
6. Navegar para Network > Services para ver o LoadBalancer
```

## Resumo dos componentes apos instalacao

```
istio-system namespace:
├── istiod (1 pod, 1 container)
│   └── Control plane: discovery, config, certificados
├── istio-ingressgateway (1 pod, 1 container)
│   └── Envoy proxy para trafego de entrada
└── Services:
    ├── istiod (ClusterIP)
    └── istio-ingressgateway (LoadBalancer)
```