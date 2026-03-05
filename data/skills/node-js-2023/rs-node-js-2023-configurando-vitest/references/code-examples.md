# Code Examples: Configurando Vitest

## Instalacao completa

```bash
npm i vitest vite-tsconfig-paths -D
```

Ambas sao dependencias de desenvolvimento (`-D`) porque testes nao vao para producao.

## vite.config.ts completo

```typescript
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
})
```

**Nota:** `tsconfigPaths()` deve ser invocado como funcao dentro do array de plugins. Passar apenas `tsconfigPaths` sem parenteses nao funciona.

## Scripts no package.json

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

### Variacao: com coverage (extensao futura)

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Arquivo de teste de verificacao

```typescript
// src/use-cases/register.spec.ts
import { test, expect } from 'vitest'

test('check if it works', () => {
  expect(2 + 2).toBe(4)
})
```

Este arquivo serve apenas para validar que o ambiente esta configurado corretamente. Deve ser substituido por testes reais ao implementar o caso de uso.

## Executando os testes

```bash
# Execucao unica
npm run test

# Watch mode (observa mudancas)
npm run test:watch
```

## Exemplo de tsconfig.json com paths (contexto)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Sem o plugin `vite-tsconfig-paths`, importacoes como a abaixo falhariam nos testes:

```typescript
import { RegisterUseCase } from '@/use-cases/register'
```

Com o plugin configurado no `vite.config.ts`, o Vitest resolve `@/use-cases/register` para `./src/use-cases/register` automaticamente.