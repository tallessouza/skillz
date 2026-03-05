# Deep Explanation: Componentes Puros

## Analogia com funcoes puras

O conceito vem da programacao funcional. Uma funcao pura:
- Nao depende do meio, contexto ou informacoes externas
- Nao tem side effects (chamadas API, mutacoes)
- Dados os mesmos parametros, sempre retorna o mesmo resultado

Quando trazemos isso para React, um **componente puro** e um componente que nao depende do contexto onde vive. Ele depende apenas das props recebidas. Nao importa quantas vezes voce renderize com as mesmas props — o resultado e o mesmo.

## O problema real: separacao vs desacoplamento

O insight central do Diego e a distincao entre **separar** e **desacoplar**:

- **Separar**: mover HTML e JS para outro arquivo. O componente filho ainda depende do pai para funcionar. Sao dois arquivos, mas um unico modulo logico.
- **Desacoplar**: o componente filho funciona independentemente. Voce pode move-lo para qualquer lugar da aplicacao e ele continua funcionando, desde que receba as props corretas.

### Como acontece o acoplamento acidental

1. Voce tem um `App` com uma lista de todos e uma funcao `createTodo`
2. Voce extrai o `Header` para um arquivo separado
3. Voce move a funcao `createTodo` junto para dentro do `Header`
4. Agora `createTodo` faz chamada API e precisa atualizar o estado do `App`
5. O `Header` so funciona dentro do `App` — ele nao esta desacoplado

### A solucao: inversao de dependencia via props

Em vez de o `Header` saber COMO criar um todo (chamada API, mutacao de estado), ele so precisa saber QUE precisa chamar algo quando o usuario clica. O PAI decide o que acontece.

Isso e essencialmente o principio de inversao de dependencia (DIP) aplicado a componentes React.

## O teste definitivo

> "Se voce criou um componente no intuito de ser desacoplado, voce tem que conseguir facilmente pegar este componente e mover de um lugar da sua aplicacao pra outro lugar e aquilo tem que continuar funcionando."

Se nao passa nesse teste, voce so separou arquivos.

## Quando um componente NAO precisa ser puro

O Diego faz questao de dizer: componentes impuros nao sao necessariamente um problema. Existem componentes que sao "smart components" ou "container components" por design — eles gerenciam estado e side effects intencionalmente.

O problema e quando voce ACHA que desacoplou mas na verdade so separou. A intencao importa:
- Se o componente foi criado para ser reutilizavel → deve ser puro
- Se o componente e um container/page que orquestra logica → pode ser impuro por design

## Conexao com testabilidade

Componentes puros sao trivialmente testaveis: passe props mockadas e verifique o output. Componentes impuros precisam de mocks de API, providers de contexto, e setup complexo.