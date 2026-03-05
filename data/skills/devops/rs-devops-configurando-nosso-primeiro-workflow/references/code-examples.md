# Code Examples: Configurando Primeiro Workflow no GitHub Actions

## Exemplo 1: Arquivo YAML criado na aula

O arquivo `ci.yaml` dentro de `.github/workflows/`:

```yaml
name: CI

jobs:
  build:
    name: Build and Push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

**Nota:** Este arquivo propositalmente NAO tem a propriedade `on:`, que sera adicionada na proxima aula. O resultado e o erro `No event triggers defined in on`.

## Exemplo 2: Estrutura de pastas

```
meu-projeto/
├── .github/
│   └── workflows/
│       └── ci.yaml        # Workflow de CI
├── Dockerfile              # Ja existia no projeto
├── docker-compose.yml      # Ja existia no projeto
├── src/                    # Aplicacao NestJS
└── README.md
```

## Exemplo 3: Multiplos jobs (demonstracao conceitual)

O instrutor mostrou brevemente que voce pode ter multiplos jobs:

```yaml
name: CI

jobs:
  build:
    name: Build and Push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

  outro-exemplo:
    name: Outro Job
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

Cada job e uma key separada dentro de `jobs:`, no mesmo nivel de identacao.

## Exemplo 4: Usando action do Marketplace

A action de checkout e referenciada assim no step:

```yaml
steps:
  - uses: actions/checkout@v4
```

- `uses:` indica que este step usa uma action externa
- `actions/checkout` e o repositorio da action no GitHub
- `@v4` e a versao (Version 4, mais recente na data da aula)
- Sem configuracao adicional (`with:`), o checkout usa defaults (branch atual)

## Exemplo 5: Workflow completo (corrigido com `on:`)

Para referencia, o workflow funcional seria:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    name: Build and Push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

## Comandos git usados na aula

```bash
# Puxar alteracoes feitas pela interface do GitHub
git pull

# Commitar primeira configuracao
git add .
git commit -m "add first configuration for actions"
git push
```