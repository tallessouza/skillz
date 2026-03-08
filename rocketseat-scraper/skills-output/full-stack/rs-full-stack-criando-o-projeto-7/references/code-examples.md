# Code Examples: Criando um Projeto Node.js

## Exemplo 1: Fluxo completo de criacao

```bash
# Criar a pasta do projeto
mkdir project

# Navegar ate a pasta
cd project

# Inicializar o package.json com valores padrao
npm init -y
```

**Saida esperada do `npm init -y`:**
```json
Wrote to /path/to/project/package.json:

{
  "name": "project",
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

## Exemplo 2: package.json antes da limpeza

```json
{
  "name": "project",
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

## Exemplo 3: package.json depois da limpeza

O instrutor remove `keywords`, `author`, `description` e o script de test padrao:

```json
{
  "name": "project",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {},
  "license": "MIT"
}
```

**Campos removidos e por que:**
- `"description": ""` — vazio, sem utilidade
- `"keywords": []` — vazio, sem utilidade
- `"author": ""` — vazio, sem utilidade
- `"test": "echo \"Error...\"` — script placeholder inutil

## Exemplo 4: Variacoes de inicializacao

### Com nome customizado
```bash
mkdir meu-api
cd meu-api
npm init -y
```

O campo `"name"` no package.json herda o nome da pasta automaticamente.

### Abrir no VS Code via terminal
```bash
code .
```

### Abrir arrastando a pasta
Selecionar a pasta no explorador de arquivos e arrastar para a janela do VS Code.

## Exemplo 5: Estrutura apos inicializacao

```
project/
└── package.json
```

Apenas o package.json existe neste ponto. Nenhum `node_modules/`, nenhum `package-lock.json` — esses aparecerao quando dependencias forem instaladas nas proximas aulas.

## Exemplo 6: Verificando que esta na pasta correta

```bash
# Verificar diretorio atual
pwd
# Saida: /caminho/para/project

# Listar arquivos
ls
# Saida: package.json
```