# Code Examples: Polyfills e Fakes em Testes

## 1. Jest Setup com Polyfills Completo

Configuracao usada na aula para resolver o `ReferenceError: TextEncoder is not defined`:

```typescript
// jest.setup.ts
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { webcrypto } from "crypto";

// Polyfills para APIs que o Next.js usa internamente
// mas que nao estao disponiveis no jsdom
// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;
// @ts-ignore
global.crypto = webcrypto;
```

**Nota:** O `@ts-ignore` e aceitavel aqui porque e configuracao de teste, nao codigo de producao.

## 2. Fake Repository (da aula)

```typescript
// Interface que define o contrato
interface PromptRepository {
  search(query: string): Promise<Prompt[]>;
  findAll(): Promise<Prompt[]>;
}

// Fake para testes — implementacao simplificada
class FakePromptRepository implements PromptRepository {
  private prompts: Prompt[] = [];

  async search(query: string): Promise<Prompt[]> {
    return this.prompts.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  async findAll(): Promise<Prompt[]> {
    return this.prompts;
  }

  // Metodo auxiliar para setup do teste
  seed(prompts: Prompt[]) {
    this.prompts = prompts;
  }
}
```

## 3. Use Case com Inversao de Dependencia

```typescript
// O use case depende da INTERFACE, nao da implementacao
class SearchPromptUseCase {
  constructor(private repository: PromptRepository) {}

  async execute(query: string): Promise<Prompt[]> {
    return this.repository.search(query);
  }
}

// No teste:
it("should search prompts by query", async () => {
  const repository = new FakePromptRepository();
  repository.seed([
    { id: "1", title: "Hello World", content: "..." },
    { id: "2", title: "Goodbye", content: "..." },
  ]);

  const useCase = new SearchPromptUseCase(repository);
  const result = await useCase.execute("Hello");

  expect(result).toHaveLength(1);
  expect(result[0].title).toBe("Hello World");
});
```

## 4. Fake para Cenario de Erro

```typescript
// Fake que sempre falha — para testar tratamento de erro
class FailingPromptRepository implements PromptRepository {
  async search(): Promise<Prompt[]> {
    throw new Error("Database connection failed");
  }

  async findAll(): Promise<Prompt[]> {
    throw new Error("Database connection failed");
  }
}

// No teste:
it("should handle repository errors", async () => {
  const repository = new FailingPromptRepository();
  const useCase = new SearchPromptUseCase(repository);

  await expect(useCase.execute("query")).rejects.toThrow(
    "Database connection failed"
  );
});
```

## 5. Gateway Pattern com Adapters

```typescript
// Interface gateway
interface ApiGateway {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: unknown): Promise<T>;
}

// Adapter real com Axios
class AxiosApiGateway implements ApiGateway {
  async get<T>(url: string): Promise<T> {
    const { data } = await axios.get(url);
    return data;
  }

  async post<T>(url: string, body: unknown): Promise<T> {
    const { data } = await axios.post(url, body);
    return data;
  }
}

// Adapter real com Fetch
class FetchApiGateway implements ApiGateway {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);
    return response.json();
  }

  async post<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return response.json();
  }
}

// Fake para testes
class FakeApiGateway implements ApiGateway {
  private responses: Map<string, unknown> = new Map();

  // Setup: define o que cada URL retorna
  willReturn(url: string, data: unknown) {
    this.responses.set(url, data);
  }

  async get<T>(url: string): Promise<T> {
    const data = this.responses.get(url);
    if (!data) throw new Error(`No fake response for GET ${url}`);
    return data as T;
  }

  async post<T>(url: string): Promise<T> {
    const data = this.responses.get(url);
    if (!data) throw new Error(`No fake response for POST ${url}`);
    return data as T;
  }
}
```

## 6. Exemplo Historico de Polyfill (citado na aula)

Polyfill de `sessionStorage` para IE7 (exemplo da MDN citado pelo instrutor):

```javascript
// Checa se a API existe no ambiente
if (typeof localStorage === "undefined" || typeof sessionStorage === "undefined") {
  // Implementacao simplificada que supre a necessidade
  // sem quebrar o codigo que depende dessas APIs
  window.sessionStorage = {
    getItem(key) { /* implementacao simples */ },
    setItem(key, value) { /* implementacao simples */ },
    removeItem(key) { /* implementacao simples */ },
  };
}
```

**Principio:** o mesmo raciocinio se aplica ao Jest — o jsdom nao tem `TextEncoder`, entao voce fornece uma implementacao (nesse caso, a do proprio Node.js via `util`).