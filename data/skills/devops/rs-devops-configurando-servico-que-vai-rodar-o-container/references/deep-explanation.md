# Deep Explanation: Configurando Servico do Container

## Por que duas roles separadas?

O instrutor enfatiza a separacao por seguranca. A role do ECR (ja existente) serve para o CI — o GitHub Actions assume essa role via OIDC para fazer push de imagens. A role do AppRunner serve para o servico em si — o AppRunner precisa de permissao de leitura no ECR para baixar a imagem e fazer o deploy.

No `ci.yaml`, na etapa de configurar credenciais, o pipeline assume a role do ECR. Em outro momento (quase CD), precisara assumir a role do AppRunner. Escopo diferente = role diferente. Isso e uma pratica de seguranca: principio do menor privilegio.

## O que e uma ARN?

ARN = Amazon Resource Name. E o identificador unico de qualquer recurso na AWS. Formato: `arn:aws:{service}::{account}:policy/{policy-name}`. No caso, usamos a ARN da managed policy `AmazonEC2ContainerRegistryReadOnly` que a propria AWS fornece.

## Trust Policy vs Inline Policy vs Managed Policy

- **Trust Policy (assume_role_policy):** Define QUEM pode assumir a role. No caso, o servico `build.apprunner.amazonaws.com`.
- **Managed Policy:** Policies pre-definidas pela AWS que voce associa via ARN. Exemplo: `AmazonEC2ContainerRegistryReadOnly`.
- **Inline Policy:** Policy customizada escrita diretamente na role. Permite granularidade total. No caso, adicionamos statements para AppRunner e IAM.

## Por que `iam:PassRole` e `iam:CreateServiceLinkedRole`?

- **PassRole:** Quando um servico AWS precisa assumir uma role em tempo de execucao (ex: o CI passando a role do AppRunner para o servico), ele precisa da permissao `iam:PassRole`. Sem ela, o pipeline nao consegue "passar" a role adiante.
- **CreateServiceLinkedRole:** Alguns servicos AWS criam roles automaticamente vinculadas ao servico. O AppRunner pode precisar disso. Esta permissao permite essa criacao automatica.

## O erro 400 e a limitacao do `terraform plan`

O instrutor demonstrou um erro real: SIDs duplicados geraram um Bad Request (400) no `terraform apply`. Ponto importante: o `terraform plan` NAO detectou esse erro porque ele apenas simula — nao tenta criar o recurso na AWS. A validacao real so acontece no `apply`. Isso reforça que plan e necessario mas nao suficiente.

## A vantagem do IaC neste contexto

O instrutor destaca que usar Infrastructure as Code (Terraform) facilita enormemente a escrita de permissoes. Em vez de clicar no console e configurar manualmente (o que ele fez apenas para pegar o boilerplate do Custom Trust Policy), todo o recurso e declarativo, versionavel e reproduzivel.

## Estrutura final da inline policy

A inline policy `ecr-app-permission` fica com tres statements:
1. **ECR:** Permissoes completas no ECR (para push/pull de imagens)
2. **AppRunner:** Permissoes completas no AppRunner (para o pipeline gerenciar o servico)
3. **IAM:** PassRole + CreateServiceLinkedRole (para alteracoes de role em runtime)

Essa abordagem de multiplos statements numa unica inline policy e limpa e facilita a leitura — cada statement tem um SID descritivo e um escopo claro.