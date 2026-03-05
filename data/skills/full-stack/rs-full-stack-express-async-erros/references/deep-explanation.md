# Deep Explanation: Express Async Errors

## Por que o tratamento padrao e problematico

No Express, quando uma funcao async lanca um erro (throw ou rejeicao de promise), o Express **nao captura automaticamente**. O erro "morre" dentro da rota e a aplicacao **para completamente**.

O instrutor demonstrou isso ao vivo:
1. Adicionou `throw new Error('Broken')` dentro de um controller async
2. Executou a rota — a aplicacao **crashou**
3. Tentou executar novamente — o servidor ja estava parado

### A solucao padrao (e por que e ruim)

A solucao oficial do Express e:
1. Adicionar o parametro `next: NextFunction` em cada handler
2. Envolver TODO o corpo da funcao em `try-catch`
3. No catch, chamar `next(error)` para encaminhar o erro ao middleware

**Problema:** isso gera boilerplate massivo. Em uma API com 50 rotas, sao 50 blocos try-catch identicos, cada um com o mesmo padrao `catch(e) { next(e) }`.

### Como express-async-errors resolve

A biblioteca faz **monkey-patch** no Express. Ela intercepta os handlers de rota e automaticamente envolve funcoes async em um wrapper que:
1. Executa a funcao
2. Se a promise rejeitar, chama `next(error)` automaticamente

Resultado: o desenvolvedor escreve o controller limpo, como se erros nao existissem, e a biblioteca garante que qualquer throw ou rejeicao chegue ao middleware de erro.

### Analogia do instrutor

O instrutor enfatizou: "primeiro era importante voce aprender a forma padrao". A motivacao pedagogica e que o aluno entenda o mecanismo por baixo (try-catch + next) antes de usar a simplificacao. Mas em producao, a biblioteca e o padrao recomendado.

### Por que o import deve ser no topo

A biblioteca precisa fazer o patch antes que qualquer rota seja registrada. Se o import vier depois do `app.use(routes)`, as rotas ja registradas nao serao interceptadas.

### O middleware de erro continua necessario

A biblioteca NAO trata o erro — apenas o encaminha. O middleware com 4 parametros `(error, req, res, next)` continua sendo o ponto onde voce decide:
- Qual status HTTP retornar
- Qual mensagem exibir
- Se loga o erro
- Se e um erro conhecido (AppError) ou desconhecido (500)

### Comportamento com funcoes sincronas

A biblioteca tambem funciona com funcoes sincronas que lancam erros, mas o beneficio principal e para funcoes async, onde o Express nativo nao captura rejeicoes de promise.