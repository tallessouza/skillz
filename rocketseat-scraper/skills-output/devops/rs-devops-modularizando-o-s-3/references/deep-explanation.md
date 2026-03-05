# Deep Explanation: Modularizando o S3 no Terraform

## Por que modularizar?

O instrutor explica que modulos Terraform sao **abstracoes que facilitam manutenibilidade e possibilitam reutilizacao de codigo**. Um modulo e "bem generico e resolve um problema especifico de criacao de um recurso ou grupo de recursos dentro da sua infraestrutura."

## O Terraform ignora pastas nao-root

Um ponto critico demonstrado na aula: o Terraform **nao detecta automaticamente** arquivos `.tf` que nao estejam na raiz do projeto. O instrutor demonstrou isso de forma pratica — criou os arquivos em `modules/s3/`, rodou `terraform plan`, e o resultado foi "no changes". Isso significa que:

- Voce pode ter arquivos `.tf` em subpastas e o Terraform simplesmente os ignora
- Para que o Terraform reconheca um modulo, voce **precisa declara-lo** com um bloco `module {}` no root
- O `source` aponta para o caminho relativo: `"./modules/s3"`

## O ciclo init → plan ao trabalhar com modulos

O instrutor mostrou que apos declarar o bloco `module`, rodar `terraform plan` diretamente gera erro. Isso acontece porque o Terraform trata todo modulo (mesmo local) como algo que precisa ser "instalado". O fluxo correto:

1. Criar/alterar modulo
2. `terraform init` — registra o modulo
3. `terraform plan` — agora funciona

## Variaveis como contrato do modulo

A grande sacada didatica: o instrutor primeiro mostrou o modulo **sem variaveis** (bucket sem nome, valores aleatorios) para depois introduzir `variables.tf`. O raciocinio:

- Se voce hardcoda o nome do bucket no modulo, "caso outro projeto queira utilizar, nao vai funcionar"
- O modulo deve ser generico — recebe configuracao via variaveis
- O `terraform.workspace` e usado para diferenciar ambientes (staging, production)
- Variaveis sem `default` sao obrigatorias — forcam o consumidor a passar valores

## Validacao estrita de variaveis

O instrutor demonstrou propositalmente o que acontece ao passar uma variavel nao declarada (ex: `url = "..."`). O Terraform retorna: `An argument named "url" is not expected here.` Isso reforca que **toda variavel passada no bloco module deve ter correspondencia em variables.tf**.

## Contexto do projeto: S3 + CloudFront

O modulo S3 e parte de um setup maior:
- **S3**: armazena o build do frontend (dist/compilado)
- **CloudFront**: CDN que aponta para o S3 para entrega de conteudo
- O CloudFront **depende de outputs do S3** (ex: `bucket_domain_name`)
- Isso justifica a modularizacao: outputs do S3 alimentam inputs do CloudFront

## terraform fmt

O instrutor notou que o editor estava com indentacao de 4 espacos. O padrao Terraform e 2 espacos. O comando `terraform fmt` corrige automaticamente, funcionando como um linter que "deixa o codigo padronizado de acordo com o que e proposto pela documentacao do Terraform."

## SSO e autenticacao AWS

O instrutor mostrou um erro de autenticacao ao rodar `terraform plan`. A solucao foi `aws sso login`, que atualiza o token (expira em ~8 horas). Configurado na etapa de SSO do curso.