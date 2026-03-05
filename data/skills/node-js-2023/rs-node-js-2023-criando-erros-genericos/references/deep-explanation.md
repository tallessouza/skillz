# Deep Explanation: Criando Erros Genéricos

## Por que nao retornar strings como erro?

O instrutor explica que mesmo usando Either (Left/Right) para erros funcionais, retornar strings como motivo do erro nao permite diferenciar um erro de outro de forma confiavel. Strings nao carregam informacao semantica — sao frageis, quebraveis por typo, e impossíveis de usar com `instanceof`.

## A hierarquia: erros genericos vs especificos

O instrutor faz uma distincao importante:

- **Erros genericos** existem em todo sistema: recurso nao encontrado, acao nao permitida. Esses ficam em `use-cases/errors/` e sao reutilizados em multiplos use cases.
- **Erros especificos** pertencem a regras de negocio unicas. Exemplo dado: num sistema de salao de beleza, "horario ja ocupado" e um erro que so existe naquele dominio.

## A interface UseCaseError em core/

O instrutor cria a interface `UseCaseError` dentro de `core/errors/` (nao dentro de `domain/`), porque ela serve para identificar a **camada** de origem do erro. Mais pra frente, havera outros tipos de erro (infrastructure, presentation), e a interface permite diferenciar:

```typescript
if (error instanceof UseCaseError) {
  // Sei que veio da camada de use case
}
```

## Por que extends Error + implements UseCaseError?

- `extends Error`: preserva stack trace, compatibilidade com try/catch se necessario, e o comportamento padrao de erros JavaScript.
- `implements UseCaseError`: marca semanticamente que este erro pertence a camada de use cases. E um contrato, nao heranca.

## Impacto nos testes

Antes: o teste so podia verificar que o use case "rejeitou" (com expect/rejects). Com Either + classes de erro, o teste fica muito mais preciso:

```typescript
const result = await sut.execute(...)
expect(result.isLeft()).toBe(true)
expect(result.value).toBeInstanceOf(NotAllowedError)
```

Isso valida nao so que houve erro, mas **qual** erro — sem depender de mensagens de texto.

## Estrutura de pastas

```
src/
├── core/
│   └── errors/
│       └── use-case-error.ts      # Interface base
└── domain/
    └── use-cases/
        └── errors/
            ├── resource-not-found-error.ts
            └── not-allowed-error.ts
```