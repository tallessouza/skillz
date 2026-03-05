# Deep Explanation: Controller de Listagem de Respostas

## Por que o Presenter existe

O instrutor enfatiza que **nunca se deve retornar a entidade de dominio diretamente**. O Presenter e uma camada de transformacao que:

1. Controla exatamente quais campos sao expostos na API
2. Converte tipos internos (como Value Objects de ID) para formatos HTTP-friendly (strings)
3. Permite evolucao independente — o dominio pode mudar sem quebrar a API

O instrutor menciona explicitamente: "quando eu tenho uma listagem de uma informação ou trago um dado, um GET, o melhor aqui é a gente ter um presenter."

## Presenter evolutivo

O instrutor cria o presenter inicial com campos basicos (id, content, createdAt, updatedAt) mas ja antecipa que **no futuro** esse presenter precisara ser "mais detalhado" para incluir dados de relacionamento como o autor da resposta.

Isso segue o principio de desenvolvimento iterativo: entregar o minimo funcional agora e evoluir quando a necessidade surgir.

## Padrao de copia e adaptacao

O fluxo do instrutor e pragmatico:
1. Copiar um controller similar existente (FetchRecentQuestionsController)
2. Adaptar: trocar o nome, ajustar params, mudar o use case
3. Criar o presenter especifico para a entidade
4. Copiar o teste e2e similar e adaptar

Isso nao e "preguica" — e **reuso de padrao**. Controllers de listagem seguem estrutura identica, entao copiar e adaptar e mais rapido e menos propenso a erro.

## Rota RESTful aninhada

A rota segue o padrao REST para recursos aninhados: `/questions/:questionId/answers`. Isso expressa a relacao hierarquica: respostas pertencem a uma pergunta.

## Checklist de registro no NestJS

O instrutor destaca tres pontos que frequentemente sao esquecidos:
1. Registrar o **controller** no array `controllers` do module
2. Registrar o **use case** no array `providers` do module
3. Adicionar `@Injectable()` no use case

Esquecer qualquer um desses causa erros de injecao de dependencia em runtime.

## Sobre o teste e2e

O teste segue o padrao:
1. Criar usuario (dependencia)
2. Criar pergunta (pai do recurso)
3. Criar N respostas vinculadas a pergunta (via `questionId`)
4. Fazer GET na rota com o ID da pergunta
5. Validar status 200 e conteudo das respostas no body

O uso de `Promise.all` para criar as respostas em paralelo e uma otimizacao de performance no teste.