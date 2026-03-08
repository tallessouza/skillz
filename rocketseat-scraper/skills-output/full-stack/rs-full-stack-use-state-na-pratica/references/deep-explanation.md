# Deep Explanation: useState na Prática

## Por que variáveis comuns não atualizam a tela?

O instrutor demonstra um ponto fundamental: criar uma variável `let count = 0` e incrementá-la com `count = count + 1` dentro de um handler **não causa nenhuma mudança visual**. O valor muda na memória, mas o React não sabe que precisa re-renderizar o componente.

Isso acontece porque o React utiliza um mecanismo interno de reconciliação. Quando `setState` é chamado, o React:
1. Registra que o estado mudou
2. Agenda uma re-renderização do componente
3. Compara o virtual DOM anterior com o novo
4. Atualiza apenas o que mudou no DOM real

Variáveis `let` e `const` vivem no escopo da função. Quando o componente re-renderiza, a função executa novamente do zero — e a variável volta ao valor inicial. Mesmo que você mude o valor antes da re-renderização, essa mudança se perde.

## A analogia do laboratório

O instrutor chama o ambiente de "laboratório" — um espaço para experimentar fundamentos. Essa mentalidade é importante: useState parece simples, mas é a base de toda interatividade no React. Se não entender por que variáveis não funcionam, o desenvolvedor vai criar bugs sutis onde a UI "congela".

## Desestruturação do array

O `useState` retorna um array com exatamente 2 posições:
- **Posição 0:** O valor atual do estado
- **Posição 1:** A função para atualizar esse estado

A convenção `[algo, setAlgo]` não é obrigatória sintaticamente, mas é um padrão universal no ecossistema React. O prefixo `set` comunica imediatamente que aquela função modifica estado.

## Valor inicial

O argumento passado para `useState(0)` é o valor inicial — só é usado na **primeira renderização**. Nas re-renderizações seguintes, o React ignora esse argumento e usa o valor mais recente do estado.

O instrutor demonstra isso trocando o valor inicial no código (0, 1, 2, 3, 5) e vendo a mudança — mas isso acontece porque o hot reload re-monta o componente. Em produção, o valor inicial só importa uma vez.

## Handlers nomeados vs arrow functions inline

O instrutor evolui de:
```tsx
onClick={() => setCount(count + 1)}
```

Para:
```tsx
function handleAdd() {
  setCount(count + 1)
}
// ...
onClick={handleAdd}
```

A vantagem: quando a lógica cresce (validação, limites, analytics), o handler nomeado é mais fácil de manter. Além disso, sem a arrow function inline, a referência da função não muda a cada render — o que pode ajudar em otimizações futuras com `React.memo`.

## Armadilha do onClick

O instrutor quase escreveu `onPress` (convenção do React Native) antes de corrigir para `onClick` (React web). Esse é um erro comum para quem transita entre React e React Native.

Outro erro sutil: escrever `onClick={setCount(count + 1)}` sem arrow function. Isso **executa a função imediatamente** durante a renderização, causando um loop infinito. O correto é passar uma **referência** de função: `onClick={() => setCount(count + 1)}` ou `onClick={handleAdd}`.

## Quando usar estado vs variável

O instrutor resume com clareza:
- **Estado:** quando o valor precisa refletir na tela em tempo real após interação
- **Variável/constante:** para apoiar a lógica interna, guardar valores temporários que não precisam aparecer na UI

Essa distinção é a regra de ouro para decidir onde armazenar dados num componente React.