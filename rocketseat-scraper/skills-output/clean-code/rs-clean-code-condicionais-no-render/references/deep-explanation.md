# Deep Explanation: Condicionais no Render

## Por que extrair condicionais do JSX?

Diego Fernandes apresenta um principio simples mas poderoso: **a camada de renderizacao (JSX/HTML) deve ser o mais declarativa possivel**, com o minimo de operacoes JavaScript embutidas.

### O raciocinio

Quando voce escreve `todos.length === 0` diretamente no JSX, voce esta misturando duas responsabilidades:
1. **Logica de negocio** (determinar se a lista esta vazia)
2. **Apresentacao** (o que renderizar)

Ao extrair para `isToDoListEmpty`, voce separa essas camadas. O JSX passa a ser puramente declarativo — ele apenas diz "se a lista estiver vazia, mostre isso".

### Pensando no crescimento do projeto

Diego enfatiza: "pensando no crescimento do teu projeto". Isso porque:

- Em componentes pequenos, `todos.length === 0` parece inofensivo
- Mas conforme o componente cresce, multiplas condicoes inline tornam o JSX ilegivel
- Variaveis nomeadas servem como documentacao inline — o nome explica a intencao
- Facilita refatoracao: se a logica de "vazio" mudar, voce altera em um unico lugar acima do return

### O principio geral

A dica vai alem de condicionais. O principio e: **mantenha o maximo de JavaScript na camada anterior ao return**. Isso inclui:
- Calculos
- Filtragens
- Transformacoes de dados
- Formatacoes

O return deve ser uma "planta" declarativa do que sera renderizado, nao um lugar onde decisoes sao tomadas.

## Quando a regra e flexivel

Condicionais simples com uma unica variavel booleana ja nomeada (`{isOpen && <Modal />}`) nao precisam de extracao adicional — a variavel ja carrega o significado semantico.