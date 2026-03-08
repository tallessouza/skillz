# Deep Explanation: onChange e Estado em Inputs React

## O que é o onChange?

O `onChange` é um event handler que o React disponibiliza em elementos de formulário (input, textarea, select). Ele **observa** o conteúdo do input e, toda vez que esse conteúdo muda (cada tecla digitada, cada caractere apagado), dispara a função callback que você passou.

O instrutor demonstrou isso ao vivo: ao digitar "React" no campo de nome do evento, cada letra gerou um log separado no console:
- Digitou `R` → log: `"R"`
- Digitou `E` → log: `"RE"` (não só `"E"`, porque `e.target.value` retorna o conteúdo **completo** do input)
- Digitou `A` → log: `"REA"`
- E assim por diante...

O ponto-chave: **onChange não retorna apenas a letra digitada, retorna o estado completo do input naquele momento**. Isso inclui quando você apaga — ao deletar o `T` de "REACT", o log mostra `"REAC"`.

## O objeto de evento (e)

O parâmetro recebido pela função do onChange é um **objeto de evento sintético do React** (SyntheticEvent). O instrutor mostrou que você pode nomear como quiser — ele usou `batata` para provar que é apenas um parâmetro de função. Mas a convenção é `e` (abreviação de "event" ou "evento").

Dentro desse objeto:
- `e.target` → referência ao elemento DOM do input
- `e.target.value` → o valor atual do input (string)

O caminho `e.target.value` é o que importa. O instrutor enfatizou: "é o caminho para a gente recuperar qual é o valor desse input nesse momento".

## De console.log para useState

O fluxo natural que o instrutor apresentou:

1. **Primeiro, console.log para entender:** Colocou `console.log(e.target.value)` no onChange para visualizar o comportamento
2. **Depois, substituiu por estado:** Trocou o `console.log` por `setName(e.target.value)`

Essa progressão é pedagógica — mostra que onChange + console.log é ótimo para debugging, mas em produção você armazena o valor em estado.

## O ciclo de re-renderização

O instrutor explicou a cadeia completa:

1. Usuário digita no input
2. `onChange` dispara
3. `setName(e.target.value)` atualiza o estado
4. React detecta mudança de estado
5. Componente re-renderiza
6. O novo valor aparece na tela (ex: `<p>Evento: {name}</p>`)

A frase-chave do instrutor: "Toda vez que um estado muda, ele gera uma nova renderização ali na nossa tela."

## Padrão de nomenclatura do useState

O instrutor estabeleceu o padrão com clareza:
- `name` → o valor atual do estado (getter)
- `setName` → a função que atualiza o estado (setter)
- Convenção: prefixo `set` + nome do estado com primeira letra maiúscula

"A gente sempre vai padronizar com set e o nome do próprio estado em si."

## Valor inicial

O instrutor usou `useState("")` — string vazia como valor inicial. Isso é importante porque:
- O input começa vazio
- O tipo do estado fica consistente (sempre string)
- Evita `undefined` sendo exibido na tela antes da primeira digitação

## Contexto: controlado vs não controlado

O instrutor mencionou que essa aula é a **base** para entender inputs controlados e não controlados. Nesta aula, o input ainda é **não controlado** — o onChange captura o valor, mas não há `value={name}` no input. A próxima aula abordaria a adição de `value` para torná-lo controlado.