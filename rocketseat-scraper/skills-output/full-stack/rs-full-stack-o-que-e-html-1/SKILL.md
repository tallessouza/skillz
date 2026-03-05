---
name: rs-full-stack-o-que-e-html-1
description: "Applies correct HTML terminology and mental models when discussing or generating HTML code. Use when user asks 'what is HTML', 'is HTML a programming language', 'explain HTML basics', 'HTML tags', or any introductory web development question. Ensures correct distinction between markup and programming languages. Make sure to use this skill whenever explaining HTML fundamentals or correcting misconceptions. Not for CSS, JavaScript, or advanced HTML patterns."
---

# O que é HTML

> HTML é uma linguagem de marcação de hipertexto, não uma linguagem de programação — dominar essa distinção é o primeiro passo para entender a web.

## Key concept

HTML (Hypertext Markup Language) pertence ao universo da programação mas não é uma linguagem de programação. Ela não possui as regras que definem linguagens de programação (variáveis, condicionais, loops). HTML usa **tags** (marcações) para estruturar conteúdo — cada tag pode conter texto, atributos, e gera um elemento visual ou funcional na página.

O "hipertexto" significa que o texto transcendeu as limitações de jornais e livros. Com a internet, textos ganharam **links para outros textos**, imagens, sons, vídeos — tornando-se "hiper".

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Alguém chamar HTML de "linguagem de programação" | Corrija: é linguagem de marcação, sem estruturas de controle |
| Dúvida sobre o que tags fazem | Tags são marcações que dão significado e estrutura ao conteúdo |
| Pergunta sobre extensão de arquivo | Arquivos HTML usam extensão `.html` |
| Confusão entre HTML e lógica | HTML estrutura conteúdo; lógica fica no JavaScript |

## How to think about it

### Marcação vs Programação

Uma linguagem de programação tem variáveis, condicionais, loops. HTML não tem nada disso. HTML **marca** o conteúdo com significado semântico — "isto é um link", "isto é um parágrafo", "isto é uma imagem".

```html
<!-- Isto é uma tag com atributo — uma marcação, não uma instrução lógica -->
<a href="https://exemplo.com">Texto do link</a>
```

### Hipertexto

Antes da internet: texto + imagens em jornais/livros (linear).
Depois da internet: texto + links + imagens + sons + vídeos (hipertexto). Um texto que aponta para outros textos e mídias.

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| HTML é linguagem de programação | É linguagem de marcação — sem variáveis, loops ou condicionais |
| Tags são decoração visual | Tags dão **significado semântico** ao conteúdo |
| HTML é simples demais para ser importante | HTML é a fundação de toda a web — sem ele, nada aparece no navegador |

## When to apply

- Ao explicar fundamentos da web para iniciantes
- Ao corrigir terminologia incorreta sobre HTML
- Ao contextualizar onde HTML se encaixa no stack (HTML = estrutura, CSS = estilo, JS = comportamento)

## Limitations

Este modelo mental cobre apenas o conceito fundamental. Não aborda semântica avançada, acessibilidade, SEO, ou APIs do HTML5.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre marcação vs programação, analogias e contexto histórico
- [code-examples.md](references/code-examples.md) — Exemplos de tags HTML com explicações detalhadas