# Deep Explanation: Input Text — Atributos HTML

## Por que type e name sao fundamentais

O instrutor enfatiza que **sempre** que houver um input, dois atributos sao obrigatorios:

1. **`type`** — Define o tipo de dado que o input aceita. Para texto simples, `type="text"`. O input e descrito como "uma das tags mais poderosas" porque aceita uma variedade enorme de tipos (text, email, password, number, etc.), cada um com comportamento proprio.

2. **`name`** — Identifica o dado quando o formulario e enviado. Sem `name`, o dado simplesmente nao aparece na submissao. O instrutor usa o exemplo: `name="nome"` faz com que o dado seja enviado como `?nome=valor` na URL.

## A diferenca crucial entre value e placeholder

Este e o ponto mais importante da aula e onde mais erros acontecem:

- **`value="Mike"`** — O campo ja vem preenchido com "Mike". Se o usuario submeter sem alterar, "Mike" e enviado. O usuario precisa apagar o conteudo para digitar algo novo.

- **`placeholder="Coloque seu nome"`** — Aparece como texto cinza/fantasma dentro do campo. E apenas uma dica visual. Se o usuario submeter sem digitar nada, o campo vai **vazio**. O placeholder NAO e um valor.

O instrutor demonstra isso ao vivo: submete o form com placeholder apenas e mostra que `nome=` vai vazio na URL. Depois coloca `value="Mike"` e mostra que `nome=Mike` aparece na URL mesmo sem o usuario digitar nada.

## Atributos booleanos: autofocus, disabled, readonly, required

Estes atributos sao booleanos — basta estarem presentes para ativar:

### autofocus
Quando a pagina carrega, o campo ja esta focado (cursor piscando nele). Util para o campo principal de um formulario de busca ou login. O instrutor menciona que o Live Preview dele nao demonstrava bem, mas o comportamento e padrao em navegadores reais.

### disabled
Desabilita completamente o campo. O usuario nao consegue clicar, editar, nem o dado e enviado no submit. Funciona em todos os tipos de input.

### readonly
O campo tem um valor visivel mas o usuario nao consegue alterar. Diferente de disabled:
- readonly: dado E enviado no submit
- disabled: dado NAO e enviado no submit

O instrutor demonstra clicando varias vezes no campo readonly e mostrando que nao consegue apagar nem modificar o valor.

### required
Torna o campo obrigatorio. O navegador bloqueia o envio e mostra mensagem "Por favor, preencha este campo" se estiver vazio. O instrutor mostra clicando varias vezes no Submit e o navegador recusando.

**Nota do instrutor:** Nem todos os tipos de input aceitam todos esses atributos. Ele usa exclamacao (!) para marcar os que nao sao universais.

## Atributo autocomplete

Permite que o navegador sugira valores baseado no historico do usuario. Aceita valores como:
- `name` — nome completo
- `email` — endereco de email
- `new-password` — sugere geracao de senha
- `url` — endereco web

O comportamento varia entre navegadores. O instrutor menciona que o editor de codigo mostra muitas opcoes possiveis.

## Atributo size

Controla o tamanho visual do campo em numero de caracteres. O instrutor demonstra aumentando o numero e o campo crescendo, mas imediatamente da a "dica maravilhosa": **use CSS para isso**. O atributo existe, e bom saber, mas na pratica CSS e o caminho correto.

## Atributo form (linkando input externo)

Permite que um input fora da tag `<form>` seja associado ao formulario pelo ID. O instrutor demonstra:

```html
<form id="meu-form">
  <button type="submit">Submit</button>
</form>
<input type="text" name="nome" form="meu-form" />
```

Ao clicar Submit, o dado do input externo e enviado junto. O instrutor comenta que "geralmente a gente deixa tudo dentro do formulario" mas essa opcao existe para casos especiais de layout.

## Estilos dependem do user agent

O instrutor alerta que a aparencia visual do input varia conforme o navegador (Chrome, Firefox, Safari). Isso e controlado pelo "user agent stylesheet" — cada navegador tem seus proprios estilos padrao para inputs. Por isso CSS e fundamental para consistencia visual.

## Contexto maior

Esta aula cobre apenas `type="text"`. O instrutor fecha dizendo que existem MUITOS outros tipos de input para estudar. Os atributos gerais aprendidos aqui (value, placeholder, required, etc.) se aplicam a varios desses outros tipos, o que torna esta aula fundamental para todo o modulo de formularios.