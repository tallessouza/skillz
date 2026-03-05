# Deep Explanation: Controller Comentar Pergunta

## Raciocinio do Instrutor

### Por que copiar ao inves de criar do zero?

O instrutor demonstra um padrao pragmatico: ao criar um novo controller em uma aplicacao NestJS com clean architecture, ele **identifica o controller mais parecido** e copia. No caso, o `AnswerQuestionController` foi escolhido porque:

1. Opera sobre o mesmo recurso pai (Question)
2. Tem o mesmo shape de body (content)
3. Segue o mesmo padrao de autenticacao (usuario logado)

A unica diferenca significativa e a **rota** (`/comments` ao inves de `/answers`) e a **ausencia de attachmentIds** no body do comentario.

### O padrao "Copy-Rename-Register-Test"

O instrutor segue uma sequencia mecanica e deterministica:

1. **Copy** — Copia o controller + teste E2E mais similar
2. **Rename** — Substituicao sistematica de todos os nomes (find & replace)
3. **Register** — Adiciona no HTTP module (controller + use case + @Injectable)
4. **Test** — Roda o teste E2E pra validar

Esse padrao e valioso porque **minimiza erros de digitacao** e **garante consistencia** com os controllers existentes. Nao ha valor em "reinventar" a estrutura de um controller quando o projeto ja tem um padrao estabelecido.

### Por que registrar no modulo ANTES de testar?

O instrutor vai direto ao `http.module.ts` antes de rodar qualquer teste. Isso porque o NestJS usa injecao de dependencia baseada em modulos — se o controller ou o use case nao estiverem registrados, o framework simplesmente nao os reconhece. O erro seria:

```
Nest could not find CommentOnQuestionUseCase element
```

### O papel do @Injectable()

O use case vem da camada de dominio (clean architecture), onde nao existe conceito de DI do NestJS. Ao integrar no NestJS, e necessario adicionar o decorator `@Injectable()` para que o container de DI consiga resolver a dependencia. Sem isso, o use case existe como classe pura mas o NestJS nao consegue injeta-lo no controller.

### Teste E2E: o padrao de verificacao

O teste nao se limita a verificar o status code. O padrao e:

1. Criar os pre-requisitos (question, user)
2. Executar a acao (POST para criar comentario)
3. **Verificar no banco de dados** se o comentario foi persistido

Isso garante que toda a cadeia funciona: rota → controller → use case → repository → banco.

### Observacao sobre RESTful design

A rota `/questions/:questionId/comments` segue o padrao REST de recursos aninhados. Comentarios sao sub-recursos de perguntas, entao a URL reflete essa hierarquia. Isso e consistente com o padrao ja usado no projeto (`/questions/:questionId/answers`).