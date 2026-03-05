# Code Examples: Setup de Testes no Next.js

## Exemplo completo do `jest.config.ts`

```typescript
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Caminho para o diretorio raiz do Next.js
  dir: "./",
});

const config = createJestConfig({
  // Arquivo de setup que roda depois do environment
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Environment que simula o DOM no Node.js
  testEnvironment: "jest-environment-jsdom",

  // Pastas ignoradas pelo Jest
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/e2e/",
  ],
});

export default config;
```

## `jest.setup.ts` completo

```typescript
import "@testing-library/jest-dom";
```

Este import estende o `expect` global com matchers como:
- `toBeInTheDocument()`
- `toHaveTextContent()`
- `toBeVisible()`
- `toHaveAttribute()`

## `lib/test-utils.tsx` completo

```typescript
import { render, type RenderOptions } from "@testing-library/react";
import { type ReactElement } from "react";

// Render customizado para centralizar Providers
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, options);
}

// Re-exporta tudo de testing-library
export * from "@testing-library/react";

// Sobrescreve o render padrao com o customizado
export { customRender as render };
```

### Evolucao: adicionando Providers

Quando o projeto crescer, o `test-utils.tsx` evolui assim:

```typescript
import { render, type RenderOptions } from "@testing-library/react";
import { type ReactElement } from "react";
import { ThemeProvider } from "@/providers/theme";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function AllProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from "@testing-library/react";
export { customRender as render };
```

## Teste de verificacao do setup

```tsx
import { render, screen } from "@/lib/test-utils";

describe("Example", () => {
  it("should pass", () => {
    render(<div>test</div>);
    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
```

## Scripts do `package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

- `test`: roda todos os testes uma vez
- `test:watch`: modo interativo, re-roda ao salvar arquivos
- `test:coverage`: gera relatorio de cobertura

## Adicionando types no `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "types": ["jest", "@testing-library/jest-dom"]
  }
}
```

Sem isso, o TypeScript nao reconhece `describe`, `it`, `expect`, nem os matchers customizados do jest-dom.

## Dependencias instaladas e suas funcoes

| Pacote | Funcao |
|--------|--------|
| `jest` | Framework de testes (runner, assertions, mocks) |
| `@testing-library/react` | Renderizar componentes React para teste |
| `@testing-library/jest-dom` | Matchers customizados para DOM |
| `@testing-library/user-event` | Simular interacoes do usuario (click, type, etc) |
| `jest-environment-jsdom` | Simular DOM no Node.js |
| `@types/jest` | Types TypeScript para Jest |