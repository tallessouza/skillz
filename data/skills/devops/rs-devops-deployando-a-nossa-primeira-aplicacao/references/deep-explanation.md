# Deep Explanation: Deployando Aplicacao no Kubernetes

## Por que labels do selector e template devem ser iguais

O instrutor explica com clareza: o ReplicaSet (criado pelo Deployment) controla quantas replicas existem fazendo **match pela label**. Se o selector diz `app: myapp` mas o template cria pods com `app: api`, o ReplicaSet nunca encontra pods que satisfazem o match. Resultado: ele acha que tem 0 replicas e tenta criar mais indefinidamente.

Na palavras do instrutor: "vai funcionar no que tange execucao do manifesto, mas na pratica ele nao vai ter nenhum tipo de match, entao ele vai sempre tentar recriar outras replicas... para fins de producao, nao vai funcionar."

## Por que imagePullPolicy IfNotPresent

Dois beneficios mencionados:
1. **Performance** — so faz pull se a imagem nao existe no node, economizando banda
2. **Forca boas praticas de tagging** — se voce usar `latest` com `IfNotPresent`, a imagem so baixa na primeira vez e nunca atualiza. Isso "forca que voce tageie seus containers" com versoes explicitas.

## Fluxo de push para Docker Hub

O push so funciona se a imagem estiver tagueada com o formato `usuario/repo:tag`. O instrutor demonstra que fazer `docker push app-service-mesh:v1` sem o prefixo do usuario **nao funciona** — "ele nao vai encontrar maneiras de enviar essa imagem, nao vai ter nada esperando essa imagem, nada que vai dar match com esse endereco."

Para evitar rebuild, use `docker tag` para criar uma nova tag apontando para a mesma imagem:
```bash
docker tag app-service-mesh:v1 danielrodrigues/app-service-mesh:v1
```

## Autenticacao: push vs pull

- **Push**: sempre precisa de `docker login`, mesmo para repositorio publico, porque a imagem pertence a sua conta
- **Pull**: repositorio publico nao precisa de autenticacao. Repositorio privado precisa de Secret configurada no cluster Kubernetes

## Namespace como isolamento

O instrutor cria o namespace `app` antes de aplicar os manifestos. Sem o `-n app`, tudo vai para o namespace `default`. O namespace serve para:
- Isolar recursos da aplicacao
- Facilitar limpeza (`kubectl delete ns app` remove tudo)
- Permitir multiplas aplicacoes no mesmo cluster sem conflito

## O que ficou faltando (proxima aula)

O instrutor aponta dois gaps propositais:
1. **Service** — sem ele, os pods nao sao acessiveis pela rede
2. **Istio sidecar** — os pods estao rodando com apenas 1 container (a aplicacao). O Istio precisa ser injetado para adicionar o proxy sidecar como segundo container

## Estrutura de pastas

O instrutor cria a pasta `k8s/` dentro do projeto da aplicacao (nao na pasta `infra/`), argumentando que manifestos Kubernetes da aplicacao devem ficar junto ao codigo da aplicacao.