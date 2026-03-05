# Deep Explanation: Migrando pro ECR

## Por que migrar para o ECR?

O caso de uso especifico desta aula e a integracao com o AWS AppRunner. O AppRunner so tem compatibilidade com o ECR (tanto privado quanto publico). Para aplicacoes, o padrao e usar ECR privado — a imagem nao fica exposta na internet.

Se a aplicacao fosse open source ou um servico publico, o ECR publico seria uma opcao, assim como o DockerHub. A escolha do ECR aqui e puramente por conta do servico final (AppRunner).

## Anatomia do URI do ECR

O instrutor enfatiza uma distincao critica que muitos confundem:

```
123456789.dkr.ecr.us-east-2.amazonaws.com/skillz-ci:tag
|____________________________________________| |________| |__|
              REGISTRY                        REPOSITORY   TAG
```

- **Registry**: e o endpoint do servico ECR na sua conta/regiao. Equivale ao "username" no DockerHub, mas e um endpoint completo.
- **Repository**: e o nome do repositorio dentro do registry (ex: `skillz-ci`). Dentro dele ficam as image tags.
- **Tag**: identificador da versao da imagem.

No DockerHub, a estrutura era `username/image:tag` (ex: `danielrodrigues/skillz-ci:latest`). No ECR, o registry e um URI completo.

## Por que usar outputs em vez de hardcode?

O instrutor chama isso de "maneira mais elegante". A razao tecnica:

1. **O step de login no ECR ja retorna o registry** — quando voce usa `aws-actions/amazon-ecr-login`, o output `registry` contem o endpoint completo
2. **A permissao e escopada** — se sua role IAM tem acesso a um registro em `us-east-2`, o login retorna o endpoint dessa regiao. Se tiver registros em outras regioes, cada login retorna o endpoint correto
3. **Escalabilidade** — ao mudar de regiao ou conta AWS, nao precisa alterar a pipeline. O output se adapta automaticamente
4. **Legibilidade** — `$REGISTRY/skillz-ci:$TAG` e muito mais legivel que o URI completo

## OpenID Connect (OIDC) vs Access Keys

O instrutor destaca que a pipeline ja usa OIDC:

- **Access Key + Secret Key como secrets**: funciona, mas nao e best practice. Requer rotacao manual, risco de vazamento.
- **OIDC**: o GitHub Actions se autentica diretamente com a AWS via token temporario. Sem secrets permanentes, sem rotacao.

A configuracao de OIDC foi feita em aulas anteriores (IAM role com trust policy para GitHub Actions).

## Processo de limpeza na migracao

Ao migrar de DockerHub para ECR, o instrutor segue um processo disciplinado:

1. Remove o step de login do DockerHub
2. Remove o step de build/push do DockerHub
3. Mantem a abordagem de rodar `docker build` e `docker push` diretamente (funciona porque o runner Ubuntu ja tem Docker instalado)
4. Nota que as secrets do DockerHub podem ser removidas depois

## Scan de vulnerabilidades

O ECR tem scan de vulnerabilidades integrado. Quando a imagem e pushada, o ECR pode automaticamente escanear por vulnerabilidades conhecidas. O instrutor menciona que:

- Pode ser ativado/desativado no registro
- Ferramentas como Trivy tambem fazem isso e podem ser adicionadas como step na pipeline
- E um ponto importante de seguranca que o DockerHub nao oferece nativamente da mesma forma

## Nota sobre o AppRunner

A imagem no ECR ainda nao esta "rodando" — esta apenas hospedada. O deploy no AppRunner sera feito na proxima aula. O ECR e apenas o registry; o AppRunner e o runtime.