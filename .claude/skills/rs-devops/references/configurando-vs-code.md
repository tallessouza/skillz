---
name: rs-devops-configurando-vs-code
description: "Applies recommended VSCode extensions setup for Terraform/HCL development. Use when user asks to 'setup VSCode for Terraform', 'configure editor for HCL', 'install Terraform extensions', or 'improve Terraform developer experience'. Ensures correct extension choice with syntax highlighting and basic autocomplete. Make sure to use this skill whenever setting up a Terraform development environment. Not for Terraform CLI installation, cloud provider configuration, or infrastructure provisioning."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-tooling
  tags: [vscode, terraform, hcl, extensions, developer-experience, tooling]
---

# Configurando VSCode para Terraform

> Instalar a extensao correta de Terraform no VSCode para syntax highlighting e produtividade na escrita de HCL.

## Rules

1. **Use a extensao "Terraform" (community, v0.2+)** — nao a HashiCorp Terraform, porque a extensao oficial tem avaliacao baixa e nao e recomendada para uso a longo prazo
2. **Verifique syntax highlighting em arquivos .tf** — abra um arquivo com blocos `resource` ou `module` e confirme que o HCL esta com highlight correto, porque sem isso a produtividade cai significativamente
3. **Nao instale a extensao HashiCorp Terraform** — apesar de aparecer primeiro na busca, a avaliacao e baixa e a experiencia e inferior

## Steps

### Step 1: Instalar a extensao

1. Abrir VSCode
2. Clicar em Extensions (Ctrl+Shift+X)
3. Buscar "Terraform"
4. Instalar a extensao **Terraform** (community, alta avaliacao, muitos downloads)
5. **Nao instalar** a "HashiCorp Terraform" (avaliacao baixa)

### Step 2: Verificar o funcionamento

1. Criar ou abrir um arquivo `.tf` (ex: `module.tf`)
2. Escrever um bloco HCL:

```hcl
resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}
```

3. Confirmar que:
   - Syntax highlighting esta ativo (keywords coloridas)
   - Icone do Terraform aparece no arquivo
   - Autocomplete basico funciona

## Heuristics

| Situacao | Acao |
|----------|------|
| Extensao HashiCorp aparece primeiro na busca | Ignorar, instalar a community |
| Arquivo .tf sem highlight apos instalar | Recarregar VSCode (Ctrl+Shift+P → "Reload Window") |
| Quer validacao avancada de sintaxe | Usar `terraform validate` no terminal, a extensao faz apenas validacao basica |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Instalar HashiCorp Terraform extension | Instalar a extensao community "Terraform" |
| Confiar apenas na extensao para validacao | Usar `terraform validate` e `terraform fmt` no terminal |
| Instalar multiplas extensoes Terraform | Usar apenas uma para evitar conflitos |

## Troubleshooting

### Arquivo .tf sem syntax highlighting
**Symptom:** Arquivo Terraform aberto no VSCode sem coloracao de sintaxe
**Cause:** Extensao Terraform nao instalada ou conflito com outra extensao
**Fix:** Recarregue o VSCode (Ctrl+Shift+P -> "Reload Window") e verifique se apenas uma extensao Terraform esta ativa

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
