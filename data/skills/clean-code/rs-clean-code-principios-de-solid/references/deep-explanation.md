# Deep Explanation: Principios SOLID

## Os principios sao um emaranhado, nao uma lista

O ponto central do instrutor (Diego) e que SOLID nao faz sentido estudado principio a principio. Eles sao "um emaranhado de principios, totalmente conectados". Na pratica, o mesmo pedaco de codigo resolve dois ou tres principios simultaneamente. Isso explica por que muitos devs acham que os principios "parecem a mesma coisa" — visualmente em codigo, eles se manifestam de forma similar.

## SRP — O teste do "e"

A heuristica pratica para identificar violacao de SRP: descreva o que o metodo faz em uma frase. Se voce usar a palavra "e" conectando duas acoes ("cria um usuario **e** envia um email"), o metodo tem duas responsabilidades.

O instrutor enfatiza que SRP nao diz COMO resolver — apenas identifica o problema. A solucao envolve outros principios (OCP, DIP).

## OCP — O problema dos ifs crescentes

O exemplo classico usado: sistema de logistica com calculo de frete. Cada nova transportadora (Correios, "SkillzPress") exige um novo `if` na funcao original. Isso viola OCP porque voce esta **modificando** a classe original em vez de **estender** o comportamento.

O principio na teoria diz: "classes devem estar abertas para extensao e fechadas para modificacao". Na pratica isso significa: deve ser possivel adicionar comportamento novo sem alterar codigo existente.

## LSP — Substituicao sem quebra

O exemplo usado: repositorio de banco de dados. Se sua classe usa um repositorio Postgres com metodos `create`, `update`, `delete`, `list`, voce deve poder trocar por um repositorio Mongo, MySQL ou ate arquivo fisico — desde que tenha os mesmos metodos. A classe consumidora "nao deve saber de nada" sobre a implementacao interna do repositorio.

LSP esta "totalmente conectado" com DIP — a inversao de dependencia e o que torna a substituicao possivel.

## ISP — O exemplo da impressora

Exemplo classico: interface `Printer` com metodos `print` e `scan`. Uma impressora basica so imprime, nao escaneia. Se a interface exige ambos, a impressora basica e forcada a implementar um metodo que nao usa.

Solucao: separar em `Printable` e `Scannable`. Impressora multifuncional implementa ambas; impressora basica implementa apenas `Printable`.

## DIP — Inverter o import

O modelo tradicional: dentro da funcao, voce importa a dependencia diretamente (`import { createUserOnDatabase } from './database'`). No DIP, a funcao **recebe** a dependencia como parametro. Quem chama a funcao e que decide qual implementacao passar.

O instrutor nota que isso nao necessariamente torna o codigo "melhor" por si so — o valor real aparece na testabilidade e manutenibilidade na pratica.

## Aviso sobre paralisia por analise

O instrutor faz um aviso forte: se voce nunca colocou um backend em producao, nunca teve mais de mil usuarios, nunca trabalhou em time — **cuidado para nao usar SOLID como regra absoluta**. O risco e cair em "paralisia por analise": voce le sobre principios, sente que nao sabe programar, e para de escrever codigo.

> "Se voce estivesse escrevendo o codigo da maneira que voce ja sabe escrever, mesmo que nao siga as melhores praticas do universo, voce ja teria terminado o software, ja teria entregue e o cliente estaria satisfeito."

SOLID e para ajudar a escrever codigo mais limpo, mas **nao e essencial** para escrever codigo limpo. Respeite o seu momento.