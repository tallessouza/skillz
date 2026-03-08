# Deep Explanation: Select e Default Values no React Hook Form

## Por que Controller para Selects?

O `<select>` é um elemento HTML que mantém estado interno (qual option está selecionada). Quando usamos react-hook-form, precisamos que o **form library** controle esse estado, não o DOM nativo. O `Controller` faz essa ponte — ele cria um `field` object com `value`, `onChange`, `onBlur` e `ref` que substitui o controle nativo do select.

Sem Controller, o select opera de forma "uncontrolled" — o DOM mantém o estado e o react-hook-form não sabe o valor atual até o submit. Com Controller, cada mudança é capturada em tempo real.

## O conflito entre defaultValue nativo e defaultValues do useForm

O instrutor demonstrou um bug comum: quando você usa `<select defaultValue="react">` (propriedade nativa do HTML) **junto** com Controller, dois sistemas tentam controlar o valor inicial:

1. O HTML diz: "o valor inicial é 'react'"
2. O Controller/useForm diz: "o valor inicial é o que está em defaultValues"

Isso causa um warning no console e comportamento imprevisível. A solução é simples: **escolha um só sistema**. Como estamos usando react-hook-form, use `defaultValues` no `useForm()` e remova `defaultValue` do HTML.

## Locale e formatação de datas

O instrutor removeu o atributo `lang` do input date porque ele não tinha efeito — o formato de data (MM/DD/YYYY vs DD/MM/YYYY) é determinado pela configuração do **sistema operacional** do usuário, não pelo HTML. Se o SO está em inglês, aparece mês/dia/ano. Se está em português, aparece dia/mês/ano.

Isso é importante porque não adianta tentar forçar formato via HTML — é o browser que respeita o locale do SO.

## defaultValues é opcional

O instrutor demonstrou explicitamente: remover `defaultValues` e recarregar a página — tudo funciona. O formulário inicia com campos vazios e captura os valores normalmente no submit.

Porém, `defaultValues` é útil quando:
- Você quer pré-preencher um formulário de edição
- Quer manter valores após reload (combinado com persistência)
- Precisa de um valor inicial específico (ex: primeiro item do select já selecionado)

## O field spread e onde aplicar

O pattern `{...field}` espalha `value`, `onChange`, `onBlur` e `ref` no elemento. Para selects:

- **Correto:** `<select {...field}>` — o select recebe o controle
- **Errado:** `<option {...field}>` — options são filhos estáticos, não precisam de controle de estado

Cada option tem apenas `value` (o que vai para o form state) e children (texto de exibição). O value do option é diferente do texto — o instrutor mostrou isso quando o select exibia "React" mas o valor enviado era "react" (lowercase).