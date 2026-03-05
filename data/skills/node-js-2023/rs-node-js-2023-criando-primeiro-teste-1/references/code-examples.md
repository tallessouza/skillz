# Code Examples: Criando Primeiro Teste com Vitest

## 1. Instalacao

```bash
# Instalar Vitest como dependencia de desenvolvimento
npm install vitest -D
```

## 2. Estrutura de pastas

```
project/
├── src/
│   └── ... (codigo da aplicacao)
├── test/
│   └── example.spec.ts    # primeiro teste
├── package.json
└── tsconfig.json
```

## 3. Primeiro teste (do transcript)

```typescript
// test/example.spec.ts
import { test, expect } from 'vitest'

test('usuario consegue criar uma nova transacao', async () => {
  // Operacao (hardcoded por enquanto — chamada HTTP vem na proxima aula)
  const responseStatusCode = 201

  // Validacao
  expect(responseStatusCode).toEqual(201)
})
```

## 4. Demonstracao de falha

O instrutor muda o valor para mostrar que a validacao funciona:

```typescript
import { test, expect } from 'vitest'

test('usuario consegue criar uma nova transacao', async () => {
  const responseStatusCode = 500 // simulando erro do servidor

  // Este expect FALHA — Vitest mostra:
  // "expected 500 to equal 201"
  expect(responseStatusCode).toEqual(201)
})
```

## 5. Script no package.json

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "test": "vitest"
  }
}
```

Agora pode rodar com:

```bash
npm test
# ou
npm run test
```

## 6. Execucao

```bash
# Roda em watch mode (padrao)
npx vitest

# Roda uma vez e sai
npx vitest run

# Via script do package.json
npm test
```

## 7. Variacao: teste mais realista (proxima evolucao)

```typescript
import { test, expect } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'

test('usuario consegue criar uma nova transacao', async () => {
  // Operacao — chamada HTTP real
  const response = await request(app.server)
    .post('/transactions')
    .send({
      title: 'Salario',
      amount: 5000,
      type: 'credit',
    })

  // Validacao
  expect(response.statusCode).toEqual(201)
})
```

## 8. Anatomia do teste — modelo mental

```typescript
import { test, expect } from 'vitest'

test(
  'descricao do comportamento esperado',  // 1. ENUNCIADO
  async () => {
    // 2. OPERACAO — executa a acao
    const result = await algumaOperacao()

    // 3. VALIDACAO — verifica o resultado
    expect(result).toEqual(valorEsperado)
  }
)
```