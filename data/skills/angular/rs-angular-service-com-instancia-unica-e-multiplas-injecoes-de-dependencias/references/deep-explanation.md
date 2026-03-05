# Deep Explanation: Service com Instância Única e Múltiplas Injeções

## Por que services ao invés de input/output?

O instrutor enfatiza que o uso excessivo de `@Input()` e `@Output()` cria **acoplamento forte** entre componentes. Quando um componente pai precisa passar dados para netos ou bisnetos, cada nível intermediário precisa declarar inputs e outputs que ele nem usa — apenas repassa. Isso é o chamado "prop drilling" no Angular.

Com services, cada componente que precisa dos dados simplesmente injeta o service. Não importa onde ele está na árvore de componentes.

## Referência de memória compartilhada

O ponto central da aula é entender que quando múltiplos componentes injetam o mesmo service (`providedIn: 'root'`), eles recebem **a mesma instância**. Isso significa:

- `ProductsComponent`, `ProductsListComponent` e `ProductsCounterComponent` acessam o **mesmo objeto** `ProductsService`
- Quando `ProductsComponent` modifica `productsService.products`, a mudança é visível imediatamente nos outros dois componentes
- Isso acontece porque todos compartilham a mesma **referência de memória**

### O perigo da referência compartilhada

O instrutor alerta: se qualquer componente fizer `this.productsService.products = []`, isso afeta **todos** os componentes que consomem essa lista. Por isso:

1. Componentes **não devem** modificar propriedades do service diretamente
2. O service deve expor **métodos** para mutações (`addProduct`, `removeProduct`)
3. Idealmente, consumidores recebem **cópias** dos dados, não a referência original

O instrutor menciona que isso será aprofundado nas próximas aulas, onde os componentes receberão cópias (outra referência de memória) para que alterações acidentais não propaguem.

## Analogia do container

O instrutor usa o conceito de **componente container**: o `ProductsComponent` é o "container" que orquestra ações (criar, remover, modificar), enquanto os componentes filhos (`ProductsListComponent`, `ProductsCounterComponent`) são **componentes de apresentação** que apenas leem e renderizam.

## Armadilha do import

O instrutor destaca um erro comum: ao importar `inject`, o autocomplete do editor pode sugerir `@angular/core/testing` ao invés de `@angular/core`. O import errado causa um erro silencioso que pode levar muito tempo para diagnosticar.

## Reestruturação de pastas

A aula também demonstra uma boa prática de organização: mover componentes para uma pasta `components/` e manter services na pasta `services/`, ambos dentro do mesmo módulo/feature. Essa separação facilita a navegação e deixa claro o papel de cada arquivo.