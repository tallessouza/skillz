# Deep Explanation: CSS Transitions

## O que e uma transicao?

Uma transicao CSS e uma **suavidade ao mudar uma propriedade de um valor para outro**. Sem transicao, a mudanca e instantanea (um "pulo"). Com transicao, o navegador interpola os valores intermediarios ao longo do tempo.

## O conceito de trigger (disparo)

Transicoes nao acontecem sozinhas — precisam de um **disparo**. O instrutor enfatiza que o trigger e o evento que causa a mudanca de propriedade:

- `:hover` — mouse passa por cima
- `:focus` — elemento recebe foco
- `:active` — elemento esta sendo clicado
- Mudanca de classe via JavaScript

Sem trigger, a propriedade nunca muda, e a transicao nunca executa.

## As 4 sub-propriedades de transition

### 1. `transition-property`
Define **qual propriedade** sera transicionada. Aceita:
- Nome especifico: `opacity`, `transform`, `background-color`
- `all`: todas as propriedades que mudarem (nao recomendado)

### 2. `transition-duration`
Define **quanto tempo** a transicao leva. Unidades:
- Segundos: `1s`, `0.5s`
- Milissegundos: `200ms`, `1000ms`

Sem duracao definida, a transicao nao acontece (valor padrao e `0s`).

### 3. `transition-delay`
Define **quanto tempo esperar** antes de iniciar a transicao. Mesmas unidades que duration.

Ponto importante do instrutor: o delay afeta **tanto a entrada quanto a saida**. Se voce define `transition-delay: 1s`, ao passar o mouse, espera 1 segundo para iniciar. Ao tirar o mouse, espera 1 segundo para voltar.

### 4. `transition-timing-function`
(Nao abordada nesta aula — sera coberta na proxima.)

## Configuracao multipla (separada por virgula)

O padrao CSS permite configurar cada propriedade de forma independente usando virgulas:

```css
transition-property: opacity, transform;
transition-duration: 1s, 200ms;
transition-delay: 1s, 10ms;
```

A ordem importa: o primeiro valor de duration corresponde a primeira propriedade, o segundo valor a segunda, e assim por diante.

Isso permite efeitos sofisticados onde uma propriedade transiciona rapido e outra devagar, ou uma comeca antes que a outra.

## Por que evitar `all`

O instrutor recomenda fortemente ser especifico. Razoes:

1. **Performance** — com `all`, o navegador monitora TODAS as propriedades que podem transicionar. Em projetos grandes, isso causa recalculos desnecessarios.

2. **Conflitos inesperados** — uma propriedade que voce nao pretendia transicionar pode acabar transicionando, causando efeitos visuais indesejados.

3. **Controle** — ser especifico permite duracoes e delays diferentes por propriedade, o que `all` nao permite de forma granular.

O instrutor deixa claro: "nada te impede de tentar usar o `all` algumas vezes pra ver como funciona", mas para producao, seja especifico.

## Onde declarar a transicao

A transicao deve ser declarada no **estado base** do elemento, nao no estado de hover. Isso garante que a transicao funcione tanto na ida (hover) quanto na volta (saida do hover).

```css
/* CORRETO — transicao no estado base */
.box {
  opacity: 0.6;
  transition-property: opacity;
  transition-duration: 1s;
}
.box:hover {
  opacity: 1;
}

/* Se declarasse transition apenas no :hover,
   a volta seria instantanea (sem suavidade) */
```