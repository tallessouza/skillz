# Deep Explanation: Setup de Projeto Template

## Por que separar HTML/CSS do JavaScript neste curso

O instrutor deliberadamente fornece o HTML e CSS prontos para que o foco seja 100% em JavaScript. Isso reflete uma pratica pedagogica importante: isolar a variavel de aprendizado. Quando o aluno tem que lidar com HTML, CSS e JS ao mesmo tempo, a carga cognitiva impede o aprofundamento em qualquer um deles.

A frase-chave do instrutor: "O nosso foco é JavaScript, certo? Então eu trouxe aqui o HTML e o CSS desse projeto pronto pra gente utilizar como base."

## O projeto: Conversor de Moedas

O template consiste em:
- **Logo** no topo
- **Formulario** (`<main>`) com:
  - Input de valor
  - Select com opcoes de moedas (dolar, euro, libra)
  - Botao "Converter para Reais"
- **Footer** oculto (`display: none`) que exibira o resultado da conversao

O footer estar oculto e uma decisao de design: ele so aparece depois que o JavaScript calcular a conversao. Isso demonstra o conceito de **manipulacao dinamica do DOM** — mostrar/esconder elementos baseado em acoes do usuario.

## Fork vs Download ZIP

O instrutor apresenta duas opcoes:
- **Fork**: cria uma copia do repositorio no seu GitHub. O instrutor compara com "Ctrl+C / Ctrl+V" para simplificar. Ideal para quem ja usa GitHub e quer manter historico.
- **Download ZIP**: mais simples, sem necessidade de conta GitHub. O instrutor usa esta opcao na demonstracao, sinalizando que e a mais acessivel para iniciantes.

## Live Server — Por que usar

O instrutor mostra primeiro o metodo "abrir arquivo direto no navegador" e depois explica por que prefere o Live Server:

1. **Sem Live Server**: cada alteracao exige F5 manual
2. **Com Live Server**: cria um servidor local (localhost/127.0.0.1) que observa mudancas nos arquivos e recarrega automaticamente

A explicacao do instrutor sobre localhost: "é como se ele criou um servidor dentro da nossa própria máquina aqui, para ficar observando as alterações."

Isso e relevante porque antecipa conceitos que o aluno encontrara mais tarde (servidores, HTTP, hot-reload em frameworks modernos).

## Detalhes sobre o footer oculto

O instrutor demonstra ao vivo:
1. Abre o CSS
2. Usa Ctrl+F para encontrar `footer`
3. Mostra que tem `display: none`
4. Remove temporariamente para mostrar como ficara
5. Volta para `none` — "a gente vai fazer isso aparecer de forma dinâmica"

Isso planta a semente do conceito de manipulacao de estilos via JavaScript, que sera abordado nas proximas aulas.