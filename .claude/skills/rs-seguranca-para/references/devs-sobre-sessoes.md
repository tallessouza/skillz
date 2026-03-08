---
name: rs-seguranca-devs-sobre-sessoes
description: "Enforces secure session management practices when building server-side multi-page applications. Use when user asks to 'implement sessions', 'configure cookies', 'setup authentication with sessions', 'secure session handling', or works with PHP/Laravel/Django/Rails session code. Applies rules: use framework sessions, rename default cookie, enforce httpOnly/secure/strict flags, validate session entropy. Make sure to use this skill whenever generating session-related code or configuring session cookies. Not for JWT authentication, SPA token management, or client-side storage."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: session-management
  tags: [security, sessions, cookies]
---

# Gerenciamento Seguro de Sessoes

> Sessoes no servidor devem usar mecanismos prontos do framework, com cookies configurados como httpOnly, secure, strict, e com entropia suficiente no ID.

## Rules

1. **Use sessoes do framework, nunca implemente do zero** — `session_start()` no PHP, `request.session` no Django, `session()` no Laravel, porque comunidades investem anos tornando isso seguro e voce nao vai replicar esse trabalho
2. **Renomeie o cookie de sessao** — troque `PHPSESSID` para `SESSIONID` ou nome generico, porque o nome padrao vaza informacao sobre a plataforma para atacantes
3. **Sete httpOnly no cookie de sessao** — porque impede JavaScript de ler o cookie, mitigando ataques de script injection que roubam sessoes
4. **Sete secure no cookie de sessao** — porque garante que o cookie so trafega via HTTPS, impedindo interceptacao em redes inseguras
5. **Use SameSite strict ou lax, nunca none** — `strict` impede envio cross-origin total, `lax` permite navegacao por link; `none` permite fetch cross-origin logado, o que e perigoso
6. **Habilite strict mode para sessoes** — porque sem strict mode, um atacante pode injetar um session ID conhecido via script injection e depois assumir a sessao do usuario quando ele se logar
7. **Garanta entropia alta no session ID** — um ID de 32 bits leva ~7 minutos para brute force com 1000 req/s e 10k usuarios; 64 bits leva 585 anos. Use CSPRNG do framework

## How to write

### Configuracao de cookie de sessao (PHP)

```php
// php.ini — configuracoes seguras de sessao
session.name = SESSIONID          // nao vaza plataforma
session.cookie_httponly = 1        // bloqueia acesso via JavaScript
session.cookie_secure = 1          // apenas HTTPS
session.cookie_samesite = Strict   // sem envio cross-origin
session.use_strict_mode = 1        // rejeita session IDs desconhecidos
```

### Cookie seguro em codigo

```php
// Ao setar cookies de sessao manualmente
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'domain'   => 'exemplo.com',
    'secure'   => true,
    'httponly'  => true,
    'samesite' => 'Strict',
]);
session_start();
```

## Example

**Before (inseguro):**
```php
// php.ini padrao — vaza plataforma, permite script injection
session.name = PHPSESSID
session.cookie_httponly = 0
session.cookie_secure = 0
session.use_strict_mode = 0
```

**After (com esta skill aplicada):**
```php
session.name = SESSIONID
session.cookie_httponly = 1
session.cookie_secure = 1
session.cookie_samesite = Strict
session.use_strict_mode = 1
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App multi-page com MVC (Laravel, Django, Rails) | Use sessoes do framework, configure os 5 flags de seguranca |
| SPA com API (React, Vue, Angular) | Nao use sessoes servidor — use JWT em cookie httpOnly secure |
| Ambiente local sem HTTPS | Deixe secure=0 em dev, mas garanta secure=1 em producao |
| Banco ou app financeiro | Use SameSite=Strict obrigatoriamente |
| App comum com links externos | SameSite=Lax e aceitavel |
| Cookie de sessao com nome padrao da plataforma | Renomeie para nome generico como SESSIONID |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Implementar mecanismo de sessao proprio | Usar sessao do framework (PHP, Laravel, Django) |
| `session.name = PHPSESSID` | `session.name = SESSIONID` |
| Cookie sem httpOnly | Sempre setar httpOnly=true |
| Cookie sem secure em producao | Sempre setar secure=true em producao |
| `SameSite=None` sem motivo forte | `SameSite=Strict` ou `SameSite=Lax` |
| `use_strict_mode = 0` | `use_strict_mode = 1` |
| Session ID com baixa entropia | Usar CSPRNG do framework com ID longo |
| Guardar sessoes sem proteger o servidor | Proteger diretorio de sessoes no servidor |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-sobre-sessoes/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-sobre-sessoes/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
