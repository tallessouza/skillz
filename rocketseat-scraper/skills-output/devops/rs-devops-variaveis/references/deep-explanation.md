# Deep Explanation: Variáveis no Terraform

## Por que variáveis existem no Terraform

O instrutor enfatiza que a principal vantagem de variáveis é **evitar código duplicado**. Quando o mesmo valor (como o nome de uma organização) aparece em múltiplos recursos — `resource`, `data source`, `output` — qualquer mudança exige editar todos os pontos. Variáveis centralizam isso.

## Dois tipos de variáveis

O instrutor faz uma distinção importante:

1. **Variáveis configurativas (constantes):** Valores fixos definidos com `default` em `variables.tf`. Exemplo: nome da organização, região padrão, flags de nomenclatura.

2. **Variáveis dinâmicas (outputs):** Valores que mudam a cada execução de `terraform apply`. São os `output` blocks que capturam IDs, ARNs, endpoints gerados pela infraestrutura.

Essa distinção é crucial porque determina onde e como o valor é definido.

## A decisão de naming: `bucket_name` → `org_name`

O instrutor começou criando `bucket_name` mas percebeu em tempo real que isso não escalaria. Se amanhã houver um segundo recurso (outro bucket, uma Lambda, um API Gateway), todos precisarão do prefixo da organização. Renomeou para `org_name` pensando em escalabilidade.

Esse raciocínio é: **nomeie pela semântica do domínio, não pelo recurso que consome**.

## O erro `invalid reference` e o prefixo `var.`

O instrutor demonstrou o erro ao vivo: definiu a variável `org_name` mas referenciou sem o prefixo `var.`. O Terraform retornou `invalid reference`. A lição:

- `terraform.xxx` = variáveis internas do Terraform (ex: `terraform.workspace`)
- `var.xxx` = variáveis definidas pelo usuário

O prefixo é obrigatório e indica a **origem** do valor.

## Tipos suportados

O instrutor mencionou que Terraform suporta:
- `string` — texto simples
- `list` — arrays
- `map` — objetos chave-valor
- `number`, `bool` — tipos primitivos

E reforçou: **sempre tipar**. A tipagem facilita entender o que trafega e previne erros.

## Conexão com módulos (próxima aula)

O instrutor antecipa que variáveis ganham muito mais poder com módulos:
- Cada módulo terá seu próprio `variables.tf`
- Variáveis serão escopadas por módulo
- Haverá variáveis dinâmicas passadas entre módulos via outputs
- Múltiplos data sources combinados com variáveis

## Fluxo de verificação

O instrutor usou `terraform plan` (não `apply`) para verificar se a variável estava funcionando. Esse é o padrão correto: plan valida a configuração sem aplicar mudanças reais.