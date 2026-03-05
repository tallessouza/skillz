# Deep Explanation: Terraform State

## O que e o estado e por que existe

O Terraform precisa de um mecanismo para mapear o que esta declarado no codigo (`.tf`) com o que realmente existe na infraestrutura do provedor (AWS, GCP, Azure). O arquivo `terraform.tfstate` e esse mapeamento.

Sem o estado, o Terraform nao saberia:
- Quais recursos ele gerencia vs quais foram criados manualmente
- O que mudou desde a ultima execucao
- Quais atributos foram gerados em tempo de criacao (como domain names, ARNs, IDs)

## Estrutura do tfstate

O arquivo e um JSON versionado. Estrutura simplificada:

```json
{
  "version": 4,
  "serial": 1,
  "resources": [
    {
      "mode": "managed",
      "type": "aws_s3_bucket",
      "name": "s3_bucket",
      "provider": "provider[\"registry.terraform.io/hashicorp/aws\"]",
      "instances": [
        {
          "attributes": {
            "bucket": "rocketc-bucket-ac",
            "bucket_domain_name": "rocketc-bucket-ac.s3.amazonaws.com",
            "tags": {}
          }
        }
      ]
    }
  ]
}
```

Pontos importantes:
- `resources` e um array — pode conter N recursos de N provedores
- `instances` contem os atributos reais do recurso, incluindo valores gerados pelo provedor (como `bucket_domain_name`) que voce nao declarou no codigo
- `serial` incrementa a cada alteracao — e o versionamento interno

## O ciclo de reconciliacao em detalhe

Quando voce roda `terraform plan`:

1. **Refreshing State**: Terraform consulta a API do provedor para cada recurso no estado. Pergunta: "qual e o estado atual deste recurso na infra real?"
2. **Comparacao triangular**: Compara tres fontes — codigo declarativo, estado local, infra real
3. **Diff generation**: Gera um plano de alteracoes para alinhar a infra com o codigo

Quando voce roda `terraform apply`:
1. Repete os passos 1-3
2. Executa as alteracoes na infra via API do provedor
3. Atualiza o `tfstate` com o novo estado real

## A analogia da fonte unica da verdade

O instrutor enfatiza repetidamente: **o repositorio (codigo declarativo) e a fonte da verdade**. Isso significa:

- Se alguem adiciona uma tag pelo console AWS → Terraform remove no proximo apply
- Se alguem remove um recurso pelo console → Terraform recria no proximo apply
- A unica forma de fazer alteracoes permanentes e atraves do codigo `.tf`

Isso e fundamental para IaC: o console do provedor deve ser **read-only** em ambientes gerenciados por Terraform.

## Experimento didatico do instrutor

O instrutor demonstra o conceito editando tags diretamente no console AWS:

1. Cria tag `test=true` no console (fora do Terraform)
2. Roda `terraform plan` → detecta drift, propoe remover a tag
3. Roda `terraform apply` → remove a tag, reconcilia com o codigo

Depois faz o inverso:
1. Adiciona `tags = { test = "pro" }` no codigo `.tf`
2. `terraform plan` → detecta que precisa adicionar a tag
3. `terraform apply` → adiciona a tag na infra E no estado

E o teste final:
1. Remove a tag pelo console novamente
2. `terraform plan` → detecta que a tag sumiu e precisa ser readicionada
3. Confirma que tanto adicao quanto remocao sao reconciliadas

## Backup do estado

O Terraform gera automaticamente `terraform.tfstate.backup` antes de cada modificacao. Este e o estado anterior, util para recovery em caso de corrupcao.

## Por que nao comitar o tfstate

Razoes mencionadas pelo instrutor e boas praticas:
- O arquivo muda a cada `apply` — gera conflitos de merge constantes
- Pode conter dados sensiveis (passwords, tokens em atributos de recursos)
- Em equipe, estado local causa conflitos — duas pessoas rodando `apply` simultaneamente corrompem o estado
- Solucao: backend remoto com locking (abordado em aulas futuras)

## Relacao com workspaces

O instrutor menciona que workspaces serao o proximo topico. Workspaces permitem multiplos estados isolados dentro do mesmo projeto — util para ambientes (dev, staging, prod).