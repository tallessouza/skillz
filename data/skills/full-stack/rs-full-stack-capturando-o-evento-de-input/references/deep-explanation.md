# Deep Explanation: Capturando o Evento de Input

## Por que `oninput` e nao `onchange`?

O instrutor escolhe `oninput` deliberadamente. A diferenca fundamental:

- **`oninput`**: Dispara a **cada caractere** digitado, apagado, colado ou qualquer interacao que modifique o conteudo do input. E como um observador em tempo real — cada mudanca e detectada imediatamente.
- **`onchange`**: So dispara quando o campo **perde o foco** (blur). O usuario poderia digitar "abc123" e so ao clicar fora o evento dispararia — tarde demais para validacao caractere a caractere.

### A analogia do porteiro

Pense no `oninput` como um porteiro que verifica cada pessoa que entra. O `onchange` seria um porteiro que so confere a lista depois que todo mundo ja entrou. Para validacao de input numerico, voce precisa do porteiro na porta, nao no final da festa.

## Por que validar caractere a caractere?

O instrutor destaca: "cada caractere é um novo conteúdo entrando ali no input". Isso e poderoso porque:

1. **Feedback imediato** — o usuario ve instantaneamente que letras nao sao aceitas
2. **Prevencao** — caracteres invalidos nunca aparecem no campo
3. **Captura completa** — ate o ato de apagar (backspace/delete) dispara o evento

## Organizacao com comentarios de secao

O instrutor enfatiza usar comentarios como `// Seleciona os elementos do formulario` para:
- Documentar o proposito de cada bloco de codigo
- Facilitar revisao e manutencao futura
- Manter o projeto organizado conforme cresce

Essa pratica e especialmente importante em projetos vanilla JS onde nao ha framework impondo estrutura.

## `getElementById` como estrategia de selecao

Quando o elemento HTML tem um `id`, usar `getElementById` e a forma mais direta e semantica de seleciona-lo. O instrutor verifica primeiro o HTML, identifica o ID do elemento, e entao usa esse ID no JavaScript. Esse fluxo de trabalho — **inspecionar HTML primeiro, depois selecionar** — e fundamental para desenvolvimento frontend.

## O evento `oninput` captura TUDO

Um ponto sutil que o instrutor demonstra: o evento nao dispara apenas ao digitar. Ele dispara em qualquer modificacao:
- Digitar um caractere
- Apagar com backspace ou delete
- Colar conteudo (Ctrl+V)
- Autocomplete do navegador
- Drag and drop de texto

Isso torna `oninput` a escolha mais robusta para validacao em tempo real.