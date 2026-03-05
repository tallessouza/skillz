# Deep Explanation: Tag Imutável e Rollback no Kubernetes

## Por que nunca sobrescrever tags?

O instrutor demonstra na prática o problema: se você rebuilda a mesma tag (ex: `v1`), o cluster pode ou não fazer pull da nova imagem dependendo do `imagePullPolicy`. Com `Always`, ele sempre puxa — mas isso é lento e imprevisível. Com `IfNotPresent`, ele usa o cache — mas aí a tag sobrescrita nunca chega ao cluster. A solução é simples: tags são imutáveis. Mudou o código? Nova tag.

Isso permite:
- **Rollback instantâneo**: a imagem antiga já está no cluster (cache), não precisa de pull
- **Rastreabilidade**: `v2` no cluster = `v2` no registry = commit X no git
- **Previsibilidade**: ninguém tem dúvida sobre o que está rodando

## imagePullPolicy: IfNotPresent vs Always

O instrutor muda de `Always` para `IfNotPresent` justamente porque com tags imutáveis, fazer pull toda vez é desperdício. Quando fez rollback para `v1`, o evento do cluster mostrou: "a imagem v1 já existe" — não fez pull, o pod subiu instantaneamente. Isso é crítico em cenários de emergência onde cada segundo conta.

## O perigo do imperativo sem declaração

Este é o insight mais importante da aula. O instrutor demonstra o cenário completo:

1. Aplicação está na v2 (declarado no YAML)
2. Dev faz rollback imperativo para v1 (`kubectl rollout undo`)
3. Cluster agora roda v1 — mas o YAML ainda diz v2
4. Outro membro da equipe roda `kubectl apply` (rotina normal)
5. Cluster volta para v2 — a versão com problema!

Ninguém fez nada errado. O problema é que o estado real do cluster divergiu do estado declarado. O instrutor enfatiza: "tudo o que você fizer no imperativo, você precisa declarar".

## Deploy cadenciado (Rolling Update)

O instrutor mostra visualmente no Lens como o deploy acontece de forma cadenciada:
- Pod novo é criado (status: Creating)
- Pod novo começa a rodar
- Pod antigo é terminado
- Próximo pod novo é criado
- E assim por diante

Durante esse processo, a aplicação **não fica indisponível**. O que pode acontecer é ter duas versões rodando simultaneamente por um breve período. O instrutor nota que "sinceramente não é um problema" para a maioria dos casos.

## Rollback: com ou sem --to-revision

- `kubectl rollout undo deployment/app` — volta para a revisão imediatamente anterior
- `kubectl rollout undo deployment/app --to-revision=3` — volta para uma revisão específica
- `kubectl rollout history deployment/app` — mostra todas as revisões disponíveis

O instrutor menciona que trabalhou `--to-revision` na aula anterior e aqui demonstra o undo simples (sem especificar revisão).

## CI manual vs CI automatizada

O processo mostrado na aula (docker build → docker push → editar YAML → kubectl apply) é a "CI manual". O instrutor deixa claro que em cenário automatizado, a troca de tag no manifesto seria feita pelo CD pipeline. O fluxo manual existe para entender cada etapa no detalhe.

## Correção do controller

Um detalhe técnico: na aula anterior, a mensagem não mudou porque o controller não foi atualizado (apenas o service). Isso reforça a importância de testar end-to-end, não apenas o componente alterado.