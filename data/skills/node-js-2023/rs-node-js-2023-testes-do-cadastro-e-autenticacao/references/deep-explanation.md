# Deep Explanation: Testes de Cadastro e Autenticacao

## Por que repositorios in-memory?

O instrutor demonstra que para cada entidade do dominio, voce precisa de um repositorio in-memory correspondente. A tecnica e simples: copiar um repositorio in-memory existente (ex: `InMemoryQuestionsRepository`) e usar "Replace All" com "Preserve Case" para trocar o nome da entidade. Isso mantem a consistencia de casing (maiusculas/minusculas) automaticamente.

O `InMemoryStudentsRepository` implementa apenas os metodos definidos na interface `StudentsRepository`: `create` e `findByEmail`. Metodos como `delete` e `save` que existiam no repositorio copiado sao removidos porque a interface nao os exige.

## A importancia do hash no teste de autenticacao

O ponto mais sutil da aula e: quando voce testa autenticacao, o student salvo no repositorio DEVE ter a senha ja com hash aplicado. Isso porque o use case de autenticacao faz `hashComparer.compare(senhaInput, senhaDoRepo)`. Se a senha no repo estiver em plain text, a comparacao vai falhar.

O `FakeHasher` nesta implementacao simplesmente concatena `-hashed` ao valor, tornando o comportamento deterministico e previsivel para testes.

## Factory pattern com overrides

O `makeStudent` segue o mesmo padrao do `makeQuestion` ja existente no projeto. Ele gera dados aleatorios com faker, mas aceita overrides parciais. Para testes de autenticacao, voce precisa controlar email e senha especificos — por isso o override e essencial.

```typescript
// O factory gera tudo aleatorio por padrao
makeStudent() // nome, email, senha aleatorios

// Mas aceita overrides para controlar o que importa no teste
makeStudent({
  email: 'john@example.com',
  password: await fakeHasher.hash('123456'),
})
```

## Estrutura do faker atualizada

O instrutor nota que `faker.name` esta depreciado. A API correta agora e:
- `faker.person.fullName()` em vez de `faker.name.fullName()`
- `faker.internet.email()` continua igual
- `faker.internet.password()` continua igual

## Verificacao de resultado com Either pattern

Os testes usam o pattern Either (Right/Left) para verificar resultados:
- `result.isRight()` — operacao bem-sucedida
- `result.value` — contem o payload de sucesso

Para registro: verifica que o student retornado e o mesmo salvo no repositorio (`repository.items[0]`).
Para autenticacao: verifica que retorna um objeto com `accessToken` como string.

## Por que nao validar formato JWT nos testes unitarios?

O instrutor menciona que seria possivel usar regex para validar formato JWT, mas decide que `expect.any(String)` e suficiente. A razao: o teste unitario testa o USE CASE, nao a implementacao do encrypter. O `FakeEncrypter` nem gera JWT real — ele retorna uma string qualquer. Validacao de formato JWT pertence a testes de integracao ou E2E.

## Watch mode e produtividade

O instrutor usa `pnpm run test watch` para executar testes automaticamente ao salvar. O watch mode inteligente do Vitest/Jest executa apenas os testes dos arquivos alterados, acelerando o ciclo de feedback.