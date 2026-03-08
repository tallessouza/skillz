---
name: rs-testes-e-setup-testes
description: "Generates Jest and React Testing Library setup for Next.js projects. Use when user asks to 'setup tests', 'configure Jest', 'add testing to Next.js', 'configure React Testing Library', or 'create test utilities'. Follows Next.js official Jest integration pattern with custom render utility. Make sure to use this skill whenever setting up a testing environment in a Next.js project. Not for end-to-end testing setup (Cypress/Playwright), Vitest configuration, or non-React testing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: unit-testing
  tags: [testing, next-js, react, jest, playwright, e2e, testing-library]
---

# Setup de Testes — Jest + React Testing Library no Next.js

> Configure Jest e React Testing Library seguindo o padrao oficial do Next.js, com utilitario de render customizado.

## Prerequisites

- Projeto Next.js existente
- TypeScript configurado
- Se nao encontrar `next/jest`: verificar versao do Next.js (requer 12+)

## Steps

### Step 1: Instalar dependencias

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

### Step 2: Criar `jest.config.ts` na raiz

```typescript
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config = createJestConfig({
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/e2e/",
  ],
});

export default config;
```

### Step 3: Criar `jest.setup.ts` na raiz

```typescript
import "@testing-library/jest-dom";
```

### Step 4: Adicionar types no `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    // ... existing config
    "types": ["jest", "@testing-library/jest-dom"]
  }
}
```

### Step 5: Criar utilitario `lib/test-utils.tsx`

```typescript
import { render, type RenderOptions } from "@testing-library/react";
import { type ReactElement } from "react";

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, options);
}

export * from "@testing-library/react";
export { customRender as render };
```

### Step 6: Adicionar scripts no `package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Verification

Criar `__tests__/example.spec.tsx`:

```tsx
import { render, screen } from "@/lib/test-utils";

describe("Example", () => {
  it("should pass", () => {
    render(<div>test</div>);
    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
```

Rodar `npm test` — deve passar.

## Error handling

- Se `Cannot find module 'next/jest'`: atualizar Next.js para 12+
- Se types do Jest nao reconhecidos: verificar `tsconfig.json` inclui `@types/jest`
- Se `testEnvironment` falha: confirmar instalacao de `jest-environment-jsdom`

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto usa App Router ou Pages Router | Mesma configuracao, `next/jest` abstrai |
| Precisa de Provider global (Theme, Auth) | Adicionar `wrapper` no `customRender` |
| Testes e2e no mesmo projeto | Ignorar pasta `e2e/` no `testPathIgnorePatterns` |
| Jest < 30 | Considerar atualizar — v30+ significativamente mais rapido |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
