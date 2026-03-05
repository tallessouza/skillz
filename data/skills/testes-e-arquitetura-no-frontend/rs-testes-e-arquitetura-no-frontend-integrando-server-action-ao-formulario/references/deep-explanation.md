# Deep Explanation: Integrando Server Action ao Formulário

## Por que testar antes de integrar?

O instrutor enfatiza um ponto crucial: durante toda a implementação da Server Action, o projeto Next.js **nem estava rodando**. Ele trabalhou exclusivamente com testes. Isso demonstra o princípio test-first na prática — você valida o comportamento da Action isoladamente, sem depender da UI.

A sequência que ele segue:
1. Testa cenário de sucesso da Action
2. Testa erro de validação (campos vazios)
3. Testa erro de validação (prompt duplicado)
4. Testa erro genérico (qualquer falha inesperada)
5. **Só então** integra ao formulário

Quando finalmente rodou o projeto e testou visualmente, a Action já funcionava. A UI foi apenas "a última camada de validação visual".

## O problema dos mocks compartilhados

O instrutor encontrou um bug real durante a aula: o teste de erro genérico retornava `success: true` quando deveria retornar `false`. A causa? O mock do `repository.create` ainda estava com o comportamento do teste anterior (sucesso).

A solução foi adicionar `mockReset()` no `beforeEach` para cada método do repositório usado nos testes. Isso é um padrão fundamental — mocks são estado global dentro de um arquivo de teste, e estado global precisa ser limpo.

## Organização com describe

O instrutor destaca que organizar testes em blocos `describe` separados por funcionalidade (`Create Prompt Action`, `Search Prompt Action`) produz logs muito mais claros. Quando algo falha, você sabe imediatamente em qual domínio está o problema.

## A integração form → action

A integração é surpreendentemente simples:
1. Criar uma função `submit` assíncrona que recebe o DTO tipado
2. Chamar a Action e verificar `result.success`
3. Se falhou, retornar (early return)
4. Se sucesso, `router.refresh()`
5. Passar `submit` para `form.handleSubmit()`

O `router.refresh()` é usado em vez de `router.push()` porque o objetivo é revalidar os dados da página atual, não navegar para outra página. Isso é importante para o sistema de cache do Next.js.

## O bug do Prisma repository

Durante a integração visual, o instrutor encontrou outro problema: o repositório Prisma não tinha os métodos `create` e `findByTitle` implementados — só existiam as interfaces e os mocks nos testes. Isso mostra que testes com mocks validam comportamento, mas não substituem a implementação real. Os dois são complementares.

A implementação do `create` e `findByTitle` no Prisma foi direta:

```typescript
// create
await this.prisma.prompt.create({
  data: { title: data.title, content: data.content }
})

// findByTitle
const prompt = await this.prisma.prompt.findFirst({
  where: { title }
})
return prompt
```

## Cache — próximo passo

O instrutor menciona que o `router.refresh()` é uma solução temporária. Em aulas futuras, eles vão trabalhar com o sistema de cache do Next.js (revalidação via `revalidatePath` ou `revalidateTag`) para uma solução mais elegante.