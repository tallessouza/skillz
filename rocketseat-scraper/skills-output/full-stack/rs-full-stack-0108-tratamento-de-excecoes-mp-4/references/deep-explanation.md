# Deep Explanation: Tratamento de Exceções em API Express

## Por que express-async-errors é necessário

O Express, por padrão, não captura erros que acontecem dentro de funções assíncronas (async/await). Se uma promise é rejeitada dentro de uma rota async, o Express não sabe o que fazer — a requisição fica pendurada e eventualmente dá timeout, ou a aplicação crasheia.

A biblioteca `express-async-errors` resolve isso interceptando automaticamente qualquer erro lançado (throw) dentro de uma rota async e repassando para o middleware de erro do Express. Sem ela, seria necessário envolver cada rota em try/catch manual, o que é repetitivo e propenso a esquecimento.

**Instalação específica:** `npm i express-async-errors@3.1.1`

**Ponto crítico:** O import de `express-async-errors` deve acontecer ANTES de qualquer definição de rota, idealmente no topo do arquivo app.ts.

## A classe AppError como utilitário

A decisão de criar uma classe separada (e não simplesmente usar `new Error()`) é estratégica:

1. **Diferenciação por tipo** — `instanceof AppError` permite que o middleware saiba que o erro foi lançado intencionalmente pelo desenvolvedor, não por uma falha inesperada
2. **Status code customizado** — `Error` nativo do JavaScript não tem conceito de HTTP status code. A classe AppError adiciona essa propriedade
3. **Valor padrão inteligente** — `statusCode = 400` como padrão faz sentido porque a maioria dos erros de negócio são "bad request" do ponto de vista HTTP

### Por que usar classe e não interface/type?

O instrutor usa classe (não tipo/interface) porque `instanceof` só funciona com classes. Se fosse um objeto tipado, não seria possível diferenciar no middleware.

### Convenção de nomenclatura

O arquivo `AppError.ts` começa com letra maiúscula porque é uma classe — seguindo a convenção de que classes usam PascalCase tanto no nome quanto no arquivo.

## Arquitetura do middleware de erro

O middleware de erro do Express tem uma assinatura especial: recebe 4 parâmetros `(error, req, res, next)`. O Express identifica que é um middleware de erro justamente pela quantidade de parâmetros.

### Cadeia de verificação por instanceof

A ordem das verificações importa:

1. **Primeiro AppError** — erros intencionais de negócio, com status e mensagem controlados pelo desenvolvedor
2. **Depois ZodError** — erros de validação de input, que têm estrutura própria com detalhes de cada campo que falhou
3. **Por último, fallback genérico** — qualquer outro erro (banco de dados, rede, bug) retorna 500 com a mensagem original

### Por que return em cada branch?

Cada verificação termina com `return` para interromper a execução do middleware. Sem o return, o código continuaria executando e poderia tentar enviar múltiplas respostas (o que causaria erro "headers already sent").

### Por que não usar next()?

O parâmetro `next` existe na assinatura mas não é usado, porque este é o middleware FINAL — não queremos passar o erro adiante, queremos resolvê-lo aqui. Se chamássemos `next(error)`, o Express tentaria encontrar outro middleware de erro, e se não encontrasse, usaria seu handler padrão (que expõe stack traces em desenvolvimento).

## Integração com Zod

O instrutor instala Zod (`npm i zod@3.24.1`) já neste ponto porque:

1. **Validação de request body** — Zod é usado para validar dados que chegam do cliente
2. **Erros estruturados** — `ZodError` contém informações detalhadas sobre cada campo que falhou
3. **`.format()` vs `.message`** — O método `.format()` retorna um objeto estruturado com cada campo e seus erros. O `.message` retorna uma string concatenada que é menos útil para o frontend processar

### Estrutura de resposta do ZodError

A decisão de separar em `message: "Validation error"` + `issues: error.format()` (em vez de jogar tudo em `message`) é intencional:

- O frontend pode mostrar "Validation error" como mensagem geral
- E usar `issues` para destacar campos específicos com erro
- Se houvesse múltiplos erros (ex: idade e nome inválidos), todos aparecem em `issues`

## Registro do middleware

`app.use(errorHandling)` DEVE vir depois de todas as rotas porque:

1. Express processa middlewares na ordem de registro
2. Se o middleware de erro vier antes das rotas, os erros das rotas não seriam capturados por ele
3. A ordem é: middlewares gerais → rotas → middleware de erro

## Fluxo completo de um erro

```
Rota async lança throw new AppError("msg", 404)
  → express-async-errors captura
  → Passa para o próximo middleware de erro
  → errorHandling recebe o erro
  → instanceof AppError? SIM
  → res.status(404).json({ message: "msg" })
  → return (encerra)
```

```
Rota faz bodySchema.parse(req.body) e o body é inválido
  → Zod lança ZodError automaticamente
  → express-async-errors captura
  → errorHandling recebe o erro
  → instanceof AppError? NÃO
  → instanceof ZodError? SIM
  → res.status(400).json({ message: "Validation error", issues: ... })
  → return (encerra)
```

```
Rota tenta acessar banco e a conexão falha
  → Erro genérico é lançado
  → express-async-errors captura
  → errorHandling recebe o erro
  → instanceof AppError? NÃO
  → instanceof ZodError? NÃO
  → Cai no fallback
  → res.status(500).json({ message: error.message })
```