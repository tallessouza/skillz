# Deep Explanation: HPA Stabilization Window e Políticas de Escalabilidade

## Por que o behavior existe

O HPA por padrão tem comportamentos fixos: scale up rápido e scale down após 5 minutos (300 segundos). O bloco `behavior` permite customizar essa dinâmica para que o autoscaling se adapte ao perfil real da sua aplicação.

## Janela de estabilização — o conceito central

A `stabilizationWindowSeconds` define quanto tempo o HPA espera DEPOIS que a condição de scale (up ou down) é detectada antes de agir. É uma "janela de observação" para evitar reações precipitadas.

**Scale Down:** O instrutor explica que o default de 300s (5 min) existe porque, após um pico de acesso, você não quer derrubar pods imediatamente — o pico pode voltar. Se você configura 30 segundos, o HPA vai esperar apenas 30s após o tráfego cair abaixo do threshold para começar a remover réplicas.

**Scale Up:** O valor default é 0 (imediato). O instrutor reforça que faz sentido manter próximo de zero porque "se eu já tenho algo que contemple o meu trigger, eu já quero escalar o mais rápido possível para evitar downtime." No teste dele, colocou 5 segundos e isso causou ~500 requisições a menos comparado ao default de 0 — demonstrando que mesmo 5 segundos é um tempo considerável sob carga.

## Policies — controle de cadência

Sem policies, quando a janela de estabilização expira, o HPA ajusta as réplicas de uma vez (ex: de 10 para 6). Com policies, você define uma cadência:

### Type: Pods
Valor inteiro. "Eu tenho 10 pods, a cada 15 segundos quero que 2 pods sejam terminados." Isso evita o drop abrupto.

### Type: Percent
Valor percentual. "A cada 15 segundos, remova 20% dos pods." Útil quando o número de réplicas varia muito e você quer proporcionalidade.

### Combinando duas policies
Quando você tem duas policies (ex: Pods + Percent), o `selectPolicy` decide qual aplicar:
- **Min:** Escolhe a menos agressiva (remove menos pods no período)
- **Max:** Escolhe a mais agressiva (remove mais pods no período)

O instrutor fez questão de notar que ter duas policies "não é muito comum" e trouxe como exemplo didático.

## Erro comum: selectPolicy no nível errado

O instrutor cometeu esse erro ao vivo — colocou `selectPolicy` dentro de `behavior` em vez de dentro de `scaleDown`. O `kubectl apply` retornou erro. A correção é colocar `selectPolicy` no mesmo nível que `policies`, dentro de `scaleDown` ou `scaleUp`.

## Calibração é iterativa

O instrutor enfatiza fortemente que "no dia zero é muito difícil ter esses números." Os valores corretos vêm de:
1. Observabilidade (próximo módulo do curso)
2. Acompanhamento da aplicação em produção com tráfego real
3. Ajustes iterativos conforme você entende o padrão de uso

Para aplicações com tráfego sazonal (picos em vários períodos), vale usar janelas maiores no scale down para manter réplicas extras caso o pico volte.

## Condição para scale down acontecer

Ponto importante que o instrutor reforça: o scale down SÓ acontece se a utilização estiver abaixo do threshold definido nas métricas pelo período INTEIRO da janela de estabilização. Se durante os 30 segundos de janela houver qualquer spike acima do threshold, o timer reseta.

## Impacto medido no teste

No teste de estresse do instrutor:
- Com `stabilizationWindowSeconds: 0` no scaleUp: resultado baseline
- Com `stabilizationWindowSeconds: 5` no scaleUp: ~500 requisições a menos
- Conclusão: para aplicações críticas, manter 0 no scale up é preferível

O scale down com 30s + policy Max mostrou réplicas caindo rapidamente de volta ao mínimo (6), comparado ao default de 5 minutos.