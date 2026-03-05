# Code Examples: Executando Teste Específico

## Exemplo 1: Criacao do arquivo de teste (exatamente como na aula)

```typescript
// src/sum.test.ts
test('example', () => {
  console.log('teste ok!')
})
```

**Saida esperada:**
```
PASS  src/sum.test.ts
  ✓ example
  
  console.log
    teste ok!

Tests:       1 passed, 1 total
```

## Exemplo 2: Instalacao do ts-node

```bash
# Comando exato usado na aula
npm i ts-node@10.9.2 -D
```

**Resultado no package.json:**
```json
{
  "devDependencies": {
    "ts-node": "^10.9.2"
  }
}
```

## Exemplo 3: Execucao do teste especifico

```bash
# Formato: npx jest <caminho-do-arquivo>
npx jest src/sum.test.ts

# Alternativas validas:
npx jest ./src/sum.test.ts
```

## Exemplo 4: Erro sem ts-node instalado

```bash
npx jest src/sum.test.ts
# Error: Jest: 'ts-node' is required for the TypeScript configuration
```

**Solucao:** Instalar ts-node como devDependency (ver Exemplo 2).

## Variacoes: Nomenclatura de arquivos de teste

```
# Usando .test (escolha do instrutor)
sum.test.ts
user.test.ts
calculator.test.ts

# Usando .spec (alternativa valida)
sum.spec.ts
user.spec.ts
calculator.spec.ts
```

## Variacao: Teste com assertion real (proximo passo natural)

```typescript
// sum.test.ts — evolucao do teste vazio
function sum(a: number, b: number): number {
  return a + b
}

test('should sum two numbers', () => {
  const result = sum(2, 3)
  expect(result).toBe(5)
})
```

## Variacao: Multiplos testes no mesmo arquivo

```typescript
// sum.test.ts
test('should sum positive numbers', () => {
  expect(sum(2, 3)).toBe(5)
})

test('should sum negative numbers', () => {
  expect(sum(-1, -2)).toBe(-3)
})

test('should sum zero', () => {
  expect(sum(0, 5)).toBe(5)
})
```

## Comandos de execucao — resumo

```bash
# Executar teste especifico
npx jest src/sum.test.ts

# Executar todos os testes (sem especificar arquivo)
npx jest

# Executar com verbose (mais detalhes)
npx jest --verbose src/sum.test.ts
```