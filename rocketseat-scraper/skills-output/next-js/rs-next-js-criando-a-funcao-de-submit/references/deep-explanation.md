# Deep Explanation: Criando a Funcao de Submit

## Por que unificar date e time?

O instrutor explica que no schema do Prisma existe apenas um campo `scheduleAt` do tipo `DateTime`. Nao existem campos separados para date e time. Isso significa que o formulario, que tem inputs separados de data e horario, precisa de uma tratativa no submit para combinar os dois valores num unico DateTime antes de enviar ao banco.

O input de time retorna uma string no formato `"10:00:00"`. O instrutor demonstra que ao fazer `console.log` dos dados do formulario, o time vem como string. Para transformar isso em algo utilizavel, ele usa `split(':')` que transforma `"10:00:00"` em `["10", "00", "00"]`, e entao desestrutura pegando apenas `hour` e `minutes`.

## A mecanica do setHours

`setHours(hours, minutes, seconds, milliseconds)` e um metodo nativo do JavaScript que modifica um objeto Date in-place. O instrutor:

1. Cria um novo Date a partir do `data.scheduleAt` (que ja vem como Date do date picker)
2. Usa `setHours` para injetar a hora e os minutos selecionados pelo usuario
3. Passa `0, 0` para segundos e milissegundos porque nao sao relevantes para agendamentos

A conversao com `Number()` e necessaria porque `split` retorna strings, e `setHours` espera numeros.

## Sonner como lib de toasts

O instrutor escolhe o Sonner (`pnpm add sonner`) como biblioteca de toast notifications. A configuracao requer:

1. **Provider global**: O componente `<Toaster />` deve ser colocado no `layout.tsx` (layout raiz), por fora ou por baixo do `{children}`. Isso garante que qualquer componente da aplicacao pode disparar toasts.

2. **Position**: O instrutor configura `position="top-right"` no Toaster, mas existem outras opcoes disponiveis.

3. **Uso**: Importar `toast` do `sonner` e chamar `toast.success('mensagem')` onde necessario.

## O fluxo completo do submit

O instrutor deixa claro que o submit ainda esta incompleto nesta aula:
- Dados estao sendo preparados (date/time unificados)
- Toast de sucesso ja esta configurado
- Mas a server action ainda nao foi criada — sera feita na proxima aula
- O console.log ainda esta ativo para debug

Isso demonstra um padrao de desenvolvimento incremental: preparar os dados no cliente primeiro, validar que o fluxo funciona com console.log e toasts, e so depois conectar ao backend.