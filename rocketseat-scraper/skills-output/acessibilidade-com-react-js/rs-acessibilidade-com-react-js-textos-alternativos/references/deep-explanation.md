# Deep Explanation: Textos Alternativos

## Por que descrever intencao e nao aparencia

O instrutor usa o exemplo da logo da Rocketseat: muitos desenvolvedores descreveriam "um foguete virado em 45 graus com chamas, roxo". Mas isso nao e o que a imagem tenta comunicar. A imagem e uma representacao de marca — ela tenta transmitir a sensacao da marca Rocketseat.

A analogia com universidades americanas e poderosa: brasoes universitarios tem simbolos complexos, mas o alt text seria simplesmente "Universidade de Harvard", nao "brasao com escudo vermelho contendo tres livros abertos com a palavra Veritas".

**Principio:** o alt text responde a pergunta "o que essa imagem COMUNICA?" e nao "o que essa imagem MOSTRA?"

## Redundancia — o erro silencioso

Leitores de tela ja anunciam o tipo do elemento. Quando voce escreve `alt="Imagem da logo Rocketseat"`, o leitor de tela dira algo como "imagem, imagem da logo Rocketseat" — redundante e confuso.

O mesmo vale para texto visivel duplicado. Se um link contem um icone com `alt="GitHub"` E o texto "GitHub", o leitor de tela lera "GitHub GitHub" — experiencia pessima.

## SVGs: tres estrategias

O instrutor apresentou tres abordagens para tornar SVGs acessiveis:

### 1. aria-label no elemento pai (recomendada para links)
```html
<a href="..." aria-label="GitHub">
  <svg>...</svg>
</a>
```
Melhor quando o SVG esta dentro de um elemento interagivel (link, botao). O aria-label no elemento pai descreve a acao, nao apenas o icone.

### 2. title como primeiro filho do SVG
```html
<svg>
  <title>GitHub</title>
  <path d="..." />
</svg>
```
Funciona para SVGs standalone. O `<title>` DEVE ser o primeiro filho do SVG.

### 3. aria-hidden + texto adjacente
```html
<a href="...">
  <svg aria-hidden="true">...</svg>
  GitHub
</a>
```
Esconde o SVG do leitor de tela e usa texto visivel. Desvantagem: texto visivel aparece na tela, o que pode nao ser desejado no design.

### 4. SVG como arquivo importado (img tag)
Copiar o SVG para um arquivo `.svg`, importar como imagem e usar alt normalmente. Funcional, mas pode perder estilizacao CSS (como a cor roxa via `fill` no CSS).

## Quando NAO colocar alt text

Casos especificos onde alt vazio (`alt=""`) e preferivel:
- **Ilusoes de otica** — a experiencia depende da percepcao visual, texto nao traduz
- **Obras de arte abstratas** — interpretacao e subjetiva
- **Imagens decorativas** — divisores, backgrounds, ornamentos
- **Imagens redundantes** — quando texto adjacente ja descreve o conteudo

O instrutor enfatiza: `alt=""` (vazio) e DIFERENTE de remover o atributo alt. Remover e erro critico. Vazio e intencional — diz ao leitor "ignore esta imagem".

## Acessibilidade multimidia (mencionado)

Para elementos de audio, o atributo `alt` nao se aplica. O padrao da comunidade e colocar texto descritivo adjacente ao elemento `<audio>`, acima ou abaixo, descrevendo o conteudo do audio.

## Ferramentas de validacao

O instrutor usa o axe DevTools (extensao do navegador) que:
- Identifica erros criticos (imagens sem alt, links sem texto discernivel)
- Detecta redundancia entre alt text e texto visivel
- Aponta exatamente qual elemento tem o problema