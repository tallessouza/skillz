---
name: rs-node-js-2023-copiando-camada-de-dominio
description: "Applies domain layer migration and TypeScript error fixing patterns when copying code between projects, setting up NestJS clean architecture, or fixing TypeScript strict mode errors. Use when user asks to 'migrate domain layer', 'copy code from another project', 'fix TypeScript errors after migration', 'setup clean architecture in NestJS', or 'fix eslint errors after copying files'. Make sure to use this skill whenever migrating existing domain code into a new project structure. Not for creating domain entities from scratch or writing new business logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [migration, clean-architecture, typescript, domain-layer]
  mind-lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
---

# Migracao de Camada de Dominio

> Ao migrar codigo entre projetos, valide incrementalmente com tsc, lint e testes antes de prosseguir.

## Rules

1. **Valide com `tsc --noEmit` apos cada mudanca** — porque verifica tipos sem gerar build, isolando erros de TypeScript rapidamente
2. **Substitua `{}` por `null` em tipos de retorno vazio** — `{}` em TypeScript significa "qualquer nao-nulo" (tudo e objeto em JS), `null` expressa semanticamente "sem retorno"
3. **Substitua `any` por `unknown`** — `unknown` aceita qualquer valor mas impede acesso a propriedades sem type narrowing, porque `any` desabilita o type system silenciosamente
4. **Mantenha getters e setters adjacentes** — TypeScript moderno exige que `get prop()` e `set prop()` fiquem proximos, coloque sempre o set abaixo do get
5. **Desative `no-new` no ESLint quando usar `new` para side effects** — pattern valido para disparar Domain Events via constructor
6. **Instale dependencias faltantes antes de validar tipos** — rode `tsc --noEmit`, corrija dependencias, repita ate zero erros

## Steps

### Step 1: Copiar arquivos de dominio
```bash
# Copiar pastas core/ e domain/ para src/
cp -r projeto-anterior/src/core projeto-atual/src/
cp -r projeto-anterior/src/domain projeto-atual/src/

# Copiar arquivos de teste
cp -r projeto-anterior/test/factories projeto-atual/test/
cp -r projeto-anterior/test/repositories projeto-atual/test/
cp -r projeto-anterior/test/utils projeto-atual/test/
```

### Step 2: Instalar dependencias faltantes
```bash
# Dependencias de dev (testes)
pnpm add -D @faker-js/faker

# Dependencias de producao
pnpm add dayjs
```

### Step 3: Validar tipos incrementalmente
```bash
# Type check sem gerar build
pnpm tsc --noEmit

# Corrigir erros apontados, repetir ate zero erros
```

### Step 4: Corrigir erros de lint
```bash
# Lint com auto-fix
pnpm lint --fix

# Rodar novamente para ver erros remanescentes
pnpm lint
```

### Step 5: Executar testes unitarios
```bash
pnpm test
```

## Correcoes comuns pos-migracao

### Tipo de retorno vazio: `{}` → `null`
```typescript
// ERRADO: {} significa qualquer nao-nulo
type DeleteQuestionResponse = Either<ResourceNotFoundError, {}>

// CORRETO: null expressa ausencia de retorno
type DeleteQuestionResponse = Either<ResourceNotFoundError, null>
```

### Tipagem generica: `any` → `unknown`
```typescript
// ERRADO: any desabilita type checking
export class DomainEvent<T = any> { }

// CORRETO: unknown forca type narrowing
export class DomainEvent<T = unknown> { }
```

### Getters e setters adjacentes
```typescript
// CORRETO: set imediatamente abaixo do get
get content() {
  return this.props.content
}

set content(value: string) {
  this.props.content = value
  this.touch()
}
```

### ESLint no-new para Domain Events
```json
// .eslintrc.json
{
  "rules": {
    "no-new": "off"
  }
}
```

## Verification

- `tsc --noEmit` retorna zero erros
- `pnpm lint` retorna zero erros
- `pnpm test` todos os testes unitarios passam

## Heuristics

| Situacao | Acao |
|----------|------|
| Erro de dependencia no tsc | Instalar dependencia, rodar tsc novamente |
| Erro `{}` como tipo | Trocar por `null` se representa retorno vazio |
| Erro `any` no lint | Trocar por `unknown` |
| Getter/setter nao adjacentes | Mover set para logo abaixo do get |
| `new` usado para side effect | Desativar `no-new` no ESLint |
| Testes divididos (unit/e2e) | `pnpm test` = unitarios, `pnpm test:e2e` = end-to-end |

## Troubleshooting

### Erro inesperado ao seguir este padrao
**Symptom:** Codigo segue o padrao mas comportamento nao e o esperado
**Cause:** Dependencia nao registrada no modulo ou configuracao incompleta
**Fix:** Verificar registro completo no modulo (controllers, providers, imports) e dependencias instaladas

## Deep reference library

- [deep-explanation.md](../../../data/skills/node-js-2023/rs-node-js-2023-copiando-camada-de-dominio/references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/node-js-2023/rs-node-js-2023-copiando-camada-de-dominio/references/code-examples.md) — Todos os exemplos de código expandidos com variações
