---
name: rs-seguranca-para
description: "Enforces web application security best practices when implementing authentication flows, protecting against XSS/CSRF/injection attacks, configuring HTTP security headers, managing secrets and credentials, validating user input, or hardening frontend/backend code. Make sure to use this skill whenever building login systems, handling password reset, storing secrets, sanitizing input, configuring CORS/CSP headers, implementing MFA/passkeys, or auditing dependencies for vulnerabilities. Not for network infrastructure, firewall hardware configuration, or non-web security domains."
---

# Seguranca para Devs — Decision Tree Router

> Siga a arvore de decisao para chegar na skill certa. 54 skills organizadas por pergunta natural do desenvolvedor.

## Tracer Bullet — Caminho Rapido

| Preciso de... | Skill |
|---------------|-------|
| Visao geral de seguranca web | [devs-boas-vindas-ao-curso](references/devs-boas-vindas-ao-curso.md) |
| Proteger login/senha | [devs-boas-praticas-para-autenticacao-e-criacao-de-senha](references/devs-boas-praticas-para-autenticacao-e-criacao-de-senha.md) |
| Prevenir XSS no DOM | [devs-alternativas-a-innerhtml](references/devs-alternativas-a-innerhtml.md) |
| Proteger contra CSRF | [devs-cross-site-request-forgery-csrf](references/devs-cross-site-request-forgery-csrf.md) |
| Configurar CORS | [devs-headers-http-para-o-cors](references/devs-headers-http-para-o-cors.md) |
| Validar input | [devs-validacao-de-entrada-e-sanitizacao](references/devs-validacao-de-entrada-e-sanitizacao.md) |
| Gerenciar segredos | [devs-gerenciamento-de-segredos](references/devs-gerenciamento-de-segredos.md) |
| Roadmap de seguranca | [devs-encerramento-do-curso-seguranca](references/devs-encerramento-do-curso-seguranca.md) |

---

## Decision Tree

### Voce esta construindo ou protegendo autenticacao?

#### Login e senhas

- Precisa de boas praticas gerais de auth?
  - [devs-boas-praticas-para-autenticacao-e-criacao-de-senha](references/devs-boas-praticas-para-autenticacao-e-criacao-de-senha.md) — regras para criacao de senha e fluxo de login
- Como armazenar senhas com seguranca (hashing)?
  - [devs-seguranca-no-armazenamento-de-senhas](references/devs-seguranca-no-armazenamento-de-senhas.md) — bcrypt, argon2, salt, nunca plain text
- Precisa migrar auth de sistema legado?
  - [devs-senha-e-autenticacao-em-sistemas-legados](references/devs-senha-e-autenticacao-em-sistemas-legados.md) — migracao incremental de hashes, re-autenticacao
- Por que NAO usar perguntas de seguranca?
  - [devs-algumas-perguntas-de-seguranca](references/devs-algumas-perguntas-de-seguranca.md) — falham em todos os criterios de seguranca

#### Reset de senha

- Como gerar token de reset seguro?
  - [devs-gerando-token-de-reset-de-senha-seguro](references/devs-gerando-token-de-reset-de-senha-seguro.md) — CSPRNG, expiracao, nunca Math.random
- Boas praticas para a pagina de reset?
  - [devs-alguns-conselhos-sobre-a-pagina-de-reset-de-senha](references/devs-alguns-conselhos-sobre-a-pagina-de-reset-de-senha.md) — rate limit, MFA, invalidar sessoes
- Como evitar user enumeration no reset?
  - [devs-sobre-reset-de-senha-e-user-enumeration](references/devs-sobre-reset-de-senha-e-user-enumeration.md) — respostas genericas, timing constante
- Como evitar vazamento de token na pagina?
  - [devs-como-evitar-vazamento-de-token-no-reset-de-senha](references/devs-como-evitar-vazamento-de-token-no-reset-de-senha.md) — Referrer-Policy, zero scripts externos

