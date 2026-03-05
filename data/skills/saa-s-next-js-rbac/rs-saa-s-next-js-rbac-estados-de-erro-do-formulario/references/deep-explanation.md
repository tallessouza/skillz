# Deep Explanation: Estados de Erro do Formulário

## Por que safeParse e não parse?

O `parse` do Zod faz throw de um `ZodError` quando a validação falha. Em Server Actions, isso significaria que o erro cairia num catch genérico e perderia a granularidade dos erros por campo. O `safeParse` retorna um discriminated union: `{success: true, data}` ou `{success: false, error}`, permitindo tratamento explícito sem try/catch.

O instrutor enfatiza: "eu quero que ele faça a validação, mas caso essa validação falhe, eu não quero que ele dispare um erro, que ele faça um throw. Porque eu vou lidar com o erro de uma maneira manual."

## A estrutura de retorno padronizada

O insight central da aula é que **toda** Server Action deve retornar exatamente a mesma shape:

```typescript
{
  success: boolean       // operação deu certo?
  message: string | null // mensagem de erro da API ou genérica
  errors: Record<string, string[]> | null // erros de validação por campo
}
```

Isso elimina a necessidade de type guards complexos no componente. O `message` serve para erros de API (ex: "Invalid credentials") e também poderia servir para mensagens de sucesso ou informação. Os `errors` são exclusivamente erros de validação Zod, mapeados por nome do campo.

## Três camadas de erro

A action tem três cenários de erro distintos, cada um tratado de forma diferente:

1. **Validação (Zod)** — retorna antes de qualquer requisição, erros vão em `errors`
2. **Erro de API (HTTPError)** — a API respondeu com status de erro, mensagem vem do body JSON
3. **Erro inesperado** — qualquer outra coisa (rede, bug, etc), mensagem genérica

O instrutor chama atenção para verificar `error instanceof HTTPError` antes de tentar extrair a mensagem, porque o erro pode ter vindo de outras fontes.

## Por que `error.response.json()` retorna uma Promise?

O método `.json()` do Response é assíncrono porque precisa ler o body stream. Por isso o `await` é necessário: `const { message } = await error.response.json()`.

## Padronização do backend

O padrão funciona porque o backend foi construído para sempre enviar erros no formato `{message: string}`. O instrutor menciona: "eu padronizei para que todos os erros enviados, por exemplo, esses bad-request errors, fossem enviados dentro de uma propriedade message no corpo da requisição."

Sem essa padronização no backend, a extração de `message` no frontend não seria confiável.

## Inicialização do useActionState

O instrutor explica por que não iniciar com `null`: ao usar `{success: false, message: null, errors: null}` como estado inicial, o TypeScript garante que `state` sempre tem a mesma shape. Isso elimina checks de nullability no componente — `state.errors?.email` funciona sempre, sem precisar verificar se `state` existe primeiro.

## Estilização dos erros de validação

Classes usadas para mensagens de erro inline: `text-xs font-medium text-red-500 dark:text-red-400`. O padrão é colocar um `<p>` logo abaixo do input correspondente, com conditional rendering baseado na existência do erro para aquele campo.

## Alert component para erros de API

Para erros que não são de campo específico (erros de API), usa-se o componente Alert do ShadCN com `variant="destructive"`. O instrutor customizou as cores do tema dark para usar `border-red-400`, `text-red-400` e `svg red-400` no dark mode, e `red-500` no light mode.