# Deep Explanation: Módulos JavaScript

## Por que modularizar?

O instrutor parte de uma observação prática: até este ponto do curso, todo código foi escrito num único arquivo. Isso funciona para exercícios pequenos, mas quebra quando o projeto cresce.

A analogia implícita é a de uma gaveta: quando você tem poucos objetos, uma gaveta só basta. Quando acumula muitos, precisa de um móvel com gavetas separadas — cada uma com seu propósito.

## O momento certo de separar

Não existe regra numérica absoluta, mas o sinal claro é: **quando você precisa rolar o arquivo para encontrar algo, já passou da hora de separar.**

O instrutor enfatiza que a separação não é sobre preferência estética — é sobre **responsabilidades**. Cada arquivo deve ter uma razão de existir, um domínio que ele cuida.

## A progressão natural

1. **Arquivo único** — exercícios, scripts rápidos, protótipos
2. **Poucos arquivos** — separação por tipo (dados, lógica, apresentação)
3. **Estrutura de pastas** — projetos reais com múltiplas funcionalidades
4. **Módulos com API pública** — cada módulo exporta apenas o necessário

## Separação de responsabilidades como fundamento

Este conceito é a base para entender frameworks depois. React separa em componentes, Node.js separa em módulos, APIs separam em rotas/controllers/services. Tudo começa aqui: entender que **um arquivo = uma responsabilidade**.

## Conexão com o que vem depois

O instrutor posiciona este módulo como ponte entre "escrever JavaScript" e "construir aplicações reais". Módulos são o primeiro passo para pensar em arquitetura, mesmo que simples.