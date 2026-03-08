# Code Examples: Criando Projeto Express + TypeScript

## Comando completo de setup (passo a passo)

### 1. Criar e navegar para a pasta

```bash
mkdir refund_api
cd refund_api
```

### 2. Inicializar package.json

```bash
npm init -y
```

Resultado gerado:

```json
{
  "name": "refund_api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### 3. Editar package.json

```json
{
  "name": "refund_api",
  "version": "1.0.0",
  "description": "API de solicitação de reembolso",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Seu Nome",
  "license": "ISC"
}
```

### 4. Instalar Express

```bash
npm i express@4.19.2
```

package.json apos instalacao:

```json
{
  "dependencies": {
    "express": "^4.19.2"
  }
}
```

### 5. Instalar tipagem do Express (com -D)

```bash
npm i @types/express@5.0.0 -D
```

### 6. Instalar ferramentas TypeScript

```bash
npm i typescript@5.7.3 tsx@4.19.2 ts-node@10.9.2 -D
```

### package.json final

```json
{
  "name": "refund_api",
  "version": "1.0.0",
  "description": "API de solicitação de reembolso",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Rodrigo Gonçalves",
  "license": "ISC",
  "dependencies": {
    "express": "^4.19.2"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "ts-node": "^10.9.2",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3"
  }
}
```

## Variacao: erro comum e correcao

### Instalando tipagem sem -D (ERRADO)

```bash
npm i @types/express@5.0.0
```

Resultado incorreto — tipagem em dependencies:

```json
{
  "dependencies": {
    "express": "^4.19.2",
    "@types/express": "^5.0.0"
  }
}
```

### Corrigindo: reinstalar com -D

```bash
npm i @types/express@5.0.0 -D
```

O npm automaticamente move para devDependencies:

```json
{
  "dependencies": {
    "express": "^4.19.2"
  },
  "devDependencies": {
    "@types/express": "^5.0.0"
  }
}
```

## Variacao: instalacao em uma unica linha

Para quem quer ser mais rapido, pode instalar tudo de desenvolvimento de uma vez:

```bash
npm i @types/express@5.0.0 typescript@5.7.3 tsx@4.19.2 ts-node@10.9.2 -D
```

## Estrutura final do projeto

```
refund_api/
├── node_modules/           # Dependencias instaladas
│   ├── express/
│   ├── @types/express/
│   ├── typescript/
│   ├── tsx/
│   ├── ts-node/
│   └── ... (subdependencias)
├── package.json            # Configuracao do projeto
└── package-lock.json       # Lock de versoes exatas
```