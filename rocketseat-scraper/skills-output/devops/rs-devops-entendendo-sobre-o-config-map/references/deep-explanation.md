# Deep Explanation: Kubernetes ConfigMap

## Duas etapas distintas

O instrutor enfatiza que ConfigMap envolve **duas etapas separadas** que muitos confundem:

1. **Criar o ConfigMap** — definir o mapa de chave-valor como objeto no cluster
2. **Injetar no pod** — referenciar o ConfigMap dentro da spec do container no Deployment

Os nomes sao propositalmente diferentes no exemplo (`appname` no ConfigMap vs `APP` na env var) para deixar claro que o mapeamento e explicito, nao magico. Voce define a chave como quiser no ConfigMap e depois mapeia para o nome que a aplicacao espera.

## Por que .env em dois ignore files

Em ambiente de pipeline CI/CD, o `.gitignore` ja protege o `.env` — o arquivo nao existe no repositorio, logo nao existe no contexto de build. Porem, em **build local** com Docker, o contexto de build e o diretorio local, onde o `.env` existe fisicamente. Por isso a "dupla exclusao": `.gitignore` para o Git e `.dockerignore` para o Docker build.

## ConfigMap nao injeta arquivo

O instrutor destaca um ponto sutil: a injecao via `env` + `valueFrom` **nao cria um arquivo .env** dentro do container. Ela injeta uma variavel de ambiente diretamente no processo. Nao existe arquivo fisico. Isso e diferente de montar o ConfigMap como volume (que cria arquivo), abordagem que sera vista em aulas futuras.

## Escalabilidade do padrao individual

O instrutor reconhece que para 10+ variaveis, o padrao de injecao individual (um bloco `name`/`valueFrom` por variavel) fica "complicado demais". A solucao — `envFrom` com `configMapRef` — sera abordada em aulas seguintes. Este e um padrao de progressive disclosure do proprio curso.

## ConfigMap vs Secret

ConfigMap e para dados **abertos** (nao-sensiveis). O instrutor lista exemplos do que NAO colocar em ConfigMap: senhas, chaves de API, tokens. Para esses, existe o objeto Secret, tema da proxima aula.

## Troubleshooting: undefined no pod

Quando o pod mostra `undefined` para uma variavel, significa que:
- O ConfigMap nao foi aplicado, ou
- Foi aplicado em namespace diferente, ou
- O Deployment nao referencia o ConfigMap corretamente

Solucao rapida: verificar namespace, reaplicar ConfigMap, e fazer restart do deployment (`kubectl rollout restart deployment`). Como a image pull policy e `IfNotPresent`, o restart e rapido.

## RollingUpdate como contexto

A aula tambem ajusta o deployment de `Recreate` para `RollingUpdate` com `maxSurge` e `maxUnavailable`, e reduz replicas para 3. Isso nao e central ao ConfigMap, mas demonstra boa pratica de manter o deployment atualizado antes de adicionar novas configuracoes.