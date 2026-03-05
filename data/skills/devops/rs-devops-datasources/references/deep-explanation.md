# Deep Explanation: Terraform Data Sources

## O que e um Data Source

Data source e um recurso Terraform que **consulta** informacoes de recursos ja existentes e incorpora essas informacoes no escopo configurativo. A palavra-chave e "ja existentes" — diferente de `resource` que cria algo novo, `data` apenas le.

## Por que Data Sources existem

Quando um recurso e criado (ex: S3 bucket), ele recebe atributos gerados em tempo de criacao que voce nao especificou:
- **ARN** (Amazon Resource Name)
- **Bucket Domain Name** (ex: `bucket.s3.amazonaws.com`)
- **Bucket Regional Domain Name**
- **Region**
- **ID**

Esses atributos sao visiveis no console da AWS e no state do Terraform (`tfstate`). O problema: se outro recurso precisa de um desses valores, como voce passa? Hardcoded? Nao — isso quebra quando muda de ambiente, quando o recurso e recriado, ou quando o valor muda.

O instrutor enfatiza: **"Nao funcionaria muito bem. Seria algo que a gente passaria na mao ali? Alguma coisa assim meio hard decoded? Nao, nao seria."**

## A palavra reservada `data`

Terraform tem tres palavras reservadas principais para blocos:
1. `provider` — configura o provedor (AWS, GCP, etc.)
2. `resource` — cria/gerencia recursos
3. `data` — consulta recursos existentes

A sintaxe do bloco data:

```hcl
data "<PROVIDER>_<RESOURCE_TYPE>" "<ALIAS>" {
  <ATRIBUTO_DE_LOOKUP> = "<VALOR>"
}
```

- **Provider + Resource Type**: identifica O QUE consultar (ex: `aws_s3_bucket`)
- **Alias**: nome local para referenciar no contexto Terraform (ex: `bucket`, `logs_bucket`)
- **Atributo de lookup**: como encontrar o recurso especifico (ex: `bucket = "nome"`)

## Alias e unicidade

O instrutor destaca que um repositorio Terraform pode criar N buckets. O alias serve para diferenciar:

```hcl
data "aws_s3_bucket" "assets" {
  bucket = "my-assets-bucket"
}

data "aws_s3_bucket" "logs" {
  bucket = "my-logs-bucket"
}
```

Cada alias e unico dentro do mesmo tipo de data source.

## Workspace e nomes dinamicos

O instrutor copia o nome do bucket incluindo a interpolacao de workspace:

```hcl
bucket = "skillz-bucket-${terraform.workspace}"
```

Isso garante que o data source consulta o bucket correto para o workspace ativo (stage, production, etc.).

## O que acontece apos criar o data source

O instrutor mostra que `terraform plan` nao exibe mudancas apos criar apenas o data source. Isso e **esperado** — o data source sozinho nao cria, modifica ou destroi nada. Ele apenas disponibiliza atributos para uso em outros blocos.

Para que o data source tenha efeito visivel, voce precisa:
1. Referenciar seus atributos em um `resource`, ou
2. Expor seus atributos via `output`

## Organizacao de arquivos

O instrutor cria um arquivo `datasources.tf` dedicado em vez de colocar o bloco data no mesmo arquivo dos resources. A justificativa e boa pratica: separacao de responsabilidades por arquivo.

Padrao recomendado:
- `main.tf` — resources
- `datasources.tf` — data sources
- `variables.tf` — input variables
- `outputs.tf` — output values
- `providers.tf` — provider configuration