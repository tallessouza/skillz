---
name: rs-discover-acessando-projeto-figma
description: "Guides extraction of design specifications from Figma layouts for frontend implementation. Use when user asks to 'implement a design', 'convert Figma to code', 'extract colors from Figma', 'check spacing in layout', or 'read design specs'. Covers navigation, Style Guide interpretation, spacing measurement with Alt key, and translating visual properties to CSS. Make sure to use this skill whenever converting a Figma design into HTML/CSS code. Not for creating designs, prototyping, or advanced Figma plugin usage."
---

# Extraindo Informacoes do Figma para Codigo

> Figma e a fonte de verdade visual — extraia cores, fontes, espacamentos e componentes antes de escrever qualquer CSS.

## Key concept

O Figma nao e uma ferramenta de programacao — e a ferramenta onde designers (UI/UX ou Product Designers) criam o layout. O papel da pessoa programadora e **extrair informacoes** do layout e traduzi-las em codigo. Nao e necessario dominar o Figma, apenas saber navegar e ler as propriedades visuais.

## Decision framework

| Quando voce encontra | Faca |
|---------------------|------|
| Um layout no Figma para implementar | Abra, favorite, e use "Open with Figma" |
| Precisa saber cores e fontes | Consulte a aba **Style Guide** do projeto |
| Precisa saber espacamentos entre elementos | Selecione o elemento + segure **Alt** para ver distancias em pixels |
| Precisa ver detalhes de um componente | Clique no elemento para ver propriedades no painel direito |
| Versao do Figma diferente da aula | Ignore diferencas visuais da interface, foque nas propriedades dos elementos |

## How to navigate

### Controles essenciais

```
Zoom in/out:     Ctrl + scroll do mouse (Mac: Cmd + scroll)
Mover pela pagina: Espaco + clique + arrastar
Selecionar elemento: Clique simples
Ver espacamentos:   Selecione elemento + segure Alt + passe mouse em outros elementos
```

### O que extrair do Style Guide

```css
/* Cores do projeto — encontradas na aba Style Guide */
--bg-color: #____;        /* cor de fundo */
--text-color: #____;      /* cor do texto */
--accent-color: #____;    /* cor de destaque */

/* Fontes — nome e peso encontrados no Style Guide */
font-family: 'NomeDaFonte', sans-serif;
font-weight: 400;         /* regular, bold, etc */

/* Espacamentos — medidos com Alt no Figma */
padding: __px;
margin: __px;
gap: __px;
```

## Workflow: do Figma ao codigo

### Step 1: Acessar e favoritar o projeto
- Abra o link do layout nos materiais complementares
- Faca login no Figma
- Favorite o projeto (coracao)
- Clique "Open with Figma"

### Step 2: Consultar o Style Guide
- Localize a aba/frame "Style Guide" no projeto
- Anote: cores, fontes, icones, componentes e imagens

### Step 3: Inspecionar elementos
- Clique no elemento desejado
- No painel direito, leia: cor, fonte, tamanho, border-radius
- Segure Alt para medir distancias entre elementos

### Step 4: Traduzir para CSS
- Cada propriedade visual no Figma tem um equivalente CSS direto
- Distancias em pixels viram margin, padding ou gap
- Cores viram variaveis CSS ou valores diretos

## Heuristics

| Situacao | Faca |
|----------|------|
| Layout da aula parece diferente do seu Figma | Ignore — versoes mudam, propriedades dos elementos sao as mesmas |
| Nao sabe o nome da fonte | Clique em qualquer texto no Figma e veja no painel direito |
| Precisa do codigo hex de uma cor | Clique no elemento colorido e copie o valor no painel direito |
| Espacamento parece "a olho" | Sempre meça com Alt — nunca estime pixels |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Preciso dominar Figma para programar | Basta saber navegar e ler propriedades — quem cria o layout e o designer |
| O Figma gera o CSS final | Figma mostra propriedades visuais — voce traduz para CSS semantico |
| Style Guide e opcional | E a referencia oficial de cores, fontes e componentes do projeto |

## Limitations

- Esta skill nao ensina a criar designs no Figma
- Nao cobre plugins, prototipagem ou handoff avancado
- Para projetos complexos, ferramentas como Figma Dev Mode oferecem mais detalhes

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o papel do Figma no fluxo de desenvolvimento
- [code-examples.md](references/code-examples.md) — Exemplos de extracao de propriedades do Figma para CSS