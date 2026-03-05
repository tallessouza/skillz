# Deep Explanation: Alinhamento no CSS Grid

## O modelo mental do instrutor

O instrutor apresenta as 9 propriedades como uma **matriz 3x3**, nao como uma lista para decorar. A visualizacao e:

```
         content    items    self
align       ✓         ✓       ✓
justify     ✓         ✓       ✓
place       ✓         ✓       ✓
```

A sacada e: voce nao precisa decorar 9 nomes. Voce entende 2 dimensoes:

1. **Primeira dimensao — o eixo:**
   - `align` = eixo de bloco (geralmente vertical)
   - `justify` = eixo inline (geralmente horizontal)
   - `place` = shorthand que combina ambos

2. **Segunda dimensao — o alvo:**
   - `content` = o conteudo do grid inteiro (as tracks) em relacao ao espaco disponivel no container
   - `items` = os itens dentro de suas respectivas celulas
   - `self` = um item individual, sobrescrevendo o padrao definido por items

## Onde cada propriedade e aplicada

### No container (pai) — 6 propriedades

As propriedades `content` e `items` sao aplicadas no **grid container** (o elemento com `display: grid`). Isso faz sentido porque:

- **content** controla como o grid inteiro se posiciona dentro do espaco do container. Se o grid nao ocupa todo o espaco, `align-content` e `justify-content` decidem onde o grid fica.
- **items** define o alinhamento padrao de todos os itens dentro de suas celulas. E um "default" que cada item herda.

### No item (filho) — 3 propriedades

As propriedades `self` sao aplicadas nos **grid items** (filhos diretos do container). Elas sobrescrevem o valor definido por `items` no pai, permitindo que um item especifico tenha alinhamento diferente.

## Diferenca critica: content vs items

Esta e a confusao mais comum:

- **content** age quando o grid tem espaco sobrando no container. Se o grid ocupa 100% do espaco, `align-content` e `justify-content` nao tem efeito visivel.
- **items** age dentro de cada celula. Mesmo que o grid ocupe 100% do container, os itens podem ser menores que suas celulas, entao `align-items` e `justify-items` controlam onde o item fica dentro da celula.

### Analogia

Imagine um armario (container) com prateleiras (tracks/celulas):
- **content** = mover as prateleiras para cima/baixo/centro do armario
- **items** = mover os objetos dentro de cada prateleira
- **self** = mover um objeto especifico diferente dos outros

## Por que place- existe

`place-content`, `place-items` e `place-self` sao shorthands que combinam align + justify em uma unica declaracao. Quando o valor e o mesmo para ambos os eixos, basta um valor:

```css
place-items: center;
/* equivale a: */
align-items: center;
justify-items: center;
```

Quando os valores sao diferentes, use a barra:

```css
place-items: center / start;
/* equivale a: */
align-items: center;
justify-items: start;
```

## Nota sobre uso real

O instrutor menciona que existem 9 propriedades fundamentais, mas "nao significa que a gente use todas elas". Na pratica, as mais usadas sao:

- `place-items: center` — centralizar tudo
- `justify-content: space-between` — distribuir colunas
- `align-self` / `justify-self` — excecoes pontuais

As propriedades `place-content` e menos comum porque normalmente o grid ocupa todo o espaco do container.