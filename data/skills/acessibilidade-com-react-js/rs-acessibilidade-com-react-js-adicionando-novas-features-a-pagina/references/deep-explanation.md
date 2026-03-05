# Deep Explanation: Modal Acessivel em React

## O que sao atributos WAI-ARIA

O instrutor explica que ARIA (Accessible Rich Internet Applications) e um conjunto de atributos especiais para acessibilidade. A documentacao da Mozilla (MDN) e recomendada por ter linguagem simples e facil de ler.

Exemplos de uso de ARIA mencionados:
- **Barra de progresso**: um atributo ARIA informa o valor atual para leitores de tela
- **Modais**: atributos ARIA informam que um dialogo foi aberto

A ideia central: voce adiciona atributos HTML extras e tecnologias assistivas (leitores de tela, etc.) ganham funcionalidade adicional com aquele elemento.

## O problema demonstrado na aula

O instrutor construiu um modal simples de "Termos de Uso" no footer do blog. O processo:

1. Criou a estrutura HTML (div com h2 e paragrafo)
2. Estilizou com CSS (position fixed, top/left 50%, transform translate -50% -50% para centralizar)
3. Adicionou renderizacao condicional com `useState`
4. Trocou o `<a>` por `<button>` para o trigger

### O teste com leitor de tela (ChromeVox)

Quando clicou no botao "Termos de uso":
- **Visualmente**: o modal apareceu na tela — feedback visual OK
- **Leitor de tela**: leu "termos de uso, botao" mas **nao anunciou que o modal abriu**
- O leitor so leu o conteudo do modal quando o usuario **clicou diretamente nele**

### A analogia do feedback

> "Na web, quando a gente ta falando sobre acessibilidade, feedbacks de acoes — quando nos conseguimos enxergar, o modal aparece em tela e nosso feedback e visual. Para uma pessoa que utiliza leitor de tela, deveria ser da mesma forma."

O principio: **todo feedback visual precisa de um equivalente nao-visual**. Se algo muda na tela, o leitor de tela precisa comunicar essa mudanca.

## Por que H2 e nao H1

O instrutor explica que ja existe um H1 na pagina (titulo principal do blog). A regra geral e manter apenas um H1 por pagina, "a nao ser que realmente faca sentido semantico ter mais de um titulo principal". No caso de um modal, nao faz sentido ter outro H1.

## Por que trocar `<a>` por `<button>`

O link original apontava para o GitHub, mas foi reaproveitado para abrir o modal. Como a acao nao e navegacao (e sim abrir um dialogo), o elemento semantico correto e `<button>`.

## Centralizacao CSS do modal

Tecnica usada:
```css
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

O instrutor explica o "hack": `top: 50%` e `left: 50%` posicionam o canto superior esquerdo do elemento no centro da tela. O `translate(-50%, -50%)` desloca o elemento de volta em 50% do seu proprio tamanho, resultando em centralizacao perfeita.

## A proxima aula

Esta aula deliberadamente cria o modal SEM acessibilidade para demonstrar o problema. A proxima aula cobrira como adicionar os atributos ARIA para tornar o modal acessivel (role, aria-modal, aria-labelledby, focus trap, etc.).