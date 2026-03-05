# Deep Explanation: Editando um Agendamento

## Por que children pattern em vez de prop "mode"?

O instrutor escolheu passar o botao como `children` em vez de criar uma prop `mode: 'create' | 'edit'` com renderizacao condicional interna. A razao e flexibilidade composicional: o componente pai controla completamente a aparencia do trigger sem que o formulario precise conhecer todas as variantes possiveis.

No appointment card, o botao de edicao e um icone pequeno (`variant="edit"`, `size="icon"`) com um `Pen` de 16px. Na page principal, o botao de criacao e grande com texto. O mesmo componente `AppointmentForm` serve ambos sem nenhum `if/else` interno para triggers.

## Por que useEffect + form.reset?

O instrutor mencionou que "existem varias formas de fazer isso" e escolheu `useEffect` com `form.reset()`. A razao: o react-hook-form gerencia estado interno, e `reset()` e o metodo oficial para sincronizar valores externos com o estado do formulario. Passar via `defaultValues` no `useForm` so funciona na montagem inicial — nao atualiza se os dados mudarem.

## Fluxo de composicao

```
Page (criacao)
  └── AppointmentForm
        └── children = <Button>Novo Agendamento</Button>

AppointmentCard (edicao)
  └── AppointmentForm appointment={appointment}
        └── children = <Button variant="edit" size="icon"><Pen /></Button>
```

## Sobre o appointment como undefined

O tipo `appointment?: Appointment` e undefined na criacao porque simplesmente nao existe dado previo. O instrutor enfatizou: "Na criacao do nosso componente, do nosso agendamento, a gente nao vai ter ele. Vai ser so na edicao." Isso elimina a necessidade de criar dados mock ou defaults artificiais.

## Proximos passos mencionados

O instrutor finalizou dizendo que o submit ainda nao diferencia create de update — so existe a funcao de create. A proxima aula criara uma nova server action para update. Isso mostra o padrao incremental: primeiro flexibilize o componente, depois adicione a logica de persistencia.