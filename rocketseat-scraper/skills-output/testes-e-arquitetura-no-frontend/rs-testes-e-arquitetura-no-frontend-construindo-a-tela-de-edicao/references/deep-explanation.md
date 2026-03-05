# Deep Explanation: Construindo a Tela de Edicao

## TDD de Fora pra Dentro (Outside-In TDD)

O instrutor demonstra uma abordagem de TDD onde o teste end-to-end e a "meta" e voce constroi os passos intermediarios ate ele passar. A analogia: "eu estabeleci uma meta e agora vou ter que correr atras dela". O teste E2E valida o comportamento completo (inserir prompt, acessar, editar, verificar atualizacao) e os passos intermediarios sao:

1. Ajustar o formulario para suportar edicao (defaults, bifurcacao)
2. Criar a server action de update
3. Criar o schema de validacao
4. Criar o use case
5. Implementar o metodo no repository

Cada passo gera erros temporarios que vao sendo resolvidos incrementalmente. O instrutor chama isso de "gerenciar a ansiedade" — voce sabe que tem erros, mas resolve um de cada vez.

## Por que Actions Separadas (e nao uma so)

O instrutor separa `createPromptAction` e `updatePromptAction` mesmo sendo parecidas. Razoes:

- **Single Responsibility Principle (SRP)**: cada action muda por motivos diferentes. Create pode ganhar campos opcionais, update pode precisar de validacao de permissao.
- **Assinaturas diferentes**: update precisa de ID, create nao.
- **Error handling diferente**: update precisa tratar "not found", create nao.

## FormState Compartilhado vs Separado

O instrutor cria um tipo `FormState` novo ao inves de reusar o `SearchFormState` existente porque:

- Search retorna `prompts[]`, CRUD retorna `success/message/errors`
- "Como eles podem mudar por motivos diferentes, ja entra o S do SOLID"
- Manter tipos separados permite evolucao independente

Ele menciona que daria pra usar `extends` para compartilhar campos comuns (success, message), mas opta por manter separado "por enquanto" — pragmatismo sobre pureza.

## Partial no Repository Update

O uso de `Partial<CreatePromptDto>` no metodo `update` do repository permite editar apenas alguns campos. No Prisma, isso se traduz em:

```typescript
data: {
  ...(data.title !== undefined ? { title: data.title } : {}),
  ...(data.content !== undefined ? { content: data.content } : {}),
}
```

Campos `undefined` nao sao enviados ao banco, evitando sobrescrever com null.

## WebServer do Playwright

O instrutor destaca que com o `webServer` configurado no Playwright, nao e necessario rodar `npm run dev` manualmente. O Playwright sobe o servidor automaticamente antes dos testes E2E e mata depois. Isso evita:

- Esquecer de subir o servidor
- Conflitos de porta
- Estado sujo entre runs

## Erro no Teste: heading vs content

Um bug no teste E2E buscava `updatedContent` como heading, mas o conteudo nao e um heading — o titulo sim. A correcao foi buscar `updatedTitle` como heading. Licao: testes E2E devem buscar elementos pela semantica correta (role + name).