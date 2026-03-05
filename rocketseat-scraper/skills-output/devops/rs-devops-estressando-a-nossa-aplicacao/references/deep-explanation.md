# Deep Explanation: Teste de Estresse no Kubernetes com FortIO

## Por que teste de estresse no Kubernetes?

O instrutor posiciona o teste de estresse como parte da **engenharia do caos** — a pratica de submeter sua aplicacao a condicoes adversas controladas para entender seu comportamento real antes que problemas acontecam em producao.

O cenario especifico e: o HPA (Horizontal Pod Autoscaler) v2 ja estava configurado, e a equipe ja havia observado escala por baixa memoria alocada. Agora o objetivo e validar o HPA em um **cenario de alto trafego realista**.

## Pods efemeros — um conceito importante

O instrutor destaca um padrao que vai alem do FortIO: a capacidade de executar containers temporarios dentro do cluster Kubernetes sem criar manifestos declarativos.

A logica e clara: "Eu quero rodar o teste, ele existe. Eu nao quero mais rodar o teste, ele deixa de existir." Isso se aplica a qualquer ferramenta de diagnostico, debug ou teste que voce precise rodar momentaneamente dentro do cluster.

O `kubectl run --rm -it` e o mecanismo para isso:
- `run` cria um pod diretamente (sem Deployment)
- `--rm` remove o pod quando a execucao termina
- `-it` modo interativo (ve o output em tempo real)

## Por que FortIO especificamente?

O instrutor menciona que existem varias ferramentas de teste de carga (K6, Locust, Vegeta) e que outras serao exploradas no modulo de observabilidade. O FortIO foi escolhido por dois motivos:
1. **Simplicidade** — configuracao minima, roda direto como container
2. **Oportunidade pedagogica** — demonstrar execucao de container efemero no cluster

## DNS interno do cluster

Um ponto critico que o instrutor demonstra: quando voce roda um pod dentro do cluster, ele **enxerga os servicos pelo ClusterIP**. Entao em vez de usar um IP externo ou port-forward, voce referencia diretamente o nome do servico.

O instrutor usou `http://app-ts-svc/exemplo-k8s` porque o pod de teste estava no mesmo namespace (`primeira-aplicacao`). Se estivesse em outro namespace, precisaria do FQDN: `http://app-ts-svc.primeira-aplicacao.svc.cluster.local/exemplo-k8s`.

## Analise do comportamento do HPA

O teste revelou um padrao classico de autoscaling:
1. Carga iniciou → consumo de CPU subiu
2. HPA detectou CPU acima do target → escalou de 3 para 6 pods ("new size 6")
3. Consumo ainda alto → escalou de 6 para 8 pods ("new size 8")
4. Atingiu o limite maximo (maxReplicas: 8) → parou de escalar
5. Trafego melhor distribuido entre 8 pods → consumo estabilizou

O instrutor observou: "quando ele subiu, o consumo deu uma diminuida, ainda ta alto mas deu uma diminuida boa" — isso demonstra o efeito da distribuicao de carga.

## Interpretacao do relatorio FortIO

O relatorio final mostrou:
- **~500.000 requisicoes** em 2 minutos — volume significativo
- **100% HTTP 200** — sucesso absoluto, nenhuma requisicao falhou
- **~4000 QPS efetivo** — dos 6000 configurados, o sistema sustentou 4000
- **12ms tempo medio** — latencia excelente
- **Distribuicao por percentis** — permite entender a variacao de latencia (p50, p90, p99)

## Para-casa proposto pelo instrutor

O instrutor sugere dois exercicios:
1. **Remover o HPA e repetir o teste** — para ver o que acontece quando a aplicacao nao pode escalar. Expectativa: falhas, timeouts, nao vai ter 100% de sucesso.
2. **Adicionar complexidade a aplicacao** — a app atual e "so um return", sem processamento. Na proxima aula, ele planeja adicionar carga computacional para tornar o teste mais realista.

## Ferramentas alternativas mencionadas

| Ferramenta | Contexto |
|-----------|----------|
| K6 | Sera usada no modulo de observabilidade |
| Locust | Alternativa mencionada |
| Vegeta | Alternativa mencionada |
| FortIO | Usada nesta aula por simplicidade |