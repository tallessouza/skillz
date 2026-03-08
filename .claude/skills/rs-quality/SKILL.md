---
name: rs-quality
description: "Guides software quality decisions across testing strategy, clean code practices, security hardening, and CI/CD pipelines. Use when user asks to 'add tests', 'improve code quality', 'set up CI', 'harden security', 'refactor for testability', 'configure linting', or any quality-related development task. Walks through decisions: what to test, how to test, which tool to use, what quality standard to enforce, and how to automate quality gates. Make sure to use this skill whenever making quality decisions across any stack (frontend, backend, full-stack). Not for feature implementation logic, UI design, or DevOps infrastructure beyond CI/CD testing pipelines."
---

# Quality — Fluxo de Decisoes

> Qualidade nao e uma fase — e uma decisao em cada linha de codigo.
> Este router e CROSS-CUTTING — referencia skills de multiplos routers por dominio.

> **Caminho rapido para API Node.js:**
> Vitest + In-Memory Repos → TDD Red-Green-Refactor → E2E com Supertest → CI GitHub Actions
> [vitest-setup](../rs-node-js/references/2023-configurando-vitest.md) → [primeiro-teste](../rs-node-js/references/2023-primeiro-teste-unitario.md) → [e2e-registro](../rs-node-js/references/2023-teste-e-2-e-do-registro.md) → [ci-unit](../rs-node-js/references/2023-executando-testes-unitarios-no-ci.md)

> **Caminho rapido para Frontend Next.js:**
> Jest + RTL → Testes de componente → Playwright E2E → CI pipeline
> [jest-setup](../rs-testes-e/references/setup-testes.md) → [primeiro-teste](../rs-testes-e/references/criando-o-primeiro-teste-da-sidebar-content.md) → [playwright-setup](../rs-testes-e/references/configurando-o-playwright.md) → [ci](../rs-testes-e/references/criando-pipeline-de-ci.md)

> **Caminho rapido para seguranca:**
> Input validation → Auth segura → Headers HTTP → SAST
> [input-validation](../rs-seguranca-para/references/devs-input-validation-e-falhas.md) → [auth](../rs-seguranca-para/references/devs-boas-praticas-para-autenticacao-e-criacao-de-senha.md) → [headers](../rs-seguranca-para/references/devs-headers-http-para-o-cors.md) → [sast](../rs-seguranca-para/references/devs-sast.md)

---

## Qual decisao de qualidade estou tomando?

