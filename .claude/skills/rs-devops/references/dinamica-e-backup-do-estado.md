---
name: rs-devops-dinamica-e-backup-do-estado
description: "Applies Terraform state management best practices when working with tfstate files, remote backends, and state backup strategies. Use when user asks to 'configure terraform backend', 'manage terraform state', 'setup remote state', 'backup tfstate', or 'fix corrupted state'. Ensures correct state handling, backup restoration, and S3 backend configuration. Make sure to use this skill whenever working with Terraform infrastructure state. Not for Terraform resource creation, variable configuration, or module authoring."
---

# Dinâmica e Backup do Estado Terraform

> O tfstate é a fonte da verdade da infraestrutura — nunca comitar no Git, sempre gerenciar remotamente com backup.

## Rules

1. **Nunca comitar tfstate no repositório** — adicionar `*.tfstate` e `*.tfstate.backup` ao `.gitignore`, porque o estado contém dados sensíveis e deve ser gerenciado remotamente
2. **Estado só muda no apply com sucesso** — `plan` não altera estado, `apply` com erro não altera estado, porque o Terraform só persiste estado após operação bem-sucedida
3. **Tfstate é a fonte da verdade** — alterações feitas diretamente no cloud provider sem passar pelo Terraform geram dissonância e serão sobrescritas no próximo apply, porque o Terraform resolve conflitos priorizando seu estado
4. **Backup é sempre a versão anterior** — o arquivo `.tfstate.backup` contém o estado antes do último apply, porque serve como failover para restauração em caso de corrupção
5. **Usar backend remoto (S3) em produção** — configurar backend remoto para que o estado seja compartilhado e versionado, porque estado local impede colaboração e não tem versionamento
6. **Evitar alterar estado manualmente** — usar `terraform state` apenas quando estritamente necessário, porque alterações manuais podem corromper a fonte da verdade

## Localização do tfstate

### Workspace default
```
projeto/
├── terraform.tfstate          # Estado atual
├── terraform.tfstate.backup   # Versão anterior (failover)
├── main.tf
└── variables.tf
```

### Workspace customizado (ex: stage)
```
projeto/
├── terraform.tfstate.d/
│   └── stage/
│       ├── terraform.tfstate
│       └── terraform.tfstate.backup
├── main.tf
└── variables.tf
```

## Comandos de estado

```bash
# Listar todos os recursos no estado
terraform state list

# Mostrar detalhes de um recurso específico
terraform state show aws_s3_bucket.example

# Mover recurso entre estados
terraform state mv SOURCE DESTINATION

# Baixar estado remoto para edição local
terraform state pull > state.json

# Enviar estado editado de volta
terraform state push state.json

# Remover recurso do estado (sem destruir na cloud)
terraform state rm aws_s3_bucket.example
```

## Restauração de backup

```bash
# Se o tfstate foi corrompido após um apply com erro:
cp terraform.tfstate.backup terraform.tfstate

# Em workspace customizado:
cp terraform.tfstate.d/stage/terraform.tfstate.backup \
   terraform.tfstate.d/stage/terraform.tfstate
```

## Backend remoto (S3)

```hcl
terraform {
  backend "s3" {
    bucket = "meu-projeto-terraform-state"
    key    = "env/stage/terraform.tfstate"
    region = "us-east-1"
  }
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| Trabalhando sozinho em projeto pequeno | Estado local aceitável, mas remoto é melhor |
| Equipe ou CI/CD | Backend remoto obrigatório |
| Estado corrompido após apply | Restaurar do `.tfstate.backup` |
| Recurso criado manualmente na cloud | `terraform import` para sincronizar |
| Precisa remover recurso do estado sem destruir | `terraform state rm` |
| Migrar de local para remoto | Configurar backend S3, rodar `terraform init -migrate-state` |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Comitar `*.tfstate` no Git | Adicionar ao `.gitignore` e usar backend remoto |
| Editar tfstate manualmente em JSON | Usar `terraform state` CLI |
| Alterar recurso direto no console AWS | Alterar no `.tf` e rodar `apply` |
| Ignorar o backup quando estado corrompe | Restaurar do `.tfstate.backup` |
| Usar estado local com equipe | Configurar S3 backend com locking (DynamoDB) |
| Deletar tfstate achando que recria | Estado perdido = Terraform não conhece mais seus recursos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-dinamica-e-backup-do-estado/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-dinamica-e-backup-do-estado/references/code-examples.md)
