---
name: rs-devops-trabalhando-com-multiplos-datasources
description: "Applies Terraform data source patterns for reading existing resource attributes and configuring module outputs. Use when user asks to 'read existing resource data', 'create data source', 'configure terraform outputs', 'use depends_on', or 'output not showing in console'. Enforces data sources inside modules, dynamic ID references, and root-level outputs for console visibility. Make sure to use this skill whenever creating Terraform data sources or configuring module output visibility. Not for resource creation, state management, or provider configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-modules
  tags: [terraform, data-source, outputs, depends-on, modules, cloudfront, s3, dynamic-references]
---

# Trabalhando com Múltiplos Datasources no Terraform

> Data sources vivem no módulo que os consome, outputs do módulo não aparecem no console sem outputs na raiz, e IDs nunca são hardcoded.

## Rules

1. **Datasource dentro do módulo** — crie `datasources.tf` dentro do módulo, não na raiz, porque a responsabilidade pertence ao módulo que consome o recurso
2. **Nunca hardcode IDs** — use referências dinâmicas como `aws_cloudfront_distribution.cloudfront.id`, porque IDs mudam entre ambientes e execuções
3. **Datasource exige recurso criado** — o recurso deve existir no provider antes de criar o datasource, porque ele consulta o provider real para obter informações
4. **Outputs de módulo vs outputs de projeto** — outputs em `modules/x/outputs.tf` são saídas do módulo; para aparecer no console do `terraform plan/apply`, crie `outputs.tf` na raiz referenciando `module.x.variable`
5. **depends_on para recursos dependentes** — quando um recurso depende de outro dentro do mesmo módulo (ex: website config depende do bucket), declare `depends_on` explicitamente
6. **Alias pode repetir nome do recurso** — usar o mesmo nome no data source e no resource não causa conflito, são namespaces separados (`data.aws_s3_bucket.bucket` vs `aws_s3_bucket.bucket`)

## How to write

### Data source dentro do módulo

```hcl
# modules/cloudfront/datasources.tf
data "aws_cloudfront_distribution" "cloudfront" {
  id = aws_cloudfront_distribution.cloudfront.id
}
```

### Data source S3

```hcl
# modules/s3/datasources.tf
data "aws_s3_bucket" "bucket" {
  bucket = aws_s3_bucket.bucket.bucket
}
```

### Outputs do módulo (saída interna)

```hcl
# modules/cloudfront/outputs.tf
output "cdn_id" {
  value       = data.aws_cloudfront_distribution.cloudfront.id
  sensitive   = false
  description = "ID do CloudFront"
}

output "cdn_domain_name" {
  value       = data.aws_cloudfront_distribution.cloudfront.domain_name
  sensitive   = false
  description = "Nome de domínio do CloudFront"
}
```

### Outputs na raiz (saída do console)

```hcl
# outputs.tf (raiz do projeto)
output "s3_bucket_name" {
  value       = module.s3.bucket_domain_name
  sensitive   = false
  description = "Nome do bucket S3"
}

output "cdn_domain" {
  value       = module.cloudfront.cdn_domain_name
  sensitive   = false
  description = "Nome de domínio do CloudFront"
}
```

### Recurso dependente com depends_on

```hcl
# modules/s3/main.tf
resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_website_configuration" "bucket" {
  bucket = aws_s3_bucket.bucket.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }

  depends_on = [aws_s3_bucket.bucket]
}
```

## Example

**Before (erros comuns):**
```hcl
# datasource na raiz ao invés do módulo
data "aws_cloudfront_distribution" "cdn" {
  id = "E1ABCDEF123456"  # hardcoded!
}

# output do módulo esperando aparecer no console
# modules/cloudfront/outputs.tf
output "domain" {
  value = data.aws_cloudfront_distribution.cdn.domain_name
}
# -> NÃO aparece no terraform plan/apply
```

