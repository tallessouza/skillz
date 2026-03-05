# Deep Explanation: Criando Primeiro Recurso GCP com Terraform

## Por que o GCP exige ativacao de API

Diferente da AWS onde os servicos estao sempre disponiveis, o GCP adota um modelo de "ativacao explicita". Cada servico (Compute Engine, GKE, Cloud Storage, etc.) precisa ter sua API habilitada antes de ser utilizada — tanto via console quanto via Terraform.

Isso significa que o primeiro `terraform apply` para qualquer servico novo vai falhar com `403 Service Disabled` se voce nao ativou a API previamente. O instrutor demonstrou isso propositalmente para mostrar que e um passo obrigatorio, nao opcional.

### Analogia com outros servicos

O mesmo padrao se aplica a qualquer servico GCP:
- **Compute Engine** → Compute Engine API
- **GKE** → Kubernetes Engine API
- **Cloud Storage** → Cloud Storage API
- E assim por diante

### Dependencia de faturamento

A ativacao de APIs pode exigir configuracao de faturamento. Mesmo no free tier, o GCP pede que voce configure um metodo de pagamento. Novas contas recebem creditos gratuitos que cobrem o uso inicial.

## Autenticacao: gcloud auth application-default login

O Terraform precisa de credenciais para interagir com a API do GCP. O metodo mais simples para desenvolvimento local e o `gcloud auth application-default login`, que:

1. Abre o browser para login SSO Google
2. Gera um arquivo JSON com tokens no disco local
3. O Terraform automaticamente detecta e usa esses tokens

Isso e analogo ao `aws sso login` na AWS — gera tokens temporarios para a maquina local se comunicar com o cloud provider.

### Primeira vez vs. renovacao

- **Primeiro acesso:** Precisa conceder permissoes no browser
- **Acessos subsequentes:** Mesmo fluxo, mas sem tela de permissoes

## O ciclo plan → apply → destroy

### terraform plan

Faz apenas a planificacao. Le o codigo HCL, compara com o state (se existir), e mostra o que seria criado/alterado/destruido. Nao executa nada. Na primeira execucao, como nao ha state, e muito rapido.

### terraform apply

Executa de fato as operacoes. O flag `-auto-approve` pula a confirmacao interativa. Gera o arquivo `terraform.tfstate` localmente (quando nao ha backend remoto configurado).

O instrutor mostrou que a criacao da VM levou ~42 segundos, e foi possivel confirmar no console GCP que o recurso apareceu em execucao.

### terraform apply -destroy

Destroi todos os recursos gerenciados pelo state. O instrutor enfatizou a importancia de destruir recursos de teste para evitar custos desnecessarios.

**Ponto importante:** Voce nao consegue desativar a API de um servico enquanto houver recursos ativos nele. Precisa deletar os recursos primeiro.

## Zone como atributo obrigatorio

Para instancias GCP, a zone e obrigatoria. Pode ser definida:
1. No proprio recurso (`zone = "us-central1-a"`)
2. No bloco provider (aplica a todos os recursos)

Se nao definida em nenhum dos dois, o recurso nao sera criado.

## State local vs. backend remoto

O instrutor mencionou que nesta aula esta usando state local (`terraform.tfstate`), sem backend remoto configurado. O state contem todos os atributos do recurso criado (boot disk, rede, etc.) e permite configurar outputs conforme necessidade — mesma estrutura ja vista no modulo para AWS.