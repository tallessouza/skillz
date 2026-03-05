# Code Examples: Configurando TypeScript

## Config base da aula

```json
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["es2023"],
    "module": "node16",
    "moduleResolution": "node16",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Variacao: Com outDir e rootDir

Para projetos que compilam TS para JS em pasta separada:

```json
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["es2023"],
    "module": "node16",
    "moduleResolution": "node16",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

## Variacao: Com path aliases

Para projetos maiores que usam aliases de importacao:

```json
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["es2023"],
    "module": "node16",
    "moduleResolution": "node16",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Variacao: Com resolveJsonModule

Para importar arquivos JSON diretamente:

```json
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["es2023"],
    "module": "node16",
    "moduleResolution": "node16",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

## Variacao: Com declaracoes de tipo

Para bibliotecas que precisam gerar `.d.ts`:

```json
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["es2023"],
    "module": "node16",
    "moduleResolution": "node16",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

## Exemplo: package.json complementar

O tsconfig com `module: "node16"` funciona melhor quando o package.json declara o tipo de modulo:

```json
{
  "name": "meu-projeto",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/server.ts"
  }
}
```