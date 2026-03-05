# Deep Explanation: Probes e Self-Healing no Kubernetes

## Por que probes existem

O instrutor enfatiza que sem probes, o Kubernetes nao tem nenhuma visibilidade sobre o estado real da aplicacao. O container pode estar rodando (processo ativo) mas a aplicacao dentro dele pode estar completamente quebrada. Probes sao o mecanismo que fecha essa lacuna.

## As tres probes em detalhe

### Startup Probe — Sondagem de subida

O ponto central do instrutor: "Quando eu tenho o container da minha aplicacao, nada garante que ele vai funcionar." O Startup Probe existe para validar que o bootstrap completou com sucesso.

Isso e especialmente critico em aplicacoes com dependencias pesadas (banco de dados, Kafka, Redis, cache). Essas aplicacoes tem um tempo de bootstrap maior — podem levar 30s, 60s ou mais para estabelecer todas as conexoes. O Startup Probe permite configurar thresholds para acomodar esse tempo sem que o Kubernetes mate o container prematuramente.

Se o Startup Probe falha apos todas as tentativas, o Kubernetes entende que o container nao conseguiu subir e toma acoes (geralmente restart).

### Readiness Probe — Sondagem de prontidao

Insight chave do instrutor: "Quando a sua aplicacao sobe, nao quer dizer que ela ja esta pronta para receber trafego."

A separacao entre "subiu" e "esta pronta" e fundamental. Uma aplicacao pode ter completado o bootstrap (Startup OK) mas ainda estar:
- Carregando cache em memoria
- Sincronizando estado com outros servicos
- Esperando warmup de connection pool

O Readiness Probe remove o pod do Service (e portanto do load balancer) ate que a aplicacao sinalize que esta pronta. Isso evita que usuarios recebam erros 503 durante a inicializacao.

### Liveness Probe — Sondagem de vivacidade

O instrutor descreve como "acompanhar a aplicacao de tempos em tempos para entender se esta viva." Diferente do Startup (que roda uma vez) e do Readiness (que valida prontidao), o Liveness e continuo.

Quando o Liveness falha, entra o self-healing: o Kubernetes reinicia o container automaticamente. O instrutor menciona "thresholds" — voce configura quantas falhas consecutivas sao toleradas antes do restart.

## A armadilha das dependencias externas

Este e o insight mais valioso da aula. O instrutor usa um exemplo concreto:

> "Aplicacao A depende de MySQL, Kafka e Redis. Se qualquer um estiver off, a aplicacao nao esta de fato online."

O erro comum e criar uma rota de health que apenas retorna 200 sem verificar nada. O instrutor e enfatico: "Voce vai descobrir que a aplicacao esta pronta, mas as dependencias nao estao. E isso vai gerar um gargalo."

A boa pratica e que toda rota de probe teste ativamente as conexoes com dependencias externas. Se MySQL esta down, a rota de health deve retornar 503, triggering o mecanismo de self-healing.

## Compartilhamento de rotas

O instrutor explica que na pratica voce pode ter:
- **Duas rotas:** `/health` (compartilhada entre Startup e Liveness) e `/ready` (Readiness)
- **Tres rotas:** uma para cada probe, se a arquitetura exigir
- **Uma rota:** em apps muito simples sem dependencias

A decisao depende da arquitetura da aplicacao. O ponto importante e que a rota existe e testa o que precisa testar.

## Self-healing como consequencia

O self-healing nao e algo que voce "configura" separadamente. Ele e consequencia natural das probes. Quando o Liveness Probe falha alem do threshold, o Kubernetes reinicia o container. Essa e a "autocura" — o sistema tenta resolver sozinho antes de escalar para alertas.

O instrutor menciona que alarmistica (alertas, notificacoes) sera abordada no modulo de observabilidade, indicando que probes sao a base sobre a qual observabilidade e construida.