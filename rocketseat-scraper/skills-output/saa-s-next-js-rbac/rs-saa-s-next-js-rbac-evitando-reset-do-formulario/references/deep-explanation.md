# Deep Explanation: Evitando Reset do Formulário (React 19)

## Por que o React 19 reseta formularios automaticamente?

No React 18, formularios nunca eram resetados automaticamente apos o submit. O desenvolvedor precisava manualmente chamar `form.reset()` quando desejasse limpar os campos. O React 19 inverteu esse comportamento: agora, ao usar o atributo `action` no `<form>`, o formulario e resetado automaticamente apos o submit.

O instrutor (Rocketseat) considera que isso "não foi muito uma feature" e que "a comunidade nem vai gostar tanto". A razao e pratica: quando um formulario retorna erro de validacao, o usuario perde todos os dados que digitou, precisando preencher tudo de novo.

## A solucao encontrada nas issues do React

O instrutor menciona que encontrou a solucao nas proprias issues do repositorio do React. Como o componente e um client component, a alternativa e voltar ao padrao classico:

1. Substituir `action={serverAction}` por `onSubmit={handleSubmit}`
2. Fazer `event.preventDefault()` manualmente
3. Construir o `FormData` a partir de `event.currentTarget`
4. Chamar a server action como funcao normal

## useActionState vs useState + useTransition

O useActionState oferece tres coisas em um unico hook:
- Estado do resultado da action
- A funcao action bindada ao form
- isPending automatico

Ao abandonar useActionState, voce precisa recriar essas tres funcionalidades:
- `useState` para o estado do resultado
- `useTransition` para o isPending (substitui o padrao manual de setIsLoading)
- Handler manual no onSubmit

O instrutor destaca que o useTransition e superior ao padrao antigo de `setIsLoading(true/false)` porque o React gerencia o estado automaticamente — tudo dentro do `startTransition` fica com `isPending = true`.

## Mudanca na assinatura da server action

Com useActionState, a action recebia `(previousState, formData)`. Sem useActionState, a action volta ao formato original: apenas `(formData)`. Esse primeiro parametro do estado anterior nao existe mais.

## requestFormReset — o reset manual

O React DOM agora exporta `requestFormReset(formElement)` para quando voce QUER resetar o formulario explicitamente. Isso da controle total: voce decide quando resetar (apos sucesso, por exemplo) e quando manter os dados (apos erro).

## Momento de transicao

O instrutor reconhece que o React esta em "momento de muita transicao" e que surgem "muitas duvidas e workarounds". A decisao entre useActionState e useState+useTransition depende do caso:
- Se o formulario pode perder dados no erro → useState + useTransition
- Se o formulario sempre limpa (ex: formulario de busca) → useActionState e aceitar o reset