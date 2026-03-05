# Code Examples: Configurando o TypeScript para Node.js

## Exemplo 1: Gerando o tsconfig.json

```bash
# Inicializar o TypeScript no projeto
npx tsc --init
```

Output esperado: arquivo `tsconfig.json` criado na raiz do projeto com todas as opcoes possiveis (maioria comentada).

## Exemplo 2: tsconfig.json limpo para Node 20+

Este e o resultado final da aula — o tsconfig limpo apos remover todos os comentarios:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "Node16",
    "lib": ["ES2023"],
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Exemplo 3: tsconfig.json para Node 22+

Para projetos usando Node.js 22 ou superior:

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "module": "Node18",
    "lib": ["ES2024"],
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Exemplo 4: tsconfig com outDir (comum em APIs REST)

Quando voce precisa separar o codigo fonte do codigo compilado:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "Node16",
    "lib": ["ES2023"],
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Exemplo 5: O que NAO fazer — manter o tsconfig "sujo"

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig to read more about this file */

    /* Projects */
    // "incremental": true,
    // "composite": true,
    // "tsBuildInfoFile": "./.tsbuildinfo",
    // "disableSourceOfProjectReferenceRedirect": true,
    // "disableSolutionSearching": true,
    // "disableReferencedProjectLoad": true,

    /* Language and Environment */
    "target": "es2016",
    // "lib": [],
    // ... mais 80 linhas de comentarios ...
    "strict": true,
    "skipLibCheck": true
  }
}
```

O instrutor explicitamente remove todas essas linhas comentadas para manter o arquivo limpo e organizado.

## Exemplo 6: Verificando a configuracao

Apos configurar, verifique que tudo esta correto:

```bash
# Verificar se compila sem erros (sem gerar output)
npx tsc --noEmit

# Ver a configuracao efetiva (incluindo defaults)
npx tsc --showConfig
```

## Exemplo 7: Node Target Mapping — tabela de referencia rapida

```
Node 16  → target: ES2021, module: Node16,  lib: ["ES2021"]
Node 18  → target: ES2023, module: Node16,  lib: ["ES2023"]
Node 20  → target: ES2023, module: Node16,  lib: ["ES2023"]
Node 22  → target: ES2024, module: Node18,  lib: ["ES2024"]
```

Fonte: github.com/microsoft/TypeScript/wiki/Node-Target-Mapping