# Deep Explanation: Controller Editar Pergunta

## Por que 204 e nao 200?

O instrutor explica que quando um endpoint de edicao nao retorna nenhum body na resposta, o status code semanticamente correto e 204 (No Content), nao 200 (OK). O 200 implica que ha um body de resposta, enquanto 204 comunica explicitamente: "a operacao foi bem-sucedida e nao ha conteudo para retornar".

## O problema das interfaces no NestJS (TypeScript → JavaScript)

Este e um dos insights mais importantes da aula. O NestJS usa o sistema de injecao de dependencias que depende de **metadados em tempo de execucao** para resolver quais classes injetar.

Quando o TypeScript compila para JavaScript:
- **Interfaces sao completamente eliminadas** — elas existem apenas no sistema de tipos do TS
- **Classes abstratas sobrevivem** — JavaScript entende classes, entao elas permanecem no codigo compilado

O NestJS precisa do **nome da referencia** para fazer o matching entre o que foi requisitado (`@Inject(QuestionsRepository)`) e o que foi fornecido (`provide: QuestionsRepository`). Se `QuestionsRepository` e uma interface, apos compilacao o nome desaparece e o NestJS nao consegue resolver a dependencia.

A solucao: converter todas as interfaces de repositorios (e outros contratos) para classes abstratas com metodos `abstract`. Funcionalmente identico, mas sobrevive a compilacao.

## Padrao de reutilizacao: copiar controller de criacao

O instrutor demonstra um padrao pragmatico: ao criar o controller de edicao, ele copia o controller de criacao e faz as seguintes alteracoes:
1. Renomeia `create` → `edit` em todos os lugares
2. Troca `@Post()` → `@Put()`
3. Adiciona `/:id` na rota
4. Troca `@HttpCode(201)` → `@HttpCode(204)`
5. Adiciona `@Param('id')` para extrair o ID
6. Remove imports nao utilizados (como `Post`)

## DatabaseModule: provide/useClass para todos os repositorios

O instrutor mostra uma tecnica de produtividade no editor: selecionar multiplas linhas simultaneamente (multi-cursor) para transformar uma lista simples de classes em objetos `{ provide, useClass }`. Cada repositorio abstrato precisa de um mapeamento explicito dizendo ao NestJS: "quando alguem pedir X, entregue Y".

## Bug sutil no teste de listagem: Promise.all e ordenacao

O instrutor revela um bug intermitente no teste `fetchRecentQuestionsController`: ao usar `Promise.all` para criar duas perguntas simultaneamente, a ordem de insercao no banco nao e garantida. Isso fazia o teste falhar esporadicamente quando a pergunta 2 era inserida antes da 1.

A solucao: trocar a validacao de array exato para `expect.arrayContaining()`, que verifica se os elementos existem independente da ordem. Essa e uma licao importante sobre testes nao-deterministicos.

## Teste E2E de edicao: factory pattern

Para testar edicao, e necessario primeiro criar o recurso. O instrutor usa o `QuestionFactory` para criar a pergunta no banco antes de fazer o PUT. O teste:
1. Cria um usuario (para autenticacao)
2. Cria uma pergunta com esse usuario como autor
3. Extrai o ID da pergunta
4. Faz PUT com novo titulo e conteudo
5. Valida que o banco contem os dados atualizados
6. Verifica status code 204