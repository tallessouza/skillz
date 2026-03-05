# Deep Explanation: Acessando Pods com Services

## Por que Deployments nao tem interface de rede

O instrutor destaca um ponto sutil: ao clicar em um Pod no Lens, aparece a opcao de port-forward. Ao clicar em um Deployment, essa opcao **nao existe**. Isso porque Deployment e ReplicaSet sao **controladores** — eles gerenciam pods, mas nao possuem endpoint de rede proprio.

Voce ate consegue fazer `kubectl port-forward deployment/nginx`, mas o instrutor classifica isso como "gambiarra". O caminho correto e criar um Service.

## O problema da variabilidade de pods

A quantidade de pods e **sempre variavel**. Voce pode ter 5, escalar para 30, voltar para 5. Em aplicacoes de grande escala (que e o caso de uso do Kubernetes), isso e natural. O cliente nao pode depender de um pod especifico — ele precisa de um endereco estavel.

O Service resolve isso: o cliente acessa o endereco do Service, e o Kubernetes internamente distribui o trafego entre os pods disponiveis.

## ClusterIP — o tipo mais basico

ClusterIP cria um IP interno (ex: 10.x.x.x) que **so existe dentro do cluster**. Nao e acessivel de fora. E o tipo padrao de Service.

Outros tipos mencionados pelo instrutor (para aulas futuras):
- **NodePort** — expoe em uma porta do no
- **LoadBalancer** — provisiona load balancer externo
- **Ingress** — objeto de camada 7 para roteamento HTTP

## Selector: a cola entre Service e Deployment

O Service encontra seus pods pelo **selector**, da mesma forma que o ReplicaSet encontra pods pelo matchLabels. O instrutor faz a analogia direta: "voce vai resolver isso da mesma forma que o ReplicaSet pro Pod".

```yaml
# No Deployment
spec:
  template:
    metadata:
      labels:
        app: nginx  # <-- esta label

# No Service
spec:
  selector:
    app: nginx  # <-- deve casar exatamente
```

## Port vs TargetPort

- `port`: porta do Service (o que o cliente acessa)
- `targetPort`: porta do container (onde a aplicacao realmente roda)

Exemplo pratico: se seu container Node.js sobe na porta 3000, voce pode expor o Service na porta 80:
```yaml
ports:
  - port: 80
    targetPort: 3000
```

## Declarativo vs Imperativo — a fonte da verdade

O instrutor faz uma analogia com **Terraform**: se voce altera um recurso diretamente no cloud (imperativo) e depois roda `terraform apply`, o Terraform sobrescreve com o que esta no declarativo.

Kubernetes funciona igual: se voce escala para 30 replicas via UI mas seu YAML diz 5, o proximo `kubectl apply` volta para 5.

**Regra de ouro**: o declarativo e SEMPRE a fonte da verdade. Se fizer alteracao emergencial via UI, replique imediatamente no YAML.

## Service Discovery

O Service funciona como service discovery interno. O instrutor menciona que e "um service discovery do service pro pod", onde o ReplicaSet tambem controla a quantidade de pods em execucao.

## Algoritmo de distribuicao

Por default, o Kubernetes usa **round robin** para distribuir trafego entre pods. O instrutor menciona que e possivel configurar outros algoritmos, mas nao aprofunda nesta aula.