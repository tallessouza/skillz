# Deep Explanation: Select de Horario com React Hook Form

## Por que onValueChange e nao onChange?

O componente Select do Radix UI (base do shadcn/ui) nao e um input HTML nativo. Ele nao dispara eventos `onChange` padrao do DOM. Em vez disso, expoe uma prop `onValueChange` que recebe diretamente o valor selecionado (string), nao um evento. Por isso, ao integrar com React Hook Form, conectamos `onValueChange={field.onChange}` — o field.onChange do RHF aceita tanto eventos quanto valores diretos.

Da mesma forma, `value={field.value}` garante que o Select reflita o estado atual do formulario (controlled component).

## Estrutura do Select (Radix/shadcn)

O Select e composto por partes:

1. **Select** (root) — gerencia estado aberto/fechado e valor selecionado
2. **SelectTrigger** — o botao que o usuario clica para abrir
3. **SelectValue** — exibe o valor selecionado ou placeholder
4. **SelectContent** — o dropdown que aparece
5. **SelectItem** — cada opcao individual

Essa composicao permite customizacao total do trigger (adicionar icones, mudar layout) sem perder a logica de acessibilidade do Radix.

## Por que gerar horarios com Array.from?

O instrutor mostra que os horarios vao de 9h ate 21h. Em vez de escrever 13 opcoes manualmente, usamos geracao programatica. Isso:
- Evita erros de digitacao
- Facilita mudancas no range (basta mudar os numeros)
- Mantem o codigo DRY

## Padrao visual com icone no Trigger

O instrutor usa o icone `Clock` do Lucide React dentro do SelectTrigger, envolvido numa div com `flex items-center gap-2`. Esse e o mesmo padrao usado nos outros campos do formulario (consistencia visual). O icone tem classes `h-4 w-4 text-muted-foreground` — tamanho 16px e cor suave para nao competir com o texto.

## Integracao com Zod Schema

O campo `time` ja foi adicionado ao schema Zod na aula anterior. O Select so funciona corretamente porque o schema valida que `time` e uma string obrigatoria. O FormField conecta o schema ao componente via `control={form.control}` e `name="time"`.

## Estilo consistente

O instrutor menciona que o estilo inicial ficou "bem ruinsao" e depois aplicou o mesmo padrao CSS dos outros campos. A chave e manter o SelectTrigger com as mesmas classes de altura, borda e padding dos outros inputs do formulario, garantindo alinhamento visual.