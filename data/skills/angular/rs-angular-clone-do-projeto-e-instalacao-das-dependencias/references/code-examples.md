# Code Examples: Clone do Projeto e Instalacao das Dependencias

## Fluxo completo de setup

### 1. Clone

```bash
# Na pasta onde deseja clonar
git clone https://github.com/skillz-education/angular-gerenciador-filmes.git
```

### 2. Entrar no projeto e mudar branch

```bash
cd angular-gerenciador-filmes
git checkout projeto-inicial
```

Verificar que esta na branch correta:
```bash
git branch
# * projeto-inicial
```

### 3. Instalar dependencias do front-end

```bash
# Na raiz do projeto (onde esta o package.json do Angular)
npm install
```

Verificar:
```bash
ls
# ... node_modules ... src ... package.json ... server ...
```

### 4. Instalar dependencias do back-end

```bash
cd server
npm install
ls
# ... node_modules ... package.json ...
cd ..
```

### 5. Abrir no VS Code

```bash
code .
```

### 6. Rodar o front-end (Terminal 1)

```bash
ng serve
# Angular Live Development Server is listening on localhost:4200
```

Resultado esperado no navegador: `http://localhost:4200` exibe a aplicacao Angular.

### 7. Rodar o back-end (Terminal 2)

```bash
cd server
npm run build
# Gera pasta dist/ com codigo JavaScript compilado

npm run start
# Server running on http://localhost:3000
```

Resultado esperado no navegador: `http://localhost:3000` exibe mensagem "API esta funcionando".

## Scripts do package.json do back-end

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "start": "..."
  }
}
```

| Script | Funcao | Quando usar |
|--------|--------|-------------|
| `npm run dev` | Roda com hot-reload (TypeScript direto) | Desenvolvimento ativo no back-end |
| `npm run build` | Transpila TS → JS na pasta `dist/` | Antes de rodar `start` |
| `npm run start` | Serve o codigo compilado | Uso estavel durante o curso |

## Erro comum: rodar start sem build

```bash
cd server
npm run start
# Error: Cannot find module './dist/...'
```

Solucao:
```bash
npm run build
npm run start
```

## Erro comum: branch errada

```bash
# Se instalou na branch main por engano
git stash        # salva mudancas locais se houver
git checkout projeto-inicial
rm -rf node_modules server/node_modules
npm install
cd server && npm install && cd ..
```