**After (com esta skill aplicada):**
```hcl
# modules/cloudfront/datasources.tf
data "aws_cloudfront_distribution" "cloudfront" {
  id = aws_cloudfront_distribution.cloudfront.id  # dinâmico
}

# modules/cloudfront/outputs.tf
output "cdn_domain_name" {
  value = data.aws_cloudfront_distribution.cloudfront.domain_name
}

# outputs.tf (RAIZ)
output "cdn_domain" {
  value = module.cloudfront.cdn_domain_name  # agora aparece no console
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa ler atributo de recurso já criado | Crie data source no módulo do recurso |
| Output não aparece no `terraform plan` | Verifique se existe output na raiz referenciando o módulo |
| Recurso B depende de recurso A no mesmo módulo | Use `depends_on = [aws_x.a]` |
| ID do recurso necessário | Use `resource_type.name.id`, nunca string literal |
| Mesmo alias para data e resource | Permitido — namespaces diferentes |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `id = "E1ABCDEF123456"` | `id = aws_cloudfront_distribution.cloudfront.id` |
| `bucket = "my-bucket-name"` | `bucket = aws_s3_bucket.bucket.bucket` |
| `datasources.tf` na raiz do projeto | `datasources.tf` dentro de `modules/x/` |
| Output só no módulo esperando ver no console | Output na raiz com `module.x.output_name` |
| Criar datasource sem recurso existente | Primeiro `apply` o recurso, depois adicione datasource |


## Troubleshooting

### Output nao aparece no terraform plan/apply
**Symptom:** Outputs definidos no modulo nao aparecem no console
**Cause:** Outputs do modulo sao saidas internas — para aparecer no console, precisa de output na raiz referenciando `module.x.output_name`
**Fix:** Crie `outputs.tf` na raiz do projeto com `value = module.<nome>.output_name`

### Data source falha com "resource not found"
**Symptom:** `terraform plan` falha dizendo que o recurso referenciado pelo data source nao existe
**Cause:** O recurso ainda nao foi criado no provider — data source consulta a API real
**Fix:** Rode `terraform apply` primeiro para criar o recurso, depois adicione o data source

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Trabalhando com Múltiplos Datasources

## Por que datasources moram no módulo?

O instrutor enfatiza a questão de **responsabilidade**. O datasource poderia tecnicamente ficar na raiz do projeto, mas isso quebraria o encapsulamento do módulo. Cada módulo deve ser auto-contido — seus data sources, seus outputs, suas variáveis. Isso permite reutilização e evita acoplamento.

## Datasource precisa de recurso existente

Um ponto crítico ressaltado: o data source **consulta o provider real** (AWS, GCP, etc.). Ele não trabalha com estado local apenas. Se o recurso não existir no cloud provider, o datasource falha.

Sequência correta:
1. `terraform apply` para criar o recurso
2. Adicionar o datasource
3. `terraform plan` para validar

Se tentar criar recurso e datasource juntos na primeira execução, o datasource não encontrará o recurso no provider e falhará.

## A diferença entre outputs de módulo e outputs de projeto

Esta é uma confusão muito comum. O instrutor demonstra que ao criar outputs dentro de `modules/cloudfront/outputs.tf`, o `terraform plan` **não mostra nada no console**. Por quê?

- Outputs do módulo são **saídas internas** — expostas para outros módulos ou para a raiz
- Outputs na raiz (`outputs.tf` no diretório principal) são **saídas do console** — aparecem no `terraform plan/apply`

Para que uma informação do módulo apareça no console, é preciso criar um "relay":
```
módulo output → raiz output (module.x.var) → console
```

## O atributo ID do CloudFront

O CloudFront, diferente do S3, não tem um "nome único" (bucket name). Ele é identificado por um **ID** — uma sequência alfanumérica gerada pela AWS (ex: `E1ABCDEF123456`). Este ID está disponível como atributo do recurso após criação e pode ser visto no `terraform.tfstate`.

## Alias repetido entre resource e data source

O instrutor usa `bucket` como alias tanto no `aws_s3_bucket.bucket` quanto no `data.aws_s3_bucket.bucket`. Isso funciona porque são namespaces separados no Terraform:
- `aws_s3_bucket.bucket` → recurso
- `data.aws_s3_bucket.bucket` → data source

Não há sobrescrita. O instrutor menciona que é como um "merge de informações" — ambos coexistem e cada um expõe seus próprios atributos.

## depends_on — dependência explícita

O `aws_s3_bucket_website_configuration` só pode ser aplicado a um bucket que já existe. O Terraform normalmente infere dependências implícitas (quando um recurso referencia outro), mas `depends_on` torna isso **explícito e seguro**.

Dentro do módulo, a referência é ao recurso diretamente: `depends_on = [aws_s3_bucket.bucket]`. Na raiz, quando se fala do módulo inteiro, seria `module.s3`.

## Website Configuration como exemplo de múltiplos recursos

O instrutor usa o `aws_s3_bucket_website_configuration` não apenas pelo valor prático, mas para demonstrar como um módulo pode conter **vários recursos relacionados**. O módulo S3 não precisa ter apenas o bucket — pode ter configuração de website, políticas, versionamento, etc. Cada um como um `resource` separado com dependências bem definidas.

---

# Code Examples: Trabalhando com Múltiplos Datasources

## Estrutura de arquivos completa

```
project/
├── main.tf                    # Declaração dos módulos
├── outputs.tf                 # Outputs do projeto (aparecem no console)
├── modules/
│   ├── cloudfront/
│   │   ├── main.tf            # Resource aws_cloudfront_distribution
│   │   ├── datasources.tf     # Data source do CloudFront
│   │   ├── outputs.tf         # Outputs do módulo CloudFront
│   │   └── variables.tf
│   └── s3/
│       ├── main.tf            # Resource aws_s3_bucket + website config
│       ├── datasources.tf     # Data source do S3
│       ├── outputs.tf         # Outputs do módulo S3
│       └── variables.tf
```

## Datasource CloudFront completo

```hcl
# modules/cloudfront/datasources.tf
data "aws_cloudfront_distribution" "cloudfront" {
  id = aws_cloudfront_distribution.cloudfront.id
}
```

O `id` é obtido dinamicamente do recurso `aws_cloudfront_distribution.cloudfront` que está definido no `main.tf` do mesmo módulo.

## Datasource S3 completo

```hcl
# modules/s3/datasources.tf
data "aws_s3_bucket" "bucket" {
  bucket = aws_s3_bucket.bucket.bucket
}
```

O atributo `bucket` (nome do bucket) é pego diretamente do recurso criado.

## Outputs do módulo CloudFront

```hcl
# modules/cloudfront/outputs.tf
output "cdn_id" {
  value       = data.aws_cloudfront_distribution.cloudfront.id
  sensitive   = false
  description = "ID do CloudFront"
}