### Preciso adicionar testes
Siga para: [Que tipo de teste preciso?](#que-tipo-de-teste-preciso)

### Preciso melhorar a qualidade do codigo
Siga para: [Que aspecto do codigo quero melhorar?](#que-aspecto-do-codigo-quero-melhorar)

### Preciso proteger contra vulnerabilidades
Siga para: [Que tipo de ameaca estou enfrentando?](#que-tipo-de-ameaca-estou-enfrentando)

### Preciso automatizar qualidade (CI/CD)
Siga para: [Que etapa do pipeline preciso configurar?](#que-etapa-do-pipeline-preciso-configurar)

---

## Que tipo de teste preciso?

### Estou testando backend (Node.js)?

#### Como configuro o ambiente de testes?
- [vitest-setup](../rs-node-js/references/2023-configurando-vitest.md) — Configurando Vitest
- [vitest-swc](../rs-node-js/references/2023-configurando-vitest-com-swc.md) — Vitest com SWC
- [vitest-ui](../rs-node-js/references/2023-utilizando-ui-do-vitest.md) — Interface visual
- [entendendo-testes](../rs-node-js/references/2023-entendo-testes-automatizados.md) — Conceitos fundamentais

#### Como escrevo meu primeiro teste (TDD)?
- [primeiro-teste](../rs-node-js/references/2023-primeiro-teste-unitario.md) — Primeiro teste unitario
- [criando-teste](../rs-node-js/references/2023-criando-primeiro-teste-1.md) — Passo a passo
- [tdd-mocking](../rs-node-js/references/2023-tdd-and-mocking.md) — TDD com mocking

#### Como isolo dependencias nos testes?
- [in-memory-db](../rs-node-js/references/2023-in-memory-databases.md) — Repositorios in-memory
- [factories](../rs-node-js/references/2023-factories-de-testes.md) — Factories de dados
- [banco-isolado](../rs-node-js/references/2023-banco-de-dados-isolado-nos-testes.md) — Banco isolado

#### Como organizo e refatoro testes?
- [categorizando](../rs-node-js/references/2023-categorizando-os-testes.md) — Agrupando por dominio
- [refatorando-instancias](../rs-node-js/references/2023-refatorando-instancias-nos-testes.md) — Eliminando duplicacao
- [refatorando-unitarios](../rs-node-js/references/2023-refatorando-os-testes-unitarios.md) — Refatoracao

#### Que features especificas preciso testar?
- [testes-auth](../rs-node-js/references/2023-testes-do-cadastro-e-autenticacao.md) — Cadastro e auth
- [testes-rbac](../rs-node-js/references/2023-testes-de-rbac.md) — RBAC
- [testes-erros](../rs-node-js/references/2023-testando-classes-de-erro.md) — Classes de erro
- [testes-eventos](../rs-node-js/references/2023-testando-eventos-de-dominio.md) — Domain events
- [testes-upload](../rs-node-js/references/2023-testando-caso-de-uso-de-upload.md) — Upload
- [testes-cache](../rs-node-js/references/2023-testando-persistencia-em-cache.md) — Cache
- [coverage](../rs-node-js/references/2023-gerando-coverage-de-testes.md) — Coverage report

### Estou testando frontend (React/Next.js)?

#### Como configuro Jest + RTL?
- [jest-rtl-setup](../rs-testes-e/references/setup-testes.md) — Setup Jest e RTL
- [jest-intro](../rs-full-stack/references/conhecendo-o-jest.md) — Conhecendo o Jest
- [teste-qualidade](../rs-testes-e/references/teste-e-qualidade.md) — Teste e qualidade

#### Como testo componentes React?
- [primeiro-componente](../rs-testes-e/references/criando-o-primeiro-teste-da-sidebar-content.md) — Primeiro teste
- [comportamentos](../rs-testes-e/references/testando-comportamentos-da-sidebar-content.md) — Toggle, collapse
- [formularios](../rs-testes-e/references/testando-o-prompt-form.md) — Formularios
- [listas-cards](../rs-testes-e/references/testando-prompt-list-e-prompt-card.md) — Listas e cards
- [responsividade](../rs-testes-e/references/criando-testes-unitarios-para-responsividade.md) — Responsividade
- [matchers](../rs-testes-e/references/diferencas-entre-matchers-do-jest.md) — toBeVisible vs toBeInTheDocument

#### Como testo use cases e server actions?
- [use-case](../rs-testes-e/references/testando-o-use-case.md) — Use cases com fakes/spies
- [server-action](../rs-testes-e/references/testando-a-server-action.md) — Server Actions
- [create-use-case](../rs-testes-e/references/testando-create-prompt-use-case.md) — Create use case
- [prisma-repo](../rs-testes-e/references/criando-os-testes-do-prisma-prompt-repository.md) — Prisma repository

### Preciso de testes E2E?

#### Qual ferramenta E2E usar?

| Criterio | Playwright | Cypress |
|----------|-----------|---------|
| Multi-browser | Sim (Chromium, Firefox, WebKit) | Limitado |
| Paralelismo | Nativo | Pago (Dashboard) |
| Escolher quando | Projeto novo, multi-browser, Next.js 14+ | Time ja usa, DX prioritaria |

#### Playwright (frontend)?
- [intro](../rs-testes-e/references/introducao-playwright.md) — Introducao
- [config](../rs-testes-e/references/configurando-o-playwright.md) — Configuracao
- [primeiro-e2e](../rs-testes-e/references/criando-o-primeiro-teste-e-2-e.md) — Primeiro teste
- [criacao](../rs-testes-e/references/criando-teste-e-2-e-para-criacao-de-prompt.md) — Fluxo de criacao
- [delecao](../rs-testes-e/references/criando-o-teste-e-2-e-de-delecao.md) — Fluxo de delecao
- [busca](../rs-testes-e/references/teste-e-2-e-para-busca-de-prompt.md) — Fluxo de busca
- [tdd-e2e](../rs-testes-e/references/tdd-com-testes-e-2-e.md) — TDD com E2E

#### Cypress (frontend)?
- [cypress-setup](../rs-next-js/references/app-router-e-testes-setup-do-cypress-e-2-e.md) — Setup Cypress
- [cypress-carrinho](../rs-next-js/references/app-router-e-testes-testando-o-carrinho.md) — Testando carrinho
- [cypress-ci](../rs-next-js/references/app-router-e-testes-workflow-de-ci-com-cypress.md) — CI com Cypress

#### Supertest/Vitest (backend API)?
- [e2e-registro](../rs-node-js/references/2023-teste-e-2-e-do-registro.md) — Registro
- [e2e-auth](../rs-node-js/references/2023-teste-e-2-e-da-autenticacao.md) — Autenticacao
- [e2e-perfil](../rs-node-js/references/2023-teste-e-2-e-do-perfil.md) — Perfil
- [e2e-factories](../rs-node-js/references/2023-utilizando-factories-nos-testes-e-2-e.md) — Factories
- [e2e-test-env](../rs-node-js/references/2023-criando-test-environment-2024.md) — Test environment
- [e2e-banco](../rs-node-js/references/2023-configurando-banco-de-testes.md) — Banco isolado

### Preciso de testes de integracao?
- [test-env](../rs-node-js/references/2023-aprendendo-sobre-test-environment.md) — Conceito
- [test-env-2024](../rs-node-js/references/2023-criando-test-environment-2024.md) — Criando test env
- [docker-prisma](../rs-testes-e/references/setup-docker-docker-compose-e-prisma.md) — Docker + Prisma

### Vitest ou Jest?

| Criterio | Vitest | Jest |
|----------|--------|------|
| Backend Node.js | Recomendado | OK |
| ESM nativo | Sim | Config extra |
| Performance | Mais rapido (Vite) | Mais lento |
| Escolher quando | Backend, projetos novos | Frontend Next.js, existentes |

---

## Que aspecto do codigo quero melhorar?

### Como nomear variaveis e funcoes?
- [nomenclatura](../rs-clean-code/references/nomenclatura-de-variaveis-download-exercicio.md) — Nomeando corretamente
- [causa-efeito](../rs-clean-code/references/causa-vs-efeito.md) — Booleanos: causa vs efeito
- [codigo-ingles](../rs-clean-code/references/codigo-em-ingles.md) — Codigo em ingles
- [numeros-magicos](../rs-clean-code/references/numeros-magicos.md) — Eliminando magic numbers
- [comentarios](../rs-clean-code/references/comentarios-vs-documentacao.md) — Comentarios vs documentacao

### Como escrever funcoes e condicionais?
- [condicionais](../rs-clean-code/references/regras-em-condicionais.md) — Early return, sem else
- [parametros](../rs-clean-code/references/parametros-e-desestruturacao.md) — Desestruturacao
- [syntatic-sugars](../rs-clean-code/references/evite-syntatic-sugars.md) — Evite !!, +, ''

### Como estruturar componentes React?
- [puros](../rs-clean-code/references/componentes-puros.md) — Componentes puros
- [composicao](../rs-clean-code/references/composicao-vs-customizacao.md) — Composicao vs customizacao
- [condicionais-render](../rs-clean-code/references/condicionais-no-render.md) — Condicionais no render
- [desacoplando](../rs-clean-code/references/desacoplando-componentes.md) — Desacoplando componentes
- [funcoes-eventos](../rs-clean-code/references/funcoes-e-eventos-no-react.md) — Funcoes e eventos

### Como aplicar SOLID e DDD?
- [solid-principios](../rs-clean-code/references/principios-de-solid.md) — Os 5 principios
- [solid-pratico](../rs-clean-code/references/exemplo-pratico-de-solid.md) — Exemplo pratico
- [ddd-principios](../rs-clean-code/references/principios-de-ddd.md) — Principios DDD
- [ddd-pratico](../rs-clean-code/references/exemplo-pratico-de-ddd.md) — Exemplo pratico
- [ddd-solid](../rs-clean-code/references/unindo-ddd-ao-solid.md) — Conectando DDD com SOLID
> Tambem usado em: [rs-node-js](../rs-node-js/SKILL.md) (entidades, use cases, repositorios)

### Como lidar com erros?
- [functional-error](../rs-node-js/references/2023-functional-error-handling.md) — Either pattern
- [problemas-error](../rs-node-js/references/2023-problemas-com-error-handling.md) — Problemas comuns
- [app-error](../rs-full-stack/references/app-error-1.md) — AppError customizado
- [error-reporting](../rs-seguranca-para/references/devs-error-reporting-em-backend.md) — Reporting seguro

### Como configurar linting?
- [eslint-prettier](../rs-testes-e/references/eslint-prettier-e-lefthook.md) — ESLint + Prettier + Lefthook
> Tambem usado em: [Pipeline CI/CD](#que-etapa-do-pipeline-preciso-configurar)

### Como estruturar frontend para testabilidade?
- [arquitetura-sw](../rs-testes-e/references/arquitetura-de-software.md) — Arquitetura testavel
- [rsc-vs-client](../rs-testes-e/references/react-client-components-vs-react-server-components.md) — RSC vs Client
- [separando-regras](../rs-testes-e/references/separando-as-regras-de-negocio.md) — Regras de negocio

---

## Que tipo de ameaca estou enfrentando?

### Como proteger autenticacao e senhas?
- [auth-praticas](../rs-seguranca-para/references/devs-boas-praticas-para-autenticacao-e-criacao-de-senha.md) — Boas praticas
- [armazenamento](../rs-seguranca-para/references/devs-seguranca-no-armazenamento-de-senhas.md) — Armazenamento seguro
- [reset-senha](../rs-seguranca-para/references/devs-sobre-reset-de-senha-e-user-enumeration.md) — Reset + user enumeration
- [vazamento-token](../rs-seguranca-para/references/devs-como-evitar-vazamento-de-token-no-reset-de-senha.md) — Vazamento de token

### Preciso de MFA/Passkeys?
- [mfa](../rs-seguranca-para/references/devs-seguranca-em-multiplos-fatores-de-autenticacao.md) — MFA seguro
- [otp](../rs-seguranca-para/references/devs-implementando-otp.md) — Implementando OTP
- [passkey](../rs-seguranca-para/references/devs-gerando-passkey-fido.md) — Passkeys FIDO
- [passwordless](../rs-seguranca-para/references/devs-login-sem-senha-com-fido.md) — Login sem senha

### Como proteger contra injection?
- [nosql](../rs-seguranca-para/references/devs-nosql-injection.md) — NoSQL injection
- [command](../rs-seguranca-para/references/devs-execucao-de-comandos-do-so-em-aplicacoes.md) — OS command injection
- [prototype](../rs-seguranca-para/references/devs-object-prototype-pollution.md) — Prototype pollution

### Como proteger contra CSRF/SSRF?
- [csrf](../rs-seguranca-para/references/devs-cross-site-request-forgery-csrf.md) — CSRF
- [ssrf](../rs-seguranca-para/references/devs-server-side-request-forgery-ssrf.md) — SSRF
- [redirects](../rs-seguranca-para/references/devs-unvalidated-redirects-em-backend.md) — Redirects nao validados

### Como proteger o frontend (XSS/DOM)?
- [innerhtml](../rs-seguranca-para/references/devs-alternativas-a-innerhtml.md) — Alternativas a innerHTML
- [clickjacking](../rs-seguranca-para/references/devs-click-jacking-em-iframe.md) — Clickjacking
- [dom-clobbering](../rs-seguranca-para/references/devs-dom-clobbering-js.md) — DOM clobbering
- [sri](../rs-seguranca-para/references/devs-subresource-integrity-sri.md) — Subresource Integrity

### Como validar input?
- [input-validation](../rs-seguranca-para/references/devs-input-validation-e-falhas.md) — Validacao e falhas
- [sanitizacao](../rs-seguranca-para/references/devs-validacao-de-entrada-e-sanitizacao.md) — Sanitizacao
- [json](../rs-seguranca-para/references/devs-json-serializacao-validacao.md) — JSON validation

### Como configurar headers HTTP e TLS?
- [cors](../rs-seguranca-para/references/devs-headers-http-para-o-cors.md) — Headers CORS
- [content-type](../rs-seguranca-para/references/devs-headers-http-para-o-content-type.md) — Content-Type
- [mais-headers](../rs-seguranca-para/references/devs-mais-alguns-headers-http.md) — Mais headers
- [tls](../rs-seguranca-para/references/devs-tls-com-lets-encrypt.md) — TLS Let's Encrypt

### Como gerenciar secrets e dependencias?
- [segredos](../rs-seguranca-para/references/devs-gerenciamento-de-segredos.md) — Gerenciamento
- [dependencias](../rs-seguranca-para/references/devs-seguranca-em-gestao-de-dependencias.md) — Dependencias
- [sast](../rs-seguranca-para/references/devs-sast.md) — SAST
- [waf](../rs-seguranca-para/references/devs-web-application-firewall.md) — WAF
- [logging](../rs-seguranca-para/references/devs-logging.md) — Logging seguro
> Tambem usado em: [Pipeline CI/CD](#que-etapa-do-pipeline-preciso-configurar)

---

## Que etapa do pipeline preciso configurar?

### Como rodar testes no CI?
- [ci-unit-backend](../rs-node-js/references/2023-executando-testes-unitarios-no-ci.md) — CI unitarios (Node.js)
- [ci-e2e-backend](../rs-node-js/references/2023-executando-testes-e-2-e-no-ci.md) — CI E2E (Node.js)
- [ci-pipeline-frontend](../rs-testes-e/references/criando-pipeline-de-ci.md) — CI pipeline (frontend)
- [ci-cypress](../rs-next-js/references/app-router-e-testes-workflow-de-ci-com-cypress.md) — CI Cypress
- [o-que-e-ci](../rs-testes-e/references/o-que-e-ci.md) — O que e CI

### Como garantir qualidade antes do commit?
- [eslint-prettier-lefthook](../rs-testes-e/references/eslint-prettier-e-lefthook.md) — Pre-commit hooks
> Tambem usado em: [Linting](#como-configurar-linting)

### Como integrar seguranca no pipeline?
- [ci-segredos](../rs-seguranca-para/references/devs-ci-com-criptografia-e-segredos.md) — CI com criptografia
- [sast](../rs-seguranca-para/references/devs-sast.md) — SAST no pipeline
> Tambem usado em: [Secrets e dependencias](#como-gerenciar-secrets-e-dependencias)

---

## Decisoes transversais

### Como estruturar codigo para testabilidade?
- [separando-regras](../rs-testes-e/references/separando-as-regras-de-negocio.md) — Separar regras de negocio
- [solid](../rs-clean-code/references/principios-de-solid.md) — SOLID para testabilidade
- [in-memory](../rs-node-js/references/2023-in-memory-databases.md) — Repos in-memory
> Cross-reference: [rs-clean-code](../rs-clean-code/SKILL.md) (SOLID + DDD)

### Como garantir qualidade completa antes do deploy?
- [eslint-prettier-lefthook](../rs-testes-e/references/eslint-prettier-e-lefthook.md) — Pre-commit
- [ci-pipeline](../rs-testes-e/references/criando-pipeline-de-ci.md) — CI pipeline
- [sast](../rs-seguranca-para/references/devs-sast.md) — SAST
> Cross-reference: [rs-devops](../rs-devops/SKILL.md) (CI/CD pipelines completos)

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 4 (Validacao)** → Siga o ramo de testes relevante por stack
- **Qualquer fase** → Consulte clean code para naming e condicionais

## Cross-References — Decision Coverage

| Decisao | Delegue para | Motivo |
|---------|-------------|--------|
| D1_RUNTIME (Node.js profundo) | [rs-node-js](../rs-node-js/SKILL.md) | Streams, Fastify, NestJS |
| D1_FRAMEWORK_WEB (Next.js) | [rs-next-js](../rs-next-js/SKILL.md) | App Router, SSR |
| D3_DEPLOY (Docker/K8s) | [rs-devops](../rs-devops/SKILL.md) | Infra, CI/CD profundo |
| D3_STATE (Redux/Zustand) | [rs-redux-zustand](../rs-redux-zustand/SKILL.md) | State management |
