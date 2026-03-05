# Deep Explanation: Como Executar um Cluster Kubernetes

## Por que a portabilidade importa

O instrutor enfatiza que o Kubernetes e "100% portavel" e "100% portátil" — nao esta acoplado a nenhum cloud provider. Isso significa que a decisao de onde rodar e puramente estrategica/financeira, nao tecnica. Voce pode migrar entre providers sem reescrever nada do Kubernetes em si.

## A distincao custo vs ferramenta

Ponto chave do instrutor: "Voce nao paga o Kubernetes, voce paga o gerenciamento dele." Essa frase resolve uma confusao comum entre iniciantes que acham que K8s e um produto pago. O open source garante que a ferramenta e gratuita; o que custa dinheiro e:

1. **No modelo gerenciado:** O servico do cloud provider (EKS, GKE, AKS) que cuida do control plane, upgrades, seguranca do cluster
2. **No modelo auto-gerenciado:** As horas da sua equipe fazendo o mesmo trabalho manualmente

## Carga cognitiva de gerenciamento

O instrutor menciona "alta carga cognitiva para gerenciar um cluster Kubernetes" como razao principal para o modelo gerenciado ser tao popular. Isso inclui:

- Upgrades de versao do K8s
- Gerenciamento de certificados
- Configuracao de rede (VPC, subnets)
- Monitoramento do control plane
- Backup e disaster recovery do etcd
- Seguranca e patches

Por isso empresas com equipes pequenas geralmente optam pelo modelo gerenciado — delegar essa complexidade ao provider libera o time para focar na aplicacao.

## O "nao gerenciado" entre aspas

O instrutor faz questao de colocar "nao gerenciado" entre aspas e explica: o cluster sempre sera gerenciado por alguem. A diferenca e apenas quem faz esse trabalho. Usar o termo "auto-gerenciado" seria mais preciso do que "nao gerenciado".

## Cenario de execucao local

Para estudo, o Kubernetes roda na maquina local em qualquer SO (Linux, Windows, Mac). Ferramentas como minikube, kind, ou k3d permitem subir um cluster local rapidamente. O instrutor indica que o modulo comeca com execucao local antes de migrar para cenarios produtivos com EKS + Terraform.

## Roadmap do modulo mencionado

O instrutor indica que ao longo do modulo serao cobertos:
- Execucao local do K8s
- Containers e isolamento
- EKS (AWS) com Terraform
- VPC e subnets
- Cluster API
- Ferramentas de interface com o cluster