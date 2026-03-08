# Deep Explanation: Definindo Valor Inicial com useForm

## Por que o warning aparece sem defaultValues

Quando você usa `useForm()` sem `defaultValues`, os campos começam como `undefined`. No React, um input com `value={undefined}` é considerado **uncontrolled** (não-controlado). No momento em que o usuário digita algo, o valor muda de `undefined` para uma string, e o React detecta que o input passou de uncontrolled para controlled — gerando o warning:

> "A component is changing an uncontrolled input to be controlled"

Esse warning existe porque o React precisa saber desde o início se o componente gerencia o valor do input ou se o DOM gerencia. Misturar os dois modos causa comportamentos imprevisíveis.

## Como defaultValues resolve

Ao passar `defaultValues: { name: "" }`, o `useForm` inicializa o campo `name` com uma string vazia desde a primeira renderização. Isso significa que o input já nasce como **controlled** — o React sabe desde o início que o valor é gerenciado pelo componente.

O instrutor demonstra isso ao vivo: antes do `defaultValues`, digitar no campo causava o alerta. Depois de adicionar `defaultValues` com string vazia e recarregar a página, o alerta desaparece completamente.

## Submit via Enter

O instrutor destaca um comportamento nativo do browser que muitos desenvolvedores não conhecem: quando um formulário tem um handler de `onSubmit` (via `handleSubmit` do React Hook Form), o usuário pode submeter o formulário tanto clicando no botão de submit quanto pressionando Enter em qualquer campo de texto.

Isso acontece porque o browser nativamente dispara o evento `submit` do `<form>` quando o usuário pressiona Enter dentro de um input que está dentro de um form com um botão `type="submit"`. Não é necessário código adicional — é comportamento padrão do HTML.

Essa é uma funcionalidade importante para a experiência do usuário, especialmente em formulários simples com poucos campos, onde pressionar Enter é mais rápido do que mover o mouse até o botão.

## Analogia: Controlled vs Uncontrolled

Pense em um input como um interruptor de luz:
- **Uncontrolled:** O interruptor funciona sozinho, sem automação. O React não sabe em que posição está.
- **Controlled:** O interruptor está conectado a um sistema de automação. O React sempre sabe a posição e decide quando mudar.

Passar de uncontrolled para controlled é como instalar a automação no meio do uso — o sistema fica confuso sobre quem está no controle. Por isso o React avisa.

## Quando usar valores diferentes de string vazia

- **Campos numéricos:** Use `0` como default, não `""`, para evitar problemas de tipagem
- **Checkboxes:** Use `false` como default
- **Selects:** Use o valor da primeira opção como default
- **Formulários de edição:** Passe os dados carregados da API diretamente no `defaultValues`, ou use `reset()` após carregar os dados