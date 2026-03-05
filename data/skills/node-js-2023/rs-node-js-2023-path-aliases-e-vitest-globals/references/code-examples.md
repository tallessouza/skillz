# Code Examples: Path Aliases e Vitest Globals

## Configuracao completa do tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["vitest/globals"]
  },
  "include": ["src"]
}
```

## Configuracao completa do vite.config.ts

```typescript
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
  },
})
```

## Instalacao da dependencia

```bash
npm install -D vite-tsconfig-paths
```

## Antes da configuracao — arquivo de teste tipico

```typescript
import { expect, test, describe } from 'vitest'
import { Answer } from '../../domain/entities/answer'
import { Question } from '../../domain/entities/question'
import { UniqueEntityID } from '../../../core/entities/unique-entity-id'

describe('Answer', () => {
  test('should create an answer', () => {
    const answer = new Answer({
      content: 'Nova resposta',
      authorId: new UniqueEntityID('1'),
      questionId: new UniqueEntityID('1'),
    })

    expect(answer.content).toBe('Nova resposta')
  })
})
```

## Depois da configuracao — mesmo arquivo

```typescript
import { Answer } from '@/domain/entities/answer'
import { Question } from '@/domain/entities/question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

describe('Answer', () => {
  test('should create an answer', () => {
    const answer = new Answer({
      content: 'Nova resposta',
      authorId: new UniqueEntityID('1'),
      questionId: new UniqueEntityID('1'),
    })

    expect(answer.content).toBe('Nova resposta')
  })
})
```

## Variacao: multiplos aliases

Se o projeto tiver mais de um diretorio raiz:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@test/*": ["./test/*"]
    }
  }
}
```

## Troubleshooting comum

### Erro: "Cannot find module '@/...'"
```bash
# Verificar se o plugin esta instalado
npm ls vite-tsconfig-paths

# Verificar se vite.config.ts tem o plugin
cat vite.config.ts
```

### Erro: "Cannot find name 'describe'" no editor
```json
// Adicionar em tsconfig.json > compilerOptions
{
  "types": ["vitest/globals"]
}
```