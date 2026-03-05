---
name: rs-seguranca-para
description: "Enforces web application security best practices when implementing authentication flows, protecting against XSS/CSRF/injection attacks, configuring HTTP security headers, managing secrets and credentials, validating user input, or hardening frontend/backend code. Make sure to use this skill whenever building login systems, handling password reset, storing secrets, sanitizing input, configuring CORS/CSP headers, implementing MFA/passkeys, or auditing dependencies for vulnerabilities. Not for network infrastructure, firewall hardware configuration, or non-web security domains."
---

# Segurança para Devs — Decision Tree Router

> Siga a árvore de decisão para chegar na skill certa. 54 skills organizadas em 7 domínios.

## Decision Tree

```
O que você está protegendo?
│
├─ Autenticação / senhas?
│  ├─ Boas práticas auth → [devs-boas-praticas-para-autenticacao-e-criacao-de-senha.md](references/devs-boas-praticas-para-autenticacao-e-criacao-de-senha.md)
│  ├─ Armazenamento de senhas → [devs-seguranca-no-armazenamento-de-senhas.md](references/devs-seguranca-no-armazenamento-de-senhas.md)
│  ├─ Reset de senha seguro → [devs-sobre-reset-de-senha-e-user-enumeration.md](references/devs-sobre-reset-de-senha-e-user-enumeration.md)
│  ├─ MFA → [devs-seguranca-em-multiplos-fatores-de-autenticacao.md](references/devs-seguranca-em-multiplos-fatores-de-autenticacao.md)
│  ├─ OTP → [devs-implementando-otp.md](references/devs-implementando-otp.md)
│  └─ Passkeys FIDO → [devs-gerando-passkey-fido.md](references/devs-gerando-passkey-fido.md)
│
├─ Sessões / controle de acesso?
│  ├─ Sessões seguras → [devs-sobre-sessoes.md](references/devs-sobre-sessoes.md)
│  ├─ Broken access control → [devs-broken-access-control-em-aplicacoes.md](references/devs-broken-access-control-em-aplicacoes.md)
│  └─ Local storage → [devs-local-storage-html.md](references/devs-local-storage-html.md)
│
├─ Injection / request forgery?
│  ├─ CSRF → [devs-cross-site-request-forgery-csrf.md](references/devs-cross-site-request-forgery-csrf.md)
│  ├─ SSRF → [devs-server-side-request-forgery-ssrf.md](references/devs-server-side-request-forgery-ssrf.md)
│  ├─ NoSQL injection → [devs-nosql-injection.md](references/devs-nosql-injection.md)
│  ├─ Command injection → [devs-execucao-de-comandos-do-so-em-aplicacoes.md](references/devs-execucao-de-comandos-do-so-em-aplicacoes.md)
│  ├─ Prototype pollution → [devs-object-prototype-pollution.md](references/devs-object-prototype-pollution.md)
│  └─ Open redirects → [devs-unvalidated-redirects-em-backend.md](references/devs-unvalidated-redirects-em-backend.md)
│
├─ Frontend / DOM?
│  ├─ innerHTML alternativas → [devs-alternativas-a-innerhtml.md](references/devs-alternativas-a-innerhtml.md)
│  ├─ Clickjacking → [devs-click-jacking-em-iframe.md](references/devs-click-jacking-em-iframe.md)
│  ├─ CSS injection → [devs-css-sniffer.md](references/devs-css-sniffer.md)
│  ├─ DOM clobbering → [devs-dom-clobbering-js.md](references/devs-dom-clobbering-js.md)
│  ├─ Iframe sandbox → [devs-iframe-atributo-sandbox.md](references/devs-iframe-atributo-sandbox.md)
│  └─ SRI → [devs-subresource-integrity-sri.md](references/devs-subresource-integrity-sri.md)
│
├─ HTTP headers / CORS / TLS?
│  ├─ CORS → [devs-headers-http-para-o-cors.md](references/devs-headers-http-para-o-cors.md)
│  ├─ Content-Type headers → [devs-headers-http-para-o-content-type.md](references/devs-headers-http-para-o-content-type.md)
│  ├─ Security headers → [devs-mais-alguns-headers-http.md](references/devs-mais-alguns-headers-http.md)
│  └─ TLS / Let's Encrypt → [devs-tls-com-lets-encrypt.md](references/devs-tls-com-lets-encrypt.md)
│
├─ Validação de input / serialização?
│  ├─ Input validation → [devs-input-validation-e-falhas.md](references/devs-input-validation-e-falhas.md)
│  ├─ Sanitização → [devs-validacao-de-entrada-e-sanitizacao.md](references/devs-validacao-de-entrada-e-sanitizacao.md)
│  ├─ JSON serialização → [devs-json-serializacao-validacao.md](references/devs-json-serializacao-validacao.md)
│  └─ Error reporting → [devs-error-reporting-em-backend.md](references/devs-error-reporting-em-backend.md)
│
└─ Secrets / deps / tooling?
   ├─ Gerenciamento de segredos → [devs-gerenciamento-de-segredos.md](references/devs-gerenciamento-de-segredos.md)
   ├─ Auditoria de deps → [devs-seguranca-em-gestao-de-dependencias.md](references/devs-seguranca-em-gestao-de-dependencias.md)
   ├─ SAST → [devs-sast.md](references/devs-sast.md)
   ├─ WAF → [devs-web-application-firewall.md](references/devs-web-application-firewall.md)
   ├─ Threat modeling → [devs-modelagem-de-ameacas.md](references/devs-modelagem-de-ameacas.md)
   └─ SSH seguro → [devs-acesso-ssh.md](references/devs-acesso-ssh.md)
```

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 4 (Validação)** → Siga o ramo relevante por tipo de ameaça
