# Deep Explanation: Teste E2E do Registro

## Por que Supertest?

Supertest e a biblioteca mais utilizada no ecossistema Node.js para fazer chamadas HTTP nos testes sem precisar subir o servidor manualmente. Ela se conecta diretamente ao servidor HTTP nativo do Node, o que significa que nao precisa de uma porta aberta — tudo acontece in-process.

## O papel do `app.server`

O Fastify encapsula o servidor HTTP do Node. Quando escrevemos `request(app.server)`, estamos pegando o servidor HTTP nativo (o `http.Server` do Node) que o Fastify usa internamente. O Supertest precisa desse servidor raw, nao da instancia Fastify em si.

## Por que `app.ready()` e essencial

O instrutor explica que a aplicacao Fastify "demora um pouquinho para inicializar" — ela precisa:
- Instalar o plugin do JWT
- Registrar todas as rotas
- Executar hooks de inicializacao

O `ready()` e um evento que o Fastify emite quando toda a inicializacao terminou. Sem ele, os testes podem rodar antes da aplicacao estar pronta, causando falhas intermitentes.

## Por que `app.close()` no afterAll

Apos os testes, precisamos encerrar a aplicacao para liberar conexoes (banco de dados, sockets, etc). Sem isso, o processo do teste pode ficar pendurado ou vazar recursos entre suites.

## Scripts separados para watch mode

O instrutor mostra um insight importante sobre o npm scripts:
- `npm run test:e2e` pode incluir pre-scripts como linting
- `npm run test:e2e:watch` roda direto o vitest em modo watch, sem os pre-scripts

Isso e importante porque durante o desenvolvimento, voce nao quer que o linting rode toda vez que um arquivo muda.

## O truque dos dois hifens (`--`)

Quando voce roda `npm run test:e2e -- --watch`, os dois hifens dizem ao npm: "tudo depois disso nao e para mim, repasse para o comando interno (vitest)".

Exemplo pratico:
- `npm run test:e2e -h` → mostra help do **npm**
- `npm run test:e2e -- -h` → mostra help do **vitest**

## Escopo do teste E2E

O teste E2E do registro testa o fluxo completo:
1. Requisicao HTTP chega na rota `/users` (POST)
2. Controller processa a requisicao
3. Use case executa a logica de negocio
4. Repository persiste no banco de dados
5. Resposta 201 retorna ao cliente

Isso garante a integridade do sistema como um todo, diferente de testes unitarios que testam cada camada isoladamente.