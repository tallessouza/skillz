---
name: rs-full-stack-despedida-e-proximos-passos
description: "Configures exploration of CSS value functions by category when user asks to 'use CSS functions', 'explore CSS features', 'check CSS compatibility', or 'what CSS functions exist'. Provides a categorized reference of CSS function families (transform, math, filter, color, gradient, grid, animation, counter) with browser compatibility guidance. Make sure to use this skill whenever the user needs to discover or choose between CSS functions. Not for implementing specific CSS functions or writing CSS code."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-functions
  tags: [CSS, functions, calc, transform, filter, gradient, compatibility]
---

# Referência de Funções CSS por Categoria

> Conhecer as famílias de funções CSS e verificar compatibilidade antes de usar é tão importante quanto saber a sintaxe.

## Key concepts

Funções CSS são valores aplicados a propriedades. A sintaxe segue o padrão `propriedade: funcao(argumento1, argumento2)`. Existem dezenas de funções organizadas por categoria, e nem todas funcionam em todos os navegadores — verificar compatibilidade é obrigatório antes de adotar qualquer função.

## Decision framework

| Quando encontrar | Faça |
|-----------------|------|
| Precisa de layout complexo | Explore funções de **grid** (`repeat()`, `minmax()`, `fit-content()`) |
| Precisa calcular valores | Use funções **matemáticas** (`calc()`, `min()`, `max()`, `clamp()`, e exponenciais) |
| Precisa de efeitos visuais | Use **filtros** (`blur()`, `brightness()`, `contrast()`, etc.) |
| Precisa manipular cores | Use funções de **cor** (`rgb()`, `hsl()`, `color-mix()`, `oklch()`, etc.) |
| Precisa de transições de cor | Use **gradients** (`linear-gradient()`, `radial-gradient()`, `conic-gradient()`) |
| Precisa de movimento | Use funções de **animação** e **transformação** (`rotate()`, `scale()`, `translate()`, etc.) |
| Precisa de numeração automática | Use **contadores** (`counter()`, `counters()`) |
| Precisa referenciar valores | Use funções de **referência** (`var()`, `attr()`, `env()`, `url()`) |
| Precisa de tipografia dinâmica | Use funções de **fontes** |
| Função é experimental | Verifique compatibilidade — provavelmente não funciona na maioria dos navegadores |

## Como verificar compatibilidade

1. Abra [DevDocs — CSS Functions](https://devdocs.io/css/css_functions)
2. Clique na função desejada
3. Verifique a tabela de compatibilidade com navegadores
4. Se "quase não funciona" — evite em produção, use apenas para testes

## Catálogo de famílias

| Família | Exemplos | Volume |
|---------|----------|--------|
| Transformação | `translate()`, `rotate()`, `scale()`, `skew()`, `matrix()`, `perspective()` | Muitas funções |
| Cálculo matemático | `calc()`, `min()`, `max()`, `clamp()`, exponenciais | Muitas funções |
| Filtros | `blur()`, `brightness()`, `contrast()`, `grayscale()`, `sepia()` | Vários |
| Cores | `rgb()`, `hsl()`, `oklch()`, `color-mix()`, `light-dark()` | Muitas opções |
| Gradients | `linear-gradient()`, `radial-gradient()`, `conic-gradient()` | 3+ variações |
| Imagens | Algumas experimentais — verificar compatibilidade | Poucos estáveis |
| Contadores | `counter()`, `counters()` | Poucas |
| Referência | `var()`, `attr()`, `env()`, `url()` | Poucas, essenciais |
| Grid | `repeat()`, `minmax()`, `fit-content()` | Poucas, essenciais |
| Fontes | Funções tipográficas | Poucas |
| Animação | `cubic-bezier()`, `steps()`, `linear()` | Poucas |

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Todas as funções CSS funcionam em todos os navegadores | Muitas são experimentais e têm suporte parcial — sempre verificar |
| Conhecer `calc()` e `rgb()` é suficiente | Existem dezenas de funções organizadas em 10+ famílias |
| Funções experimentais são inutilizáveis | Podem ser testadas localmente, mas não devem ir para produção |

## Exemplo basico

```css
/* Funcao calc() — calculo dinamico */
.container {
  width: calc(100% - 40px);
  font-size: clamp(1rem, 2vw, 2rem);
  background: linear-gradient(to right, #3490dc, #6574cd);
  filter: blur(2px);
}
```

## Limitations

- Este é um mapa de navegação, não um guia de implementação — para usar cada função, consulte a documentação específica
- Compatibilidade muda com o tempo — sempre verifique a versão mais recente no DevDocs ou MDN

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Funcao CSS nao funciona no navegador | Funcao experimental ou sem suporte | Verifique compatibilidade no MDN ou DevDocs antes de usar |
| `calc()` retorna valor errado | Unidades incompativeis ou sintaxe incorreta | Verifique espacos ao redor dos operadores: `calc(100% - 20px)` |
| Gradiente nao aparece | Aplicado em `color` em vez de `background` | Use `background: linear-gradient(...)` nao `color:` |
| `clamp()` nao funciona no IE | Funcao nao suportada em navegadores antigos | Use fallback com `min()` e `max()` ou valor fixo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre estudo progressivo de CSS functions
- [code-examples.md](references/code-examples.md) — Exemplos de cada família de funções com variações