output "cdn_domain_name" {
  value       = data.aws_cloudfront_distribution.cloudfront.domain_name
  sensitive   = false
  description = "Nome de domínio do CloudFront"
}
```

Note o uso de `data.aws_cloudfront_distribution` — está pegando do **data source**, não do resource diretamente. Ambos funcionariam, mas usar o data source é consistente com o padrão.

## Outputs na raiz do projeto

```hcl
# outputs.tf (raiz)
output "s3_bucket_name" {
  value       = module.s3.bucket_domain_name
  sensitive   = false
  description = "Nome do bucket S3"
}

output "cdn_domain" {
  value       = module.cloudfront.cdn_domain_name
  sensitive   = false
  description = "Nome de domínio do CloudFront"
}
```

Estes outputs referenciam `module.<nome_modulo>.<output_do_modulo>`. São eles que aparecem no console ao executar `terraform plan` ou `terraform apply`.

## S3 com Website Configuration e depends_on

```hcl
# modules/s3/main.tf
resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_website_configuration" "bucket" {
  bucket = aws_s3_bucket.bucket.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }

  depends_on = [aws_s3_bucket.bucket]
}
```

### Pontos importantes:
- O alias `"bucket"` é usado tanto no `aws_s3_bucket` quanto no `aws_s3_bucket_website_configuration` — isso é válido porque são tipos de recurso diferentes
- O `depends_on` garante que o website config só roda após o bucket existir
- `index.html` e `error.html` são configurações — os arquivos não precisam existir no momento do `apply`
- O `bucket` é passado dinamicamente via `aws_s3_bucket.bucket.bucket`

## Saída do terraform plan

Após configurar outputs na raiz, o `terraform plan` mostra:

```
Changes to Outputs:
  + cdn_domain     = "d1234abcdef.cloudfront.net"
  + s3_bucket_name = "my-bucket.s3.amazonaws.com"
```

Sem outputs na raiz, mesmo com outputs no módulo, **nada aparece no console**.

## Verificando atributos disponíveis

Para descobrir quais atributos um recurso expõe (como `id`, `domain_name`, `bucket`):

1. **terraform.tfstate** — contém todos os atributos após `apply`
2. **Terraform Registry** — documentação oficial do provider lista todos os atributos exportados
3. **terraform state show** — `terraform state show aws_cloudfront_distribution.cloudfront`
