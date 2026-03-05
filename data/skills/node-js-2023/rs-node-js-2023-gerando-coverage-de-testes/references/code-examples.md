# Code Examples: Gerando Coverage de Testes

## Configuracao do package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

Nota: usar `vitest run` (nao apenas `vitest`) para executar uma vez sem watch mode. A flag `--coverage` ativa a geracao do relatorio.

## Instalacao da dependencia

Na primeira execucao, Vitest detecta que `@vitest/coverage-c8` nao esta instalado e sugere instalacao automatica:

```bash
npm run test:coverage
# Vitest pergunta se quer instalar @vitest/coverage-c8
# Responder 'y' para instalar automaticamente
```

## Await em expects asincronos

### Problema — sem await

```typescript
it('should not be able to register with same email twice', async () => {
  const email = 'johndoe@example.com'

  await sut.execute({ name: 'John Doe', email, password: '123456' })

  // BUG: sem await, Vitest pode nao aguardar a rejeicao
  expect(
    sut.execute({ name: 'John Doe', email, password: '123456' })
  ).rejects.toBeInstanceOf(UserAlreadyExistsError)
})
```

### Correcao — com await

```typescript
it('should not be able to register with same email twice', async () => {
  const email = 'johndoe@example.com'

  await sut.execute({ name: 'John Doe', email, password: '123456' })

  // CORRETO: await garante execucao completa
  await expect(
    sut.execute({ name: 'John Doe', email, password: '123456' })
  ).rejects.toBeInstanceOf(UserAlreadyExistsError)
})
```

## Usando it.skip para pular teste

```typescript
// .skip pula este teste — coverage mostrara impacto
it.skip('should not be able to register with same email twice', async () => {
  const email = 'johndoe@example.com'

  await sut.execute({ name: 'John Doe', email, password: '123456' })

  await expect(
    sut.execute({ name: 'John Doe', email, password: '123456' })
  ).rejects.toBeInstanceOf(UserAlreadyExistsError)
})
```

## Usando it.only para teste isolado

```typescript
// .only executa SOMENTE este teste — util para debugging
it.only('should be able to register', async () => {
  const { user } = await sut.execute({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  })

  expect(user.id).toEqual(expect.any(String))
})
```

## .gitignore

```gitignore
# Test coverage output
coverage/
```

## Exemplo de saida do coverage no terminal

```
 % Coverage report from c8
----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
All files |   100   |   100    |   100   |   100   |
 register |   100   |   100    |   100   |   100   |
----------|---------|----------|---------|---------|
```

## Interpretando o HTML

Ao abrir `coverage/index.html`, o relatorio mostra por arquivo:

```
src/use-cases/register.ts

  1x  | export class RegisterUseCase {
  4x  |   async execute({ name, email, password }) {
  4x  |     const userWithSameEmail = await this.usersRepo.findByEmail(email)
  1x  |     if (userWithSameEmail) {
  1x  |       throw new UserAlreadyExistsError()
      |     }
  4x  |     const password_hash = await hash(password, 6)
  4x  |     const user = await this.usersRepo.create({ name, email, password_hash })
  4x  |     return { user }
      |   }
      | }
```

- `4x` = linha executada por todos os 4 testes
- `1x` = linha executada por apenas 1 teste (o de email duplicado)
- Linhas sem numero = declaracoes que nao sao "executaveis" (fechamento de chaves, etc.)