#### Multi-fator (MFA) e Passkeys

- Como implementar MFA?
  - [devs-seguranca-em-multiplos-fatores-de-autenticacao](references/devs-seguranca-em-multiplos-fatores-de-autenticacao.md) — TOTP, SMS, segundo fator
- Como implementar OTP?
  - [devs-implementando-otp](references/devs-implementando-otp.md) — one-time password, TOTP/HOTP
- Como registrar uma passkey FIDO no navegador?
  - [devs-gerando-passkey-fido](references/devs-gerando-passkey-fido.md) — WebAuthn registration, credential creation
- Como validar passkey FIDO no servidor?
  - [devs-validando-passkey-fido](references/devs-validando-passkey-fido.md) — challenge verification, credential storage
- Como fazer login sem senha com FIDO?
  - [devs-login-sem-senha-com-fido](references/devs-login-sem-senha-com-fido.md) — fluxo de autenticacao passwordless

#### Sessoes e controle de acesso

- Como gerenciar sessoes com seguranca?
  - [devs-sobre-sessoes](references/devs-sobre-sessoes.md) — cookies, session ID, httpOnly, secure
- Conselhos avancados sobre comportamento de sessoes?
  - [devs-alguns-conselhos-sobre-o-comportamento-das-sessoes](references/devs-alguns-conselhos-sobre-o-comportamento-das-sessoes.md) — renovar ID, Cache-Control, timeout
- Precisa proteger contra broken access control?
  - [devs-broken-access-control-em-aplicacoes](references/devs-broken-access-control-em-aplicacoes.md) — IDOR, escalacao de privilegio
- Seguranca no uso de localStorage?
  - [devs-local-storage-html](references/devs-local-storage-html.md) — riscos de XSS, quando usar/evitar

> **Cross-ref:** Para RBAC e permissoes granulares, veja [rs-saa-s](../rs-saa-s/SKILL.md). Para JWT e auth em Node.js, veja [rs-node-js](../rs-node-js/SKILL.md).

---

### Voce esta protegendo o frontend/DOM?

#### XSS e manipulacao de DOM

- Como evitar XSS ao inserir conteudo no DOM?
  - [devs-alternativas-a-innerhtml](references/devs-alternativas-a-innerhtml.md) — textContent, createElement, nunca innerHTML
- O que e DOM clobbering e como prevenir?
  - [devs-dom-clobbering-js](references/devs-dom-clobbering-js.md) — named elements sobrescrevendo variaveis globais

#### Iframes e comunicacao entre janelas

- Como proteger iframes contra clickjacking?
  - [devs-click-jacking-em-iframe](references/devs-click-jacking-em-iframe.md) — X-Frame-Options, frame-ancestors
- Como configurar sandbox em iframes?
  - [devs-iframe-atributo-sandbox](references/devs-iframe-atributo-sandbox.md) — sandbox attribute, permissoes granulares
- Como usar postMessage com seguranca?
  - [devs-web-messaging-api-html](references/devs-web-messaging-api-html.md) — validar origin, especificar targetOrigin
- Como abrir popups sem risco de tab-nabbing?
  - [devs-abra-popups-com-noopener](references/devs-abra-popups-com-noopener.md) — noopener em window.open()

#### CSS como vetor de ataque

- O que e CSS injection/sniffer?
  - [devs-css-sniffer](references/devs-css-sniffer.md) — exfiltracao de dados via CSS
- Como CSS e Tag Manager aumentam superficie de ataque?
  - [devs-css-e-tag-manager-aumentando-a-superficie-de-ataques](references/devs-css-e-tag-manager-aumentando-a-superficie-de-ataques.md) — naming de classes em admin, acesso ao Tag Manager

#### Integridade de recursos externos

- Como verificar integridade de scripts CDN (SRI)?
  - [devs-subresource-integrity-sri](references/devs-subresource-integrity-sri.md) — atributo integrity, crossorigin
