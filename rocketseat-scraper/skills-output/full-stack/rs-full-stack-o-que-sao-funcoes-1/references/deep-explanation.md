# Deep Explanation: O que são Funções

## A analogia do controle de videogame

O instrutor usa a analogia de um controle de videogame para explicar funções. Cada botão do controle tem uma função específica:

- Botão de pular → sempre faz o personagem pular
- Botão de voltar → sempre volta
- Cada botão = uma responsabilidade clara

Quando você quer que o personagem pule, aperta o botão de pular. Sempre o mesmo botão, sempre o mesmo resultado. Isso é uma função: **definida uma vez, executada quantas vezes quiser, com uma responsabilidade clara**.

## Os três sinônimos

O instrutor enfatiza que existem três termos intercambiáveis na comunidade:

1. **Chamar** uma função
2. **Executar** uma função
3. **Invocar** uma função

Todos significam a mesma coisa: acionar o bloco de código encapsulado pela função. É comum encontrar qualquer um desses termos em documentação, tutoriais e conversas entre devs.

## Os três pilares das funções

### 1. Organização
Funções permitem separar o código em blocos lógicos. Em vez de um script monolítico de 500 linhas, você tem funções nomeadas que descrevem o que cada parte faz.

### 2. Compreensibilidade
O nome da função serve como documentação. Se a função se chama `calculateDiscount`, você sabe o que ela faz sem ler a implementação. Cada função com uma responsabilidade = código fácil de entender.

### 3. Reutilização
Definir uma vez, usar quantas vezes quiser. Se você precisa calcular desconto em 10 lugares diferentes do código, não copia e cola a lógica 10 vezes — chama a mesma função 10 vezes.

## Por que responsabilidade única importa

Se um botão do controle fizesse pular E atacar ao mesmo tempo, seria impossível pular sem atacar. Funções que fazem múltiplas coisas têm o mesmo problema: você não consegue usar parte da lógica sem executar tudo.

Separar responsabilidades permite:
- Testar cada parte isoladamente
- Reutilizar partes específicas
- Entender o código rapidamente
- Modificar uma parte sem afetar outras

## Edge cases conceituais

- **Função sem retorno:** Ainda é válida — ela executa uma ação (side effect) como exibir algo na tela
- **Função que chama outra função:** Composição — funções de alto nível orquestram funções menores
- **Função chamada uma única vez:** Ainda vale a pena se o nome melhora a legibilidade do código