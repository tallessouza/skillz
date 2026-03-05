# Deep Explanation: Isolamento de Testes com beforeEach

## Por que isolamento importa

O instrutor explica o problema central: se voce cria o repositorio uma unica vez e compartilha entre todos os testes, dados criados em um teste vazam para o proximo. Um teste que roda depois de outro pode ter resultados diferentes dependendo da ordem de execucao.

Exemplo concreto: se o primeiro teste registra um usuario com email "john@example.com", e o segundo teste tenta registrar o mesmo email para testar duplicacao, o resultado depende de qual teste roda primeiro. Se a ordem mudar, o teste quebra sem que voce tenha mudado nada no codigo.

## A armadilha do "funciona mas esta errado"

O instrutor mostra que mover as variaveis para o topo do describe (com `const`) faz os erros de TypeScript sumirem — o codigo funciona. Mas funcionar nao e suficiente. A regra dos testes unitarios e que cada teste deve rodar em contexto totalmente isolado. "Se esse teste rodar depois daquele teste, ele nao pode sofrer alteracoes de funcionamento."

## Por que `let` sem inicializar + beforeEach

A solucao tem duas partes:

1. **`let` sem valor inicial** — declara a variavel no escopo visivel para todos os testes, mas sem criar a instancia ainda
2. **`beforeEach`** — cria novas instancias antes de CADA teste individual

Isso garante que cada teste comeca com repositorios vazios e use cases frescos.

## O erro do import

O instrutor alerta especificamente: importe `beforeEach` de `vitest`, nao de `node:test`. O Node.js tem sua propria suite de testes que ainda estava em beta na epoca da gravacao, e a API e diferente. Confundir os imports causa erros silenciosos ou comportamento inesperado.

## Escala do problema

O instrutor antecipa que o beneficio cresce com o tempo: "daqui a pouco a gente vai ter casos de uso que recebem cinco, seis repositorios." Inicializar 5-6 dependencias em cada teste individual geraria dezenas de linhas repetidas. O `beforeEach` centraliza essa inicializacao mantendo o isolamento.

## Convencao SUT

O instrutor aproveita a refatoracao para aplicar a convencao `sut` (subject under test) que foi introduzida na aula anterior, substituindo nomes como `registerUseCase` por `sut` para identificar imediatamente o que esta sendo testado.