- Como calcular o hash para SRI?
  - [devs-processo-de-calculo-de-hash-para-integrity](references/devs-processo-de-calculo-de-hash-para-integrity.md) — SHA-256/384/512, base64

> **Cross-ref:** Para CSP headers, veja a secao HTTP headers abaixo. Para frontend auth com Next.js, veja [rs-next-js](../rs-next-js/SKILL.md).

---

### Voce esta protegendo contra ataques de request forgery ou injection?

#### CSRF (Cross-Site Request Forgery)

- Como proteger contra CSRF no servidor (tokens)?
  - [devs-cross-site-request-forgery-csrf](references/devs-cross-site-request-forgery-csrf.md) — CSRF tokens, SameSite cookies
- Como proteger contra CSRF no client-side (URLs dinamicas)?
  - [devs-cliente-side-request-forgery-csrf](references/devs-cliente-side-request-forgery-csrf.md) — validar form action, whitelist de destinos

#### SSRF (Server-Side Request Forgery)

- Como proteger contra SSRF?
  - [devs-server-side-request-forgery-ssrf](references/devs-server-side-request-forgery-ssrf.md) — whitelist de hosts, bloquear IPs internos

#### Injection

- Como prevenir NoSQL injection?
  - [devs-nosql-injection](references/devs-nosql-injection.md) — sanitizar operadores MongoDB, parametrizar queries
- Como prevenir command injection (OS)?
  - [devs-execucao-de-comandos-do-so-em-aplicacoes](references/devs-execucao-de-comandos-do-so-em-aplicacoes.md) — nunca exec com input do usuario
- O que e prototype pollution e como evitar?
  - [devs-object-prototype-pollution](references/devs-object-prototype-pollution.md) — Object.create(null), validar keys

#### Redirects e open redirects

- Como prevenir open redirects?
  - [devs-unvalidated-redirects-em-backend](references/devs-unvalidated-redirects-em-backend.md) — whitelist, nunca redirecionar com input direto

> **Cross-ref:** Para SQL injection com Prisma/Knex, veja [rs-node-js](../rs-node-js/SKILL.md) e [rs-full-stack](../rs-full-stack/SKILL.md).

---

### Voce esta validando input ou tratando dados?

#### Validacao e sanitizacao

- Como validar entrada de dados?
  - [devs-input-validation-e-falhas](references/devs-input-validation-e-falhas.md) — whitelist vs blacklist, falhas comuns
- Como sanitizar input corretamente?
  - [devs-validacao-de-entrada-e-sanitizacao](references/devs-validacao-de-entrada-e-sanitizacao.md) — bibliotecas, encoding, contexto

#### Serializacao

- Como serializar/validar JSON com seguranca?
  - [devs-json-serializacao-validacao](references/devs-json-serializacao-validacao.md) — schema validation, nunca confiar no payload
- Como evitar insecure deserialization no backend?
  - [devs-serializacao-em-backend](references/devs-serializacao-em-backend.md) — nunca desserializar de fronteira de confianca

> **Cross-ref:** Para validacao com Zod em Node.js, veja [rs-node-js](../rs-node-js/SKILL.md).

---

### Voce esta configurando HTTP headers ou TLS?

- Como configurar CORS?
  - [devs-headers-http-para-o-cors](references/devs-headers-http-para-o-cors.md) — Access-Control-Allow-Origin, preflight
- Como configurar Content-Type headers?
  - [devs-headers-http-para-o-content-type](references/devs-headers-http-para-o-content-type.md) — X-Content-Type-Options, MIME sniffing
- Quais outros security headers usar?
  - [devs-mais-alguns-headers-http](references/devs-mais-alguns-headers-http.md) — CSP, HSTS, X-Frame-Options, Permissions-Policy
- Como configurar TLS com Let's Encrypt?
  - [devs-tls-com-lets-encrypt](references/devs-tls-com-lets-encrypt.md) — HTTPS, certificados, renovacao automatica

