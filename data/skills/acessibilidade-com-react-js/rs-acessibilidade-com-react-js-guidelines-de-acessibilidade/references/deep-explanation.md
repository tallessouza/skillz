# Deep Explanation: Guidelines de Acessibilidade (WCAG)

## Origem e contexto historico

A WCAG (Web Content Accessibility Guidelines) foi criada pela WAI (Web Accessibility Initiative), que por sua vez foi criada pela W3C em 1997. O objetivo da WAI e melhorar a acessibilidade da web para pessoas com deficiencias, criando diretrizes e materiais educacionais.

A WAI mantém um website com recursos extensivos sobre acessibilidade, incluindo as guidelines atuais, propostas futuras e guidelines antigas — permitindo acompanhar a evolucao das regras ao longo do tempo.

## Importancia global

As guidelines da WCAG sao seguidas ao redor do mundo inteiro. Em alguns paises, seguir essas guidelines e **obrigatorio por lei** para publicar sites governamentais ou tipos especificos de sites. Isso torna o acompanhamento da WCAG essencial para qualquer desenvolvedor web.

## Os 4 principios WCAG

### 1. Perceptivel
As pessoas devem conseguir **ver** o conteudo **ou ouvir**. O instrutor usa o exemplo: uma pessoa cega nao consegue ver, mas conseguiria ouvir o conteudo via leitor de tela. Inversamente, uma pessoa com deficiencia auditiva nao consegue ouvir um video, mas poderia consumir o mesmo conteudo atraves de legendas ou transcricao de texto.

A chave e: o **mesmo conteudo** deve estar disponivel atraves de diferentes canais sensoriais.

### 2. Operavel
As pessoas devem conseguir usar o computador atraves do **teclado** ou por **controle de voz**. Nao se pode assumir que todos usam mouse.

### 3. Compreensivel
O conteudo deve conter **linguagem clara e simples** para que as pessoas compreendam com facilidade. Isso inclui uso correto de idioma, explicacao de abreviacoes, etc.

### 4. Robusto
As pessoas devem conseguir utilizar **diversos tipos de tecnologias assistivas** — leitores de tela, controle por voz, e outras ferramentas.

## Versoes e criterios

- **WCAG 2.0**: 61 criterios
- **WCAG 2.1**: 78 criterios (todos os 61 da 2.0 + 17 novos)
- **WCAG 2.2**: draft/rascunho disponivel no site da WAI
- **WCAG 3.0**: prevista para o futuro

A versao 2.1 e um **superset** da 2.0 — contem tudo da versao anterior mais adicoes.

## Sistema de niveis (A, AA, AAA)

O instrutor explica que cada nivel a mais significa que os criterios sao **mais complexos** ou **dependem de mais adaptacoes** do layout/estrutura do site.

### Nivel A (30 criterios)
Criterios mais faceis de atingir, com menor impacto na estrutura ou design do website. E o baseline minimo.

### Nivel AA (20 criterios adicionais)
Requer atingir TODOS os criterios do nivel A + os 20 criterios AA. Media complexidade, ja altera o design do site (ex: regras de contraste). Alguns paises exigem este nivel por lei para certos tipos de site.

### Nivel AAA (28 criterios adicionais)
O nivel mais rigoroso. O instrutor destaca que **nem sempre e possivel atingir todos os criterios AAA em todos os tipos de site**, mas isso nao significa que se pode ignorar completamente — cada criterio a mais e um grupo a mais de pessoas atendidas.

## Insight sobre imagens decorativas

O instrutor da um exemplo importante: imagine um circulo que e so uma ilustracao decorativa no site, um background ilustrativo sem significado para o conteudo. Se voce colocar texto alternativo nele, o leitor de tela vai anunciar esse texto, o que **confunde** o usuario. A solucao e usar `alt=""` (alt vazio) para que a imagem seja completamente ignorada pelas tecnologias assistivas.

## Insight sobre som de fundo

Para conteudo audiovisual (sites com audio ou videos), o criterio AAA recomenda:
1. **Idealmente**: nenhum som de fundo
2. **Se houver**: que seja possivel desliga-lo
3. **Se nao for possivel desligar**: o som de fundo deve ser pelo menos **20 decibeis mais baixo** que o volume da voz (em media 4x mais baixo)

O instrutor explica que isso e importante para:
- **Pessoas com transtornos neurologicos/autismo**: sons de fundo altos, irritantes ou repetitivos incomodam
- **Pessoas com problemas de audicao**: dificuldade de distinguir entre som de fundo e voz

## Recursos oficiais

O instrutor recomenda fortemente acessar:
- **WAI website**: recursos extensivos sobre acessibilidade
- **WCAG 2.1 Standard**: todos os criterios organizados por principio
- **Understanding WCAG**: explicacoes detalhadas de cada criterio (proposito, beneficios, exemplos)
- **How to Meet WCAG**: parte tecnica de como implementar cada criterio

Navegacao: WAI → Standards/Guidelines → WCAG Overview ou WCAG 2.1 Standard