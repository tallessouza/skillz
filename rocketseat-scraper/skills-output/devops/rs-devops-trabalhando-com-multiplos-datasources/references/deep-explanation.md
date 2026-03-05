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