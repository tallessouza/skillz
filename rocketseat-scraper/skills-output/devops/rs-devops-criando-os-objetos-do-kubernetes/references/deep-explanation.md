# Deep Explanation: Criando Objetos do Kubernetes

## Por que usar Registry Remoto e nao Imagem Local

O instrutor menciona que e possivel referenciar uma imagem local diretamente no manifesto do deployment para um cluster Kubernetes local, mas enfatiza que essa nao e a pratica usual. A ideia e sempre trabalhar com repositorio remoto porque:

- Em ambientes reais, o cluster nao tem acesso ao Docker daemon local
- O fluxo registry remoto -> manifesto -> apply simula o ambiente de producao
- Pipelines de CI/CD sempre passam por um registry

## Docker Hub: Publico vs Privado

A aula usa repositorio publico porque a aplicacao e um boilerplate sem regras de negocio. O instrutor destaca que:

- Mesmo repositorios publicos exigem `docker login` para push (precisa associar a uma conta)
- Repositorios privados serao abordados posteriormente, incluindo como o Kubernetes autentica para fazer pull de imagens privadas (imagePullSecrets)
- Alem do Docker Hub, outros registries como o Azure Container Registry (Outlook/ACR) tambem serao cobertos

## O Fluxo de Tagueamento

O instrutor explica duas abordagens:

1. **Build + Tag separados**: `docker build -t app:v1 .` seguido de `docker tag app:v1 usuario/app:v1`
2. **Build ja com tag final**: `docker build -t usuario/app:v1 .` — elimina a necessidade do `docker tag`

A primeira abordagem foi usada na aula porque o build inicial usou um nome local. Em pipelines, a segunda abordagem e mais comum.

## Tags e a Questao do Latest

O instrutor propositalmente nao usa tag `latest` neste momento. Explica que:

- Em pipelines de CI/CD, normalmente se envia tanto a `latest` (atualizada) quanto uma tag especifica (associada a um commit)
- Por ora, como o fluxo e local, a tag e definida manualmente e nao esta associada a um commit
- Aulas futuras vao demonstrar os problemas de usar `latest` (cache de imagem, rollback impossivel)

## Labels: Selector vs Template

Ponto critico enfatizado: as labels definidas em `spec.selector.matchLabels` DEVEM coincidir com as labels em `spec.template.metadata.labels`. O instrutor muda de `app` para `api` para mostrar que o nome da label e uma definicao do usuario, mas que a consistencia entre selector e template e obrigatoria. Sem esse match, o Deployment controller nao consegue identificar quais pods estao sob seu gerenciamento.

## Resources: Requests vs Limits

O instrutor usa valores conservadores (100m CPU, 64Mi memoria para requests; dobro para limits) e menciona que o controle detalhado de recursos sera aprofundado depois. A regra pratica inicial: limits = 2x requests.

## Arquitetura ARM vs AMD

Como o instrutor usa Mac (Apple Silicon), o build gera imagens ARM64 por default. Ele menciona que e possivel forcar AMD64 e que isso sera visto na proxima aula. Isso e relevante porque clusters em cloud geralmente rodam em AMD64.

## Estrutura de Pastas

A convencao usada e criar uma pasta `k8s/` na raiz do repositorio para armazenar os manifestos Kubernetes. Cada repositorio tem seus proprios manifestos — pelo menos nesse primeiro momento do curso.