# Deep Explanation: TDD & Mocking

## O que e TDD na visao do instrutor

TDD (Test Driven Development) — Desenvolvimento Dirigido a Testes. A ideia central: se voce escreve o teste ANTES da implementacao, o teste por si so te ajuda a validar se a implementacao esta ok ou nao.

### Quando usar TDD (perspectiva pessoal do instrutor)

> "Eu gosto muito de utilizar TDD, principalmente em regras de negocio, em funcionalidades que sao mais cabeludas, mais dificeis de voce simplesmente ir la e desenvolver. Um CRUD, por exemplo, na maioria das vezes eu acabo escrevendo o teste depois."

A chave: TDD e uma **metodologia**, nao um dogma. E opcional. Pode funcionar muito bem para uma pessoa e nao para outra. Voce pode usar em funcionalidades especificas e nao em outras.

**Criterio do instrutor:**
- Regras de negocio complexas → TDD
- CRUD simples, operacoes previsiveis → teste depois
- Ponto de decisao: "tem imprevisibilidade?" Se sim, TDD ajuda

## Red, Green, Refactor — O ciclo explicado

### Red (Vermelho)
Escreva um teste que DEVE falhar. O teste falhando prova que a regra de negocio ainda nao existe no codigo. Quando voce roda e ve o erro "expected promise to reject but it resolved", voce esta no estado Red.

### Green (Verde)
Implemente o **minimo possivel** para fazer o teste passar. O instrutor enfatiza: a implementacao pode ser "burra", "porca" — nao importa. O objetivo e fazer o teste ficar verde.

Exemplo real da aula: o metodo `findByUserIdOnDate` recebe `userId` e `date`, mas a implementacao Green ignora completamente a `date` e so valida o `userId`. Isso e intencional.

### Refactor
So depois que o teste passa, voce melhora o codigo. Mas antes de refatorar, o instrutor sugere: **crie mais testes**. Os novos testes vao expor as lacunas da implementacao "burra" e guiar o refactor.

> "TDD e exatamente isso. Voce vai criando mais testes para cada uma das possibilidades que podem existir, para cada um dos fluxos que o usuario pode seguir na sua aplicacao, e voce vai imaginando isso e vai escrevendo os testes, os testes vao te guiando."

## Mocking de datas — Por que e necessario

O problema fundamental: `new Date()` retorna a data atual. Se alguem roda os testes daqui a 5 anos, a data sera diferente. Isso pode gerar comportamentos inesperados.

### Como o Vitest resolve

- `vi.useFakeTimers()` — ativa o sistema de datas ficticias
- `vi.setSystemTime(date)` — define qual data o `new Date()` vai retornar
- `vi.useRealTimers()` — volta ao comportamento real

### Armadilha do JavaScript: mes zero-indexed

```typescript
new Date(2022, 0, 20, 8, 0, 0) // Janeiro 20, 2022, 08:00:00
// O segundo parametro (month) e zero-indexed: 0 = Janeiro, 11 = Dezembro
```

### Armadilha de imports

O instrutor mostrou um bug real na aula: importou `afterEach` de `node:test` ao inves de `vitest`. Isso causa comportamento silenciosamente errado — o afterEach simplesmente nao executa no contexto do Vitest.

### Boa pratica: sempre resetar mocks

> "Sempre que a gente vai criar um mock, depois a gente reseta, volta ao estado original, sem mocks no final desse teste, porque senao os testes que executarem depois desse aqui, eles vao sofrer tambem alteracoes por causa disso."

## Como TDD guia o desenvolvimento

O fluxo real da aula:

1. Teste: "nao pode fazer check-in 2x no mesmo dia" → **RED** (erro: promise resolved ao inves de reject)
2. Implementacao minima no repository (ignora data, so valida userId) → **GREEN**
3. Novo teste: "pode fazer check-in em dias diferentes" → **RED** (erro: a implementacao "burra" bloqueia mesmo em dias diferentes)
4. Agora o desenvolvedor sabe exatamente o que precisa refatorar: adicionar validacao de data

Os testes funcionam como um mapa que vai revelando o caminho conforme voce avanca.