# Deep Explanation: Middleware Global no Express

## Por que a ordem importa

O Express processa middlewares e rotas na **ordem exata em que sao registrados**. Internamente, o Express mantem uma stack (pilha) de handlers. Quando uma requisicao chega, ele percorre essa stack de cima para baixo.

Se voce registra uma rota ANTES do middleware:
1. Requisicao chega
2. Express encontra a rota primeiro
3. Rota responde e encerra
4. Middleware nunca e alcancado

Se voce registra o middleware ANTES da rota:
1. Requisicao chega
2. Express encontra o middleware primeiro
3. Middleware executa, chama `next()`
4. Express encontra a rota e executa

O instrutor demonstrou isso ao vivo: moveu o `app.use(myMiddleware)` para depois da rota de listagem e o console.log parou de aparecer para GET. Ao mover de volta para antes, ambas as rotas (GET e POST) passaram pelo middleware.

## O papel do next()

O `next` e uma funcao que diz ao Express: "continue para o proximo handler na stack". Sem chamar `next()`:
- A requisicao fica "presa" no middleware
- O cliente nunca recebe resposta (timeout eventual)
- A rota nunca e executada

Existem dois cenarios validos para NAO chamar `next()`:
1. **Middleware de autorizacao**: se o usuario nao tem permissao, voce retorna `response.status(401)` diretamente
2. **Middleware de cache**: se ja tem resposta em cache, retorna direto sem ir para a rota

Em todos os outros casos (logging, tracking, enriquecimento de request), sempre chame `next()`.

## Por que usar tipagem do Express

O instrutor demonstrou um ponto importante sobre produtividade com TypeScript:
- **Com tipagem**: `request.` mostra todos os metodos disponiveis (body, params, query, headers, etc.)
- **Sem tipagem**: `request.` mostra sugestoes genericas do VSCode que nao correspondem ao objeto real

Os tipos `Request`, `Response` e `NextFunction` vem direto do pacote `@types/express`. Quando voce instala o Express com TypeScript, esses tipos ja estao disponiveis. Usar esses tipos ao inves de criar tipos proprios garante compatibilidade e acesso a toda a API do Express.

## Middleware global vs local

- **Global**: `app.use(middleware)` — afeta TODAS as rotas registradas depois dele
- **Local**: passado como argumento de uma rota especifica — afeta apenas aquela rota

O middleware global e ideal para:
- Logging de todas as requisicoes
- Parsing de JSON (o proprio `express.json()` e um middleware global)
- CORS
- Rate limiting
- Headers de seguranca

## Organizacao de arquivos

O instrutor criou a pasta `src/middlewares/` para organizar. Pontos importantes:
- **Padronizacao de nomes**: se usar `my-middleware.ts` (kebab-case), use em todos os arquivos. Se usar `myMiddleware.ts` (camelCase), mantenha o padrao
- **Extensao do arquivo**: ao importar em TypeScript, nao precisa colocar `.ts` no caminho de importacao — o compilador resolve automaticamente
- **Uma funcao por arquivo**: facilita encontrar e manter middlewares

## Importacao sem extensao

Curiosidade mencionada pelo instrutor: ao importar `./middlewares/my-middleware`, nao e necessario colocar `.ts` no final. O TypeScript resolve a extensao automaticamente. Isso funciona porque o compilador TypeScript (ou o ts-node/tsx) sabe procurar por arquivos `.ts` e `.tsx` nos caminhos de importacao.