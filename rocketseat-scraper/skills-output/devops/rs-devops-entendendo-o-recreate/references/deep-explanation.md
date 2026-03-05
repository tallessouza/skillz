# Deep Explanation: Estrategia Recreate no Kubernetes

## O que acontece durante um Recreate

O instrutor demonstrou ao vivo o comportamento: ao aplicar uma mudanca de imagem (v1 → v2) com estrategia Recreate, o Kubernetes **termina TODOS os pods simultaneamente** antes de criar os novos. O instrutor destacou: "olha so, ele saiu terminando todos os pods, todos, todos."

Isso significa que entre o momento em que os pods antigos sao terminados e os novos ficam Ready, **nao ha nenhuma instancia servindo trafego**. Esse e o "downtime window" do Recreate.

## Por que existe se causa downtime?

O Recreate existe para workloads onde:
- **Duas versoes nao podem coexistir** — por exemplo, um worker que processa de uma fila e a nova versao muda o schema de mensagens
- **O workload tolera indisponibilidade** — cronjobs que rodam periodicamente, batch processors
- **Simplicidade e prioridade** — em ambientes de desenvolvimento/staging onde downtime nao importa

O instrutor mencionou explicitamente: "isso aqui pode ser utilizado se voce tiver um cronjob, algum tipo de job que roda de tempos em tempos e pode ficar indisponivel, algum consumidor de fila que pode tambem ficar indisponivel."

## Estrategias que o Kubernetes puro suporta

O instrutor enfatizou que o Deployment do Kubernetes **so suporta duas estrategias nativamente**:

1. **RollingUpdate** (default) — substitui pods gradualmente, controlado por `maxSurge` e `maxUnavailable`
2. **Recreate** — mata tudo, sobe tudo de novo

## Estrategias avancadas (requerem frameworks)

O instrutor mencionou que serao exploradas ao longo do modulo:

### Blue-Green (ou Red-Black)
- Duas versoes da aplicacao rodam simultaneamente
- O trafego e virado para a nova versao quando ela esta pronta
- Rollback instantaneo: basta virar o trafego de volta
- Nomes variam por empresa: Blue-Green, Red-Black

### Canary Deployment
- Deploy gradual: 10% → 20% → 30% → ... → 100%
- Permite testar com uma parcela da base antes de ir full
- Requer ferramentas como Argo Rollouts, Istio, Flagger

O instrutor foi claro: "o Kubernetes puro nao comporta default" essas estrategias. "A gente vai trabalhar com alguns frameworks junto ao Kubernetes para conseguir fazer essas estrategias."

## Comportamento observado na aula

1. Instructor trocou `type: RollingUpdate` para `type: Recreate` no manifest
2. Comentou os campos `maxSurge` e `maxUnavailable` (nao se aplicam ao Recreate)
3. Aplicou com `kubectl apply`
4. Mudou a imagem para v2 e aplicou novamente
5. Observou: todos os pods entraram em `Terminating` simultaneamente
6. Somente apos todos terminarem, os novos pods foram criados
7. Resultado: janela de indisponibilidade total entre terminate e ready