# Deep Explanation: Testes Unitários de Action de Deleção

## Por que testes unitários são o lugar ideal para cobrir cenários

O instrutor enfatiza que testes unitários são **rápidos e baratos** de executar. Isso significa que é aqui que devemos "encher de cenários possíveis". A lógica é: testes E2E são lentos e caros, então cobrem o caminho principal. Testes unitários cobrem **todos os edge cases**.

## A armadilha do mock implícito

Um dos insights mais valiosos da aula: quando o instrutor criou o teste de sucesso **sem configurar o mock**, o teste **passou**. Isso aconteceu porque:

1. O `vi.fn()` sem configuração retorna `undefined` por padrão
2. A action, ao chamar `execute()`, recebeu `undefined`
3. Como não houve throw, o código caiu no caminho de sucesso
4. O teste passou sem que o aluno soubesse se era um falso positivo

O instrutor explica que, **implicitamente**, o mock já retornava `undefined`. Mas ele prefere **sempre deixar explícito** com `mockResolvedValue(undefined)`. A razão: se outro desenvolvedor ler o teste, vai entender a intenção. Se o comportamento padrão do vi.fn() mudar, o teste continua correto.

## Padrão de setup dos mocks

O padrão usado é o `vi.hoisted()` para garantir que os mocks são criados antes do hoisting do `vi.mock()`. Isso é necessário porque `vi.mock()` é hoisted para o topo do arquivo pelo Vitest, então qualquer variável referenciada dentro dele precisa existir no escopo hoisted.

```typescript
const { useCaseDelete } = vi.hoisted(() => ({
  useCaseDelete: { execute: vi.fn() },
}))
```

Esse padrão é **reutilizado** para todas as actions — create, update, delete. A única diferença é o nome do use case.

## Estratégia de verificação de falsos positivos

O instrutor demonstra uma prática simples mas poderosa: depois de cada teste passar, ele **muda o valor esperado** para algo incorreto e verifica que o teste quebra. Isso confirma que o teste está realmente validando o que deveria. Exemplo:

1. Teste passa com `toBe(false)`
2. Muda para `toBe(true)` — teste quebra
3. Reverte para `toBe(false)` — confirma que não é falso positivo

## Os 4 cenários obrigatórios para actions CRUD

1. **Validação de input** (ID vazio) — testa a primeira guarda da action
2. **Not found** (use case rejeita com erro específico) — testa o tratamento de erros de negócio
3. **Erro genérico** (use case rejeita com erro desconhecido) — testa o catch-all
4. **Sucesso** — testa o caminho feliz

Esses 4 cenários mapeiam diretamente para os `if`/`try`/`catch` dentro da action. O instrutor destaca que, ao final, o coverage mostra 100% porque todos os caminhos foram cobertos.

## Diferença entre erro específico e genérico

No teste de "not found", o mock rejeita com `new Error('Prompt not found')` — a action reconhece essa mensagem e retorna "Prompt não encontrado".

No teste de erro genérico, o mock rejeita com `new Error('unknown')` — a action não reconhece e cai no catch genérico, retornando "Falha ao remover prompt".

Essa distinção é importante porque garante que a action trata erros conhecidos de forma amigável e erros desconhecidos de forma segura.