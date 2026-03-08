---
name: rs-seguranca-devs-headers-http
description: "Enforces secure HTTP header configuration when setting up web servers, configuring security headers, or reviewing application security. Use when user asks to 'configure headers', 'secure my server', 'set up HSTS', 'hide server info', 'configure referrer policy', or any server/security hardening task. Applies Referrer-Policy, Strict-Transport-Security, and server information hiding rules. Make sure to use this skill whenever configuring web servers or reviewing HTTP response headers. Not for application-level authentication, cookies, sessions, or CORS configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: http-security
  tags: [security]
---

# Headers HTTP de Seguranca

> Ao configurar headers HTTP, minimize a exposicao de informacoes sensiveis e force conexoes seguras.

## Rules

1. **Configure Referrer-Policy em paginas sensiveis** — use `no-referrer` em paginas com tokens na URL (recuperacao de senha, convites), porque o header Referer vaza a URL completa incluindo tokens para sites terceiros
2. **Mantenha strict-origin-when-cross-origin como padrao global** — ja e o padrao dos navegadores: envia URL completa dentro do site, so origin para fora, nada em downgrade HTTPS→HTTP
3. **Ative HSTS com max-age de 1 ano em producao** — header `Strict-Transport-Security: max-age=31536000; preload` impede o navegador de carregar o site sem certificado valido
4. **Implemente HSTS gradualmente** — comece com max-age de 15 minutos, depois 1 semana, depois 1 ano, porque max-age longo com problema de certificado torna o site inacessivel
5. **Inclua preload no HSTS** — o Chrome mantem cache compartilhado de HSTS entre todos os usuarios, protegendo mesmo na primeira visita
6. **Remova headers que expoe informacoes do servidor** — oculte versao do servidor, framework, linguagem e sistema operacional, porque facilita ataques direcionados quando vulnerabilidades sao descobertas
7. **Remova headers de identificacao de tecnologia** — `X-Powered-By`, `X-AspNet-Version`, `Generator` e similares devem ser removidos

## How to configure

### Referrer-Policy

```
# Padrao global (ja e o default dos navegadores)
Referrer-Policy: strict-origin-when-cross-origin

# Paginas sensiveis (reset de senha, paginas com token na URL)
Referrer-Policy: no-referrer
```

### HSTS (Strict-Transport-Security)

```
# Implementacao gradual:
# Fase 1 (teste): 15 minutos
Strict-Transport-Security: max-age=900

# Fase 2 (validacao): 1 semana
Strict-Transport-Security: max-age=604800

# Fase 3 (producao): 1 ano + preload
Strict-Transport-Security: max-age=31536000; preload
```

### Ocultar informacoes do servidor (Apache)

```apache
# Em /etc/apache2/conf-available/security.conf
ServerTokens Prod
```

## Example

**Before (servidor expondo informacoes):**
```
HTTP/1.1 200 OK
Server: Apache/2.4.41 (Ubuntu)
X-Powered-By: Express
X-Generator: WordPress 6.2
```

**After (headers seguros):**
```
HTTP/1.1 200 OK
Server: Apache
Strict-Transport-Security: max-age=31536000; preload
Referrer-Policy: strict-origin-when-cross-origin
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Pagina com token na URL | `Referrer-Policy: no-referrer` |
| Site em producao com HTTPS | HSTS com max-age=31536000 e preload |
| Primeiro deploy de HSTS | max-age=900 (15 min), aumentar gradualmente |
| Qualquer servidor web | Remover versao, framework, OS dos headers |
| CMS (WordPress, etc) | Remover header Generator |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `Referrer-Policy: unsafe-url` | `strict-origin-when-cross-origin` ou `no-referrer` |
| HSTS max-age=31536000 no primeiro dia | Comecar com max-age=900, subir gradualmente |
| `Server: Apache/2.4.41 (Ubuntu)` | `Server: Apache` (ServerTokens Prod) |
| Deixar `X-Powered-By` visivel | Remover o header completamente |
| Ignorar headers de identificacao | Auditar e remover todos os headers informativos |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-mais-alguns-headers-http/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-mais-alguns-headers-http/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
