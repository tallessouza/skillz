# Deep Explanation: Criando Novos Usuarios

## refine vs superRefine — quando usar cada um

O Zod oferece dois metodos para validacao customizada, e a diferenca e sutil mas importante:

**`refine`** recebe como parametro apenas o valor do campo ao qual esta encadeado. Funciona para validacoes que dependem exclusivamente daquele campo. Exemplo: verificar se um nome tem mais de uma palavra (nome completo).

```typescript
name: z.string().refine(
  (value) => value.split(' ').length > 1, // so tem acesso ao 'value' do name
  { message: 'Please enter your full name.' }
)
```

**`superRefine`** e chamado no objeto inteiro (`.object({...}).superRefine(...)`) e recebe dois parametros: `data` (todos os campos) e `ctx` (contexto para adicionar issues). Necessario quando a validacao depende de multiplos campos — como comparar `password` com `password_confirmation`.

```typescript
.superRefine((data, ctx) => {
  // data tem TODOS os campos: name, email, password, password_confirmation
  if (data.password !== data.password_confirmation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password confirmation does not match.',
      path: ['password_confirmation'], // indica QUAL campo recebe o erro
    })
  }
})
```

O `path` no `addIssue` e crucial — ele determina em qual campo o erro sera exibido na UI.

## never vs void em TypeScript

O instrutor explorou a diferenca entre `never` e `void` como tipo de retorno:

- **`void`**: a funcao nao retorna valor util, mas voce ainda pode capturar o resultado (`const result = fn()` compila sem erro, `result` sera `undefined`)
- **`never`**: a funcao NUNCA pode ter seu resultado utilizado. Se voce tentar `const result = fn()`, o TypeScript da erro, porque o tipo `never` nao pode ser atribuido a nenhuma variavel

Na pratica, `never` nao funcionou aqui porque "a function returning never cannot have a reachable endpoint" — ou seja, funcoes que retornam `never` devem ou lancar excecao ou ter loop infinito. Para funcoes async que simplesmente nao retornam dados uteis, `void` (ou omitir o tipo de retorno) e o correto.

## Separacao de responsabilidades: HTTP vs Server Action

A arquitetura separa em duas camadas:

1. **`http/sign-up.ts`** — funcao pura que faz a requisicao HTTP. Nao mexe com cookies, nao redireciona. Apenas envia `name`, `email`, `password` para a API.

2. **`actions.ts`** — server action que orquestra: valida com Zod, chama a funcao HTTP, trata erros, retorna estado para o formulario.

Essa separacao permite reusar a funcao HTTP em outros contextos (testes, scripts) sem dependencia de Next.js.

## TurboPack e bugs de cache

O Next.js com TurboPack (sucessor do Webpack) e significativamente mais rapido, mas na epoca da gravacao apresentava bugs de cache ao alterar muitos arquivos rapidamente. O sintoma tipico: erros de "use state not available in server component" mesmo com `'use client'` corretamente declarado. A solucao: reiniciar o dev server.

## Por que extrair o formulario em componente separado

A pagina (`page.tsx`) e um Server Component por padrao no App Router. Formularios precisam de hooks (`useState`, `useFormState`) que so funcionam em Client Components. Ao extrair apenas o formulario para um componente `'use client'`, a pagina continua sendo server-rendered (melhor SEO, menor bundle) e apenas o formulario interativo vai para o client.