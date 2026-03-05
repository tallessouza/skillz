# Deep Explanation: beforeAll

## Por que beforeAll existe

Existem cenarios onde voce precisa garantir que algo esteja disponivel antes dos testes serem executados. Exemplos reais:

- Carregar um arquivo de configuracao
- Conectar com um banco de dados
- Computar um valor que sera usado como referencia em multiplos testes
- Inicializar um servidor de teste

O `beforeAll` executa uma funcao **uma unica vez** antes de todos os testes dentro do bloco `describe` onde foi declarado.

## Escopo de variaveis — o ponto critico

O instrutor demonstra um padrao fundamental:

1. **Declare a variavel no escopo do `describe`** — isso garante que todas as funcoes `it()` tenham acesso
2. **Atribua o valor dentro do `beforeAll`** — isso garante que o valor existe quando os testes executam

```typescript
describe("example", () => {
  let result: number    // 1. Declaracao no escopo do describe
  
  beforeAll(() => {
    result = 10          // 2. Atribuicao antes dos testes
  })
  
  it("uses result", () => {
    expect(result).toBe(10)  // 3. Acesso garantido
  })
})
```

Se voce pular o `beforeAll` e apenas declarar `let result: number`, a variavel sera `undefined` quando os testes executarem. O instrutor demonstrou isso ao vivo: comentou a linha de atribuicao no beforeAll e o teste falhou com `undefined`.

## Tipagem explicita

O TypeScript precisa saber o tipo da variavel no momento da declaracao. Como a variavel e declarada sem valor (`let result`), o TS infere `undefined`. Para evitar erros de tipo nos testes, declare explicitamente: `let result: number`.

## Ordem de execucao

```
1. describe() registra o bloco
2. beforeAll() executa UMA VEZ
3. it() #1 executa
4. it() #2 executa
5. ... todos os testes do bloco
6. afterAll() executa UMA VEZ (se existir)
```

## beforeAll vs beforeEach

- `beforeAll`: executa uma vez antes de todos os testes — use para setup imutavel (conexao, carga de dados)
- `beforeEach`: executa antes de cada teste — use para estado que precisa ser resetado entre testes

## Watch mode

O instrutor menciona a flag `--watch` que re-executa os testes automaticamente ao salvar. Com beforeAll, cada re-execucao passa novamente pelo setup, garantindo que o ambiente esta preparado.