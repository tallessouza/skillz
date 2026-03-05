# Deep Explanation: afterAll

## O ciclo de vida dos testes

O instrutor apresenta `afterAll` como o par natural do `beforeAll`. A lógica é simples: se você preparou algo antes dos testes, precisa limpar depois.

### Analogia mental

Pense em `beforeAll`/`afterAll` como abrir e fechar um restaurante:
- `beforeAll`: abre a cozinha, liga os equipamentos, prepara os ingredientes
- Testes: serve os clientes
- `afterAll`: limpa a cozinha, desliga equipamentos, guarda ingredientes

Você não deixa a cozinha ligada depois que o restaurante fecha.

## Ordem de execução

```
beforeAll()        ← executa UMA vez antes de todos os testes
  test 1           ← executa
  test 2           ← executa
  test 3           ← executa
afterAll()         ← executa UMA vez depois de todos os testes
```

### Com beforeEach/afterEach combinados

```
beforeAll()
  beforeEach() → test 1 → afterEach()
  beforeEach() → test 2 → afterEach()
  beforeEach() → test 3 → afterEach()
afterAll()
```

## Quando usar afterAll vs afterEach

| Hook | Executa | Use para |
|------|---------|----------|
| `afterAll` | Uma vez, após todos os testes | Recursos caros: conexões, servidores, arquivos grandes |
| `afterEach` | Após cada teste individual | Estado que cada teste modifica: variáveis, mocks, DOM |

### Regra prática do instrutor

Se o setup está no `beforeAll`, o cleanup vai no `afterAll`.
Se o setup está no `beforeEach`, o cleanup vai no `afterEach`.

## Cenários reais mencionados pelo instrutor

1. **Simulação de banco de dados**: carregar arquivo JSON grande para simular dados → `afterAll` remove da memória
2. **Variáveis compartilhadas**: `beforeAll` define valor → testes usam → `afterAll` reseta para zero
3. **Arquivos temporários**: testes criam arquivos → `afterAll` deleta

## Por que isso importa

Sem cleanup:
- Memória cresce a cada suite executada
- Testes subsequentes podem encontrar estado sujo
- CI/CD pode falhar por falta de memória em projetos grandes
- Arquivos temporários acumulam no disco

O instrutor demonstrou com `console.log` mostrando o valor antes (10) e depois (0), provando que o `afterAll` executou e resetou o estado.