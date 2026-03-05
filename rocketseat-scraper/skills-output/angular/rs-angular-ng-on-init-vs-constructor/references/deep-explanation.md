# Deep Explanation: ngOnInit vs Constructor

## Ordem de execucao dos lifecycle hooks

Quando o Angular cria um componente, a ordem e:

1. **Constructor** — cria a instancia da classe. Inputs ainda estao `undefined` (ou com valor default se declarado)
2. **ngOnChanges** — chamado pela primeira vez com os valores iniciais dos inputs
3. **ngOnInit** — chamado uma unica vez, depois que os inputs receberam o primeiro valor

Essa ordem explica por que o constructor nao tem acesso aos inputs: ele roda ANTES do Angular atribuir os valores.

## Por que o constructor era popular antigamente

No Angular pre-v14, a unica forma de injetar dependencias era via constructor:

```typescript
constructor(
  private readonly meuService: MeuService,
  private readonly router: Router
) {}
```

O Angular usava o sistema de tipos do TypeScript para resolver as dependencias automaticamente. Isso tornava o constructor essencial em praticamente todo componente.

## A funcao inject() mudou tudo

Com a introducao da funcao `inject()` (Angular 14+), dependencias podem ser declaradas como propriedades:

```typescript
private meuService = inject(MeuService);
```

Isso e importado de `@angular/core` (com `i` minusculo). O resultado pratico: o constructor se tornou desnecessario na grande maioria dos casos.

Como o instrutor mencionou: "eu nem lembro a ultima vez que eu precisei utilizar ele" — referindo-se ao constructor.

## Analogia: construcao de uma casa

- **Constructor** = fundacao sendo colocada. A casa existe, mas nao tem moveis (inputs) ainda
- **ngOnChanges** = moveis chegando pela primeira vez (e tambem quando sao trocados)
- **ngOnInit** = voce entra na casa pela primeira vez — tudo ja esta no lugar para comecar a viver

## ngOnChanges vs ngOnInit — quando usar cada um

- **ngOnInit**: logica que precisa rodar UMA vez com os valores iniciais dos inputs (chamadas HTTP, setup)
- **ngOnChanges**: logica que precisa rodar TODA VEZ que um input muda (recalculos, re-fetches)

Demonstracao do instrutor: ao clicar "mudar nome", apenas ngOnChanges foi chamado. Constructor e ngOnInit NAO executaram novamente — provando que ambos rodam uma unica vez.

## Quando usar o constructor (casos raros)

Praticamente nunca no Angular moderno. Casos extremamente raros:
- Logica que nao depende de inputs NEM de services (quase inexistente)
- Interoperabilidade com bibliotecas que exigem setup no constructor