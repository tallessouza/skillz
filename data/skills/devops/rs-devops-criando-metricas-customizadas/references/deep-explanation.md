# Deep Explanation: Métricas Customizadas com OpenTelemetry

## Por que abstrair em uma lib?

O instrutor enfatiza fortemente que a configuração de métricas (e tracing) deveria viver numa lib da organização, não dentro de cada aplicação. A razão prática: se você tem 200 aplicações (o que não é incomum), mudar qualquer configuração organizacional significa tocar 200 repositórios. Com uma lib centralizada, você muda em um lugar, sobe a versão, e cada app atualiza quando quiser.

## MeterProvider vs NodeSDK metric reader

Um ponto prático importante da aula: o instrutor encontrou um erro ao ter o metric reader configurado tanto no NodeSDK quanto no MeterProvider. O OpenTelemetry não suporta declarar o mesmo metric reader duas vezes. A solução foi remover do NodeSDK e manter apenas no MeterProvider dedicado.

Isso reforça o padrão de separação: NodeSDK cuida de auto-instrumentação e tracing, MeterProvider cuida de métricas customizadas.

## Aplicação 100% agnóstica de vendor

O ponto mais enfatizado: a aplicação usa apenas `@opentelemetry/api` e `@opentelemetry/sdk-metrics`. Ela não conhece Prometheus. Existe um `prometheus-exporter` do OpenTelemetry que poderia ser instalado diretamente na app, mas nem foi necessário.

A implicação: se amanhã você trocar Prometheus por Datadog, Elastic, ou qualquer outro backend, a mudança acontece na configuração do **coletor** (OpenTelemetry Collector), não no código da aplicação. Isso é o que o instrutor chama de "fantástico" — a complexidade toda fica na infra, não no código.

## Counters: sempre incrementam

O instrutor demonstra que `counter.add(1)` é a operação básica. Ele explica que não existe opção de decrementar — counters são monotônicos por definição. Você pode adicionar mais que 1 (ex: `add(1000)`), mas não é comum.

Para valores que precisam subir e descer, o tipo correto é `gauge`. Para distribuição de valores (como latência), é `histogram` (assunto da próxima aula).

## Padrão success/error com try-catch

O padrão recomendado é ter métricas separadas para sucesso e erro, posicionadas dentro da estrutura de tratamento de exceção:
- Sucesso: incrementa no caminho feliz (try)
- Erro: incrementa no catch

Isso dá visibilidade direta no Prometheus para comparar taxas de sucesso vs erro, inclusive lado a lado no mesmo gráfico.

## Scrape interval e visualização

O instrutor configurou scrape a cada 10 segundos. Isso significa que o Prometheus coleta os valores nesse intervalo. Na demonstração, ele mostra o counter subindo de 25 para 28 (3 acessos), depois continuando a crescer conforme mais requests são feitos. Os dois counters (success e error) aparecem lado a lado no Prometheus, permitindo comparação direta.