# Deep Explanation: Validação de Formulários com Zod

## Por que Zod e não validação manual?

O instrutor mostra que antes de adicionar Zod, o formulário já recupera os valores dos inputs (name, email, password, passwordConfirm) — mas não valida nada. O `console.log` simplesmente imprime os dados. Zod transforma validação de "if/else manual" para "schema declarativo" — cada campo tem suas regras definidas em um único lugar.

## O fluxo completo do formulário

1. **Inputs controlados** — O componente já possui estados (`name`, `email`, `password`, `passwordConfirm`) vinculados aos inputs
2. **onSubmit** — Quando o formulário é submetido, os dados passam pelo schema Zod
3. **Schema valida** — Se inválido, `parse()` lança `ZodError`; se válido, retorna os dados tipados
4. **Tratamento de erro** — `instanceof ZodError` identifica erro de validação vs erro genérico
5. **Loading state** — `finally` garante que o loading é desativado independente do resultado

## A escolha de `.parse()` vs `.safeParse()`

O instrutor usa `.parse()` que lança exceção em caso de erro. Isso se encaixa no padrão try/catch que ele já estabeleceu para o submit. A alternativa `.safeParse()` retorna `{ success, data, error }` sem lançar exceção — útil quando você quer evitar try/catch, mas aqui o try/catch já é necessário para erros de rede.

## Por que `.trim()` antes de `.min()`

O instrutor coloca `z.string().trim().min(1)` no campo nome. Sem o trim, um usuário poderia enviar `"   "` (apenas espaços) e passaria na validação de `min(1)`. O trim remove espaços antes de validar o comprimento real.

## A técnica do `.refine()` para validação cross-field

Esta é a parte mais interessante da aula. O instrutor explica que validação de campo individual (min, max, email) é simples. Mas comparar dois campos (password === passwordConfirm) requer acesso ao objeto inteiro. É por isso que `.refine()` é chamado no objeto, não no campo:

```typescript
.refine((data) => data.password === data.passwordConfirm, {
  message: "As senhas não são iguais",
  path: ["passwordConfirm"],  // associa o erro ao campo correto
})
```

O `path` é crucial — sem ele, o erro fica "flutuante" sem associação a nenhum campo. Com `path: ["passwordConfirm"]`, o erro aparece vinculado ao campo de confirmação.

## Padrão try/catch/finally para loading

O instrutor destaca o finally como o lugar correto para desativar o loading:

- **try**: ativa loading, executa validação e request
- **catch**: trata erro (Zod ou genérico)
- **finally**: desativa loading — executa SEMPRE, seja sucesso ou erro

Se o `setIsLoading(false)` estivesse no try (após a request), um erro impediria a desativação. Se estivesse duplicado no try e catch, seria código redundante. O finally resolve ambos os problemas.

## O papel do `required` no HTML vs Zod

O instrutor observa que o atributo `required` no input do nome já fornece validação básica do browser. Mas isso é validação HTML — facilmente burlável e sem mensagens customizadas. O Zod fornece validação programática confiável com mensagens controladas.

## ZodError e a estrutura de issues

Quando `.parse()` falha, o `ZodError` contém um array `issues` onde cada item tem:
- `message`: a mensagem customizada definida no schema
- `path`: o caminho do campo que falhou
- `code`: o tipo de erro Zod

O instrutor usa `error.issues[0].message` para exibir apenas o primeiro erro. Em produção, você poderia iterar sobre todos os issues para exibir múltiplos erros simultaneamente.

## Integração com estado de loading do botão

O instrutor mostra que o `isLoading` controla o estado visual do botão — quando true, o botão recebe `cursor: progress` e `disabled: true`. Isso previne double-submit e dá feedback visual ao usuário. O componente Button já implementa essa lógica internamente, bastando passar o prop `isLoading`.