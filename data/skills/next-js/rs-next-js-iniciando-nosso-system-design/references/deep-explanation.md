# Deep Explanation: Iniciando Design System com shadcn/ui

## Por que shadcn/ui como fundacao

O instrutor posiciona shadcn/ui nao como uma biblioteca de componentes comum, mas como a **fundacao do design system**. O proprio slogan do shadcn reforça isso — ele e a base sobre a qual voce constroi seu sistema de design customizado.

A diferenca fundamental do shadcn para outras bibliotecas (Material UI, Chakra, etc.) e que shadcn usa copy-paste: os componentes sao copiados para o seu projeto, e voce tem controle total sobre eles. Isso permite customizacao profunda sem fight com a lib.

## shadcn e baseado no Radix UI

O instrutor menciona que shadcn e "baseado no Radix" (ele fala "teu Indie" referindo-se ao Radix). Radix UI fornece primitivos acessiveis e sem estilo — shadcn adiciona estilos com Tailwind por cima.

## Versao 4 do Tailwind

O instrutor menciona que esta usando Tailwind v4 ("Indie 4"), que e "um pouquinho diferente das versoes anteriores, mas nada muito gritante". Isso e relevante porque a configuracao de CSS variables e a integracao com shadcn podem ter pequenas diferencas na v4.

## Filosofia de instalacao sob demanda

O instrutor demonstra instalar o botao individualmente (`shadcn add button`) em vez de instalar todos os componentes. A razao: componentes shadcn vem com muitas variacoes que provavelmente nao serao usadas. A abordagem e instalar conforme necessidade e limpar o que nao usar.

Ele explica: "Tem bastante coisa, se voce perceber. A gente vai acabar nao utilizando, entao a gente limpa ele. Isso aqui e basicamente uma base."

## Organizacao de estilos

O instrutor tem preferencia pessoal por criar uma pasta `styles/` dentro de `src/` para organizar os estilos globais, em vez de deixar o `globals.css` solto dentro de `app/`. Isso melhora a organizacao do projeto quando o design system cresce.

## Extracao do Figma

O instrutor ja tinha preparado todo o style guide no Figma com:
- Cores (background, border, etc.)
- Tipografia (todos os tamanhos de fonte)
- Icones (usando lib separada, nao os do Figma diretamente)

O globals.css foi inteiramente extraido desse Figma — incluindo CSS variables, aplicacoes default, e ate estilos de Toast para uso futuro. A ideia e fazer esse trabalho de extracao uma vez e nao perder tempo durante o desenvolvimento.

## O que o init faz

Quando roda `pnpx shadcn@latest init`, o shadcn:
1. Pergunta configuracoes (estilo, etc.)
2. Instala dependencias necessarias
3. Cria `lib/utils.ts` com a funcao `cn()` para merge de classes
4. Configura o projeto para aceitar componentes shadcn