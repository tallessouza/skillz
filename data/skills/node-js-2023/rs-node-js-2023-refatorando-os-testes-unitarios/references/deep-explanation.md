# Deep Explanation: Refatorando Testes Unitarios com In-Memory Repositories

## Por que extrair para classes?

O instrutor explica que a primeira melhoria nos testes é **separar os fake repositories de simples variaveis para classes**. Isso nao é uma questao estetica — é sobre reusabilidade. Quando voce tem uma variavel inline como `const questions: Question[] = []`, ela só existe naquele teste. Quando voce cria uma classe `InMemoryQuestionsRepository`, ela pode ser usada em dezenas de arquivos de teste.

## A decisao de localizar em `test/repositories/`

O instrutor deliberadamente coloca a pasta `test/` na raiz do projeto, nao dentro de `src/`. A justificativa é que infraestrutura de teste nao faz parte do codigo de producao. A estrutura fica:

```
test/
  repositories/
    in-memory-questions-repository.ts
    in-memory-answers-repository.ts
src/
  domain/
    ...
```

## implements — o contrato real

Ao fazer `implements QuestionsRepository`, a classe InMemory é forcada a implementar todos os metodos da interface. Isso é critico porque:

1. Se a interface mudar (novo metodo), o InMemory quebra em compilacao — voce descobre imediatamente
2. O teste usa o mesmo contrato que o codigo de producao
3. Nao existe risco de "fake divergente" onde o teste passa mas o comportamento real é diferente

## O pattern SUT (System Under Test)

O instrutor explica explicitamente por que usa `sut`:

> "Isso aqui é legal porque, como a gente vai ter que fazer muitas vezes o processo de copiar e colar, por exemplo, eu vou vir aqui, posso copiar isso aqui e posso colar inteiro aqui dentro do AnswerQuest. Eu nao preciso ficar mudando o nome das coisas, mudo só o tipo."

Ou seja, `sut` é um nome generico proposital. Quando voce copia a estrutura de teste para outro use case, só precisa mudar:
- O tipo do `sut` (de `CreateQuestionUseCase` para `AnswerQuestionUseCase`)
- O tipo do `repository` (de `InMemoryQuestionsRepository` para `InMemoryAnswersRepository`)

O nome `sut` permanece identico em todos os arquivos, criando um padrao previsivel.

## Validacao dupla: retorno + repositorio

O instrutor faz questao de validar nao apenas o retorno do use case, mas tambem o estado do repositorio:

```typescript
expect(repository.items[0].id).toEqual(question.id)
```

Isso prova que o dado foi realmente persistido. Sem isso, o use case poderia retornar um objeto sem nunca chamar o repositorio, e o teste passaria.

## beforeEach como reset automatico

Cada `it` block recebe uma instancia fresca de `repository` e `sut`. Isso elimina vazamento de estado entre testes — um teste que insere 5 questions nao afeta o proximo teste que espera repositorio vazio.

## A tecnica de copiar e adaptar

O instrutor demonstra ao vivo: copia todo o bloco de teste do `CreateQuestion`, cola no `AnswerQuestion`, e só precisa trocar:
1. O tipo do repository: `InMemoryAnswersRepository`
2. O tipo do SUT: `AnswerQuestionUseCase`
3. Os parametros do `execute()`: `questionId`, `instructorId`, `content`
4. O texto do `it`: "should be able to create an answer"

O nome `sut` e `repository` nao mudam. O `beforeEach` nao muda de estrutura. Isso é produtividade real.