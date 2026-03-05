# Deep Explanation: Controller Deletar Comentario da Pergunta

## Filosofia: Copiar e Adaptar

O instrutor demonstra explicitamente o padrao de produtividade: ao inves de criar um controller do zero, ele copia o `DeleteAnswerController` (o mais similar) e adapta. Isso e intencional — em Clean Architecture com NestJS, controllers DELETE seguem uma estrutura identica:

1. Receber ID via param
2. Chamar use case
3. Retornar 204 (No Content)

A unica variacao e: qual use case, qual param name, qual rota.

## Design da Rota: Prefixo pelo Recurso Pai

O instrutor escolhe `questions/comments/:commentId` mesmo sem precisar do ID da pergunta. A justificativa: deixa semanticamente claro que este comentario pertence a uma pergunta. O ID da pergunta nao e necessario porque o use case resolve internamente — o comentario ja tem referencia ao recurso pai.

## O Bug dos 15 Minutos

O instrutor compartilha um bug real que levou mais de 15 minutos para encontrar: na URL do teste, passou `questionComment` (o objeto) ao inves de `questionCommentId` (a string do ID). Isso enviava `[object Object]` na URL, causando `resource not found` no use case.

### Licao critica:
- Quando o use case retorna `resource not found` mas voce tem certeza que o recurso existe no banco, o problema quase sempre e no **param sendo passado incorretamente**
- `console.log(result.value)` no controller e a forma rapida de debugar — mostra o erro exato do use case

## Checklist de Registro

Apos criar o controller, sao necessarios 3 registros:
1. **Controller** no array `controllers` do `http.module.ts`
2. **Use case** no array `providers` do `http.module.ts`
3. **`@Injectable()`** no use case (se ainda nao tiver)

Esquecer qualquer um destes causa erro silencioso ou erro de injecao de dependencia.

## Teste E2E: Padrao DELETE

O teste segue sempre o mesmo fluxo:
1. Criar usuario (author)
2. Gerar token JWT
3. Criar recurso pai (question)
4. Criar recurso a ser deletado (question comment)
5. Fazer DELETE request
6. Assertar status 204
7. Buscar no banco e assertar `null`

A factory `QuestionCommentFactory` e essencial — sem ela, criar o comentario no teste seria verboso e fragil.