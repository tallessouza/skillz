# Code Examples: Configurando Targets no Babel

## Exemplo 1: babel.config.js padrao (sem targets)

```javascript
// Configuracao minima — preset-env com comportamento padrao
module.exports = {
  presets: ["@babel/preset-env"]
};
```

O Babel vai transformar o codigo para suportar uma gama ampla de navegadores. Mais transformacoes = bundle maior.

## Exemplo 2: babel.config.js com targets

```javascript
// Configuracao com targets especificos
module.exports = {
  presets: [
    ["@babel/preset-env", {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1"
      }
    }]
  ]
};
```

Note a estrutura: o preset vira um array `[nome, opcoes]`. Os targets definem versoes minimas de cada navegador.

## Exemplo 3: Com polyfills (mencionado pelo instrutor)

```javascript
module.exports = {
  presets: [
    ["@babel/preset-env", {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1"
      },
      useBuiltIns: "usage",
      corejs: 3
    }]
  ]
};
```

`useBuiltIns: "usage"` adiciona polyfills automaticamente. `corejs: 3` especifica a versao do CoreJS.

## Exemplo 4: Scripts no package.json

### Antes (apenas build com watch)
```json
{
  "scripts": {
    "build": "babel src --out-dir dist --watch"
  }
}
```

Problema: `npm run build` trava o terminal observando mudancas.

### Depois (scripts separados)
```json
{
  "scripts": {
    "build": "babel src --out-dir dist",
    "dev": "babel src --out-dir dist --watch"
  }
}
```

- `npm run build` — compila e libera o terminal
- `npm run dev` — compila e observa mudancas

## Exemplo 5: Targets com browserslist (alternativa)

```javascript
// Usando query do browserslist em vez de navegadores individuais
module.exports = {
  presets: [
    ["@babel/preset-env", {
      targets: "> 0.25%, not dead"
    }]
  ]
};
```

O preset-env tambem aceita queries do browserslist como string. Util quando voce quer uma regra dinamica em vez de versoes fixas.

## Exemplo 6: Multiplos presets

```javascript
// Babel aceita multiplos presets no array
module.exports = {
  presets: [
    ["@babel/preset-env", {
      targets: { chrome: "67" }
    }],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
};
```

Cada preset pode ser string (padrao) ou array (com configuracao). Podem coexistir no mesmo arquivo.