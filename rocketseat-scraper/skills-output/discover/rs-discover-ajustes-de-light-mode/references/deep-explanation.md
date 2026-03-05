# Deep Explanation: Ajustes de Light Mode

## Por que nomear pelo papel e nao pela cor

O instrutor deliberadamente copia os nomes que ja existiam no design (`stroke-color`, `surface-color`, `highlight-color`) em vez de inventar nomes descritivos da cor (`--white-border`, `--black-bg`). A razao: quando voce olha o projeto no Figma e ve "surface color", voce imediatamente sabe qual variavel CSS corresponde. Isso elimina a traducao mental.

Ele diz explicitamente: "eu nao estou querendo inventar nomes novos nao, porque fica ate mais facil depois de eu analisar la o projeto e ver o que e que estava de nomes e quais sao as referencias de variaveis que a gente esta criando aqui."

## Padrao de inversao dark/light

O padrao central e simples: onde era `rgba(255,255,255,...)` (branco) no modo escuro, vira `rgba(0,0,0,...)` (preto) no modo claro. Isso vale para:

- **stroke-color**: borda branca → borda preta
- **text-color**: texto branco → texto preto
- **surface-color**: fundo escuro transparente → fundo claro transparente

O instrutor nota isso: "Onde era branco, agora e preto."

## Estados hover como variaveis separadas

O instrutor descobre durante a aula que o botao tem uma cor diferente no hover ("passando o mouse do botao, esse fica super preto"). Em vez de usar `filter: brightness()` ou calcular a cor inline, ele cria uma variavel dedicada: `--surface-color-hover`.

Isso e importante porque no light mode, o hover pode nao ser simplesmente "mais escuro" — pode ser um valor completamente diferente. Ter a variavel separada da controle total por modo.

## Separacao HTML/CSS/JS

O instrutor faz questao de separar responsabilidades:
- **HTML** = linguagem de marcacao de texto (estrutura)
- **CSS** = linguagem de estilo (aparencia, incluindo modos de cor)
- **JavaScript** = linguagem de programacao (dinamismo, como trocar imagens)

Quando ele encontra algo que CSS nao resolve (trocar imagem entre modos), ele nao forca uma solucao CSS. Ele diz: "a imagem ela muda de maneira que vai ser de outra forma que a gente vai fazer... com programacao."

## Processo pratico do instrutor

O fluxo que ele segue ao converter cores hardcoded para variaveis:

1. Identifica a cor no componente (ex: `border: 1px solid rgba(...)`)
2. Olha o design para ver se ja tem um nome (ex: "stroke color")
3. Cria a variavel no `:root` com o valor do modo escuro
4. Cria a mesma variavel no `.light-mode` com o valor invertido
5. Substitui o valor hardcoded por `var(--nome)`
6. Testa alternando entre modos
7. Se tem hover, repete o processo com sufixo `-hover`

## Erros comuns durante o processo

O instrutor comete erros ao vivo e corrige:
- Escreve "highlight" errado → corrige verificando a ortografia
- Quase coloca variavel no bloco errado (light em vez de default) → "opa, nao e no light, quase errei"
- Esquece de verificar o hover → descobre depois que o botao hover estava diferente

Isso reforça: sempre teste alternando entre modos apos cada variavel criada.