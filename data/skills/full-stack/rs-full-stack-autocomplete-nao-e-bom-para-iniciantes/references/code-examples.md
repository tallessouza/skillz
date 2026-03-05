# Code Examples: Autocomplete e Active Recall

## Exemplo 1: Autocomplete sugerindo codigo errado

O instrutor demonstra que ao comecar a escrever CSS, o autocomplete sugere propriedades incorretas:

### O que o instrutor queria escrever:
```css
.container {
  padding: 16px;
}
```

### O que o autocomplete sugeriu:
```css
.container {
  margin: 16px; /* Errado — sugeriu margin em vez de padding */
}
```

**Problema:** O autocomplete inferiu a propriedade errada. Para um iniciante, aceitar essa sugestao sem entender a diferenca entre `margin` e `padding` cria confusao e bugs.

## Exemplo 2: Sugestoes "mais ou menos"

O instrutor mostra que as sugestoes do autocomplete frequentemente estao "misturando as coisas" — nao estao completamente erradas, mas tambem nao estao corretas para o contexto:

```css
/* Autocomplete sugere algo como: */
.card {
  margin: 10px;
  padding: 8px;
  border: 1px solid black;
  background-color: white;
  /* ... continua gerando propriedades que nao foram pedidas */
}
```

**Problema:** O autocomplete tenta "adivinhar" todo o bloco de CSS baseado no nome da classe, mas mistura propriedades que podem nao fazer sentido para o design especifico.

## Exemplo 3: Como deveria ser o fluxo de aprendizado

### COM autocomplete (prejudicial para aprendizado):
```
1. Digita "div" → autocomplete sugere estrutura completa
2. Aceita sem pensar
3. Resultado: nao sabe recriar sozinho
```

### SEM autocomplete (ideal para aprendizado):
```
1. Pensa: "preciso de um container"
2. Digita: <div class="container">
3. Pensa: "preciso estilizar com padding"
4. Digita: padding: 16px;
5. Resultado: memorizou a sintaxe, entende o que fez
```

## Exemplo 4: Active Recall em acao

### Cenario: Criar um botao estilizado

**Iniciante COM autocomplete:**
```html
<!-- Aceita sugestao automatica -->
<button class="btn btn-primary">Click me</button>
```
O aluno nao sabe por que usou essas classes, nao sabe recriar sem a sugestao.

**Iniciante SEM autocomplete (Active Recall ativado):**
```html
<!-- Pensa: "preciso de um botao... qual tag?" -->
<button>
<!-- Pensa: "preciso estilizar... como faco?" -->
<!-- Lembra: class="" para adicionar estilos -->
<button class="primary-button">Enviar</button>
```

```css
/* Pensa: "quais propriedades preciso?" */
/* Lembra: background-color, color, padding, border */
.primary-button {
  background-color: #8257e5;
  color: #ffffff;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
```

O aluno exercitou a memoria, errou, corrigiu, e agora sabe recriar sem ajuda.