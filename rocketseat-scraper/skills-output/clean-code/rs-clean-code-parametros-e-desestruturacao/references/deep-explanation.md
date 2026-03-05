# Deep Explanation: Parâmetros e Desestruturação

## O problema do repasse cego

O instrutor destaca um padrão extremamente comum em aplicações backend: dados chegam numa rota (body da requisição) e são repassados de função em função — rota → controller → repositório — sem que ninguém explicite quais campos estão sendo enviados.

O problema não é funcional (o código funciona), mas de legibilidade e segurança:

1. **Legibilidade:** Quando os arquivos estão separados, olhar para `controller(data)` não diz nada. O que é `data`? Precisa ir ao arquivo anterior para descobrir.

2. **Segurança em runtime:** Mesmo com TypeScript, a tipagem estática só existe em desenvolvimento. Em produção, se alguém enviar campos extras no body da requisição, eles serão repassados cegamente para o repositório e potencialmente para o banco de dados. A desestruturação funciona como um filtro runtime — apenas os campos explicitamente extraídos são repassados.

## Por que objetos ao invés de parâmetros posicionais

O instrutor usa um exemplo claro: uma função que recebe `(body, params)`. Quando você quer chamar essa função apenas com `params`, é forçado a escrever `fn(null, { id: 1 })`. Isso gera dois problemas:

- **O que é `null`?** Sem ver a definição da função, é impossível saber o que aquele `null` representa.
- **O que é `{ id: 1 }`?** Também é opaco fora de contexto.

Com objetos nomeados: `fn({ params: { id: 1 } })` — cada valor tem nome, ordem não importa, e parâmetros opcionais simplesmente são omitidos.

## Retorno como objeto — extensibilidade

O instrutor argumenta que retornar `{ user }` ao invés de `user` diretamente parece verboso no momento, mas paga dividendos quando você precisa adicionar informações ao retorno. Basta adicionar um campo ao objeto — nenhum consumidor existente quebra. Se retornasse `user` direto, adicionar um segundo valor de retorno exigiria refatorar todos os pontos de chamada.

## TypeScript não resolve tudo

Um ponto sutil do instrutor: mesmo que TypeScript ajude a saber o que `data` contém em tempo de desenvolvimento, ele não previne campos extras em runtime. A desestruturação é a única forma de garantir que apenas os campos esperados são extraídos e repassados. É uma validação que funciona tanto em desenvolvimento quanto em produção.