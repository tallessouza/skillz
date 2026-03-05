# Deep Explanation: Controller Deletar Pergunta

## Por que copiar do Edit e simplificar

O instrutor demonstra um padrao pragmatico: ao criar o delete controller, ele copia o edit controller e remove o que nao precisa. Isso porque delete e edit compartilham a mesma estrutura de URL (`/questions/:id`) e ambos precisam do ID via param. A diferenca fundamental:

- **Edit**: precisa de `@Body()` com dados de atualizacao + validacao com Zod
- **Delete**: nao precisa de body algum, apenas o ID do param

Essa abordagem de "copiar e simplificar" e mais segura que criar do zero porque garante que voce nao esqueca patterns ja estabelecidos (como o `@CurrentUser()` decorator).

## O erro classico: 404 por falta de registro no module

O instrutor comete esse erro ao vivo e comenta "sempre esqueco de cadastrar aqui no modulo". Isso acontece porque o NestJS nao da nenhum aviso quando um controller existe mas nao esta registrado — ele simplesmente nao cria a rota, resultando em 404.

**Checklist mental apos criar qualquer controller:**
1. Controller criado? ✓
2. Use case com `@Injectable()`? ✓
3. Controller adicionado no `controllers[]` do module? ✓
4. Use case adicionado no `providers[]` do module? ✓

Se qualquer um desses faltar, o endpoint nao funciona.

## Estrategia de teste: validar ausencia

O teste do delete tem uma abordagem diferente dos outros testes CRUD:
- **Create/Edit**: voce busca o registro e valida que ele TEM os dados corretos (`toBeTruthy()`, `toEqual()`)
- **Delete**: voce busca o registro e valida que ele NAO EXISTE (`toBeNull()`)

O instrutor usa `findUnique` com o ID do registro deletado e espera `null`. Isso e mais robusto que apenas checar o status 204, porque confirma que a operacao realmente afetou o banco de dados.

## Semantica HTTP do DELETE

- **204 No Content**: resposta correta para delete bem-sucedido. Nao retorna body.
- **Sem body na request**: a especificacao HTTP permite body em DELETE, mas e considerado ma pratica. O recurso e identificado pela URI.
- **Idempotencia**: DELETE deve ser idempotente — deletar o mesmo recurso duas vezes deve ter o mesmo efeito (na pratica, a segunda chamada pode retornar 404 ou 204 dependendo da implementacao).