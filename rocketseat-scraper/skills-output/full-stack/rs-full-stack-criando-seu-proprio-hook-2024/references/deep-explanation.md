# Deep Explanation: Criando Custom Hooks em React

## Por que custom hooks existem

O instrutor apresenta custom hooks como uma forma de **encapsular logica** — a mesma ideia de encapsulamento da orientacao a objetos, mas no mundo funcional do React. Um hook e "como se fosse um universo dele ali", com seu proprio contexto. Voce coloca logica dentro, e compartilha apenas o que quiser atraves do retorno.

A analogia central: o hook e uma **caixa preta com uma interface publica**. Dentro dele voce pode ter funcoes, estados, variaveis, efeitos — tudo privado. O `return` define o que sai da caixa.

## .ts vs .tsx — quando usar cada um

O instrutor enfatiza uma regra pratica clara:

- **`.tsx`** — quando o arquivo renderiza algo em tela (retorna JSX)
- **`.ts`** — quando o arquivo encapsula logica sem renderizar componente

Hooks nunca renderizam. Hooks encapsulam logica. Portanto, hooks sempre usam `.ts`.

Isso ajuda a entender a responsabilidade do arquivo so pela extensao: se e `.tsx`, tem UI. Se e `.ts`, e logica pura.

## Objeto vs parametros posicionais — a armadilha da ordem

O instrutor demonstra ao vivo o problema de parametros posicionais:

```typescript
// Posicional — ordem importa!
function useMessage(name: string, age: number) { ... }

// Se inverter a ordem na chamada:
useMessage(18, "Rodrigo") // ERRO: 18 nao e string
```

Com objeto:

```typescript
// Objeto — ordem nao importa
function useMessage({ name, age }: Props) { ... }

// Todas essas chamadas sao validas:
useMessage({ name: "Rodrigo", age: 18 })
useMessage({ age: 18, name: "Rodrigo" }) // mesma coisa
```

A vantagem vai alem da ordem: **extensibilidade**. Para adicionar um novo parametro, basta adicionar ao type `Props` — nenhuma chamada existente quebra.

## Props do hook vs props do metodo

O instrutor faz uma distincao importante sobre **onde** passar dados:

1. **Props do hook** — dados compartilhados com TODO o escopo interno (todos os metodos, estados, efeitos). Exemplo: `name` que e usado em multiplos metodos.

2. **Props do metodo** — dados especificos para UMA operacao. Exemplo: `message` que so o `show()` usa.

```typescript
export function useMessage({ name }: Props) {
  // name esta disponivel em TUDO dentro do hook

  function show(message: string) {
    // message so existe dentro de show
    console.log(name, message)
  }

  function greet() {
    // name tambem esta disponivel aqui
    console.log(`Ola, ${name}`)
  }

  return { show, greet }
}
```

Regra pratica: se o dado e usado por mais de um metodo do hook, promova para prop do hook. Se e especifico de um metodo, mantenha como parametro do metodo.

## Organizacao em pasta hooks/

O instrutor cria `src/hooks/` como convencao. Cada hook customizado vive nessa pasta, facilitando descoberta e organizacao. O padrao de nomenclatura do arquivo segue o nome do hook: `useMessage.ts` para o hook `useMessage`.

## Desestruturacao no consumo

O instrutor mostra duas formas de consumir:

```typescript
// Forma 1: objeto completo
const message = useMessage({ name: "Rodrigo" })
message.show("texto")

// Forma 2: desestruturacao (preferida)
const { show } = useMessage({ name: "Rodrigo" })
show("texto")
```

A desestruturacao e preferida porque:
- Acesso direto sem prefixo
- Fica claro quais metodos/valores o componente realmente usa
- Facilita tree-shaking mental (saber o que depende do que)