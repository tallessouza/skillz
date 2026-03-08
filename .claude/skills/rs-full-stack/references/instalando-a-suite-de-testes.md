---
name: rs-full-stack-instalando-a-suite-de-testes
description: "Applies Jest and Supertest installation workflow when setting up a test suite for Node.js APIs. Use when user asks to 'install tests', 'setup jest', 'add testing', 'configure test suite', or 'install supertest'. Covers exact package versions, TypeScript typings, and dev dependency flags for a complete testing toolkit. Make sure to use this skill whenever bootstrapping automated tests in a Node.js/Express project. Not for writing test cases, test configuration files, or React component testing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: testing-setup
  tags: [jest, supertest, testing, typescript, nodejs]
---

# Instalando a Suite de Testes

> Instale Jest, ts-jest e Supertest com versões específicas e tipagens como dependências de desenvolvimento antes de escrever qualquer teste.

## Prerequisites

- Node.js com npm instalado
- Projeto Node.js/TypeScript já inicializado com `package.json`
- Aplicação não precisa estar rodando durante a instalação

## Steps

### Step 1: Instalar Jest e tipagens TypeScript

```bash
npm i jest@29.7.0 @types/jest@29.5.13 ts-jest@29.2.5 -D
```

Três pacotes em um comando:
- `jest` — framework de testes
- `@types/jest` — tipagens TypeScript para Jest
- `ts-jest` — transformer que permite Jest executar TypeScript

### Step 2: Instalar Supertest e tipagens

```bash
npm i supertest@7.0.0 @types/supertest@6.0.2 -D
```

Dois pacotes:
- `supertest` — testa endpoints HTTP sem subir o servidor
- `@types/supertest` — tipagens TypeScript para Supertest

### Step 3: Verificar instalação no package.json

Confirme que `devDependencies` contém todos os pacotes:

```json
{
  "devDependencies": {
    "@types/jest": "^29.5.13",
    "@types/supertest": "^6.0.2",
    "jest": "^29.7.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5"
  }
}
```

## Output format

Após a instalação, o `package.json` deve listar todos os 5 pacotes em `devDependencies`. Nenhum deve aparecer em `dependencies` — testes são exclusivamente dependências de desenvolvimento.

## Error handling

- Se `npm i` falhar com conflito de versão, verifique se não há versões incompatíveis já instaladas com `npm ls jest`
- Se tipagens não resolverem no editor, reinicie o TypeScript Language Server

## Verification

```bash
# Confirmar que todos os pacotes estão instalados
npm ls jest @types/jest ts-jest supertest @types/supertest
```

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto novo sem testes | Executar Steps 1 e 2 completos |
| Já tem Jest, falta Supertest | Executar apenas Step 2 |
| Precisa testar API HTTP | Supertest é necessário |
| Projeto sem TypeScript | Omitir `@types/*` e `ts-jest` |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Instalar jest em `dependencies` | Usar flag `-D` para `devDependencies` |
| Omitir `@types/jest` em projeto TS | Instalar tipagens junto com o pacote |
| Instalar sem versão específica | Fixar versões para reprodutibilidade |
| Rodar a aplicação durante setup de testes | Focar apenas na instalação, sem executar o servidor |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Conflito de versao ao instalar Jest | Versoes incompativeis ja instaladas | Verificar com `npm ls jest` e remover conflitos |
| Tipagens nao resolvem no editor | TypeScript Language Server desatualizado | Reiniciar TS Server no VS Code (Cmd+Shift+P > Restart TS Server) |
| `supertest` nao encontra a aplicacao | App nao exportada corretamente | Exportar a instancia do Express/app separada do `listen()` |
| Erro "Cannot find module ts-jest" | ts-jest nao instalado como devDependency | Executar `npm i ts-jest -D` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio sobre escolha de versões, papel de cada pacote e relação entre Jest/ts-jest/Supertest
- [code-examples.md](references/code-examples.md) — Comandos completos, variações de instalação e verificação do package.json