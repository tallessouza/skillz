# Deep Explanation: useEffect e useState

## Por que useEffect deve estar dentro de um componente?

O instrutor enfatiza que a resposta e simples: o useEffect precisa acessar os estados do componente. Se estivesse fora, nao teria acesso ao escopo onde os estados vivem. Isso e fundamental porque o principal caso de uso do useEffect e reagir a mudancas de estado — e para isso, ele precisa "enxergar" esses estados.

## O modelo mental de efeito colateral

O instrutor usa o exemplo de uma lista de produtos filtrada por categoria:

1. O componente renderiza
2. O useEffect dispara e carrega produtos filtrados pela categoria padrao ("tenis")
3. O usuario muda a categoria para "camisetas"
4. O estado `category` muda
5. Como `category` esta no array de dependencias, o useEffect dispara novamente
6. A lista e recarregada com o novo filtro

Essa e a essencia do "efeito colateral": uma acao que acontece como CONSEQUENCIA de uma mudanca de estado. O useEffect e o mecanismo que conecta mudancas de estado a logicas que precisam ser re-executadas.

## Array de dependencias — tres comportamentos

O instrutor explica dois cenarios, mas existem tres:

1. **`[]` (array vazio):** Executa uma unica vez, na montagem do componente. Util para carregamento inicial de dados.
2. **`[estado]` (com dependencias):** Executa na montagem E toda vez que o estado listado mudar. E o padrao mais comum para efeitos colaterais reativos.
3. **Sem array (nao recomendado):** Executa em TODA renderizacao. Geralmente indica um bug ou design incorreto — pode causar loops infinitos.

## Por que nao pode usar async direto no useEffect?

O instrutor menciona isso como algo importante de saber. A razao tecnica: o useEffect espera que a funcao retorne `void` ou uma funcao de cleanup. Se voce coloca `async`, a funcao passa a retornar uma `Promise`, o que quebra o contrato do React.

A solucao idiomatica e declarar a funcao async DENTRO do corpo do useEffect:

```tsx
useEffect(() => {
  async function fetchData() {
    const result = await api.get("/products")
    setProducts(result)
  }
  fetchData()
}, [])
```

## useState e imutabilidade

O instrutor usa a analogia de que "o estado fica guardadinho, separado". Isso reflete o principio de imutabilidade do React:

- Voce NAO altera o estado diretamente (isso nao dispara re-renderizacao)
- Voce usa a funcao `set` que o useState retorna
- Internamente, o React compara o valor antigo com o novo para decidir se precisa re-renderizar

A desestruturacao do useState retorna um array:
- Posicao 0: o valor atual do estado (leitura)
- Posicao 1: a funcao para atualizar (escrita)

```tsx
const [name, setName] = useState("")
//      ^        ^                ^
//    valor   funcao set    valor inicial
```

## Conexao entre useState e useEffect

O ponto central da aula e que esses dois hooks trabalham JUNTOS:

1. useState guarda um valor reativo
2. useEffect observa mudancas nesse valor (via array de dependencias)
3. Quando o valor muda, o useEffect re-executa a logica associada

Esse padrao e a base de praticamente toda interacao reativa em React: formularios, filtros, buscas, paginacao, etc.

## Ciclo de vida simplificado

O instrutor menciona que o useEffect esta ligado ao ciclo de vida do componente. Em componentes funcionais (com hooks), o ciclo relevante e:

1. **Montagem:** Componente aparece na tela → useEffect com `[]` executa
2. **Atualizacao:** Estado muda → useEffect com `[estado]` re-executa
3. **Desmontagem:** Componente sai da tela → funcao de cleanup do useEffect executa (nao coberto nesta aula, mas importante mencionar)