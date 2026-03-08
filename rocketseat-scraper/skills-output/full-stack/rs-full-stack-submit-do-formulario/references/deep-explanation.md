# Deep Explanation: Submit do Formulário em React

## Por que o formulário recarrega a página?

O comportamento padrão de um `<form>` HTML é fazer um envio HTTP (GET ou POST) para o servidor quando um botão `type="submit"` é clicado dentro dele. Isso causa um reload completo da página — que no contexto de uma SPA React significa perda total do estado da aplicação.

O instrutor demonstra isso ao vivo: preenche campos (texto, data, select, textarea), clica em "Salvar", e todos os dados desaparecem porque a página foi recarregada.

## preventDefault() — O mecanismo de prevenção

O método `e.preventDefault()` do objeto Event cancela o comportamento padrão do evento sem impedir sua propagação. No caso do submit:
- **Comportamento padrão cancelado:** envio HTTP + reload da página
- **O que continua funcionando:** o evento ainda dispara, a função handler executa normalmente

## onClick no botão vs onSubmit no formulário

O instrutor mostra duas abordagens e demonstra por que a segunda é superior:

### Abordagem 1: onClick no botão (funciona, mas inferior)
```tsx
<button type="submit" onClick={onSubmit}>Salvar</button>
```
- Funciona para prevenir o reload
- **Problema de tipagem:** o evento é `React.MouseEvent<HTMLButtonElement>`, não `FormEvent`
- **Problema de acessibilidade:** não captura submissão via tecla Enter
- **Problema semântico:** o submit é um evento do formulário, não do botão

O instrutor inclusive demonstra dificuldade com a tipagem ao usar `onClick` — o TypeScript não reconhece `React.FormEvent<HTMLFormElement>` no contexto de um clique de botão, porque o tipo correto seria `HTMLButtonElement`.

### Abordagem 2: onSubmit no formulário (correta)
```tsx
<form onSubmit={onSubmit}>
  <button type="submit">Salvar</button>
</form>
```
- Captura QUALQUER forma de submissão (clique, Enter, programática)
- Tipagem correta: `React.FormEvent<HTMLFormElement>`
- Semanticamente correto: o evento pertence ao formulário

## Fluxo de eventos do submit

1. Usuário clica no botão `type="submit"` (ou pressiona Enter)
2. O botão aciona o evento `submit` do formulário pai
3. O handler `onSubmit` do `<form>` é chamado
4. `e.preventDefault()` cancela o envio HTTP
5. O código customizado executa (salvar dados, chamar API, etc.)
6. O estado React é preservado — nenhum reload acontece

## Insight do instrutor sobre o botão sem type

O instrutor destaca que `<button>` dentro de um `<form>` tem `type="submit"` por padrão. Isso é uma pegadinha comum — se você adicionar um botão "Cancelar" sem especificar `type="button"`, ele também vai submeter o formulário ao ser clicado.