# Deep Explanation: Tratamento de Exceções no Express

## Por que o middleware de erro deve ficar no final?

O Express executa middlewares em ordem de registro. Quando um `throw new Error()` acontece em qualquer ponto — seja em uma rota, controller, ou middleware — o Express procura o próximo middleware com **4 parâmetros** (error, req, res, next) na pilha.

Se o middleware de erro estiver registrado **antes** das rotas, ele não captura exceções que acontecem nas rotas, porque essas rotas foram registradas depois dele na pilha. A pilha de execução funciona assim:

```
Requisição entra
  → express.json() (parser)
  → routes (rotas da aplicação)
    → controller.create() → throw new Error("algo deu errado")
  → error middleware (CAPTURA o erro aqui)
  → app.listen (servidor rodando)
```

Se o error middleware estivesse antes das rotas, o fluxo pularia direto para o erro antes mesmo de as rotas serem processadas — e exceções nas rotas não teriam como ser capturadas.

## A assinatura de 4 parâmetros é obrigatória

O Express distingue middlewares normais de middlewares de erro pela **quantidade de parâmetros**. Um middleware com 3 parâmetros `(req, res, next)` é normal. Um com 4 parâmetros `(error, req, res, next)` é de erro.

Mesmo que você não use `next`, ele **precisa existir** na assinatura para o Express reconhecer como error handler. Por isso o instrutor ensina a usar `_next` com underscore — mantém a assinatura correta sem gerar warning de variável não utilizada.

## Comportamento sem tratamento de exceção

Sem middleware de erro:
- O Express retorna **HTML** com o stack trace completo (caminhos de arquivo, números de linha)
- O status code é 500 por padrão
- O terminal do servidor fica poluído com mensagens de erro longas
- Em produção, isso é um **risco de segurança** — expõe estrutura interna do servidor

Com middleware de erro:
- Resposta em JSON limpa: `{ message: "erro ao tentar criar um produto" }`
- Terminal limpo — sem poluição visual
- Frontend pode consumir a mensagem de erro programaticamente
- Aplicação continua funcionando normalmente

## Import elegante de tipos do Express

O instrutor destaca que em vez de fazer dois imports separados:

```typescript
import express from "express"
import { Request, Response } from "express"
```

A forma mais elegante é combinar na mesma linha:

```typescript
import express, { Request, Response, NextFunction } from "express"
```

Ambas funcionam, mas a segunda é mais concisa e idiomática em projetos TypeScript.

## A analogia do throw new Error

Quando você escreve `throw new Error("mensagem")` dentro de um método:
1. A execução do método **para imediatamente** naquele ponto
2. Qualquer código abaixo do throw **nunca executa** (o VS Code mostra isso visualmente com código "apagado")
3. O erro "sobe" pela pilha de execução até encontrar algo que o capture
4. No Express, quem captura é o middleware de erro global

Isso é análogo a uma exceção borbulhando — o erro vai subindo até alguém pegá-lo.

## error.message vs error (objeto inteiro)

O instrutor demonstra a diferença ao acessar propriedades do erro:
- `error` sozinho retorna o objeto inteiro (com stack trace, nome, etc.)
- `error.message` retorna apenas a string da mensagem que foi passada no `new Error("...")`

Para respostas de API, sempre use `error.message` para devolver apenas a informação relevante ao consumidor.