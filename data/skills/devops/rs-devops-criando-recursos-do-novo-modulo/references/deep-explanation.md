# Deep Explanation: Criando Recursos com Modulos Externos no Terraform

## Por que modulos existem

O instrutor demonstra que criar uma fila SQS com DLQ e politicas de redrive exige **4 recursos separados** no Terraform:

1. A DLQ (Dead Letter Queue)
2. A fila principal
3. A redrive allow policy (permissao)
4. A redrive policy (politica de reprocessamento)

Sem modulo, voce precisa declarar cada recurso individualmente, gerando um arquivo gigantesco. Com o modulo, **3-5 linhas** resolvem o mesmo problema.

## Ordem de criacao importa

A fila principal referencia a DLQ (para saber onde enviar mensagens com falha). Logo:

1. **DLQ e criada primeiro** — se `create_dlq = true`
2. **Fila principal e criada segundo** — referenciando a DLQ
3. **Politicas de redrive sao criadas por ultimo** — vinculando fila e DLQ

Se voce tentar criar a fila antes da DLQ, recebe erro "resource not found". O modulo cuida dessa orquestracao automaticamente.

## O que e Redrive

Quando eventos caem na DLQ (por falha de processamento), voce pode **reprocessa-los**. O redrive define:

- **Para qual fila** os eventos reprocessados vao (por default, a fila principal)
- **Permissoes** de quem pode fazer redrive

No console AWS, voce seleciona a DLQ, clica em "Start DLQ redrive", e os eventos voltam para a fila principal. A configuracao de redrive policy e o que permite isso funcionar.

## Convencao de nomenclatura DLQ

O padrao da industria e: `{nome-da-fila}-dlq`. O modulo do Terraform faz essa concatenacao automaticamente. Exemplo:
- Fila: `SkillzSQS`
- DLQ: `SkillzSQS-dlq`

## FIFO vs Standard

O modulo permite configurar `fifo_queue = true/false`:
- **Standard**: ordem nao garantida, throughput ilimitado
- **FIFO**: First In First Out, ordem garantida, throughput limitado

No exemplo da aula, `fifo_queue = false` (standard).

## Init revela erros de referencia

`terraform init` e o momento onde o Terraform baixa modulos do registry. Se o `source` aponta para um modulo que nao existe, o erro aparece aqui — nao no plan ou apply. Isso e util para validar rapidamente se a referencia esta correta.

## Remocao de recursos via codigo

O instrutor demonstra que para remover recursos criados por um modulo, basta:
1. Remover o bloco `module {}` do codigo
2. Rodar `terraform init` (clean)
3. Rodar `terraform plan` (confirma que 4 recursos serao destruidos)
4. Rodar `terraform apply -auto-approve`

Nao precisa de `terraform destroy` separado. O Terraform detecta que o codigo nao declara mais aqueles recursos e planeja a destruicao.

## Modulo vs Recurso raw — quando usar cada

O modulo abstrai, mas voce perde granularidade. Se precisar de configuracoes muito especificas que o modulo nao expoe, use recursos raw. Para casos comuns (fila + DLQ + redrive), o modulo e a escolha correta.

O ponto-chave do instrutor: "O que o modulo faz no final do dia? Ele faz isso aqui [recursos raw]. Mas ele abstraiu a complexidade e eu consigo reaproveitar o codigo."