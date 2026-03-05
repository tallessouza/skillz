# Deep Explanation: Ajustes Finais em Projetos CSS

## Por que detalhes sempre escapam

O instrutor enfatiza que é **normal** não pegar tudo de primeira: "Isso acontece com você, acontece comigo também." Isso não é descuido — é uma limitação cognitiva. Quando se está focado na estrutura macro (layout, grid, flexbox), detalhes tipográficos como line-height do footer passam batido.

A solução não é "prestar mais atenção" — é ter um **checklist de revisão** que se executa mecanicamente antes de cada commit.

## A lógica do object-fit: cover

O instrutor explica a motivação: "Caso a imagem não esteja exatamente no tamanho bom." O object-fit: cover resolve o problema de imagens com aspect ratios diferentes do container:

- Sem object-fit: a imagem estica ou comprime para caber
- Com object-fit: cover: a imagem mantém proporção e preenche o container, cortando o excesso
- Combinado com border-radius: 50%: funciona mesmo com imagens não-quadradas

## Responsividade vs. ajustes finais

O instrutor faz uma distinção importante: ajustes finais **não são** responsividade. Ele nota que a imagem "cresce de uma maneira muito estranha quando ele está pequenininho" mas explica que "essa questão de adaptar para uma tela menor é um outro trabalho, é um outro estudo."

O que se faz nos ajustes finais:
- Definir dimensões fixas para evitar distorções óbvias
- Garantir que o layout não quebra grosseiramente

O que NÃO se faz aqui:
- Media queries para breakpoints
- Layout adaptativo completo
- Mobile-first redesign

## Publicação e versionamento

O instrutor comita como "final project" e publica no GitHub com a menção: "pelo menos a gente não perde mais o projeto." A motivação é pragmática — backup na nuvem. Ele também recomenda criar um README explicando o projeto, o que mostra consciência de documentação mesmo em projetos de estudo.