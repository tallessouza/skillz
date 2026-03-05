# Deep Explanation: Monitoramento de Vulnerabilidades em Dependencias

## Por que duas fontes?

O instrutor apresenta duas ferramentas complementares para monitoramento de vulnerabilidades:

1. **Snyk (snyk.io)** — Ferramenta especializada que o instrutor descreve como "sensacional". Oferece scanning automatizado, integracao com CI/CD, e base de dados propria de vulnerabilidades. O instrutor menciona que conheceu recentemente, indicando que e uma ferramenta em ascensao no ecossistema.

2. **GitHub Advisory Database (github.com/advisories)** — Base de dados oficial do GitHub que cataloga vulnerabilidades conhecidas. Mostra versoes afetadas e versoes corrigidas de forma clara e estruturada.

## Caso real: React Server Components RCE

O instrutor demonstra um caso concreto de vulnerabilidade critica — Remote Code Execution (RCE) nos pacotes React Server Components:

- **Pacotes afetados:** `react-server-dom-parcel`, `react-server-dom-webpack`, `server.turbopack`, `server.webpack`
- **Tipo:** Remote Code Execution / Arbitrary Code Injection
- **Severidade:** Critica
- **Descoberta:** ~28 dias antes da aula

O ponto chave e que o GitHub Advisory Database mostra claramente:
- Quais versoes estao afetadas
- Quais versoes contem a correcao
- Detalhes tecnicos da vulnerabilidade

## Contexto do modulo completo

Esta aula fecha um modulo denso sobre testes e arquitetura no frontend. O instrutor recapitula os conceitos cobertos:

- **Testes automatizados** — a base de codigo confiavel
- **Piramide de testes** — unit > integration > e2e
- **Test doubles** — mocks, stubs, spies
- **Principios SOLID** — com enfase no Dependency Inversion Principle (o "D")
- **Arquitetura** — separacao de concerns, inversao de dependencia

## A frase-chave do instrutor

> "Codigo sem teste e basicamente uma promessa e a gente nao vive de promessas."

Esta analogia resume a filosofia do modulo inteiro: testes transformam intencoes em garantias verificaveis. Sem testes, voce esta confiando que o codigo funciona — com testes, voce tem evidencia.

## Automacao no pipeline

O instrutor menciona brevemente que e possivel automatizar a verificacao de vulnerabilidades no pipeline de CI/CD. Isso significa que alem de verificar manualmente nos sites, voce pode configurar ferramentas como `npm audit` ou `snyk test` para rodar automaticamente em cada push/PR, bloqueando merges quando vulnerabilidades criticas sao detectadas.