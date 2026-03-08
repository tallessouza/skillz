# Code Examples: Instalando a Suite de Testes

## Comando completo de instalação — Jest

```bash
npm i jest@29.7.0 @types/jest@29.5.13 ts-jest@29.2.5 -D
```

Breakdown:
- `npm i` — shorthand para `npm install`
- `jest@29.7.0` — framework de testes, versão fixa
- `@types/jest@29.5.13` — tipagens TypeScript para Jest
- `ts-jest@29.2.5` — transformer TypeScript para Jest
- `-D` — instalar como devDependency

## Comando completo de instalação — Supertest

```bash
npm i supertest@7.0.0 @types/supertest@6.0.2 -D
```

Breakdown:
- `supertest@7.0.0` — biblioteca para testes HTTP
- `@types/supertest@6.0.2` — tipagens TypeScript para Supertest
- `-D` — instalar como devDependency

## Resultado esperado no package.json

```json
{
  "name": "api-entregas",
  "version": "1.0.0",
  "devDependencies": {
    "@types/jest": "^29.5.13",
    "@types/supertest": "^6.0.2",
    "jest": "^29.7.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5"
  }
}
```

## Variação: instalação com tudo em um único comando

```bash
npm i jest@29.7.0 @types/jest@29.5.13 ts-jest@29.2.5 supertest@7.0.0 @types/supertest@6.0.2 -D
```

Funciona igualmente, mas o instrutor separa em dois comandos para organização lógica (Jest vs Supertest).

## Variação: usando yarn

```bash
yarn add jest@29.7.0 @types/jest@29.5.13 ts-jest@29.2.5 -D
yarn add supertest@7.0.0 @types/supertest@6.0.2 -D
```

## Variação: usando pnpm

```bash
pnpm add jest@29.7.0 @types/jest@29.5.13 ts-jest@29.2.5 -D
pnpm add supertest@7.0.0 @types/supertest@6.0.2 -D
```

## Verificação após instalação

```bash
# Listar pacotes instalados e suas versões
npm ls jest @types/jest ts-jest supertest @types/supertest

# Saída esperada:
# api-entregas@1.0.0
# ├── @types/jest@29.5.13
# ├── @types/supertest@6.0.2
# ├── jest@29.7.0
# ├── supertest@7.0.0
# └── ts-jest@29.2.5
```

## Verificação visual no package.json

```bash
# Filtrar apenas devDependencies
cat package.json | npx json devDependencies

# Ou simplesmente abrir no editor e conferir a seção devDependencies
```

## Próximos passos (não cobertos nesta skill)

Após instalação, o próximo passo típico é configurar o Jest:

```bash
# Criar arquivo de configuração (coberto em skill separada)
npx ts-jest config:init
```

Isso gera um `jest.config.js` com preset `ts-jest` — mas a configuração é assunto de outra aula.