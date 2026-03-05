# Deep Explanation: Utilizando o :root e :host no Angular

## O que é o :root?

A pseudoclasse `:root` acessa diretamente o elemento `<html>` da página. No contexto Angular, o único local correto para usar `:root` é no arquivo `styles.css` global da aplicação. É ali que definimos variáveis CSS (custom properties) que serão acessíveis por toda a aplicação.

## Por que :root funciona dentro do Shadow DOM?

CSS custom properties (variáveis com `--`) têm um comportamento especial: elas **herdam** através das fronteiras do Shadow DOM. Isso significa que variáveis definidas no `:root` (elemento `<html>`) são herdadas por qualquer componente, independentemente do tipo de encapsulamento (Emulated ou Shadow DOM).

Esse é o mecanismo fundamental que permite criar design systems em Angular — você define tokens globais no `:root` e todos os componentes conseguem consumir, mesmo os que usam Shadow DOM nativo.

## O encapsulamento é unidirecional

O instrutor demonstra um ponto crucial: variáveis definidas dentro de um Shadow DOM via `:host` **não vazam para fora**. Ele declarou `--shadow-color: blue` no `:host` do ShadowHostComponent e tentou usar essa variável no AppComponent (que está fora do Shadow DOM). O resultado: não funcionou.

Isso acontece porque o Shadow DOM encapsula seus estilos. A herança CSS flui de fora para dentro (`:root` → Shadow DOM funciona), mas o isolamento impede o fluxo inverso (`:host` → componente externo não funciona).

## :host como "mini :root" do Shadow DOM

Quando você precisa definir variáveis que serão usadas apenas dentro de um Shadow DOM específico e seus filhos, a abordagem correta é usar `:host`. O `:host` referencia o próprio elemento host do Shadow DOM, funcionando como um ":root local" para aquela árvore de componentes.

No exemplo da aula, o ShadowHostComponent define `--shadow-color: blue` no `:host`, e o AppChildComponent (que está dentro do Shadow DOM do ShadowHost) consegue acessar essa variável normalmente.

## Analogia: prédio e apartamentos

- `:root` (styles.css) = regras do condomínio inteiro — todos os apartamentos seguem
- `:host` (shadow-host.component.css) = regras internas de um apartamento — só valem dentro dele
- Componente filho dentro do Shadow DOM = cômodo dentro do apartamento — segue as regras do apartamento E do condomínio
- Componente fora do Shadow DOM = outro apartamento — não vê as regras internas do vizinho

## Por que não declarar :root dentro de componentes?

O Angular processa os estilos de cada componente de forma encapsulada (seja via Emulated ou Shadow DOM). Quando você tenta escrever `:root` dentro de um `*.component.css`, o Angular adiciona atributos de escopo que impedem a regra de atingir o `<html>` real. O resultado é que as variáveis simplesmente não são registradas.

O `styles.css` é o único arquivo de estilos que o Angular inclui globalmente, sem nenhum processamento de encapsulamento. Por isso é o único local onde `:root` funciona como esperado.

## Aplicação prática: Design System

A combinação `:root` + `:host` é a base para construir um design system em Angular:

1. **Tokens globais** (cores primárias, tipografia, espaçamentos) → `:root` no `styles.css`
2. **Tokens de componente** (variações internas de um componente complexo com Shadow DOM) → `:host` no CSS do componente
3. **Consumo** → `var(--token-name)` em qualquer lugar