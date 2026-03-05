# Deep Explanation: Fault Injection com Istio

## Por que fault injection existe

A ideia central e da engenharia do caos: levantar hipoteses sobre o comportamento do sistema em situacoes adversas e **testa-las de forma controlada**. O instrutor enfatiza que sao perguntas para as quais nao temos respostas — cada ambiente tem caracteristicas unicas.

### Duas perguntas fundamentais

1. **E se sua rede comecar a ter delay?** — Localmente pode nao parecer grave, mas a nivel de rede (blast radius global) pode ser catastrofico. O instrutor demonstrou que 20% de delay a 5 segundos impediu completamente o teste de carga.

2. **E se um servico comecar a abortar requisicoes?** — 503, 504, erros de gateway. Como a rede se comporta? No teste, o pod do Fortio (simulando app A) crashou repetidamente.

## Anatomia da configuracao

### Onde mora cada coisa

- **DestinationRule**: regras de destino — subsets, load balancing algorithm (LEAST_CONN, ROUND_ROBIN)
- **VirtualService**: tudo sobre trafego — roteamento, fault injection, retries, timeouts, traffic splitting

O instrutor reforça isso varias vezes: "de resto, vai ser configuracao fixada no VirtualService".

### Fault injection nao toca a aplicacao

Ponto critico: a aplicacao continua retornando 200. O erro e injetado pelo proxy Envoy (sidecar do Istio) **antes** de entregar a resposta ao chamador. Isso permite testar cenarios de falha sem:
- Criar branches de codigo para simular erros
- Deployar versoes modificadas
- Configurar feature flags

### Delay vs Abort — quando usar cada um

O instrutor faz uma reflexao importante:

> "O delay e aquilo — sua aplicacao ta lenta, mas ta respondendo. E esse responder pode ser que atenda, dependendo do contexto. O abort nem vai responder. Simplesmente vai dar uma negacao de servico."

E levanta a discussao: **faz mais sentido o servico ficar fora ou ficar dentro porem lento?** A resposta e subjetiva e depende do ecossistema. Alguns sistemas comportam lentidao sem gerar erro cascata; outros nao.

## Resultados experimentais do instrutor

### Teste 1: Delay 5s, 20% do trafego
- **Resultado:** Timeout total. Nem funcionou.
- **Conclusao:** 5 segundos e extremo demais para o contexto testado.

### Teste 2: Delay 1s, 20% do trafego
- **Resultado:** 45 QPS (muito aquem do esperado de ~500 QPS)
- **Conclusao:** Mesmo 1 segundo com 20% ja e catastrofico.

### Teste 3: Delay 1s, 5% do trafego
- **Resultado:** ~1.66 QPS, ~1800 requests (4x mais que o teste anterior)
- **Conclusao:** Condiz com a reducao proporcional (20% → 5% = ~4x melhora). Ainda impactante.

### Teste 4: Abort 504, 20% do trafego
- **Resultado:** Pod do Fortio crashou (CrashLoopBackOff). Servico nem rodou.
- **Conclusao:** Abort e muito mais destrutivo que delay.

### Teste 5: Abort 504, 5% do trafego
- **Resultado:** Ainda crashou. Pod entrou em CrashLoopBackOff.
- **Conclusao:** Abort gera impacto desproporcional ao percentual.

## A ponte para Circuit Breaker

O instrutor fecha a aula com uma pergunta-chave:

> "Imagine que sua aplicacao A chama a B, e a B tem fault injection. Como voce protege a aplicacao A?"

A resposta: **Circuit Breaker**. Sem ele, o servico chamador (A) crasha junto com o servico defeituoso (B). O Circuit Breaker controla se o circuito esta aberto ou fechado, protegendo servicos upstream.

## Ferramentas mencionadas

| Ferramenta | Uso | Nivel |
|------------|-----|-------|
| **Istio (VirtualService)** | Fault injection HTTP (delay/abort) | Camada HTTP |
| **Chaos Mesh** | Chaos engineering completo | HTTP + kernel + pod |
| **Litmus** | Chaos engineering completo | HTTP + kernel + pod |
| **Fortio** | Teste de carga (usado no exemplo) | CLI simples |
| **K6** | Teste de carga (Grafana Labs) | Mais customizavel, roda no cluster |
| **Vegeta** | Teste de carga | CLI |
| **Locust** | Teste de carga | Python-based, distribuido |

## Conceito de Blast Radius

Mencionado tanto nesta aula quanto no modulo de observabilidade: o impacto local vs impacto global. Um delay pode parecer insignificante localmente mas cascatear pela rede inteira. O fault injection serve exatamente para medir esse blast radius de forma controlada.