# Deep Explanation: useEffect em Múltiplos Contextos

## O modelo mental de contextos no React

O React não tem um "lugar certo" para colocar useEffect. Cada unidade de composição — seja um componente ou um custom hook — é um **contexto independente** que pode gerenciar seus próprios efeitos colaterais.

### Analogia: cada cômodo tem sua própria tomada

Pense em componentes e hooks como cômodos de uma casa. Cada cômodo tem suas próprias tomadas elétricas. Você não precisa levar todos os aparelhos para a sala principal para ligá-los — cada cômodo é autossuficiente. Da mesma forma, cada componente e hook pode ter seu próprio useEffect sem precisar "delegar" para o componente pai.

## Por que distribuir efeitos?

### 1. Encapsulamento
Quando o useMessage tem seu próprio useEffect, o componente que usa esse hook não precisa saber que existe um efeito colateral acontecendo. O hook é uma caixa preta com comportamento completo.

### 2. Reutilização
Se o useMessage é usado em 5 componentes diferentes, o efeito colateral do hook acompanha automaticamente cada uso. Não é necessário duplicar o useEffect em cada componente consumidor.

### 3. Separação de responsabilidades
O App cuida dos efeitos do App. O Button cuida dos efeitos do Button. O useMessage cuida dos efeitos do useMessage. Cada contexto é responsável pelo que lhe pertence.

## Comportamento de múltiplas instâncias

Um ponto demonstrado na aula: quando existem dois componentes `<Button />` renderizados, o console mostra "useEffect do componente" **duas vezes**. Isso acontece porque:

- Cada instância de componente tem seu próprio ciclo de vida
- Cada instância executa seu próprio useEffect independentemente
- O React não "compartilha" efeitos entre instâncias do mesmo componente

Isso é fundamental para entender: o useEffect pertence à **instância**, não ao **tipo** do componente.

## Ordem de execução

Quando o App renderiza com useMessage e dois Buttons, a ordem dos efeitos no console será:

1. `useEffect do componente Button` (primeira instância)
2. `useEffect do componente Button` (segunda instância)
3. `useEffect do useMessage` (chamado dentro do App)
4. `useEffect do App` (efeito do próprio App)

Os efeitos dos filhos executam antes dos efeitos do pai — o React processa de baixo para cima (bottom-up).

## Prática de limpeza

O instrutor enfatizou um hábito importante: após experimentar com useEffect para aprendizado ou debug, **limpe o código**. Isso significa:

1. Remover os useEffects de teste
2. Remover as importações de useEffect que não são mais usadas
3. Comentar ou remover hooks que foram apenas para demonstração

Código de experimentação não deve ir para produção.

## Quando NÃO distribuir

Nem todo efeito deve ser distribuído. Se um efeito depende de estado que vive no componente pai, ele deve ficar no pai. A regra é: **o efeito mora onde mora o estado/dados que ele precisa**.