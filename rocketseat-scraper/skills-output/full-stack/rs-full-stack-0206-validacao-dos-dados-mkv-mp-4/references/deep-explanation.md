# Deep Explanation: Validação de Dados com Zod

## Por que Zod e não validação manual?

O instrutor demonstra uma progressão clara: primeiro mostra o que acontece SEM tratamento de exceção (a aplicação quebra), depois adiciona try-catch, e finalmente substitui alerts por mensagens inline. Essa progressão pedagógica revela um princípio importante: **validação não é opcional, é infraestrutura**.

Quando `schema.parse()` é chamado sem try-catch, o Zod lança uma exceção do tipo `ZodError`. Se essa exceção não é capturada, ela propaga até o framework (Next.js/React), que exibe um erro genérico e quebra a experiência do usuário. O instrutor propositalmente deixou isso acontecer para mostrar a consequência.

## O padrão trim + min para senhas

O instrutor usa `.trim().min(1, "Informe a senha")` com uma demonstração visual: ele digita apenas espaços no campo de senha e mostra que, após o trim, a string fica vazia e o `min(1)` captura o erro.

Isso é uma **estratégia de sanitização embutida na validação**. Em vez de sanitizar em um passo separado e validar em outro, o Zod permite encadear transformações e validações na mesma pipeline. O trim remove espaços antes do min avaliar o comprimento.

Sem o trim, um usuário poderia enviar `"   "` (3 espaços) como senha e passaria na validação de `min(1)`, porque a string tem 3 caracteres. Com trim, esses espaços são removidos primeiro.

## instanceof ZodError — por que é necessário

O catch captura QUALQUER erro, não apenas erros de validação. Pode ser um erro de rede, um TypeError, ou qualquer outra coisa. O `instanceof ZodError` permite diferenciar:

```typescript
catch (error) {
  if (error instanceof ZodError) {
    // Erro de validação — mensagem amigável do schema
    return { message: error.issues[0].message }
  }
  // Erro genérico — mensagem segura que não expõe detalhes internos
  return { message: "Não foi possível entrar." }
}
```

Sem essa verificação, você poderia tentar acessar `error.issues` em um erro que não é ZodError, causando outro erro.

## Por que retornar objeto ao invés de alert

O instrutor explicitamente remove os alerts e substitui por `return { message: "..." }`. O raciocínio:

1. **Alerts bloqueiam a thread** — o usuário precisa clicar OK para continuar
2. **Alerts não são estilizáveis** — parecem nativos do browser, fora do design
3. **Alerts não são acessíveis** — leitores de tela têm problemas com eles
4. **O retorno da action popula o state** — usando `useActionState`, o valor retornado pela action fica disponível como `state` no componente, permitindo exibição inline

O padrão é: a Server Action retorna um objeto `{ message: string }`, o `useActionState` captura esse retorno no `state`, e o JSX renderiza `state?.message` condicionalmente.

## Extraindo dados do FormData inline

Em vez de criar constantes separadas:
```typescript
const email = formData.get("email")
const password = formData.get("password")
```

O instrutor passa diretamente para o parse:
```typescript
const data = signInSchema.parse({
  email: formData.get("email"),
  password: formData.get("password"),
})
```

Isso é mais conciso e, após o parse, `data` já tem os tipos corretos inferidos pelo Zod. Se a validação falhar, o erro é lançado antes de qualquer processamento.

## O underscore para estado anterior não utilizado

O instrutor usa `_` como nome do primeiro parâmetro da action (estado anterior) quando não precisa dele:

```typescript
async function signIn(_: { message: string } | null, formData: FormData) {
```

Isso é uma convenção TypeScript/JavaScript para indicar que o parâmetro existe (é necessário pela assinatura do useActionState) mas não será usado no corpo da função.

## Estilização da mensagem de erro

O instrutor usa classes Tailwind para a mensagem inline:
- `text-sm` — tamanho menor que o texto normal
- `text-red-600` — cor vermelha indicando erro
- `text-center` — centralizado como o formulário
- `my-4` — margem vertical para separar do input e do botão
- `font-medium` — peso médio para destaque sem ser bold

A mensagem fica entre o último input e o botão de submit, que é a posição mais natural para feedback de validação.