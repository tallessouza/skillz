# Code Examples: Angular CLI — Geracao de Artefatos

## Exemplo 1: Gerar componente basico

```bash
ng generate component comp-1
```

**Resultado:**
```
src/app/comp-1/
├── comp-1.component.ts
├── comp-1.component.html
├── comp-1.component.css
└── comp-1.component.spec.ts
```

## Exemplo 2: Componente sem teste unitario

```bash
ng generate component comp-1 --skip-tests=true
```

**Resultado:**
```
src/app/comp-1/
├── comp-1.component.ts
├── comp-1.component.html
└── comp-1.component.css
```

Nota: sem o arquivo `.spec.ts`.

## Exemplo 3: Service em pasta especifica

```bash
# Primeiro crie a pasta (ou deixe o CLI criar)
ng g s services/user
```

**Resultado:**
```
src/app/services/
├── user.service.ts
└── user.service.spec.ts
```

## Exemplo 4: Usando forma contraida

```bash
# Equivalentes:
ng generate component meu-comp
ng g c meu-comp

# Service:
ng generate service auth
ng g s auth
```

## Exemplo 5: Sem CLI global (via npm)

Usando o script `ng` do `package.json`:

```bash
npm run ng -- generate component comp-3
```

O `--` e necessario para passar argumentos ao script. Por debaixo dos panos executa:
```bash
ng generate component comp-3
```

Usando o CLI **local** do projeto (versao que esta no `node_modules`).

## Exemplo 6: Verificar versao do CLI

```bash
ng version
```

**Output esperado (exemplo):**
```
Angular CLI: 19.x.x
Node: 18.x.x
Package Manager: npm 9.x.x
```

Se o comando nao for reconhecido, o CLI global nao esta instalado.

## Exemplo 7: Gerar guard

```bash
ng generate guard auth
# ou
ng g guard auth
```

## Exemplo 8: Gerar interface

```bash
ng g i models/user
```

**Resultado:**
```
src/app/models/user.ts
```

## Exemplo 9: Gerar interceptor

```bash
ng g interceptor auth
```

## Todos os comandos de geracao disponiveis

```bash
ng g c nome        # component
ng g s nome        # service
ng g d nome        # directive
ng g p nome        # pipe
ng g guard nome    # guard
ng g i nome        # interface
ng g e nome        # enum
ng g interceptor nome  # interceptor
```