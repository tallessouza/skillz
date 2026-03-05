# Deep Explanation: Melhorando o Feedback para o Usuario

## Por que FormMessage funciona "magicamente"

O shadcn/ui usa react-hook-form por baixo. Quando voce define um schema Zod no `useForm` com `zodResolver`, cada campo do formulario tem seu estado de erro gerenciado automaticamente. O componente `FormMessage` acessa o contexto do `FormField` pai e renderiza a mensagem de erro correspondente — sem nenhum wiring manual.

O instrutor destaca isso: "Basta importar o FormMessage, colocar dentro do FormItem, e salvar. Ja apareceu. E so isso." Essa simplicidade e o ponto — o ecossistema shadcn/ui + Zod + react-hook-form foi desenhado para eliminar boilerplate de validacao.

## Estrategia de teste: falso positivo

O instrutor demonstra uma tecnica importante de verificacao de testes: apos o teste passar, ele deliberadamente altera o texto esperado (adiciona caracteres extras) para confirmar que o teste realmente quebra. Isso valida que o teste nao e um falso positivo — ele esta de fato verificando a mensagem correta.

Citacao do instrutor: "Vamos ver se ele e um falso positivo. Deixa eu colocar um 'ou a mais' aqui. Beleza. Quebrou. Porque ele encontrou 'O titulo e obrigatorio' so que sem os dois 'os' ali no final."

## Separacao Server Component vs Client Component

O instrutor refatora o sidebar para seguir o padrao correto do Next.js App Router:

1. **Server Component (sidebar.tsx)**: Instancia o repository, faz o fetch, trata erros com try/catch, e mapeia os dados para o formato necessario
2. **Client Component (sidebar-content.tsx)**: Recebe dados via props, so renderiza

O try/catch no server component e importante: se o banco falhar, o componente nao quebra — ele simplesmente exibe uma lista vazia. O instrutor explicitamente nao usa o objeto `error` no catch porque nao precisa dele nesse contexto.

## OrderBy no Repository

O instrutor mostra que a ordem dos prompts na sidebar ja vem correta porque o `findMany` do PrismaPromptRepository tem um `orderBy` definido. Isso reforça o valor do repository pattern — comportamentos como ordenacao ficam encapsulados e consistentes em toda a aplicacao.