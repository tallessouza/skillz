# Code Examples: Adicionando TypeScript ao Node.js

## Comando de instalacao completo

```bash
# Instalar TypeScript e tipagens do Node como devDependencies
npm i typescript@5.5.4 @types/node@20.14.12 -D
```

Decomposicao:
- `npm i` — alias para `npm install`
- `typescript@5.5.4` — pacote typescript na versao 5.5.4
- `@types/node@20.14.12` — tipagens do Node na versao 20.14.12
- `-D` — alias para `--save-dev`, instala como dependencia de desenvolvimento

## package.json resultante

### Antes da instalacao

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "description": ""
}
```

### Apos instalacao

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "description": "",
  "devDependencies": {
    "@types/node": "^20.14.12",
    "typescript": "^5.5.4"
  }
}
```

## Estrutura de pastas apos instalacao

```
projeto/
├── node_modules/
│   ├── @types/
│   │   └── node/          # Tipagens do Node.js
│   ├── typescript/
│   │   ├── package.json   # TypeScript tem suas proprias dependencias
│   │   ├── lib/
│   │   └── bin/
│   └── ...                # Dependencias transitivas
├── package.json
└── package-lock.json
```

## Variacoes de instalacao

### Com versao fixa (recomendado para cursos)

```bash
npm i typescript@5.5.4 @types/node@20.14.12 -D
```

### Com versao mais recente (projetos proprios)

```bash
npm i typescript @types/node -D
```

### Verificar o que foi instalado

```bash
# Ver devDependencies no package.json
cat package.json | grep -A 5 devDependencies

# Ver versao do TypeScript instalada
npx tsc --version
```

## Exemplo futuro: dependencia de producao

Quando adicionar uma dependencia de producao (sem `-D`):

```bash
npm i fastify
```

Resultado no package.json:

```json
{
  "dependencies": {
    "fastify": "^4.28.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.12",
    "typescript": "^5.5.4"
  }
}
```