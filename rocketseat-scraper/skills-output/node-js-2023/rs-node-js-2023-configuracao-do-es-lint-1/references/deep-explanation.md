# Deep Explanation: Configuracao do ESLint com Rocketseat Config

## Por que usar a config da Rocketseat

A Rocketseat mantem um pacote centralizado de configuracao ESLint (`@rocketseat/eslint-config`) que padroniza projetos Node.js e React. Isso evita configurar dezenas de regras manualmente e garante consistencia entre projetos do ecossistema.

O pacote oferece presets por plataforma:
- `@rocketseat/eslint-config/node` — para APIs, CLIs, backends
- `@rocketseat/eslint-config/react` — para frontends React/Next.js

## O problema do Vitest globals

Quando se usa Vitest com funcoes globais (`test`, `expect`, `describe`), o ESLint nao reconhece essas variaveis e reporta erros de "undefined". A solucao envolve tres partes:

1. **Instalar o plugin:** `eslint-plugin-vitest-globals`
2. **Estender o recommended:** adicionar `"plugin:vitest-globals/recommended"` no extends
3. **Configurar o env:** setar `"vitest-globals/env": true` para que o ESLint reconheca as globals

O instrutor destacou que esqueceu de instalar o plugin na primeira tentativa, o que causou erro. Isso e comum — o extends referencia o plugin, mas o plugin precisa estar instalado como dependencia separada.

## O problema do no-useless-constructor

Em TypeScript, e padrao declarar dependencias no constructor usando parameter properties:

```typescript
class CreateQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}
}
```

O ESLint interpreta esse constructor como "inutil" porque o corpo esta vazio. Mas no TypeScript isso e valido e necessario — e a forma idiomatica de injecao de dependencia. Por isso a regra `no-useless-constructor` deve ser desativada.

## Dois scripts: lint vs lint:fix

- **`lint`** — apenas reporta erros, sem modificar arquivos. Usado em CI/CD (GitHub Actions) para validar que commits novos seguem a padronizacao.
- **`lint:fix`** — corrige automaticamente o que puder e reporta o que nao conseguir. Usado durante desenvolvimento local.

Essa separacao e importante porque no CI voce quer detectar problemas (nao corrigi-los silenciosamente), enquanto no desenvolvimento voce quer produtividade.