# Deep Explanation: Configuracao de Modulos Terraform

## Por que nao deixar valores hardcoded em modulos

O instrutor enfatiza que modulos devem ser genericos. Valores como `price_class` parecem inofensivos, mas quando voce reutiliza o modulo em outro projeto com requisitos diferentes, precisa editar o modulo diretamente — quebrando o principio de reutilizacao.

A regra pratica: se o valor pode variar entre projetos ou ambientes, ele deve ser variavel. Se e um padrao tecnico estavel (protocolo HTTPS, metodos HTTP permitidos), pode ficar hardcoded sem problema.

## Pattern: Default com Override

O instrutor mostra um padrao fundamental do Terraform: definir `default` na variavel do modulo e permitir override no consumidor.

```hcl
variable "cdn_price_class" {
  type        = string
  default     = "PriceClass_200"
}
```

Se o consumidor nao passa nada, usa `PriceClass_200`. Se passa, sobrescreve. Isso torna o modulo usavel "out of the box" mas customizavel.

## Por que tags sao criticas

O instrutor destaca dois motivos:
1. **Governanca** — saber quais recursos sao gerenciados por IaC vs criados manualmente
2. **Billing** — filtrar custos por tag no AWS Cost Explorer

A tag minima recomendada e `iac = "true"`, indicando que o recurso e gerenciado pelo Terraform. Poderia ser Pulumi ou CloudFormation — o importante e identificar que nao foi criado manualmente.

## map(string) para tags

Tags na AWS sao pares chave-valor onde ambos sao strings. O tipo `map(string)` do Terraform reflete exatamente isso. Default como `{}` (mapa vazio) permite que o modulo funcione sem tags, mas aceite qualquer quantidade delas.

## Workflow de validacao

O instrutor descobriu um erro ao rodar `terraform validate` — faltava uma atribuicao no arquivo de variaveis. Ele comenta: "foi ate bom ter rodado o validate antes". A licao: `validate` e barato (nao faz API calls), `plan` e caro (faz refresh de state). Sempre valide primeiro.

Sequencia correta apos alteracoes:
1. `terraform fmt` — formatar
2. `terraform validate` — verificar sintaxe
3. `terraform plan` — verificar mudancas
4. `terraform apply` — aplicar

## Outputs como forma de expor informacao

O instrutor menciona brevemente que dentro de um modulo, voce pode expor informacoes via outputs. Por exemplo, `aws_s3_bucket.bucket` pode ser exposto para que o modulo consumidor use. Isso sera aprofundado na proxima aula sobre data sources.

## Ctrl+C e estado inconsistente

O instrutor alerta que cancelar um `terraform plan` com Ctrl+C pode deixar "alguma coisa para tras" — reforçando a importancia de rodar `validate` antes, para evitar ter que cancelar plans com erros.