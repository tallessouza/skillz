---
name: rs-full-stack-atualizando-token-automatico
description: "Applies automatic token extraction from session responses in HTTP clients like Insomnia or Postman. Use when user asks to 'configure authentication', 'chain API requests', 'auto update token', 'setup Insomnia environment', or 'avoid copying tokens manually'. Makes token always current by referencing session response dynamically. Make sure to use this skill whenever setting up API testing workflows with authentication. Not for JWT implementation in code, token refresh logic in applications, or backend auth middleware."
---

# Atualizando Token Automático

> Configure o cliente HTTP para extrair o token automaticamente da resposta de sessão, eliminando cópia manual entre requisições.

## Rules

1. **Use referência dinâmica ao token** — `$response.body.attribute` em vez de colar o token manualmente, porque o token muda a cada sessão e cópia manual é propensa a erro
2. **Aponte para a requisição de sessão** — selecione a request `[Sessions] POST` como source, porque é ela que retorna o token atualizado
3. **Filtre pelo atributo correto** — use `$.token` no filter para extrair apenas o campo do token do body, porque a resposta pode conter múltiplos campos
4. **Não inclua caracteres extras no campo** — remova qualquer `$` ou texto residual fora da referência dinâmica, porque o cliente interpreta literalmente e a requisição falha
5. **Sempre execute a sessão antes** — dê Send na request de sessão antes de usar endpoints autenticados, porque a referência dinâmica precisa de uma resposta prévia para resolver o valor

## How to write

### Configuração no Insomnia

```
1. No campo Authorization/Token, apague o valor fixo
2. Digite: $
3. Selecione: Response → Body Attribute
4. Em Request: escolha [Sessions] POST
5. Em Filter: digite $.token
6. Clique Done
```

### Referência dinâmica (formato interno)

```
{% response "body", "req_sessions_post", "$.token" %}
```

## Example

**Before (manual, propenso a erro):**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiY3VzdG9tZXIi...
```
Problema: token expira ou muda e todas as requisições quebram.

**After (automático):**
```
Authorization: Bearer {% response "body", "req_sessions_post", "$.token" %}
```
Token sempre atualizado: basta dar Send na sessão e todas as requisições usam o novo valor.

## Heuristics

| Situação | Faça |
|----------|------|
| Token mudou (ex: role alterado) | Dê Send na sessão primeiro, depois nas outras requests |
| Resposta retorna múltiplos campos | Use `$.campo_desejado` no filter para isolar |
| Referência aparece em vermelho | Normal — indica valor dinâmico não resolvido ainda |
| Request autenticada retorna 401 | Verifique se a sessão foi executada e se o filter está correto |
| Múltiplos ambientes (dev/staging) | Configure a referência uma vez — funciona em qualquer ambiente |

## Anti-patterns

| Nunca faça | Faça isso |
|------------|-----------|
| Copiar token manualmente entre requests | Use `$response.body.attribute` apontando para a sessão |
| Deixar `$` residual junto da referência | Remova qualquer caractere extra fora do placeholder |
| Hardcode do token no header | Referência dinâmica à resposta da sessão |
| Ignorar erro 401 sem checar sessão | Execute a request de sessão antes de testar endpoints |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre chaining de requests e por que token manual é problemático
- [code-examples.md](references/code-examples.md) — Passo a passo visual completo e variações para diferentes clientes HTTP

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-atualizando-token-automatico/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-atualizando-token-automatico/references/code-examples.md)
