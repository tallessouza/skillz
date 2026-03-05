# Deep Explanation: Pagina Criar Projeto

## Filosofia: Reuso por Copia Adaptada

O instrutor demonstra um padrao muito pragmatico de desenvolvimento front-end em SaaS: quando voce precisa de uma pagina para uma nova entidade (projeto) que e estruturalmente similar a uma existente (organizacao), a abordagem mais eficiente e copiar e adaptar.

Isso nao e "codigo duplicado" no sentido negativo — cada entidade tem seu proprio dominio, suas proprias validacoes, e seus proprios campos. A estrutura da pagina (page + form + actions) e um padrao arquitetural, nao duplicacao de logica.

## Por que nao abstrair num componente generico?

O instrutor nao cria um `<EntityForm>` generico. Isso e intencional:

1. **Cada entidade diverge rapidamente** — organizacao tem domain, slug, shouldAttachUsers. Projeto tem apenas nome e descricao. Uma abstracao generica seria mais complexa que as duas paginas separadas.
2. **Formularios sao folhas da arvore** — eles nao sao reutilizados em multiplos lugares. Cada um serve uma unica rota.
3. **Simplicidade > DRY** — tres arquivos simples e identicos em estrutura sao mais faceis de manter que um componente generico com configuracao.

## O padrao de 3 arquivos

Toda pagina de criacao no projeto segue:

```
create-{entity}/
├── page.tsx          → Layout e titulo
├── {entity}-form.tsx → Formulario com useFormState
└── actions.ts        → Server action com Zod schema
```

Essa separacao segue o principio de responsabilidade unica do Next.js App Router:
- `page.tsx` e o ponto de entrada da rota
- O form e um Client Component (precisa de interatividade)
- A action e um Server Action (roda no servidor)

## Action stub: validacao antes da API

Um insight importante do instrutor: mesmo sem a API implementada, a validacao do formulario ja funciona. Isso porque:

1. O schema Zod valida os dados no servidor (server action)
2. Os erros sao retornados via `useFormState`
3. O usuario ja ve feedback de validacao

Isso permite desenvolvimento paralelo: front-end avanca com validacao enquanto o back-end implementa a API.

## Simplificacao do schema

A organizacao tinha `refine()` para validacao customizada do dominio. O projeto nao precisa disso — e apenas `name` (string com minimo) e `description` (string simples). O instrutor remove ativamente codigo que nao pertence ao dominio do projeto, em vez de deixar commented out.

## Instalacao de componentes shadcn/ui

O instrutor nota que precisa do `Textarea` e instala via CLI do shadcn. Isso e um lembrete importante: componentes shadcn sao instalados sob demanda, nao vem todos pre-instalados. Sempre verifique se o componente existe antes de importar.