# Deep Explanation: HTML Semântico

## O raciocínio fundamental do instrutor

A ideia central é simples mas poderosa: **o HTML te dá liberdade para escrever tudo com uma única tag e depois estilizar com CSS. Mas esse não é o propósito do HTML.**

O HTML vem com uma "estratégia semântica" — dar significado às coisas. A pergunta-chave que o instrutor propõe como modelo mental é:

> "Eu vou escrever um título? Tem uma tag pra isso? Tem."
> "Eu vou escrever um parágrafo? Tem uma tag pra isso? Tem."
> "Eu vou fazer um link? Tem uma tag pra isso? Tem."
> "Eu preciso fazer um botão? Tem uma tag pra isso? Tem."

Esse é o filtro mental: **antes de usar qualquer elemento genérico, pergunte se existe um elemento específico para aquele propósito.**

## Por que semântica importa

### 1. Acessibilidade

Leitores de tela (screen readers) dependem da semântica HTML para navegar e comunicar o conteúdo a usuários com deficiência visual. Um `<nav>` é anunciado como "navegação", um `<h1>` como "título nível 1". Um `<div>` é silencioso — não comunica nada.

Quando você usa `<div onclick>` em vez de `<button>`, o elemento:
- Não é focável por teclado (sem Tab)
- Não é anunciado como interativo
- Não responde a Enter/Space nativamente
- Exige ARIA e JavaScript extra para funcionar

### 2. SEO (Search Engine Optimization)

Motores de busca como Google usam a estrutura semântica para entender o conteúdo da página. O instrutor menciona explicitamente que HTML semântico é a base para SEO — "otimizar o seu site, a estrutura que você está fazendo do seu HTML para que os motores de busca encontrem ele de uma maneira melhor."

Elementos semânticos ajudam o Google a:
- Identificar o conteúdo principal (`<main>`, `<article>`)
- Entender a hierarquia de informação (`<h1>` > `<h2>` > `<h3>`)
- Distinguir navegação de conteúdo (`<nav>` vs `<main>`)
- Identificar conteúdo suplementar (`<aside>`)

### 3. Manutenibilidade do código

HTML semântico é autodocumentado. Ao ler `<nav>`, qualquer desenvolvedor sabe que ali está a navegação. Ao ler `<div class="nav-wrapper-container">`, é preciso interpretar a classe CSS.

## Evolução do HTML e o HTML5

O instrutor contextualiza que a semântica evoluiu com o tempo. O HTML5 foi um marco que trouxe "um monte de novos elementos", chegando a mais de 100 elementos semânticos. Antes do HTML5, desenvolvedores eram forçados a usar `<div id="header">`, `<div id="nav">`, `<div id="footer">`. O HTML5 criou elementos nativos para esses padrões.

### Elementos estruturais adicionados no HTML5:
- `<header>`, `<footer>`, `<nav>`, `<main>`
- `<article>`, `<section>`, `<aside>`
- `<figure>`, `<figcaption>`
- `<details>`, `<summary>`
- `<mark>`, `<time>`, `<progress>`, `<meter>`
- `<video>`, `<audio>`, `<canvas>`

## Não precisa decorar tudo

O instrutor é explícito: "Tem que saber todos eles de cabeça? Não." A abordagem correta é ir descobrindo conforme estuda. O importante é internalizar o hábito de perguntar "tem uma tag pra isso?" antes de usar um elemento genérico.

## A armadilha do "div soup"

O anti-pattern mais comum em HTML é o "div soup" — páginas inteiras construídas apenas com `<div>` e `<span>`, onde toda a semântica está nas classes CSS. Isso acontece porque o CSS pode fazer qualquer div parecer qualquer coisa visualmente. Mas a aparência visual é apenas uma das dimensões do HTML — acessibilidade, SEO e manutenibilidade dependem da semântica nativa.