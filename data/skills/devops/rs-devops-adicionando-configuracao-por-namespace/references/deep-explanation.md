# Deep Explanation: Configuracao mTLS por Namespace

## Por que mTLS na infra e nao na aplicacao

O instrutor enfatiza um principio fundamental: **a aplicacao idealmente nem precisa saber que esta em contexto de mTLS**. Isso significa que a responsabilidade de criptografia mutual fica na camada de infraestrutura (service mesh), nao no codigo.

Sem Istio, implementar mTLS manualmente exige:
- Gerar certificados para cada servico
- Configurar proxy reverso com os certificados
- Implementar validacao na aplicacao para saber "quem esta chamando"
- Gerenciar rotacao de certificados

Com Istio, tudo isso e abstraido em um unico YAML de ~10 linhas.

## Logica do namespace-scoped vs cluster-scoped

O instrutor faz questao de explicar a estrategia incremental:

1. **Comecar por namespace** — aplicar `PeerAuthentication` com `namespace: app` garante que so aquele namespace e afetado
2. **Validar intra-namespace** — chamadas dentro do mesmo namespace continuam funcionando normalmente porque ambos os pods tem sidecar Istio com certificados
3. **Testar inter-namespace** — chamadas de fora (ex: namespace `default` chamando namespace `app`) vao falhar porque o pod externo nao tem certificado mTLS valido
4. **Expandir gradualmente** — so depois de validar, considerar aplicar a nivel de cluster

### O risco de aplicar direto no cluster

O instrutor alerta explicitamente: "Se voce tiver um cluster gigantesco e subir essa estrutura, pode ser que voce tenha grandes problemas." Isso porque:
- Servicos legados sem sidecar Istio perdem conectividade
- Comunicacoes cross-namespace que funcionavam param de funcionar
- Jobs, CronJobs e ferramentas de monitoramento podem quebrar

## Demonstracao pratica: o timeout

Na aula, o instrutor demonstra o fluxo completo:

1. **Sem mTLS**: Pod `fortio` no namespace `default` chama `app-service-mesh.app` → funciona normalmente
2. **Com mTLS STRICT**: Mesma chamada → timeout, nenhum trafego chega ao servico
3. **Remove mTLS**: `kubectl delete` do PeerAuthentication → chamada volta a funcionar

Esse teste empirico prova que o mTLS STRICT realmente bloqueia trafego nao autenticado, e nao e apenas "decorativo".

## Kiali como ferramenta de verificacao

O instrutor usa o Kiali para verificar visualmente:
- Custom Resources → PeerAuthentication criado
- Workload graph → trafego criptografado identificado
- Ausencia de trafego quando mTLS bloqueia chamada externa

## Modos de mTLS no Istio

| Mode | Comportamento |
|------|--------------|
| `STRICT` | Apenas trafego mTLS aceito — rejeita plaintext |
| `PERMISSIVE` | Aceita tanto mTLS quanto plaintext — util para migracao |
| `DISABLE` | Desativa mTLS — nao recomendado |

O instrutor usa STRICT porque o objetivo e seguranca real, nao apenas "ter mTLS configurado".

## Analogia: fechar a porta do namespace

Pense no namespace como uma sala. Sem mTLS, qualquer pessoa entra. Com mTLS STRICT, so entra quem tem o cracha (certificado) correto. O Istio e o seguranca que emite e verifica os crachas automaticamente.