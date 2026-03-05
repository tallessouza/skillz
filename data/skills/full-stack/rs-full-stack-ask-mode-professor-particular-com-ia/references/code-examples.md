# Code Examples: Ask Mode — Professor Particular com IA

## Exemplo 1: Explicacao de CSS :hover (da aula)

### Trecho selecionado
```css
button:hover {
  cursor: pointer;
  transform: translateY(-2px);
  box-shadow: 0 0 10px rgba(255, 200, 0, 0.5);
}
```

### Prompt usado
```
Explique com detalhes como se fosse para uma crianca
da quinta serie, explique os first principles.
```

### Resposta da IA (reconstruida da aula)

**Analogia inicial:**
> Imagina que voce esta desenhando uma casa. O CSS e como se fosse as cores, o tamanho, a decoracao. E uma linguagem que diz ao computador como as coisas devem parecer bonitas na tela. E como quando voce pinta um desenho ou coloca adesivos no caderno.

**Explicacao do trecho:**
> Isso aqui significa que quando alguem colocar o mouse em cima do botao, ele vai fazer magicamente algumas coisas acontecerem:
> - `cursor: pointer` → A seta do mouse vira uma maozinha
> - `transform: translateY(-2px)` → O botao sobe dois pixeizinhos
> - `box-shadow: 0 0 10px rgba(255, 200, 0, 0.5)` → Aparece uma sombra amarelada iluminada, tipo um brilho

**First Principles:**
> - Tudo e uma caixa: no computador, tudo e um retangulo ou uma caixa. Texto e caixa, botao e caixa, imagem e caixa
> - Para pintar essa caixa, colocar espaco, colocar borda — voce pode usar propriedades CSS
> - A ordem importa: seletores definem quais caixas voce esta estilizando
> - Propriedades definem O QUE muda naquela caixa

### Verificacao pratica (feita pelo instrutor)
O instrutor passou o mouse sobre o botao e confirmou visualmente:
- ✅ Sombra amarelada apareceu
- ✅ Botao subiu 2 pixels
- ✅ Cursor virou maozinha

> Sempre verifique a explicacao da IA contra o comportamento real.

## Exemplo 2: Progressao de prompts

### Nivel iniciante
```
[seleciona codigo]

Explique com detalhes como se fosse para uma crianca
da quinta serie, explique os first principles.
```
→ Gera analogias concretas + fundamentos + explicacao detalhada

### Nivel intermediario
```
[seleciona codigo]

Explique com detalhes o que esse codigo esta fazendo.
```
→ Gera explicacao tecnica mais direta, sem analogias infantis

### Nivel avancado
```
[seleciona codigo]

O que esse trecho faz e quais edge cases devo considerar?
```
→ Explicacao tecnica + consideracoes praticas

## Exemplo 3: Contexto poluido (anti-pattern)

### Chat com contexto misturado (ERRADO)
```
Usuario: [seleciona CSS] Explique esse CSS
IA: [explica CSS corretamente]

Usuario: [seleciona JavaScript] E isso aqui?
IA: [tenta conectar JS com CSS — pode alucinar]
```

A IA pode gerar algo como:
> "Esse JavaScript complementa o CSS que voce estava vendo, manipulando o DOM para..."

Quando na verdade o JS pode nao ter NADA a ver com aquele CSS.

### Contextos separados (CORRETO)
```
--- Chat 1: CSS ---
Usuario: [seleciona CSS] Explique esse CSS
IA: [explica CSS corretamente, focada]

--- Chat 2: JavaScript ---
Usuario: [seleciona JS] Explique esse JavaScript
IA: [explica JS corretamente, sem contaminar com CSS]
```

## Exemplo 4: Alucinacao por concordancia

### Padrao perigoso
```
Usuario: Esse box-shadow usa RGB, certo?
IA: Sim, esta usando RGB para definir a cor da sombra!

Usuario: Nao, espera, acho que e RGBA
IA: Voce tem razao! E RGBA, o A e o canal alpha
    que define a transparencia...
```

Neste caso a IA estava correta na segunda resposta, mas o padrao e perigoso: ela sempre tende a concordar. Em outros casos, a "correcao" pode ser uma alucinacao.

### Como lidar
1. Nao contradiga a IA esperando que ela se corrija
2. Va verificar na documentacao (MDN, docs oficiais)
3. Se a IA mudou de opiniao facil demais, desconfie das duas respostas