# Deep Explanation: Erros Personalizados em Use Cases

## Por que nao usar throw new Error() generico?

O problema central que o Diego apresenta: quando o controller tem um `try/catch` generico, todo erro retorna o mesmo status code (ex: 409). Isso é problematico porque use cases tipicamente tem **multiplas validacoes** — email duplicado, dados invalidos, recurso nao encontrado — e cada uma deveria retornar um status HTTP diferente.

Com `throw new Error('mensagem')`, a unica forma de diferenciar erros no controller seria comparar strings de mensagem, que é fragil e quebra com qualquer refactor.

## A solucao: classes de erro como tipos

A ideia central é usar o sistema de tipos do JavaScript/TypeScript a favor: cada erro é uma **classe** que estende `Error`. No controller, `instanceof` funciona como um type guard — voce sabe exatamente qual erro aconteceu e pode reagir de forma especifica.

### O mecanismo do extends Error

Quando voce faz `class UserAlreadyExistsError extends Error`, a classe herda:
- Stack trace automatico
- Propriedade `message`
- Compatibilidade com `catch`
- `instanceof` funcional

O `super('mensagem')` no constructor chama o constructor de `Error`, definindo a mensagem.

## Organizacao em pasta errors/

Diego sugere criar `src/use-cases/errors/` com um arquivo por erro. Isso:
1. Centraliza todos os erros possiveis da aplicacao
2. Facilita reutilizacao — `ResourceNotFoundError` pode ser usado por varios use cases
3. Serve como documentacao viva dos erros da aplicacao

## Conexao com inversao de dependencia

Diego faz uma conexao importante: a separacao use case / controller / repositorio (via inversao de dependencia) é o que **permite** esse pattern funcionar limpo. O use case nao sabe nada sobre HTTP, entao ele lanca erros de dominio. O controller traduz erros de dominio para respostas HTTP. Essa separacao vai ser essencial para testes (proximo modulo do curso).

## Status 500 como fallback temporario

Diego coloca um `reply.status(500)` com um `// TODO: fix me` para erros nao tratados. Isso é proposital — mais adiante no curso ele implementa um error handler global. O pattern completo seria:

1. Erros conhecidos → instanceof no controller → status especifico
2. Erros desconhecidos → re-throw → error handler global → 500

## Por que sufixo Error?

Diego menciona que gosta de colocar o sufixo `Error` no nome da classe. A razao pratica: ao ler `throw new UserAlreadyExistsError()`, fica imediatamente claro que é um erro. Sem o sufixo, `throw new UserAlreadyExists()` parece que voce esta instanciando uma entidade.