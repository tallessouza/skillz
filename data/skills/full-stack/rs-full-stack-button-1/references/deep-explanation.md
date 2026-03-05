# Deep Explanation: HTML Button

## Por que o tipo padrao e `submit`

O instrutor enfatiza que um `<button>` dentro de um `<form>`, sem `type` definido, automaticamente se comporta como `type="submit"`. Isso e uma decisao do spec HTML — o caso mais comum de botao em formulario e enviar dados, entao o padrao reflete isso.

O problema: se voce adiciona um botao "Cancelar" ou "Abrir Ajuda" dentro de um form sem definir `type="button"`, ele vai submeter o formulario ao ser clicado. Esse e um dos bugs mais comuns em formularios HTML.

## Os tres tipos de button

### `type="submit"` — Envia o formulario
- Comportamento padrao (mesmo sem declarar type)
- Envia todos os campos com `name` do formulario para o `action` definido no `<form>`
- Se o botao tiver `name` e `value`, esses dados tambem sao incluidos na submissao
- Demonstracao do instrutor: ao clicar submit, a URL muda para `?nome=Mike&botao1=valor+do+botao`

### `type="reset"` — Limpa os campos
- Reseta todos os campos do formulario para seus valores iniciais (nao necessariamente vazio — se havia `value` padrao, volta para ele)
- O instrutor demonstrou: digitou texto no campo, clicou "Limpar", campo ficou vazio
- Uso raro em aplicacoes modernas, mas util em formularios simples

### `type="button"` — Acao via JavaScript
- Nao envia formulario, nao reseta campos
- Existe para acoes customizadas via JS (abrir modal, toggle, etc.)
- O instrutor mostrou que ao clicar, "nao existem dados enviados aqui"

## O par `name` + `value` no botao

Analogia do instrutor: imagine que voce tem multiplos botoes de submit no mesmo formulario. Como o backend sabe qual foi clicado? Atraves do par `name`/`value`.

Exemplo pratico: um formulario de pedido com "Aprovar" e "Rejeitar" — ambos sao submit, mas com values diferentes. O backend recebe `acao=aprovar` ou `acao=rejeitar`.

O `name` aparece como parametro na URL (no caso de GET) ou no body (no caso de POST), junto com o `value` correspondente.

## `autofocus` — Foco automatico

- Atributo booleano (presenca = true, ausencia = false)
- Ao carregar a pagina, o elemento com `autofocus` recebe foco
- O instrutor alertou: nem todos os navegadores respeitam (ele mesmo nao conseguiu ver o efeito no navegador que estava usando)
- Perigo: se o botao focado for submit e o usuario pressionar Enter, o formulario sera enviado sem intencao
- Recomendacao: usar com cuidado, preferencialmente em campos de input, nao em botoes submit

## `disabled` — Desativar botao

- Atributo booleano
- Desativa visualmente e funcionalmente o botao
- Caso de uso principal do instrutor: impedir envio enquanto o usuario ainda esta preenchendo o formulario
- Requer JavaScript para remover o `disabled` quando as condicoes forem atendidas (validacao completa, por exemplo)
- Nao e possivel fazer esse comportamento dinamico apenas com HTML e CSS

## Estilo visual do botao

O instrutor mencionou que o estilo padrao do botao depende do navegador. Cada browser aplica seu proprio user-agent stylesheet ao `<button>`. Isso significa que o mesmo botao pode parecer diferente no Chrome, Firefox e Safari sem CSS customizado.