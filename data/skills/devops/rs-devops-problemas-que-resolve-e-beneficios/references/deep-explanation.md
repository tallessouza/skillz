# Deep Explanation: Service Mesh — Problemas que Resolve

## Por que não resolver resiliência no código?

O instrutor destaca que é perfeitamente possível implementar circuit breaker, retry e timeout no código — existem libs para isso. O problema surge quando você escala para muitos microserviços. Cada serviço precisa da mesma lógica, gerando:

1. **Duplicação de código** — mesma lógica de retry em 20 serviços
2. **Manutenibilidade degradada** — mudar uma política de timeout significa alterar N repositórios
3. **Controle manual** — o instrutor cita o exemplo real de circuit breaker controlado por env var: alguém precisa ir lá manualmente desligar um fluxo quando há problema

## A analogia do Blast Radius

O instrutor traz o conceito de "raio de explosão" (blast radius) da observabilidade: um problema **local** no serviço C pode causar impacto **global** na rede. O circuit breaker é a contenção desse raio — o serviço B para de chamar C e retém eventos para retentar depois, em vez de propagar a falha cascaticamente.

## Circuit Breaker em detalhe

Três estados:
- **Fechado** — tudo normal, requisições passam
- **Aberto** — detectou falhas recorrentes (ex: 5 respostas 5xx consecutivas), bloqueia chamadas
- **Half-open** — após período de cooldown, tenta algumas requisições; se OK, fecha; se falha, reabre

O ponto-chave: na camada de Service Mesh, a **aplicação não sabe** que existe um circuit breaker. A infra intercepta e controla. Isso é fundamentalmente diferente de ter a lib no código onde o serviço precisa implementar a lógica.

## Observabilidade ampliada

O Service Mesh cria a "malha de serviços" e, por natureza, tem visibilidade de toda a comunicação. Isso permite integração direta com:
- **Prometheus** — métricas automáticas de tráfego entre serviços
- **Grafana** — dashboards da malha
- **Jaeger** — tracing distribuído (mencionado como algo a explorar)

## Deploy Strategies — Bônus, não razão principal

O instrutor é explícito: existem **ferramentas específicas** para estratégias de deploy. O Service Mesh **também** oferece essa capacidade, mas não é a razão principal para adotá-lo. Se você já usa Service Mesh para resiliência, aproveite para Canary/Blue-Green. Se não, considere ferramentas dedicadas.

Comparação com Kubernetes puro:
- **Kubernetes padrão** oferece rolling update (cadência: remove réplicas antigas, sobe novas)
- **Service Mesh** amplia para Blue-Green, Canary, A/B testing

## mTLS — O aviso contra over-engineering

O instrutor faz um alerta direto: usar Service Mesh **somente** para mTLS é over-engineering. O mTLS é um benefício que "já vem no plano" quando você adota Service Mesh por outras razões. Mas se segurança é sua única necessidade, existem soluções mais simples e com menos overhead operacional.

## Gerenciamento de tráfego adicional

Além de deploy strategies, o Service Mesh oferece:
- Roteamento inteligente (baseado em headers, peso, etc.)
- Balanceamento de carga avançado (além do round-robin do Kubernetes)
- Controle de complexidades de comunicação entre serviços

## Quando Service Mesh faz sentido (síntese do instrutor)

O combinado é: Service Mesh se justifica quando você precisa de **múltiplas capacidades** simultaneamente. A soma de resiliência + observabilidade + controle de tráfego + segurança é o que justifica o overhead de operar um mesh. Qualquer uma isoladamente provavelmente tem uma solução mais simples.