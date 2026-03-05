# Deep Explanation: Controller Buscar Pergunta por Slug

## Por que um controller por caso de uso?

O instrutor deixa claro que nao necessariamente existe um mapeamento 1:1 entre controllers e casos de uso — um mesmo caso de uso pode ser chamado por multiplos controllers. Porem, neste projeto da Rocketseat, a convencao e manter essa relacao direta para simplicidade e clareza.

O ponto importante: o controller e uma porta de entrada HTTP. Ele nao contem logica de negocio. Sua responsabilidade e:
1. Extrair parametros da requisicao
2. Delegar ao use case
3. Transformar o resultado via presenter
4. Retornar a resposta HTTP

## Tecnica de produtividade: copiar e adaptar

O instrutor demonstra uma tecnica pragmatica: copiar o controller `FetchRecentQuestions` e fazer find-and-replace por `GetQuestionBySlug`. Isso funciona porque todos os controllers seguem a mesma estrutura base. As diferencas sao:
- Tipo de parametro (query vs route param)
- Retorno (lista vs objeto unico)
- Presenter mapping (`.map()` vs chamada direta)

## Diferenca critica: Query Param vs Route Param

- **Query params** (`?page=1&size=10`): usados para filtros, paginacao, opcoes — o recurso ja esta identificado pela rota
- **Route params** (`/questions/:slug`): usados para identificar o recurso especifico — fazem parte da identidade da URL

No NestJS, route params sao extraidos com `@Param('nome')` e precisam estar declarados na rota do `@Controller()` ou `@Get()`.

## O erro mais comum ao criar novos controllers

O instrutor mostra que ao criar o controller, o teste falhou inicialmente. O motivo: esqueceu de registrar o novo controller e o use case no `HttpModule`. Isso e um erro extremamente comum no NestJS — o framework precisa que voce declare explicitamente cada provider e controller nos modules.

Checklist ao criar novo controller:
1. Criar arquivo do controller
2. Criar/importar o use case
3. Adicionar `@Injectable()` no use case (se ainda nao tem)
4. Registrar controller no array `controllers` do module
5. Registrar use case no array `providers` do module

## Watch mode para E2E tests

O instrutor cria um script `test:e2e:watch` removendo o `--run` do comando vitest. A vantagem: o vitest no modo watch nao re-executa todos os testes — ele detecta quais arquivos mudaram e executa somente os testes relacionados.

Isso e especialmente util durante o desenvolvimento de testes, quando voce precisa iterar rapidamente para acertar o teste. Rodar a suite inteira a cada mudanca seria lento e desperdicaria tempo.

Comando:
```json
{
  "test:e2e": "vitest run --config ./vitest.config.e2e.ts",
  "test:e2e:watch": "vitest --config ./vitest.config.e2e.ts"
}
```

A diferenca e apenas a presenca/ausencia do `run`.

## Padrao do E2E Test

Todos os testes E2E neste projeto seguem o mesmo padrao porque todas as rotas sao autenticadas:

1. **Criar usuario** via factory
2. **Gerar JWT** para autenticacao
3. **Criar dados de teste** (neste caso, uma unica question com slug conhecido)
4. **Fazer requisicao HTTP** com token no header
5. **Validar status code** (200)
6. **Validar body** usando `expect.objectContaining()` para flexibilidade

O uso de `expect.objectContaining()` e intencional — nao queremos que o teste quebre se adicionarmos novos campos ao presenter no futuro.