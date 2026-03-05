# Deep Explanation: Implementando Barra de Pesquisa com TDD

## O ciclo TDD aplicado ao componente

O instrutor demonstra o ciclo classico do TDD na pratica:

1. **Red**: Escreveu o teste `should update search field when typing` — o teste quebra porque o input nao existe ainda. O `getByPlaceholderText('Buscar prompts...')` nao encontra nenhum elemento.

2. **Green**: Criou o componente `Input` dentro da sidebar, com o placeholder correto. O teste passa imediatamente — o minimo necessario foi implementado.

3. **Refactor**: Sera feito na proxima aula, incrementando o componente.

O ponto chave e que o teste **guia** a implementacao. Voce nao cria o input e depois testa — voce descreve o comportamento desejado e deixa o teste te dizer o que falta.

## AAA vs Given-When-Then

O instrutor explica que AAA (Arrange-Act-Assertion) e Given-When-Then sao essencialmente a mesma coisa:

- **Arrange = Given**: Dado um setup inicial (makeSut, capturar elementos)
- **Act = When**: Quando uma acao acontece (user.type, user.click)
- **Assertion = Then**: Entao espero um resultado (expect...toHaveValue)

Nem todo teste tem Act. Testes que verificam presenca de elementos em tela (estilizacao, renderizacao condicional) podem ter apenas Arrange + Assertion. Isso e valido e esperado.

## Componente controlado pela sidebar

O input de busca nao e independente — ele e **controlado pela sidebar**. Isso significa:

- O estado do input vive no componente pai (sidebar)
- O input so aparece quando a sidebar esta expandida (`!isCollapsed`)
- Faz sentido testar o comportamento do input no contexto da sidebar, nao isoladamente

O instrutor justifica: "esse campo de input vai ter algumas coisinhas a mais, ele vai ser um componente controlado pela nossa sidebar, entao faz sentido ter esse comportamento validado pelo nosso teste."

## Testes como documentacao viva

O instrutor enfatiza fortemente que testes bem escritos servem como documentacao:

- Quando voce revisita o codigo meses depois, os testes te lembram o que o componente deveria fazer
- Quando uma pessoa nova entra no time, ela pode ler os testes para entender o comportamento da aplicacao
- Testes descritivos (`should update search field when typing`) sao mais valiosos que 100% de coverage com testes genericos

A qualidade dos testes importa mais que a quantidade. Uma suite com testes claros, usando AAA, com descricoes de comportamento real, vale mais que coverage mecanico.

## Validacao contra falso positivo

Apos o teste passar, o instrutor roda a aplicacao real para confirmar que o input funciona no browser. Isso valida que o teste nao e um falso positivo — o comportamento existe tanto no teste quanto na aplicacao real.

## Escolha de queries do testing-library

O instrutor usa `getByPlaceholderText` porque o input tem um placeholder descritivo ("Buscar prompts..."). Ele menciona que existem varias opcoes de query (getByRole, getByText, getByPlaceholderText, etc.) e que voce deve escolher a mais semantica para cada caso.