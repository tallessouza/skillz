# Deep Explanation: Módulos Externos do Terraform

## Por que usar módulos externos?

O instrutor reforça que módulos visam **abstrair complexidades** e **possibilitar reuso**, evitando código duplicado de infraestrutura. Isso traz melhor manutenibilidade e maior produtividade.

A recomendação é clara: **sempre procure modularizar partes da sua infraestrutura**. Se o módulo resolve um problema comum, use o do registry. Se você criou algo útil, disponibilize no registry para ajudar outros.

## O Terraform Registry

- Acessível em `registry.terraform.io`
- Possui ~16.000 módulos disponíveis
- Pode filtrar por provider: AWS, Azure, GCP, etc.
- Diferente de "Browse Providers" — módulos ficam em seção separada

## SQS — Contexto do Recurso

O SQS (Simple Queue Service) é um serviço de fila da AWS para comunicações assíncronas:

- **Comunicação 1:1** — uma fila sempre tem um consumidor (Lambda, aplicação)
- **Lambda na ponta** — pode ser trigado pela fila (Function as a Service / FaaS)
- **Polling** — aplicação pode consumir via polling

### Tipos de Fila

| Tipo | Característica |
|------|---------------|
| **Standard** | Sem garantia de ordenação, maior throughput |
| **FIFO** | First In, First Out — ordenação garantida |

**Ponto crítico:** Uma vez criada como FIFO ou Standard, **não é possível editar**. É necessário deletar e recriar. Isso é uma limitação da AWS, não do Terraform.

### Variantes de módulo disponíveis

1. **FIFO Queue** — fila com ordenação
2. **Encrypted with KMS** — requer KMS (Key Management Service) pré-configurado
3. **Queue with Dead Letter Queue** — pacote padrão recomendado

## Dead Letter Queue (DLQ) — Por que é essencial

O instrutor enfatiza fortemente a DLQ:

- Quando Lambda/aplicação consome um evento e **dá exceção**, o evento iria para o limbo
- Com DLQ, o evento com erro vai para uma **fila separada de eventos mortos**
- Permite **reprocessamento** posterior sem perda
- Garante **resiliência** e **retenção de eventos**

> "É muito comum quando a gente trabalha com SQS também ter uma Dead Letter Queue para garantir resiliência e retenção de evento."

## Source de módulos externos vs locais

| Tipo | Source |
|------|--------|
| Local | `source = "./modules/s3"` |
| Externo (registry) | `source = "terraform-aws-modules/sqs/aws"` |

O source do registry é, no final das contas, uma referência a um repositório Git mantido pela comunidade.

## Redrive Policy

Campo opcional mencionado pelo instrutor — é a política de retentativa que define quantas vezes um evento pode falhar antes de ir para a DLQ. Não foi utilizado na aula mas é configurável no módulo.

## Contribuição Open Source

O instrutor destaca que se você detectar problema ou falta de variável em um módulo, pode:
- Ir ao GitHub do módulo
- Abrir issue
- Abrir pull request
- O código é totalmente open source