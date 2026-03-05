# Deep Explanation: Testes E2E de Rotas de Academias

## Por que extrair o helper de autenticacao

O instrutor identifica um problema pratico: toda rota da aplicacao exige autenticacao. Isso significa que todo teste E2E precisa criar um usuario, fazer login e obter o token. Sem um helper, esse codigo se repete em dezenas de arquivos de teste.

A solucao e criar `utils/test/create-and-authenticate-user.ts` — uma funcao async que recebe a instancia do Fastify (`app`), faz o POST para criar usuario, faz o POST para autenticar, e retorna o token.

O detalhe importante: o instrutor escolhe retornar `{ token }` como objeto em vez de retornar a string diretamente. A justificativa e extensibilidade — "mais pra frente se eu quiser retornar mais informacoes aqui, por exemplo as informacoes do usuario que eu criei, pode ser legal". Isso evita breaking changes no futuro.

## O bug do query parameter como string

Esse e o insight mais valioso da aula. Ao testar a rota de nearby gyms, o teste retorna 400 (Bad Request) em vez de 200. O instrutor investiga e descobre:

**Todo parametro enviado via query string e obrigatoriamente uma string no padrao HTTP.** Entao quando voce envia `?latitude=-27.2092052`, o valor chega como `"-27.2092052"` (string), nao como `-27.2092052` (number).

Se o schema Zod usa `z.number()`, a validacao falha porque recebe string. A solucao e usar `z.coerce.number()`, que faz a conversao automatica de string para numero antes de validar.

O instrutor nota que isso afeta qualquer rota que receba numeros via query params — no caso, tanto nearby quanto check-in.

## Estrategia de dados de teste

Para testar busca, o instrutor cria duas academias: "JavaScript Gym" e "TypeScript Gym", depois busca por "JavaScript". Assim valida que:
1. O resultado contem a academia correta
2. O resultado NAO contem a academia errada (array tem length 1)

Para nearby, usa coordenadas reais: uma academia proxima e uma distante. Assim valida que o calculo de distancia funciona corretamente no nivel E2E.

## Vitest watch mode

O instrutor menciona que no modo watch do Vitest, apenas testes que mudaram sao re-executados. Para rodar todos, pressione `a`. Isso agiliza o ciclo de feedback durante desenvolvimento.

## Checklist antes de criar testes E2E

O instrutor quase esqueceu de registrar as rotas de check-in no app (`checkInRoutes`). Isso mostra a importancia de verificar que todas as rotas estao registradas antes de escrever testes — senao os testes falham com 404 e voce perde tempo debugando.