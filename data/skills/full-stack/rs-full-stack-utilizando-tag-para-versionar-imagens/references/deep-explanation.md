# Deep Explanation: Versionamento de Imagens Docker com Tags

## O que sao tags no Docker?

Tags sao rotulos que voce aplica a uma imagem Docker para diferenciar versoes. O formato e `nome:tag` — por exemplo, `api:v1`. Quando voce nao especifica uma tag, o Docker automaticamente usa `latest`, o que cria um problema: voce perde a capacidade de saber qual versao esta rodando.

## Tags e Image IDs — a relacao

Um ponto crucial demonstrado na aula: **duas tags diferentes podem apontar para o mesmo Image ID**. Isso acontece porque o ID e um hash do conteudo da imagem. Se voce faz `docker build -t api:v1 .` e depois `docker build -t api:v2 .` sem mudar o Dockerfile ou o contexto, ambas as tags apontam para o mesmo ID.

Consequencia pratica: ao deletar pelo ID com `docker rmi -f <id>`, **todas as tags associadas sao removidas de uma vez**. Isso pode ser util (cleanup rapido) ou perigoso (perda acidental de versoes).

## Por que nao usar `latest`?

O instrutor demonstra que sem tag explicita, voce perde rastreabilidade. Em `docker ps`, a coluna IMAGE mostra `api:v2` quando voce usou tag — mas mostra apenas `api:latest` quando nao usou. Em producao, com multiplas versoes deployadas, saber exatamente qual versao roda em cada container e essencial para debugging e rollback.

## Lifecycle completo de um container com tag

1. **Build** com tag: `docker build -t api:v1 .`
2. **Run** especificando tag: `docker run -d -p 3000:3000 api:v1`
3. **Verificar**: `docker ps` mostra a tag na coluna IMAGE
4. **Parar**: `docker stop <id>`
5. **Remover container**: `docker rm <id>` ou `docker rm -f <id>`
6. **Remover imagem**: `docker rmi api:v1` ou `docker rmi -f <id>`

## Force remove (`-f`)

O instrutor mostrou que `docker rm` sem `-f` pode falhar se o container ainda estiver em algum estado. O flag `-f` (force) envia SIGKILL e remove. Mesma logica para `docker rmi -f` em imagens que tem tags multiplas ou containers dependentes.

## Analogia: tags como branches do Git

Assim como branches no Git apontam para commits (que tem SHA hashes), tags no Docker apontam para imagens (que tem Image IDs). Duas branches podem apontar para o mesmo commit, assim como duas tags podem apontar para a mesma imagem. Deletar o "commit" (imagem) remove todos os "ponteiros" (tags).

## Edge cases

- **Rebuild com mudancas**: se voce muda o codigo e faz `docker build -t api:v2 .`, o ID sera diferente do v1 — agora cada tag aponta para uma imagem distinta
- **Mesmo nome, tags diferentes, IDs diferentes**: `docker image ls` mostra corretamente cada combinacao
- **Tag sem nome**: tecnicamente possivel (`docker build -t :v1 .`) mas nao recomendado — sempre use `nome:tag`