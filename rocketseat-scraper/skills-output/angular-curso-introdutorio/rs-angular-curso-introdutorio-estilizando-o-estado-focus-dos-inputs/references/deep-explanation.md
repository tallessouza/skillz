# Deep Explanation: Estilizando Estado Focus dos Inputs

## Por que o Bootstrap adiciona sombra extra no focus

O Bootstrap usa `box-shadow` no estado `:focus` dos elementos com classe `form-control` para indicar visualmente que o campo esta ativo. Quando voce adiciona uma `border` customizada no `:focus`, as duas estilizacoes coexistem — a borda que voce definiu E a sombra do Bootstrap. O resultado visual e uma borda dupla que nao corresponde ao design do Figma.

A solucao e simples: `box-shadow: none` remove a sombra sem perder os beneficios do `form-control` (dimensionamento, padding, responsividade).

**Armadilha comum:** remover a classe `form-control` inteira para resolver o problema visual. Isso funciona para a sombra, mas o input perde tamanho e padding que o Bootstrap fornece. Sempre prefira override pontual.

## O problema do escopo com :has() e tags genericas

O seletor CSS `:has()` e poderoso mas perigoso quando usado com seletores muito amplos. No exemplo da aula:

```css
div:has(input:focus) label {
  color: #4F46E5;
}
```

O problema: o CSS busca a `div` mais proxima que contenha um `input:focus`. Se a estrutura HTML tiver uma div pai que envolve multiplos campos, TODOS os labels dentro dessa div serao estilizados, nao apenas o label do campo focado.

**Hierarquia do problema:**
```html
<div>  <!-- Esta div contem TODOS os inputs -->
  <div>
    <label>Nome</label>        <!-- Afetado! -->
    <input type="text" />
  </div>
  <div>
    <label>Atividade</label>   <!-- Tambem afetado! -->
    <input type="text" />
  </div>
</div>
```

Quando qualquer input recebe focus, o CSS encontra a `div` ancestral que contem o input focado. Como a div externa contem AMBOS os inputs, ambos os labels sao estilizados.

**Solucao:** usar uma classe especifica (`.custom-input-group`) no wrapper imediato de cada par label+input. Assim o `:has()` para no escopo correto.

## Por que nao usar "input-group" como nome de classe

O Bootstrap ja define `.input-group` com estilos proprios (flexbox, border-radius, sizing). Se voce usar o mesmo nome, os estilos do Bootstrap serao aplicados ao seu elemento, causando comportamentos inesperados. O instrutor recomenda prefixar com `custom-` para evitar colisoes.

## Acessibilidade com for/id

A associacao `<label for="nome">` + `<input id="nome">` faz duas coisas:

1. **Acessibilidade:** leitores de tela sabem que o label descreve aquele input
2. **UX:** clicar no label automaticamente foca o input associado

Isso e particularmente util em dispositivos moveis onde a area de toque do label e maior que a do input.

## Ordem de resolucao de conflitos visuais com Bootstrap

1. Identifique se o conflito vem de `box-shadow`, `border`, `outline` ou `background`
2. Inspecione o elemento no DevTools para ver qual regra do Bootstrap esta sendo aplicada
3. Faca override pontual no seletor `:focus` da sua classe customizada
4. Nunca remova classes utilitarias do Bootstrap — faca override