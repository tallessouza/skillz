# Deep Explanation: Terraform Outputs

## O que sao outputs no contexto do Terraform

Outputs sao variaveis de saida que existem apos a criacao de um recurso. Quando o Terraform cria um recurso (ex: bucket S3), o estado (tfstate) armazena diversos atributos alem dos que voce definiu. Esses atributos podem ser uteis para criar outros recursos encadeados.

## Por que usar data sources como camada intermediaria

O instrutor explica que nao e obrigatorio usar data sources para acessar atributos — voce poderia referenciar diretamente o recurso. Porem, data sources trazem **padronizacao**: ao inves de acessar diretamente o recurso, voce acessa uma camada especifica de dados. Isso organiza o codigo e cria uma convencao clara de leitura.

A estrutura de acesso e: `data.<tipo>.<nome>.<atributo>`

## Analogia com VPC (recurso mais complexo)

O instrutor usa o exemplo de uma VPC para ilustrar o valor real dos outputs: quando voce cria uma VPC, as informacoes geradas (subnet IDs, route table IDs, etc.) sao necessarias para criar outros recursos de rede. Sem outputs, voce nao teria como encadear esses recursos no IaC de forma programatica.

## Organizacao por arquivos — principio de responsabilidade

O padrao recomendado e um arquivo por responsabilidade:

| Arquivo | Responsabilidade |
|---------|-----------------|
| `providers.tf` | Configuracao de provedores |
| `datasources.tf` | Data sources |
| `outputs.tf` | Variaveis de saida |
| `variables.tf` | Variaveis de entrada |
| `main.tf` | Recursos (vai ser reorganizado conforme projeto cresce) |

O instrutor reconhece que `main.tf` ainda esta "solto" neste ponto do curso e sera organizado depois. O importante e que outputs, providers e datasources ja estejam separados.

## Comportamento com workspaces

Um ponto importante demonstrado na aula: outputs refletem automaticamente o workspace ativo. Ao trocar de `staging` para `default` com `terraform workspace select default`, os mesmos outputs mostram valores diferentes porque o estado e diferente por workspace.

## Campos do bloco output

- **value** (obrigatorio): expressao que resolve para o valor desejado
- **sensitive** (opcional, default false): oculta o valor no output do plan/apply
- **description** (opcional mas recomendado): documentacao inline
- **depends_on** (opcional, array): dependencias explicitas — o instrutor menciona mas nao usa neste momento

## Fluxo plan → apply com outputs

1. `terraform plan` — detecta alteracoes nos outputs e mostra preview ("Changes to Outputs")
2. `terraform apply -auto-approve` — aplica e exibe os valores finais na saida
3. Recursos nao sao alterados apenas por adicionar outputs — apenas a saida muda