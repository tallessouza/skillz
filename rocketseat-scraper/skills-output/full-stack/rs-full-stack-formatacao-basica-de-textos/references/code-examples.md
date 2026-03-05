# Code Examples: Formatacao Basica de Textos

## Exemplo base da aula

O instrutor demonstra cada tag aplicada a um paragrafo de texto generico:

```html
<p>
  Eu quero dar uma <strong>importancia</strong> nessa parte do texto.
</p>

<p>
  Aqui eu quero dar uma <em>enfase</em> nesse trecho.
</p>

<p>
  Esse trecho tem <mark>relevancia</mark> especial no contexto.
</p>

<p>
  Esse conteudo <s>nao e mais valido</s> foi atualizado.
</p>
```

## Cenarios reais

### E-commerce — preco com desconto

```html
<p class="price">
  De <s>R$ 199,90</s> por <strong>R$ 149,90</strong>
</p>
```

### Blog — destaque de termo tecnico

```html
<p>
  O conceito de <mark>closure</mark> e fundamental para entender
  JavaScript moderno. Closures permitem que uma funcao
  <em>acesse variaveis</em> do escopo externo mesmo apos
  a execucao desse escopo.
</p>
```

### Formulario — instrucoes ao usuario

```html
<p>
  <strong>Atencao:</strong> todos os campos marcados com
  <mark>*</mark> sao <em>obrigatorios</em>.
</p>
```

### Aviso de atualizacao

```html
<p>
  <s>O suporte ao IE11 sera mantido ate 2024.</s><br>
  <strong>Atualizado:</strong> o suporte ao IE11 foi
  <em>descontinuado</em> em janeiro de 2024.
</p>
```

### Combinacao de tags

```html
<p>
  E <strong><em>extremamente importante</em></strong> que voce
  faca backup antes de atualizar.
</p>
```

## Resumo visual das tags

| Tag | Aparencia | Significado |
|-----|-----------|-------------|
| `<strong>` | **negrito** | Importancia |
| `<em>` | *italico* | Enfase |
| `<mark>` | destacado | Relevancia |
| `<s>` | ~~riscado~~ | Nao mais valido |