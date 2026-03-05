---
name: rs-seguranca-devs-error-reporting
description: "Enforces secure error reporting practices in backend applications. Use when user asks to 'handle errors', 'configure error pages', 'setup production environment', 'deploy application', or 'create API error responses'. Ensures stack traces, file paths, and framework versions are never exposed to end users. Make sure to use this skill whenever configuring error handling, deploying to production, or building API error responses. Not for application logic errors, input validation, or authentication flows."
---

# Error Reporting Seguro em Backend

> Em producao, erros tecnicos vao para o log, nunca para a tela do usuario ou resposta da API.

## Rules

1. **Nunca exponha stack traces em producao** — desabilite display de erros detalhados, porque stack traces revelam caminhos de arquivos, nomes de funcoes e estrutura interna da aplicacao para atacantes
2. **Nunca exponha versoes de framework/runtime** — oculte versao do Rails, PHP, Ruby, Node, etc., porque atacantes usam versoes para buscar vulnerabilidades conhecidas (CVEs)
3. **Nunca retorne detalhes tecnicos em APIs** — responda com mensagem generica e status HTTP apropriado, porque detalhes tecnicos sao inuteis para o consumidor e valiosos para o atacante
4. **Sempre registre erros completos no log** — stack trace, contexto da requisicao e timestamp devem ir para logs internos, porque o desenvolvedor precisa dessas informacoes para debugar
5. **Sempre rode producao em modo de producao** — cada framework tem seu mecanismo (Rails: `-e production`, PHP: `display_errors=Off`, Django: `DEBUG=False`), porque o modo desenvolvimento expoe tudo por design
6. **Sempre teste o comportamento de erro em producao** — suba uma pagina que causa erro proposital e verifique que nada vaza, porque configuracao errada e silenciosa

## How to write

### Resposta de erro em API (qualquer linguagem)

```typescript
// CORRETO: mensagem generica para o cliente, detalhes no log
app.use((err, req, res, next) => {
  logger.error('Request failed', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  })

  res.status(500).json({
    error: 'Internal server error',
  })
})
```

### Configuracao PHP para producao

```ini
; php.ini — producao
error_reporting = 0
display_errors = Off
log_errors = On
error_log = /var/log/php/error.log
```

### Configuracao Rails para producao

```bash
# Suba o servidor em modo producao
rails server -e production
```

### Configuracao Django para producao

```python
# settings/production.py
DEBUG = False
ALLOWED_HOSTS = ['meusite.com']
LOGGING = {
    'handlers': {
        'file': {
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/error.log',
        },
    },
}
```

## Example

**Before (vazamento de informacao):**
```typescript
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack,
    file: err.fileName,
    line: err.lineNumber,
  })
})
```

**After (com esta skill aplicada):**
```typescript
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err, path: req.path })

  res.status(500).json({
    error: 'Internal server error',
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Configurando deploy de producao | Verifique que modo de producao esta ativo e teste com erro proposital |
| Criando middleware de erro em API | Retorne apenas `{ error: "Internal server error" }`, logue o resto |
| Revisando codigo existente | Busque por `err.stack`, `err.message`, `traceback` nas respostas HTTP |
| Time de infra separado | Converse com eles para confirmar que logs estao sendo salvos e erros nao vazam |
| Qualquer framework novo | Descubra como desabilitar debug mode antes de deployar |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `res.json({ stack: err.stack })` | `logger.error(err); res.json({ error: 'Internal server error' })` |
| `display_errors = On` em producao | `display_errors = Off` + `log_errors = On` |
| `DEBUG = True` em producao | `DEBUG = False` + logging configurado |
| Confiar que "ninguem vai ver" | Testar com erro proposital apos deploy |
| Retornar detalhes de erro na API para "ajudar o frontend" | Usar codigos de erro internos e documentacao separada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
