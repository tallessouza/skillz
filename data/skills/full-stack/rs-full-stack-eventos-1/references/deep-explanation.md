# Deep Explanation: Eventos no JavaScript

## O que sao eventos

Eventos sao acoes que o usuario realiza para interagir com a aplicacao. Um clique, um carregamento de pagina, um scroll, um keypress — tudo isso sao eventos que o browser dispara e que o JavaScript pode observar e reagir.

## addEventListener — o mecanismo de observacao

O metodo `addEventListener` funciona como um "observador" (observer pattern). Voce diz ao browser: "fique atento a ESTE tipo de evento, e quando acontecer, execute ESTA funcao."

### Anatomia do addEventListener

```javascript
alvo.addEventListener(tipoDoEvento, funcaoCallback)
```

- **alvo**: quem voce quer observar (`window`, `document`, ou um elemento especifico)
- **tipoDoEvento**: string com o nome do evento (`'load'`, `'click'`, `'submit'`, etc.)
- **funcaoCallback**: funcao que executa quando o evento acontece

### Contextos de uso

1. **`window.addEventListener`** — observa eventos da janela inteira (load, resize, scroll)
2. **`addEventListener` direto (sem alvo)** — equivale a observar o `document`, ou seja, toda a estrutura do DOM
3. **`elemento.addEventListener`** — observa eventos em um elemento especifico

## O objeto event

Quando um evento acontece, o browser cria automaticamente um objeto com TODAS as informacoes sobre aquele evento. Esse objeto e passado como parametro para a funcao callback.

### Informacoes disponiveis no objeto event

- **event.target** — o elemento exato que foi clicado/interagido
- **event.target.textContent** — o texto dentro do elemento clicado
- **event.clientX / event.clientY** — coordenadas X e Y do ponto na tela onde o clique aconteceu
- **event.type** — o tipo do evento (ex: "click", "load")
- **event.pointerType** — como a interacao aconteceu (mouse, touch, pen)

O instrutor mostrou que ao expandir o console.log do event, ha dezenas de propriedades uteis. As mais usadas no dia-a-dia sao `target`, `preventDefault()`, e as coordenadas.

## preventDefault — bloqueando o comportamento padrao

Certos elementos HTML tem comportamentos padrao:

- **`<button type="submit">` dentro de `<form>`** — recarrega a pagina (envia o formulario)
- **`<a href="...">`** — navega para o link
- **`<input type="checkbox">`** — marca/desmarca

`event.preventDefault()` impede esse comportamento padrao de acontecer, permitindo que voce controle 100% do que acontece.

### Por que o botao submit recarrega a pagina

O instrutor explicou de forma clara: quando um botao tem `type="submit"` e esta dentro de um `<form>`, o comportamento padrao do browser e entender que voce quer ENVIAR as informacoes do formulario. O envio padrao recarrega a pagina (faz um HTTP request). Com `preventDefault()`, voce intercepta isso e pode fazer o envio via JavaScript (fetch/AJAX) sem recarregar.

## Naming do parametro event

O instrutor mostrou que o nome do parametro e livre — pode ser `e`, `evt`, `event`, qualquer coisa. Porem, ele mesmo disse que prefere usar `event` por ser mais descritivo. A convencao mais legivel e `event` porque:

- E auto-documentado
- Facilita busca no codebase (`event.target` vs `e.target`)
- Outros devs entendem imediatamente o que e

## Listener global vs especifico

Quando voce usa `addEventListener('click', handler)` sem especificar um elemento (direto no escopo global ou no document), QUALQUER clique em QUALQUER lugar da pagina dispara o handler. Isso e util para:

- Delegacao de eventos (um unico listener para muitos elementos)
- Fechar menus/modais ao clicar fora
- Tracking de analytics

Quando voce quer reagir apenas ao clique em um elemento especifico, primeiro selecione o elemento com `querySelector` e depois adicione o listener nele.