> **Cross-ref:** Para CORS em Fastify/Express, veja [rs-node-js](../rs-node-js/SKILL.md) e [rs-full-stack](../rs-full-stack/SKILL.md).

---

### Voce esta gerenciando segredos, dependencias ou infraestrutura?

#### Segredos e credenciais

- Como gerenciar segredos em aplicacoes?
  - [devs-gerenciamento-de-segredos](references/devs-gerenciamento-de-segredos.md) — env vars, vaults, nunca hardcoded
- Como proteger segredos em CI/CD?
  - [devs-ci-com-criptografia-e-segredos](references/devs-ci-com-criptografia-e-segredos.md) — GitHub secrets, SSH keys, least-privilege
- Como configurar SSH com seguranca?
  - [devs-acesso-ssh](references/devs-acesso-ssh.md) — chaves SSH, configuracao segura

#### Dependencias e auditoria

- Como auditar dependencias npm?
  - [devs-seguranca-em-gestao-de-dependencias](references/devs-seguranca-em-gestao-de-dependencias.md) — npm audit, lockfiles, supply chain
- Como listar pacotes antigos/vulneraveis no Node.js?
  - [devs-listando-pacotes-antigos-do-node-js](references/devs-listando-pacotes-antigos-do-node-js.md) — retire.js, scanning automatizado

#### Analise estatica e firewall

- Como usar SAST (analise estatica de seguranca)?
  - [devs-sast](references/devs-sast.md) — ferramentas de analise estatica
- Como configurar WAF (Web Application Firewall)?
  - [devs-web-application-firewall](references/devs-web-application-firewall.md) — regras, rate limiting, protecao de borda

> **Cross-ref:** Para Docker e infra de deploy, veja [rs-devops](../rs-devops/SKILL.md).

---

### Voce esta tratando erros, logs ou modelagem de ameacas?

#### Observabilidade segura

- Como implementar logging seguro?
  - [devs-logging](references/devs-logging.md) — nunca logar segredos/PII, audit trail
- Como fazer error reporting seguro no backend?
  - [devs-error-reporting-em-backend](references/devs-error-reporting-em-backend.md) — nunca expor stack trace, mensagens genericas

#### Modelagem e estrategia

- Como fazer modelagem de ameacas?
  - [devs-modelagem-de-ameacas](references/devs-modelagem-de-ameacas.md) — STRIDE, threat modeling
- Como adotar seguranca incrementalmente?
  - [devs-encerramento-do-curso-seguranca](references/devs-encerramento-do-curso-seguranca.md) — roadmap progressivo, nao esperar perfeicao

#### Visao geral e mindset

- Qual o framework geral de seguranca web?
  - [devs-boas-vindas-ao-curso](references/devs-boas-vindas-ao-curso.md) — 4 pilares: auth/HTTP, frontend, backend, assessment

---

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 4 (Validacao)** — Siga o ramo relevante por tipo de ameaca

## Cross-References — Decision Coverage

Quando este router nao cobre uma decisao, delegue para:

| Decisao | Delegue para | Motivo |
|---------|-------------|--------|
| D0_SOLUTION_TYPE (app web) | [rs-full-stack](../rs-full-stack/SKILL.md) | Contexto de app web |
| D1_RUNTIME (Node.js) | [rs-node-js](../rs-node-js/SKILL.md) | Runtime Node.js |
| D2_AUTH_RBAC (permissoes) | [rs-saa-s](../rs-saa-s/SKILL.md) | RBAC, multi-tenancy |
| D3_DATA_LAYER (ORM/DB) | [rs-node-js](../rs-node-js/SKILL.md) | Prisma, Knex |
| D3_TESTING (testes) | [rs-testes-e](../rs-testes-e/SKILL.md) | Testes automatizados |
| D4_FRONTEND_AUTH (Next.js) | [rs-next-js](../rs-next-js/SKILL.md) | Auth em SSR/App Router |
