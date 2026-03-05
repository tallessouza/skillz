---
name: rs-testes-arquitetura-fe-polyfill-testes
description: "Applies polyfill configuration and dependency inversion patterns when fixing test environments in Next.js/Jest. Use when user encounters 'ReferenceError: TextEncoder is not defined', 'test failing after importing server action', 'jest setup polyfill', or asks about 'fakes vs mocks'. Enforces fake-first testing over excessive mocking and interface-based dependency inversion for testable components. Make sure to use this skill whenever configuring Jest for Next.js or discussing test double strategies. Not for unit test writing, React component testing logic, or production polyfill bundling."
---

# Corrigindo Testes com Polyfill e Inversao de Dependencias

> Configure polyfills no Jest setup para APIs do Node/Browser ausentes no ambiente de teste, e prefira fakes com inversao de dependencia em vez de mocks excessivos.

## Rules

1. **Polyfill no Jest setup, nao no teste** — configure `TextEncoder`, `TextDecoder`, `crypto` no `jest.setup.ts` global, porque sao dependencias de infraestrutura que o Next.js usa internamente ao importar server actions
2. **Fakes antes de mocks** — crie objetos simplificados que implementam a interface real, porque mocks programam comportamento artificial e afastam o teste da realidade
3. **Inverta dependencias com interfaces** — componentes e use cases recebem interfaces via props/construtor, nunca importam Axios/Fetch diretamente, porque isso permite substituir por fakes nos testes
4. **Mock somente quando inevitavel** — use mock apenas quando nao ha como criar um fake viavel, e minimize a quantidade, porque testes com muitos mocks testam a configuracao do mock, nao o comportamento real
5. **Fakes sao test doubles completos** — um fake implementa metodos reais de forma simplificada (incluindo cenarios de erro com throw), porque isso da controle total sem acoplar ao framework de mock

## How to write

### Jest setup com polyfills

```typescript
// jest.setup.ts
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { webcrypto } from "crypto";

// @ts-ignore - polyfill para ambiente de teste
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;
// @ts-ignore
global.crypto = webcrypto;
```

### Fake implementando interface

```typescript
// Interface que o use case depende
interface PromptRepository {
  search(query: string): Promise<Prompt[]>;
}

// Fake para testes — objeto simplificado com controle total
const fakePromptRepository: PromptRepository = {
  search: async (query: string) => {
    return [{ id: "1", title: "Test", content: query }];
  },
};

// Fake com cenario de erro
const failingRepository: PromptRepository = {
  search: async () => {
    throw new Error("Connection failed");
  },
};
```

### Gateway pattern com inversao de dependencia

```typescript
// Interface (abstracao)
interface HttpGateway {
  get<T>(url: string): Promise<T>;
}

// Implementacao real (baixo nivel)
class AxiosGateway implements HttpGateway {
  async get<T>(url: string): Promise<T> {
    const response = await axios.get(url);
    return response.data;
  }
}

// Implementacao fake para testes
class FakeHttpGateway implements HttpGateway {
  async get<T>(): Promise<T> {
    return { users: [] } as T;
  }
}
```

## Example

**Before (teste quebrando):**
```typescript
// Componente importa server action diretamente
import { searchPromptAction } from "@/actions/search-prompt";
// Jest: ReferenceError: TextEncoder is not defined
```

**After (polyfill resolve):**
```typescript
// jest.setup.ts adiciona polyfill
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// Todos os testes passam sem mocar a server action
```

## Heuristics

| Situacao | Faca |
|----------|------|
| ReferenceError de API global no Jest | Adicione polyfill no jest.setup.ts |
| Componente faz chamada HTTP direta | Crie interface gateway + inverta dependencia |
| Precisa testar cenario de erro de API | Use fake com throw, nao mock complexo |
| Muitos mocks no teste | Refatore para interfaces + fakes |
| API do Node ausente no jsdom | Polyfill global, nao mock por teste |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `jest.mock("util")` para TextEncoder | Polyfill global no jest.setup.ts |
| `import axios from "axios"` direto no componente | Receba `HttpGateway` via props/DI |
| Mock com `jest.fn().mockResolvedValue(...)` para tudo | Fake que implementa a interface |
| Polyfill dentro de cada arquivo de teste | Polyfill unico no jest.setup.ts |
| `jest.spyOn(axios, "get")` | Fake gateway com controle total |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-corrigindo-os-testes-com-polyfill/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-corrigindo-os-testes-com-polyfill/references/code-examples.md)
