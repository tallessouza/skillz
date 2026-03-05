# Code Examples: Espaços e Quebras de Linha no HTML

## Exemplo 1: Whitespace collapsing em ação

```html
<!-- O que você escreve no source -->
<p>Lorem ipsum dolor sit amet
consectetur adipiscing elit
sed do eiusmod      tempor       incididunt</p>

<!-- O que o browser renderiza -->
<!-- Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt -->
```

Todas as quebras de linha viraram espaço. Todos os espaços múltiplos colapsaram para um.

## Exemplo 2: Usando `<br>` para quebras

```html
<p>Lorem ipsum dolor sit amet<br>
consectetur adipiscing elit<br>
sed do eiusmod tempor incididunt</p>
```

Resultado: três linhas separadas, dentro do mesmo parágrafo.

### Variação: múltiplos `<br>` para espaço vertical

```html
<p>Primeira linha<br><br><br>Linha após 3 quebras</p>
```

Funciona, mas é melhor usar CSS `margin-top` ou parágrafos separados.

## Exemplo 3: `&nbsp;` para espaços forçados

```html
<p>Nome:&nbsp;&nbsp;&nbsp;&nbsp;João da Silva</p>
<p>Email:&nbsp;&nbsp;&nbsp;joao@email.com</p>
```

Resultado: espaços visíveis entre label e valor. Porém, para alinhamento real, use CSS.

### Uso correto de `&nbsp;` (non-breaking)

```html
<p>A distância é de 42&nbsp;km.</p>
<!-- "42" e "km" nunca serão separados em linhas diferentes -->
```

## Exemplo 4: Abordagem semântica com `<p>`

```html
<!-- Em vez de: -->
<p>Primeiro texto<br><br>Segundo texto<br><br>Terceiro texto</p>

<!-- Prefira: -->
<p>Primeiro texto</p>
<p>Segundo texto</p>
<p>Terceiro texto</p>
```

A segunda abordagem é mais semântica, estilizável e acessível.

## Exemplo 5: Comparação completa

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Espaços e Quebras</title>
</head>
<body>
  <!-- Whitespace ignorado -->
  <p>Texto    com     muitos    espaços</p>
  <!-- Renderiza: "Texto com muitos espaços" -->

  <!-- Quebra com br -->
  <p>Linha 1<br>Linha 2<br>Linha 3</p>

  <!-- Espaços com &nbsp; -->
  <p>Palavra&nbsp;&nbsp;&nbsp;distante</p>

  <!-- Semântico com parágrafos -->
  <p>Parágrafo um.</p>
  <p>Parágrafo dois.</p>
  <p>Parágrafo três.</p>
</body>
</html>
```

## Exemplo 6: Caso de uso real — endereço

```html
<!-- br é semanticamente correto aqui -->
<address>
  Rua das Flores, 123<br>
  Bairro Jardim<br>
  São Paulo - SP<br>
  CEP: 01234-567
</address>
```

## Exemplo 7: Migração para CSS (evolução natural)

```html
<!-- Fase 1: iniciante (br + nbsp) -->
<p>Item 1<br><br>Item 2<br><br>Item 3</p>

<!-- Fase 2: semântico (parágrafos) -->
<p>Item 1</p>
<p>Item 2</p>
<p>Item 3</p>

<!-- Fase 3: CSS (controle total) -->
<style>
  .spaced-paragraphs p {
    margin-bottom: 1.5rem;
  }
</style>
<div class="spaced-paragraphs">
  <p>Item 1</p>
  <p>Item 2</p>
  <p>Item 3</p>
</div>
```