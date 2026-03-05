# Deep Explanation: Label e Acessibilidade em Formulários HTML

## Por que leitores de tela não leem placeholder?

O atributo `placeholder` foi projetado como uma **dica visual** para o usuário. Ele aparece dentro do campo antes de o usuário digitar, mas:

- A maioria dos leitores de tela (NVDA, JAWS, VoiceOver) **não anuncia o placeholder como o nome acessível do campo**
- O placeholder desaparece quando o usuário começa a digitar, eliminando qualquer referência visual
- Usuários com deficiência cognitiva podem confundir placeholder com valor já preenchido

Como o instrutor destaca: *"é bonito, mas ele não lê"* — o placeholder é estético, não semântico.

## O mecanismo de associação for/id

Quando um `<label>` tem o atributo `for` apontando para o `id` de um input:

1. O leitor de tela anuncia o texto do label quando o input recebe foco
2. Clicar no label transfere foco para o input (comportamento nativo do browser)
3. A área clicável do campo efetivamente aumenta (melhora usabilidade touch)

O instrutor demonstra isso: *"se eu clico aqui, eu automaticamente seleciono aquele input ali"*.

## Alternativa: input dentro do label

A especificação HTML permite associação implícita quando o input está **dentro** do elemento label:

```html
<label>
  Nome
  <input type="text" name="nome">
</label>
```

Nesse caso:
- Não é necessário `for` nem `id`
- A associação é automática pelo DOM
- O leitor de tela entende que "Nome" é o label do input

O instrutor menciona: *"eu não preciso do for, e aí talvez eu não vou precisar de um ID, vai depender muito do que eu tô configurando no meu input"*.

### Quando usar cada abordagem

- **for/id (preferido pelo instrutor):** Mais explícito, funciona independente da estrutura DOM, mais fácil de estilizar com CSS
- **Input dentro do label:** Menos atributos, útil em componentes simples, mas pode complicar estilização

## Escondendo labels sem removê-los

O instrutor faz um ponto crucial: designs modernos frequentemente não mostram labels visíveis, mas **removê-los do HTML quebra acessibilidade**.

A estratégia correta é a classe `.visually-hidden` (anteriormente conhecida como `.sr-only`):

- O elemento **existe no DOM** → leitores de tela o encontram
- O elemento é **invisível visualmente** → não afeta o layout
- Diferente de `display: none` ou `visibility: hidden`, que **também escondem de leitores de tela**

Como o instrutor diz: *"existem estratégias da gente esconder o label, mas ele tem que estar presente no HTML, a gente esconde depois pelo CSS"*.

## Preferência do instrutor

O instrutor declara preferir a abordagem for/id:

*"Eu, por padrão pessoal, eu gosto de usar dessa forma primeiro aqui"* — referindo-se ao padrão `<label for="x">` + `<input id="x">`.

Esta é a forma mais universalmente suportada e a mais fácil de manter em projetos grandes onde label e input podem estar em containers DOM diferentes.