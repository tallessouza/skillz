---
name: rs-devops-traces
description: "Applies distributed tracing concepts when designing, debugging, or reviewing microservices architectures. Use when user asks to 'debug a slow request', 'trace a request', 'find bottlenecks', 'map dependencies', 'analyze latency', or 'understand blast radius'. Covers trace ID propagation, spans, dependency mapping, and impact analysis. Make sure to use this skill whenever working with distributed systems observability or microservices communication patterns. Not for application-level logging, metrics/dashboards setup, or single-service debugging."
---

# Traces — Rastreio Distribuido

> Em sistemas distribuidos, rastreie o caminho completo da requisicao entre servicos usando trace ID e spans para debug, otimizacao e analise de impacto.

## Rules

1. **Propague o trace ID em toda a cadeia** — quando a requisicao nasce, associe um ID unico que acompanha todo o fluxo A→B→C→D, porque sem ele voce precisa correlacionar logs manualmente entre servicos
2. **Modele cada operacao como um span** — chamada ao banco, chamada a outro servico, processamento interno — cada acao e um span distinto, porque granularidade permite identificar exatamente onde esta a latencia
3. **Identifique chamadas desnecessarias pelo trace** — spans que existem mas nao contribuem para o resultado sao candidatos a eliminacao, porque latencia acumulada de chamadas ociosas degrada performance silenciosamente
4. **Mapeie dependencias a partir dos traces** — construa um mapa de quem chama quem, porque isso revela o blast radius (raio de impacto) quando um servico fica indisponivel
5. **Distinga impacto local de global** — servico B indisponivel e o impacto local, mas todos que chamam B (A, C, D) sao o impacto global, porque decisoes de prioridade dependem do raio de explosao real
6. **Use auto-instrumentacao quando possivel** — prefira bibliotecas que instrumentam automaticamente (OpenTelemetry) a spans manuais, porque reduz erro humano e garante cobertura uniforme

## How to write

### Propagacao de trace ID entre servicos

```typescript
// Ao fazer chamada HTTP entre servicos, propague o trace ID via header
const response = await fetch('http://service-b/api/users', {
  headers: {
    'X-Trace-Id': context.traceId,  // mesmo ID da requisicao original
    'X-Span-Id': span.spanId,        // span pai para hierarquia
  },
});
```

### Criando spans para operacoes

```typescript
// Cada operacao relevante gera um span com inicio, fim e metadados
const span = tracer.startSpan('db.findUser');
const user = await database.users.findOne({ id: userId });
span.setAttributes({ 'db.operation': 'findOne', 'db.collection': 'users' });
span.end();
```

## Example

**Before (debug manual sem trace):**
```
1. Olhar logs do servico A → achar request ID
2. Copiar request ID → buscar nos logs do servico B
3. Repetir para servico C e D
4. Montar timeline manualmente
5. Tentar correlacionar tempos
```

**After (com tracing distribuido):**
```
1. Buscar pelo trace ID na ferramenta (Jaeger/Tempo)
2. Ver hierarquia completa: A → B → C → D
3. Ver duracao de cada span lado a lado
4. Identificar imediatamente: "service B.getUserName = 36ms de 97ms total"
5. Decidir otimizacao com dados concretos
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Requisicao lenta sem causa obvia | Abrir trace, ordenar spans por duracao, focar no mais lento |
| Span existe mas resultado nao e usado | Candidato a eliminacao — chamada desnecessaria |
| Servico critico ficou indisponivel | Consultar mapa de dependencias para calcular blast radius |
| Fluxo sincrono com latencia alta | Avaliar se spans podem ser paralelizados ou tornados assincronos |
| Consistencia eventual aceitavel | Latencia maior em spans assincronos nao e necessariamente problema |
| Planejando refatoracao arquitetural | Usar mapa de dependencias do tracing para identificar acoplamentos |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Debug distribuido via logs manuais | Use trace ID para correlacao automatica |
| Ignorar spans com latencia "aceitavel" | Analise spans acumulados — muitos "aceitaveis" somam latencia relevante |
| Assumir que indisponibilidade e local | Calcule blast radius via mapa de dependencias |
| Instrumentar apenas chamadas externas | Instrumente tambem operacoes de banco e processamento interno |
| Criar spans sem metadados | Adicione operacao, servico, duracao e status em cada span |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
