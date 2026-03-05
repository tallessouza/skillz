# Code Examples: Instalando o Babel

## Instalacao completa (comando da aula)

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

Tres pacotes separados por espaco, instalados de uma vez.

## Estrutura do projeto antes da instalacao

```
projeto/
├── index.html
└── main.js
```

O `index.html` referencia o `main.js`:
```html
<script src="main.js"></script>
```

## Estrutura apos instalacao

```
projeto/
├── node_modules/       ← gerado automaticamente
│   ├── @babel/
│   │   ├── core/
│   │   ├── cli/
│   │   └── preset-env/
│   └── ... (subdependencias)
├── index.html
├── main.js
├── package.json        ← manifesto de dependencias
└── package-lock.json   ← versoes travadas
```

## Regenerar node_modules

```bash
# Deletar a pasta (pode ser via terminal ou explorer)
rm -rf node_modules

# Regenerar a partir do package.json
npm install
```

## package.json resultante

```json
{
  "devDependencies": {
    "@babel/cli": "^7.24.0",
    "@babel/core": "^7.24.0",
    "@babel/preset-env": "^7.24.0"
  }
}
```

## Diferenca visual: devDependencies vs dependencies

```json
{
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@babel/cli": "^7.24.0",
    "@babel/preset-env": "^7.24.0"
  }
}
```

- `dependencies`: pacotes que rodam em producao (express, react, etc.)
- `devDependencies`: pacotes so para desenvolvimento (babel, eslint, jest, etc.)

## Verificar instalacao

```bash
# Confirmar que os pacotes estao listados
cat package.json | grep -A 5 devDependencies

# Confirmar que node_modules existe
ls node_modules/@babel/
```

## .gitignore recomendado

```gitignore
node_modules/
```

## Variacao: instalar um pacote de producao

```bash
# Sem --save-dev = vai para dependencies
npm install express
```

## Subdependencias — por que tantas pastas

Dentro de `node_modules/@babel/core/package.json`:
```json
{
  "dependencies": {
    "@babel/code-frame": "^7.24.0",
    "@babel/generator": "^7.24.0",
    "@babel/helper-compilation-targets": "^7.24.0",
    "@babel/parser": "^7.24.0",
    "@babel/traverse": "^7.24.0",
    "@babel/types": "^7.24.0"
  }
}
```

Cada dependencia do core puxa suas proprias dependencias, criando a arvore de `node_modules/`.