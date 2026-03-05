# Deep Explanation: Alterando Recursos e Réplicas da Aplicação

## O ciclo de tuning: configurar → testar → comparar → ajustar

O instrutor enfatiza que escalar uma aplicação Kubernetes não é um ato único — é um ciclo iterativo. Você configura, estressa, observa os números, e ajusta. Cada aplicação responde de forma diferente porque depende do que ela faz: se bate em banco, se é CPU-bound, se tem dependências externas.

## Por que 75-80% de average utilization?

O trigger de utilização do HPA define QUANDO o Kubernetes começa a criar novos pods. Se você coloca 95%, o pod já está quase no limite quando a escala começa. Novos pods levam tempo para ficar prontos (pull da imagem, startup, readiness probe). Nesse intervalo, os pods existentes podem atingir 100% e começar a rejeitar requisições (timeouts, erros 5xx).

Com 75-80%, existe uma "janela de respiro" — o HPA dispara a escala quando ainda há margem, e os novos pods ficam prontos antes dos existentes saturarem.

O instrutor recomenda testar com valores altos (90-95%) justamente para OBSERVAR esse efeito: mais chamadas com erro, timeouts, menor número total de requisições bem-sucedidas.

## Proporção requests vs limits de CPU

No exemplo da aula: 400m de request e 700m de limit. O request é o que o scheduler garante — o pod sempre terá pelo menos 400 milicores. O limit é o teto — o pod pode fazer burst até 700m mas nunca além.

Uma proporção de ~1:1.75 permite que pods lidem com picos curtos (burst) sem desperdiçar recursos quando ociosos. Se requests == limits (guaranteed QoS), não há burst possível mas a previsibilidade é máxima.

## O limite é o nó

O instrutor faz uma observação crucial: aumentar CPU por pod só funciona se o nó tiver capacidade. Se você tem 4 CPUs no nó e 10 pods pedindo 400m cada, já são 4000m = 4 CPUs inteiros só de requests. Não sobra nada para outros workloads.

Quando o nó satura, a solução é escalar nós (Cluster Autoscaler), que é um assunto mais avançado abordado em aulas posteriores.

## Escala rápida na subida, lenta na descida

O instrutor observou que pods sobem rápido (segundos) mas demoram para descer após o teste. Isso é comportamento padrão do HPA — a janela de estabilização de downscale é 5 minutos por padrão. O motivo: evitar "flapping" (sobe/desce/sobe/desce) que causa instabilidade.

Na versão 2 do HPA (próxima aula), é possível configurar essa janela de estabilização tanto para scale-up quanto scale-down.

## Calibração por microserviço

Em um parque de microserviços, cada serviço tem perfil diferente:
- **API Gateway**: muitas conexões, pouca CPU → escalar por conexões
- **Serviço de processamento**: alta CPU → escalar por CPU
- **Serviço com banco**: limitado pelo banco → escalar CPU não ajuda se o banco é o gargalo

O instrutor enfatiza: "isso vai de aplicação para aplicação". Não existe configuração universal.

## Resultados concretos do teste

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Total de requests | ~9.000 | ~36.000 | ~4x |
| Latência média | ~650ms | 166ms | ~4x menor |
| QPS | ~75 | ~300 | ~4x |

Configuração: 50 conexões, 6000 QPS target, 2 minutos de duração, usando Fortio.

Mesmo com 4x de melhoria, os ~300 QPS estão longe dos 6000 QPS do target. Isso indica que há outros gargalos (capacidade do nó, aplicação em si, rede) que precisariam ser investigados para chegar mais perto do target.