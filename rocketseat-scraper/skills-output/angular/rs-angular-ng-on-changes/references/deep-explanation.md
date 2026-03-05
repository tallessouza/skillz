# Deep Explanation: ngOnChanges

## O que e o ngOnChanges

O ngOnChanges e um lifecycle hook do Angular disparado automaticamente toda vez que qualquer valor de `@Input()` de um componente muda. E o primeiro lifecycle a ser chamado (antes do ngOnInit) e continua sendo chamado durante toda a vida do componente.

## Estrutura do SimpleChanges

O parametro `changes: SimpleChanges` e um objeto onde:
- Cada **chave** e o nome de um `@Input()` que mudou
- Cada **valor** e um objeto `SimpleChange` com tres propriedades:
  - `currentValue`: o valor atual do input
  - `previousValue`: o valor anterior (undefined na primeira vez se nao inicializado)
  - `firstChange`: boolean indicando se e a primeira vez que o input recebe valor

## Por que o tipo SimpleChanges usa indice dinamico

O instrutor explica que `SimpleChanges` tem tipagem `[propName: string]: SimpleChange`. Isso significa que em tempo de desenvolvimento, o Angular nao sabe quais sao os nomes dos inputs do componente. Por isso nao ha autocomplete — voce precisa acessar `changes['nomeDoInput']` sabendo o nome.

## A questao critica: referencia de memoria

Este e o ponto mais importante da aula. O Angular usa **comparacao por referencia** (identity check) para detectar mudancas em objetos e arrays:

- **Primitivos** (string, number, boolean): qualquer mudanca de valor cria automaticamente uma nova referencia. Dispara ngOnChanges normalmente.
- **Objetos e Arrays**: mutar uma propriedade interna (`obj.nome = 'x'`) NAO muda a referencia do objeto. O Angular nao detecta a mudanca e ngOnChanges NAO dispara.

### Analogia pratica

Pense em referencia de memoria como um endereco postal. Se voce muda a mobilia dentro da casa (muta propriedade), o endereco continua o mesmo — o Angular olha pro endereco e diz "nada mudou". Voce precisa "mudar de casa" (criar novo objeto) para o Angular perceber.

### Solucao: spread operator

```typescript
// Cria novo objeto com mesmos valores + propriedade alterada
this.pessoas[0] = { ...this.pessoas[0], nome: 'atualizado' };
```

O spread cria uma nova referencia de memoria, copiando todas as propriedades e sobrescrevendo apenas as que voce especifica.

## Multiplos inputs

Se o componente tem varios `@Input()`, o ngOnChanges dispara quando **qualquer um** deles muda. O objeto `changes` contera apenas os inputs que mudaram naquela iteracao. Por isso a verificacao `if (changes['inputName'])` e essencial.

## Conselho do instrutor sobre lifecycles

O instrutor enfatiza: **nunca chame lifecycles manualmente** (`this.ngOnChanges(...)`). O Angular gerencia a ordem e o timing dos ciclos de vida. Chamar na mao quebra esse contrato e pode causar comportamento inesperado. Se voce precisa reutilizar logica que esta no ngOnChanges, extraia para um metodo privado e chame esse metodo.

## firstChange e previousValue

- Na primeira vez que o input recebe valor, `firstChange === true` e `previousValue === undefined` (se o input nao foi inicializado)
- Se o input tiver valor padrao (ex: `@Input() pessoa = { nome: '', idade: 0 }`), o `previousValue` sera esse objeto padrao, nao undefined
- Apos a primeira mudanca, `firstChange` sera sempre `false`