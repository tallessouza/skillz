# Deep Explanation: Conhecendo o Jest

## Por que Jest?

Jest e a ferramenta mais utilizada no mercado para testes automatizados em JavaScript/TypeScript. Criada pelo Facebook (Meta), ela se tornou o padrao de facto por varios motivos:

### Tudo-em-um

Diferente de outras ferramentas que precisam de combinacoes (Mocha + Chai + Sinon + Istanbul), Jest inclui:
- **Test runner** — executa os testes
- **Assertion library** — `expect().toBe()` built-in
- **Mocking** — `jest.fn()`, `jest.mock()` built-in
- **Coverage** — `--coverage` flag built-in
- **Watch mode** — `--watch` reroda apenas testes afetados

### Zero config para a maioria dos casos

Jest funciona out-of-the-box para projetos JavaScript. Para TypeScript, o unico passo extra e adicionar `ts-jest` como preset.

## A transicao de testes manuais para automatizados

O instrutor enfatiza que a partir deste ponto, os testes serao automatizados. Isso significa:

1. **Antes:** verificar manualmente no terminal se funcoes retornam o esperado
2. **Depois:** escrever assertions que o Jest verifica automaticamente

A vantagem e que testes automatizados:
- Rodam em segundos (mesmo centenas de testes)
- Nao dependem de atencao humana para verificar resultados
- Podem ser integrados no CI/CD
- Documentam o comportamento esperado do codigo

## Site oficial

O Jest tem documentacao oficial em [jestjs.io](https://jestjs.io). A documentacao cobre:
- Getting Started (instalacao e primeiro teste)
- API Reference (expect, describe, it, jest.fn, etc.)
- Configuration (jest.config.js completo)
- CLI Options (flags disponiveis)

## Quando NAO usar Jest

- **Projetos Vite/Vitest** — Vitest e mais rapido e compativel com a API do Jest
- **Projetos Deno** — Deno tem test runner built-in
- **Projetos Bun** — Bun tem test runner built-in compativel com Jest

Para projetos Node.js tradicionais e projetos React (Create React App, Next.js), Jest continua sendo a escolha padrao.