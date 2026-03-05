# Deep Explanation: Permutação Simples

## Por que funciona: o Princípio Fundamental da Contagem

A permutação simples é uma aplicação direta do princípio fundamental da contagem (PFC). O instrutor Rodolfo enfatiza isso explicitamente: "Mas, Rodolfo, isso é princípio fundamental da contagem. É isso mesmo."

A lógica é sequencial e dependente:
- Para a **primeira posição**, todos os N elementos estão disponíveis → N opções
- Para a **segunda posição**, um elemento já foi usado → N-1 opções
- Para a **terceira posição** → N-2 opções
- ...até restar apenas 1 elemento para a última posição

Como cada escolha depende da anterior (são eventos sequenciais), **multiplicamos** as opções. Nunca somamos.

## Requisito: elementos distintos

O instrutor reforça várias vezes: "Muito importante que eu não tenho aqui elementos pessoas idênticas. Não existe duas pessoas iguais. São pessoas diferentes, elementos distintos."

Se houvesse elementos iguais, estaríamos contando arranjos que na verdade são indistinguíveis, inflando o resultado. Para isso existe a permutação com repetição.

## Fatorial como pré-requisito

Rodolfo alerta: "Se você não está por dentro do que é fatorial, volta. Algumas aulas que nós já falamos sobre fatorial. É importante para a gente dar sequência."

Fatorial é a base de toda a análise combinatória:
- Permutação simples: N!
- Arranjo: N! / (N-k)!
- Combinação: N! / (k! × (N-k)!)

Sem dominar fatorial, nenhum desses conceitos faz sentido.

## A simplicidade do conceito

Como o próprio instrutor diz: "O nome mesmo já diz. É bem simples mesmo. Só a gente conhecer de fatorial." A fórmula é direta — P(N) = N! — e o raciocínio é sempre o mesmo: contar posição a posição, multiplicando as opções decrescentes.