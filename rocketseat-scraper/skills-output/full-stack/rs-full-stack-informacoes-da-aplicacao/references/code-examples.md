# Code Examples: Metadados do package.json

## Exemplo da aula — Hair Day

O package.json do projeto Hair Day conforme demonstrado pelo instrutor:

```json
{
  "name": "hair-day",
  "description": "Aplicacao web de agendamento para corte de cabelo",
  "author": "Rodrigo Goncalves",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {}
}
```

## Variacoes por tipo de projeto

### API Backend (Express/Fastify)

```json
{
  "name": "hair-day-api",
  "description": "API REST para gerenciamento de agendamentos de corte de cabelo",
  "author": "Seu Nome",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup src",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "fastify": "^4.0.0"
  }
}
```

### Frontend React (Vite)

```json
{
  "name": "hair-day-web",
  "description": "Interface web para agendamento de corte de cabelo",
  "author": "Seu Nome",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

### Monorepo (Turborepo)

```json
{
  "name": "hair-day-monorepo",
  "description": "Monorepo contendo frontend e backend do Hair Day",
  "author": "Seu Nome",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build"
  }
}
```

### Pacote npm publicavel

```json
{
  "name": "@seu-escopo/hair-day-utils",
  "version": "1.0.0",
  "description": "Utilitarios compartilhados para o projeto Hair Day",
  "author": {
    "name": "Seu Nome",
    "email": "seu@email.com",
    "url": "https://github.com/seuusuario"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/seuusuario/hair-day-utils"
  },
  "keywords": ["hair-day", "agendamento", "utils"],
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts",
    "prepublishOnly": "npm run build"
  }
}
```

## Author — formatos aceitos

### String simples (usado na aula)
```json
{
  "author": "Rodrigo Goncalves"
}
```

### String com email e URL
```json
{
  "author": "Rodrigo Goncalves <rodrigo@email.com> (https://rodrigo.dev)"
}
```

### Objeto completo
```json
{
  "author": {
    "name": "Rodrigo Goncalves",
    "email": "rodrigo@email.com",
    "url": "https://rodrigo.dev"
  }
}
```

## package.json minimo vs completo

### Minimo (gerado por `npm init -y`)
```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### Completo (com metadados preenchidos)
```json
{
  "name": "hair-day",
  "version": "1.0.0",
  "description": "Aplicacao web de agendamento para corte de cabelo",
  "author": "Rodrigo Goncalves",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/usuario/hair-day"
  },
  "homepage": "https://hair-day.app",
  "keywords": ["agendamento", "cabelo", "barbearia"],
  "main": "dist/index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {},
  "devDependencies": {}
}
```