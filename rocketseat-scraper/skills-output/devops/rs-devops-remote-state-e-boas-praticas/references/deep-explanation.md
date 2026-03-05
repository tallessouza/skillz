# Deep Explanation: Remote State e Boas Práticas

## Por que estado remoto?

Quando o state está local, ele existe apenas na máquina de quem rodou o `terraform apply`. Se a pipeline precisa rodar `plan` e `apply`, ela precisa acessar o mesmo state. O S3 resolve isso: tanto o desenvolvedor local quanto a pipeline do GitHub Actions leem e escrevem no mesmo arquivo de estado.

O instrutor demonstra isso na prática: após configurar o backend S3, ele roda `terraform plan` e `terraform apply` localmente, e o state no S3 é atualizado (de 8.4KB para 8.6KB). Quando a pipeline roda em seguida, ela lê o mesmo state e corretamente reporta "no changes" — porque o estado já está em conformidade.

## O incidente do fmt-check

Um momento valioso da aula: o instrutor fez alterações no `main.tf` mas esqueceu de rodar `terraform fmt`. A pipeline quebrou no step `terraform fmt -check`. Isso demonstra exatamente por que o fmt-check existe na pipeline — é uma rede de segurança.

A correção é simples:
1. `terraform fmt` (corrige a indentação/formatação)
2. `git add .` → `git commit -m "fix fmt"` → `git push`

O instrutor destaca: "foi até bom a gente ter tido este acontecimento para ver na prática como ajusta".

## Condicional dupla no apply

O instrutor adiciona uma camada extra de proteção:

```yaml
if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

Mesmo que o workflow tenha um trigger configurado, essa condicional garante que o `terraform apply` SÓ executa quando:
1. O código está na branch main (não em feature branches)
2. O evento é um push (não um PR aberto, comment, etc.)

Isso é descrito como "camada extra" — defesa em profundidade.

## Fluxo branch-based (dia-a-dia real)

O instrutor admite que está fazendo push direto na main por estar sozinho, mas enfatiza que a prática correta é:

1. Criar branch a partir da main
2. Fazer as alterações de infraestrutura
3. Abrir Pull Request
4. Alguém do time revisa as mudanças
5. Opcionalmente, rodar estimativa de custo (Terracost/Infracost)
6. Aprovar e fazer merge na main
7. Pipeline aplica automaticamente

Isso transforma infraestrutura em um processo colaborativo com auditoria completa.

## Fonte única da verdade

O princípio fundamental de IaC: **todo recurso deve ser criado pela pipeline**. Isso significa:
- Versionamento (git history mostra quem mudou o quê e quando)
- Controle de SCM (code review antes de aplicar)
- Aprovação (alguém revisa e aprova a mudança)
- Auditoria (trail completo de mudanças)

Se alguém cria um recurso manualmente no console AWS, o state do Terraform não sabe desse recurso. Isso gera drift — a realidade diverge do código.

## Demonstração criar/destruir via pipeline

O instrutor demonstra o ciclo completo:
1. Cria arquivo `s3.tf` com um bucket simples
2. `terraform fmt` → commit → push
3. Pipeline roda: plan mostra 1 recurso para criar, apply cria
4. Bucket aparece no console AWS

Depois:
1. Deleta o arquivo `s3.tf`
2. Commit → push
3. Pipeline roda: plan mostra 1 recurso para destruir, apply destrói
4. Bucket removido do console AWS

Isso prova que a pipeline gerencia o ciclo de vida completo dos recursos.

## Menção ao Terracost/Infracost

O instrutor menciona brevemente que é possível adicionar um step no PR que calcula o custo estimado das mudanças de infraestrutura no cloud provider. Isso é descrito como "quase um FinOps" — permite que o time tenha visibilidade de custo antes de aprovar mudanças.