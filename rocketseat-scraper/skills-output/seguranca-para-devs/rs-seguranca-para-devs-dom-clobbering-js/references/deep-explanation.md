# Deep Explanation: DOM Clobbering

## O que e DOM Clobbering

DOM Clobbering e uma tecnica de ataque que explora um comportamento historico dos navegadores: quando um elemento HTML tem um atributo `name` ou `id`, o navegador automaticamente cria uma propriedade correspondente em `document` (e em alguns casos em `window`). Isso e heranca do Netscape Navigator dos anos 90.

Isso significa que **sem injetar nenhum JavaScript**, um atacante pode sobrescrever variaveis que seu codigo espera encontrar em `document` ou `window`.

## Por que e perigoso mesmo sem JavaScript

O instrutor enfatiza: "voce validou, voce nao deixa entrar JavaScript, mas voce deixa entrar HTML ali. Isso pode ser bastante perigoso."

A maioria dos desenvolvedores pensa que bloquear `<script>` e `onError` e suficiente. Mas DOM Clobbering nao precisa de JS — ele manipula o DOM de forma que o **seu proprio JavaScript** faz algo inesperado.

## Hierarquia de ataque com formularios

O ataque pode escalar em complexidade:

1. **Nivel 1:** `<img name="config">` → `document.config` retorna o elemento img
2. **Nivel 2:** `<form name="config"><img name="scriptToLoad">` → `document.config.scriptToLoad` funciona atraves da hierarquia form > child
3. **Nivel N:** Formularios com campos internos permitem hierarquias arbitrariamente profundas

O instrutor demonstra: "com isso, quem esta construindo esse negocio pode ir construindo uma hierarquia ate razoavelmente complexa, colocando formulario, campos de formulario dentro desse formulario, imagens."

## O atributo `form` como vetor de ataque

Um `<input>` fora de um `<form>` pode se vincular a ele usando o atributo `form="idDoFormulario"`. Isso permite que um atacante injete campos hidden em formularios existentes, mesmo que a injecao ocorra fora do formulario na pagina.

O instrutor demonstra: injetando `<input type="hidden" name="action" value="delete" form="meuForm">` fora do formulario, o campo e enviado como se estivesse dentro — potencialmente mudando a acao do formulario.

## Por que DOMPurify nao resolve sozinho

O instrutor testa DOMPurify e mostra:
- **Remove:** tag `<body>` (bom)
- **Permite:** atributo `id` em imagens (perigoso para Clobbering)
- **Permite:** atributo `name` (perigoso para Clobbering)

"Nao e uma falha da DOMPurify. Essa falha e uma falha do seu script." — O problema real e o codigo que depende de `document.algumaCoisa`.

## Hierarquia de defesa (do instrutor)

1. **`innerText`** — primeira opcao, nunca injeta HTML
2. **Safe Sinks** — APIs que nao interpretam HTML
3. **Template Engine / Framework** (React, Vue, Svelte, Angular) — escapam por padrao
4. **DOMPurify como ultimo recurso** — mas com configuracao restritiva

## Insight principal

"Nunca coloca variaveis usando `window.algumaCoisa` ou `document.algumaCoisa`, e nunca dependa dessas variaveis, porque elas podem ser injetadas via DOM Clobbering."