# Deep Explanation: Input de Telefone com Máscara

## Por que usar uma biblioteca de mascara?

O instrutor destaca que existem varias formas de implementar mascaras: libs dedicadas, regex manual, ou manipulacao direta de string. A escolha pelo React iMask se da por:

1. **Economia de tempo** — criar regex para mascaras e trabalhoso e propenso a bugs. O instrutor enfatiza repetidamente: "isso aqui poupa um tempo muito, muito bom"
2. **Declaratividade** — voce descreve o FORMAT desejado (`(00) 00000-0000`) e a lib cuida do resto
3. **Flexibilidade** — qualquer formato pode ser passado no prop `mask`, nao apenas telefone

## Como o iMask interpreta o prop `mask`

O caractere `0` no iMask significa "qualquer digito (0-9)". Entao:
- `(00) 00000-0000` = parenteses fixos, espaco fixo, hifen fixo, e slots numericos
- O usuario so consegue digitar numeros nos slots de `0`
- Caracteres fixos (parenteses, espaco, hifen) sao inseridos automaticamente

## Integracao com formularios

No contexto da aula, o input de telefone fica posicionado entre os campos de nome (tutor e pet) e a descricao. O padrao usado e o mesmo `FormField` do Shadcn UI, com a diferenca de que dentro do `FormControl` usa-se `IMaskInput` ao inves de `Input`.

O instrutor copia a estrutura de um campo existente e adapta:
- Troca o `name` para `phone`
- Troca o icone para `Phone` do Lucide
- Substitui o `Input` pelo `IMaskInput`
- Adiciona o prop `mask`

## Estilizacao

O instrutor menciona que a estilizacao do componente e extensa e nao e o foco da aula. O ponto importante e: **o IMaskInput aceita `className` normalmente**, entao basta aplicar as mesmas classes Tailwind dos outros inputs para manter consistencia visual.

Um detalhe pratico mencionado: o input inicialmente ficou com altura menor que os demais (`h-10` vs `h-12`). A correcao foi simplesmente ajustar para `h-12` — mesma altura dos outros campos.

## Quando usar regex vs biblioteca

O instrutor recomenda aprender regex ("e legal tambem criar um regex ali"), mas para producao, a biblioteca e mais pragmatica:
- Regex: bom para aprendizado, validacao server-side, cenarios simples
- Biblioteca: melhor para UX de input em tempo real, formatos complexos, manutencao a longo prazo

## Valor limpo vs valor formatado

Ponto critico na integracao: o form state geralmente precisa do valor SEM mascara (apenas digitos), enquanto o usuario ve o valor COM mascara. O `IMaskInput` oferece dois callbacks:
- `onAccept(value, mask)` — `value` e o valor sem mascara
- `onChange(event)` — evento padrao com valor formatado

Para enviar ao backend, use `onAccept` e armazene o valor limpo.