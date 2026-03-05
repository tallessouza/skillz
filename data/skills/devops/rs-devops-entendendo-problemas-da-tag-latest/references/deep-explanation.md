# Deep Explanation: Problemas da Tag Latest no Kubernetes

## Por que o rollback quebra com tags mutaveis

O instrutor demonstra um cenario real onde o rollback falha silenciosamente. O fluxo e:

1. Deploy inicial com `app:v1` (build A) — revision 1
2. Novo deploy com `app:v1` (build B, mesma tag sobrescrita) — revision 2
3. `kubectl rollout undo` volta para revision 1

O problema: revision 1 referencia `app:v1`, mas no registry essa tag agora aponta para build B. O Kubernetes baixa a imagem `app:v1` e obtem build B — exatamente a versao que voce queria reverter.

O instrutor destaca: "ele ate voltou, ele falou aqui que voltou pra gente... so que olha aqui, essa rota aqui e uma novidade, ela nao deveria existir aqui, ou seja, o rollback deveria ter removido essa rota, mas nao removeu, porque como a gente sobrescreveu a tag, ele nao tem mais essa referencia."

## O conceito de "perder o lastro"

A analogia do instrutor e precisa: quando voce sobrescreve uma tag, o Kubernetes "perde o lastro" — a referencia que ligava uma revision a um build especifico deixa de existir. O mecanismo de rollback funciona corretamente (ele muda o deployment para a revision anterior), mas a imagem referenciada ja nao corresponde ao que era originalmente.

## imagePullPolicy: Always

O instrutor explica que `imagePullPolicy: Always` forca o Kubernetes a sempre baixar a imagem do registry. Isso e necessario quando se usa tags mutaveis (como `latest`), porque sem ele o node poderia usar uma versao cacheada. Porem, com tags imutaveis, `Always` adiciona latencia desnecessaria ao deploy.

## Rollout history e revisoes

- `kubectl rollout history deployment/app -n namespace` — mostra todas as revisoes
- Por default, o Kubernetes mantem as ultimas revisoes (configuravel via `revisionHistoryLimit`)
- `kubectl rollout undo` volta para a revisao imediatamente anterior
- `kubectl rollout undo --to-revision=N` volta para uma revisao especifica
- O instrutor destaca que rollout funciona para deployments, replica sets e pods, mas no contexto do curso foca em deployments

## Por que isso e uma "ma pratica" explorada intencionalmente

O instrutor deixa claro que esta explorando deliberadamente uma ma pratica para que o aluno entenda o problema na raiz. A solucao (criar tags imutaveis por build) sera abordada na aula seguinte. O valor pedagogico esta em ver o rollback falhar para internalizar por que tags imutaveis sao obrigatorias em producao.