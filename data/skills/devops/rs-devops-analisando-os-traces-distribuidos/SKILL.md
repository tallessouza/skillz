---
name: rs-devops-traces-distribuidos
description: "Applies distributed tracing analysis patterns when working with OpenTelemetry, Grafana Tempo, or multi-service architectures. Use when user asks to 'debug latency', 'trace requests across services', 'instrument application', 'analyze spans', or 'set up distributed tracing'. Ensures proper span correlation, log placement, and trace visualization. Make sure to use this skill whenever implementing observability in microservices. Not for metrics collection, alerting rules, or dashboard creation."
---

# Traces Distribuídos com OpenTelemetry

> Instrumente cada servico na cadeia para que o trace ID se propague end-to-end — sem instrumentacao, voce so ve o retorno externo, nunca o que aconteceu dentro.

## Rules

1. **Instrumente todos os servicos na cadeia** — cada servico precisa do SDK OpenTelemetry configurado, porque sem instrumentacao voce so ve a chamada externa, nao os spans internos
2. **Propague o Trace ID entre servicos** — o Trace ID nasce no servico de entrada e deve ser propagado via headers para cada servico downstream, porque isso permite correlacionar spans em ferramentas como Grafana Tempo
3. **Coloque logs estrategicos nos pontos de entrada** — use `log.info("buscando usuarios")` antes de operacoes significativas, porque isso conecta logs aos spans e facilita debug
4. **Valide o retorno entre servicos** — deserialize e valide o retorno da API antes de propagar, porque contratos quebrados entre servicos sao dificeis de debugar sem validacao explicita
5. **Use spans para identificar gargalos de latencia** — quebre o tempo por span para ver exatamente qual servico ou operacao esta lenta, porque o trace mostra a cadeia completa com duracao de cada etapa
6. **Verifique o armazenamento de dados** — confirme que logs e traces estao sendo persistidos no backend (Minio/S3/etc), porque dados nao persistidos significam perda de observabilidade

## How to write

### Log estrategico em servico

```go
// Antes de operacoes significativas, logue com contexto
log.Info("buscando usuarios")
users, err := fetchUsers(ctx)
if err != nil {
    log.Error("erro ao buscar usuarios", "error", err)
    return err
}
```

### Validacao de retorno entre servicos

```go
// Valide o contrato antes de propagar — evita quebras silenciosas
resp, err := http.Get(serviceURL + "/users")
if err != nil {
    return fmt.Errorf("falha ao chamar servico: %w", err)
}
defer resp.Body.Close()

// Deserialize e valide campos criticos
var users []User
if err := json.NewDecoder(resp.Body).Decode(&users); err != nil {
    return fmt.Errorf("contrato quebrado no retorno: %w", err)
}
```

## Example

**Before (sem observabilidade entre servicos):**
```go
// App 1 — chama app 2 sem contexto
resp, _ := http.Get("http://app2/users")
body, _ := io.ReadAll(resp.Body)
fmt.Fprintf(w, string(body))
```

**After (com tracing e logs instrumentados):**
```go
// App 1 — propaga trace context
ctx, span := tracer.Start(r.Context(), "fetch-users-from-app2")
defer span.End()

req, _ := http.NewRequestWithContext(ctx, "GET", "http://app2/users", nil)
otel.GetTextMapPropagator().Inject(ctx, propagation.HeaderCarrier(req.Header))

resp, err := http.DefaultClient.Do(req)
if err != nil {
    span.RecordError(err)
    span.SetStatus(codes.Error, "falha ao chamar app2")
    return
}

// App 2 — extrai contexto e loga
func handleUsers(w http.ResponseWriter, r *http.Request) {
    ctx := otel.GetTextMapPropagator().Extract(r.Context(), propagation.HeaderCarrier(r.Header))
    _, span := tracer.Start(ctx, "get-users")
    defer span.End()

    log.Info("buscando usuarios")
    // ... busca e retorna
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Servico externo nao instrumentado | Aceite que so vera o span da chamada HTTP, nao os internos |
| Latencia alta detectada | Abra o trace no Tempo, identifique o span mais lento pela duracao |
| Logs nao aparecem no Grafana | Verifique se o backend (Minio/Loki) esta recebendo dados |
| Muitos spans poluindo a visualizacao | Use filtros por servico — ex: "so spans do app-skillz" |
| Chamada entre servicos falha silenciosamente | Adicione log antes e depois da chamada com status code |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Chamar servico sem propagar context | Injete trace context nos headers da requisicao |
| Logar apenas no servico de entrada | Logue em cada servico da cadeia |
| Ignorar o status code do retorno | Deserialize e valide o retorno antes de usar |
| Criar spans sem nome descritivo | Use nomes como `fetch-users-from-app2`, nao `span1` |
| Assumir que tracing funciona sem testar | Verifique no Grafana Tempo se os spans aparecem correlacionados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
