# Deep Explanation: Configurando .gitignore e .tfvars

## Por que não versionar o tfstate?

O arquivo `.tfstate` é o coração do Terraform — ele mapeia os recursos reais na cloud para a configuração declarada no código. Contém:
- IDs de recursos reais (instâncias EC2, buckets S3, etc.)
- Dados sensíveis (senhas de banco, chaves de acesso)
- Estado completo da infraestrutura

Se versionado no Git:
- Qualquer pessoa com acesso ao repo vê a infraestrutura completa
- Conflitos de merge corrompem o estado
- Dados sensíveis ficam no histórico do Git para sempre

O instrutor enfatiza: "nós não versionamos o tfstate" — isso foi mencionado em aulas anteriores e reforçado aqui como prática fundamental.

## O .terraform/ como cache local

O diretório `.terraform/` é criado pelo `terraform init` e contém:
- Binários dos providers baixados
- Módulos referenciados
- Configuração de backend

O instrutor descreve como "quase a nível de cache, quase a nível de configuração local". Cada desenvolvedor ou pipeline CI roda seu próprio `init`, então versionar este diretório é redundante e pesado.

## .tfvars como .env da infraestrutura

A analogia do instrutor é direta: **".tfvars é como se fosse um .env"**. Assim como em aplicações Node.js usamos `.env` para variáveis de ambiente sem versioná-las, no Terraform usamos `.tfvars`.

### Mecanismo de sobrescrita

Quando uma variável é definida em `variables.tf`:
```hcl
variable "state_bucket" {
  default = "valor-padrao"
}
```

E em `terraform.tfvars`:
```hcl
state_bucket = "valor-real-producao"
```

O valor do `.tfvars` **sobrescreve** o `default`. O instrutor demonstra isso ao vivo: mudou o valor do bucket no `.tfvars` e o `terraform plan` mostrou que o recurso seria destruído e recriado, porque "tudo que é passado como variável vai sobrescrever o default".

### Proteção contra destruição acidental

No exemplo da aula, ao mudar o nome do bucket via `.tfvars`, o Terraform tentou destruir e recriar o recurso. Porém, como a instância tinha `prevent_destroy = true` (lifecycle), o Terraform bloqueou a operação. Isso demonstra a importância de:
1. Usar lifecycle rules como safety net
2. Sempre rodar `plan` antes de `apply`
3. Entender que mudanças em `.tfvars` têm impacto real

## O .terraform.lock.hcl

O instrutor menciona explicitamente: "o lock não tem problema, é tranquilo". Este arquivo deve ser versionado porque garante que todos os membros do time usem as mesmas versões de providers, similar ao `package-lock.json` no Node.js.

## Contexto do curso

Esta aula encerra o módulo de IaC (Infrastructure as Code). O próximo módulo abordará CI/CD com pipelines de infraestrutura e deploy automatizado de aplicações em container, integrando com GitHub.