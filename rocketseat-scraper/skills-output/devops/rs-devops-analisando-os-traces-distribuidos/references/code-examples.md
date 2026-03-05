# Code Examples: Traces Distribuídos com OpenTelemetry

## Exemplo 1: Log basico no servico downstream (App 2)

O instrutor adiciona um log simples antes da operacao de busca:

```go
// No handler do App 2
log.Info("buscando usuarios")

// Busca usuarios e retorna
users := getUsers()
// Opcionalmente, logue o resultado:
// log.Info("usuarios encontrados", "count", len(users))
```

**Por que:** Esse log aparece correlacionado com o span no Grafana, facilitando o debug.

## Exemplo 2: Retorno validado entre servicos (App 1)

O instrutor ajusta o App 1 para retornar corretamente o resultado do App 2:

```go
// Antes (problematico — sem validacao)
resp, _ := http.Get(app2URL)
body, _ := io.ReadAll(resp.Body)
// Retorna direto sem validar

// Depois (corrigido)
resp, err := http.Get(app2URL)
if err != nil {
    http.Error(w, "erro ao chamar servico", http.StatusInternalServerError)
    return
}
defer resp.Body.Close()

body, err := io.ReadAll(resp.Body)
if err != nil {
    http.Error(w, "erro ao ler resposta", http.StatusInternalServerError)
    return
}

// Retorna o resultado validado
w.Write(body)
```

**Insight do instrutor:** "O ideal aqui novamente e voce sempre colocar por exemplo um zod ou alguma coisa assim para conseguir validar de fato se o que a API trouxe nao vai quebrar o contrato."

## Exemplo 3: Visualizacao no Grafana Tempo

Ao clicar em um trace no Grafana Tempo, voce ve:

```
[app-rocketseat] ─── 150ms total
  ├── [HTTP GET /users] ─── 120ms
  │     └── [app-rocketseat-2] ─── 100ms
  │           ├── [buscando usuarios] ─── 80ms
  │           └── [db query] ─── 15ms
  └── [serialize response] ─── 5ms
```

Informacoes disponiveis em cada span:
- **Trace ID**: identificador unico do trace completo
- **Span ID**: identificador do span individual
- **Duracao**: tempo do span
- **Servico**: qual aplicacao gerou o span
- **Biblioteca**: OpenTelemetry + versao
- **Atributos**: metadados customizados

## Exemplo 4: Filtragem de spans por servico

No Grafana Tempo, voce pode filtrar spans:

```
// Ver todos os spans
Service Name: *

// Ver so do App 1
Service Name: app-rocketseat

// Ver so do App 2
Service Name: app-rocketseat-2
```

**Insight do instrutor:** "Voce pode ver so os spans que voce quiser, ele vai trazer para voce."

## Exemplo 5: Verificacao do Minio

Para confirmar que os dados estao sendo persistidos:

1. Acesse o console do Minio
2. Navegue ate o bucket de logs/traces
3. Verifique que novos objetos estao sendo criados (organizados por timestamp)
4. O tamanho deve crescer conforme a aplicacao recebe requisicoes

```bash
# Via CLI (alternativa)
mc ls minio/traces-bucket/
mc ls minio/logs-bucket/
```

## Exemplo 6: Instrumentacao completa de um servico Go com OpenTelemetry

```go
package main

import (
    "context"
    "log/slog"
    "net/http"

    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/propagation"
    "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
)

var tracer = otel.Tracer("app-rocketseat-2")

func handleUsers(w http.ResponseWriter, r *http.Request) {
    // Extrai o contexto de trace propagado
    ctx := otel.GetTextMapPropagator().Extract(
        r.Context(),
        propagation.HeaderCarrier(r.Header),
    )

    // Cria span filho dentro do trace existente
    ctx, span := tracer.Start(ctx, "handle-users")
    defer span.End()

    slog.Info("buscando usuarios")

    users := fetchUsersFromDB(ctx)

    slog.Info("usuarios encontrados", "count", len(users))

    // Serializa e retorna
    json.NewEncoder(w).Encode(users)
}

func main() {
    // Inicializa OpenTelemetry (configuracao feita em aulas anteriores)
    initTracer()

    // Handler instrumentado automaticamente
    handler := otelhttp.NewHandler(
        http.HandlerFunc(handleUsers),
        "users-endpoint",
    )

    http.Handle("/users", handler)
    slog.Info("aplicacao subiu", "port", 8081)
    http.ListenAndServe(":8081", nil)
}
```